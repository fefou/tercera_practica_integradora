import __dirname from "../utils.js";
import { serverSockets } from "../app.js";
import { productsModelo } from "../dao/models/products.model.js";
import mongoose from "mongoose";
import { CustomError } from "../utils/customErrors.js";
import { STATUS_CODES } from "../utils/errorStatusCodes.js";
import { errorData } from "../utils/errores.js";
import { usuariosModelo } from "../dao/models/users.model.js";


export class ProductosController {
  constructor() { }

  static async getProductos(req, res) {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    try {
      const totalProducts = await productsModelo.countDocuments({
        deleted: false,
      });
      const totalPages = Math.ceil(totalProducts / limit);
      const products = await productsModelo
        .find({ deleted: false })
        .skip(skip)
        .limit(limit);

      const response = {
        status: "success",
        payload: products,
        totalPages: totalPages,
        prevPage: page > 1 ? page - 1 : null,
        nextPage: page < totalPages ? page + 1 : null,
        page: page,
        hasPrevPage: page > 1,
        hasNextPage: page < totalPages,
        prevLink: page > 1 ? `/products?page=${page - 1}&limit=${limit}` : null,
        nextLink:
          page < totalPages
            ? `/products?page=${page + 1}&limit=${limit}`
            : null,
      };

      res.setHeader("Content-Type", "application/json");
      res.status(200).json(response);
    } catch (error) {
      req.logger.error(error.message);
      res.setHeader("Content-Type", "application/json");
      res.status(500).json({ status: "error", payload: error.message });
    }
  }

  static async getProductoById(req, res) {
    let { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      res.setHeader("Content-Type", "application/json");
      return res.status(400).json({ error: `Indique un id válido` });
    }

    let existe;
    try {
      existe = await productsModelo.findOne({ deleted: false, _id: id });
    } catch (error) {
      res.setHeader("Content-Type", "application/json");
      return res
        .status(500)
        .json({ error: `Error al buscar producto`, message: error.message });
    }

    if (!existe) {
      res.setHeader("Content-Type", "application/json");
      return res.status(400).json({ error: `No existe producto con id ${id}` });
    }

    res.setHeader("Content-Type", "application/json");
    return res.status(200).json({ usuario: existe });
  }

  static async postProducto(req, res) {
    let { title, description, price, code, stock, category } = req.body;

    if (!title || !price || !code || !stock || !category) {
      // Manejar el caso en que falten datos requeridos en el formulario
      return res.status(400).json({ error: "Faltan datos requeridos en el formulario" });
    }

    try {
      // Verificar si ya existe un producto con el mismo título y código
      const existe = await productsModelo.findOne({ title, code });

      if (existe) {
        return res.status(400).json({ error: "Ya existe un producto con este título y código" });
      }

      // Crear el nuevo producto

      let ownerUser = await usuariosModelo.findById(req.user._id).lean();
      const nuevoProducto = await productsModelo.create({
        title,
        description,
        price,
        code,
        stock,
        category,
        owner: ownerUser // Establecer el propietario como el usuario actualmente autenticado
      });

      console.log(nuevoProducto)

      // Enviar una respuesta exitosa con el nuevo producto creado
      return res.status(201).json({ success: true, producto: nuevoProducto });
    } catch (error) {
      // Manejar cualquier error que ocurra durante la creación del producto
      return res.status(500).json({ error: "Error al crear el producto", message: error.message });
    }
  }


  static async putProducto(req, res) {
    let { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      res.setHeader("Content-Type", "application/json");
      return res.status(400).json({ error: `Indique un id válido` });
    }

    let existe;
    try {
      existe = await productsModelo.findOne({ deleted: false, _id: id });
    } catch (error) {
      res.setHeader("Content-Type", "application/json");
      return res
        .status(500)
        .json({ error: `Error al buscar producto`, message: error.message });
    }

    if (!existe) {
      res.setHeader("Content-Type", "application/json");
      return res.status(400).json({ error: `No existe producto con id ${id}` });
    }

    if (req.body._id) {
      res.setHeader("Content-Type", "application/json");
      return res.status(400).json({ error: `No se puede modificar el id` });
    }

    let resultado;
    try {
      resultado = await productsModelo.updateOne(
        { deleted: false, _id: id },
        req.body
      );
      req.logger.info(resultado);

      if (resultado.modifiedCount > 0) {
        res.setHeader("Content-Type", "application/json");
        return res.status(200).json({ payload: "modificación realizada" });
      } else {
        res.setHeader("Content-Type", "application/json");
        return res
          .status(200)
          .json({ message: "No se modificó ningún producto" });
      }
    } catch (error) {
      res.setHeader("Content-Type", "application/json");
      return res
        .status(500)
        .json({ error: `Error inesperado`, message: error.message });
    }
  }

  static async deleteProducto(req, res) {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      res.setHeader("Content-Type", "application/json");
      return res.status(400).json({ error: `Indique un id válido` });
    }

    let producto;
    try {
      producto = await productsModelo.findOne({ _id: id, deleted: false });
      if (!producto) {
        return res.status(404).json({ error: `No existe producto con ID ${id}` });
      }
    } catch (error) {
      return res.status(500).json({ error: `Error al buscar producto`, message: error.message });
    }

    // Verificar si el usuario es administrador o propietario del producto
    if (req.user.rol === 'admin' || (req.user.rol === 'premium' && String(req.user._id) === String(producto.owner))) {
      try {
        const resultado = await productsModelo.updateOne(
          { _id: id, deleted: false },
          { $set: { deleted: true } }
        );
        if (resultado.modifiedCount > 0) {
          return res.status(200).json({ payload: "Producto Eliminado" });
        } else {
          return res.status(200).json({ message: "No se eliminó ningún producto" });
        }
      } catch (error) {
        return res.status(500).json({ error: `Error inesperado`, message: error.message });
      }
    } else {
      return res.status(403).json({ error: "No tiene permisos para eliminar este producto" });
    }
  }
}
