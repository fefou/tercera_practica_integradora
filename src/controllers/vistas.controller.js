// import { Router } from "express";
// import productosJSON from "../json/productos.json" assert { type: "json" };
// import sessions from "express-session";
// import mongoose from "mongoose";
import { productsModelo } from "../dao/models/products.model.js";
import { cartsModelo } from "../dao/models/carts.model.js";



export class VistasController {
  constructor() { }

  static async realTimeProducts(req, res) {
    let { mensajeBienvenida } = req.query;
    let pagina = 1;
    if (req.query.pagina) {
      pagina = Number(req.query.pagina);
    }

    let limite;
    if (!req.query.limit) {
      limite = 10;
    } else {
      limite = Number(req.query.limit);
    }

    let category = req.query.category || null;
    let sort = req.query.sort || "asc";

    let filter = { deleted: false }; // Agrega el filtro para excluir los productos eliminados
    if (category) {
      filter.category = category;
    }

    let usuario = req.session.usuario;
    let products;
    try {
      products = await productsModelo.paginate(filter, {
        lean: true,
        page: pagina,
        limit: limite,
        sort: { price: sort },
      });

      let { totalPages, hasNextPage, hasPrevPage, prevPage, nextPage } =
        products;


      res.status(200).render("productos", {
        products: products.docs,
        totalPages,
        hasNextPage,
        hasPrevPage,
        prevPage,
        nextPage,
        limit: limite,
        category,
        sort,
        mensajeBienvenida,
        usuario

      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }


  static async realTimeProductsById(req, res) {
    const { pid } = req.params;
    let usuario = req.session.usuario;
    try {
      const product = await productsModelo.findById(pid).lean();

      if (!product) {
        return res.status(404).json({ message: "Producto no encontrado" });
      }

      res.status(200).render("product", { product, usuario });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async carts(req, res) {
    let carts;
    try {
      carts = await cartsModelo.paginate(
        {},
        { lean: true, populate: "products.product" }
      );
      res.status(200).render("carts", { carts: carts.docs });
    } catch (error) {
      req.logger.error(error.message);
      res.status(500).send("Error al obtener carritos");
    }
  }

  static async cartsbyId(req, res) {
    const { cid } = req.params;

    try {
      const cart = await cartsModelo
        .findById(cid)
        .populate("products.product")
        .lean();

      if (!cart) {
        return res.status(404).json({ message: "Carrito no encontrado" });
      }

      res.status(200).render("cart", { cart });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async agregarAlCarrito(req, res) {
    const { cid, pid } = req.params;
    let { quantity } = req.body;

    // Asegúrate de convertir la cantidad a un número
    quantity = parseInt(quantity);

    try {
      const cart = await cartsModelo.findById(cid);
      const product = await productsModelo.findById(pid);

      if (!cart || !product) {
        return res
          .status(404)
          .json({ message: "Carrito o producto no encontrado" });
      }

      // Verificar si el producto ya está en el carrito
      const existingProductIndex = cart.products.findIndex(item => item.product.toString() === pid);
      if (existingProductIndex !== -1) {
        // Si el producto ya está en el carrito, actualizar la cantidad
        cart.products[existingProductIndex].quantity += quantity;
      } else {
        // Si el producto no está en el carrito, agregarlo
        cart.products.push({
          product: pid,
          quantity: quantity,
        });
      }

      await cart.save();

      res.redirect("/carts/" + cid);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async reseteoPass(req, res) {
    try {
      res.render("recupero01");
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  static async reseteoPass02(req, res) {
    try {
      const token = req.query.token; // Obteniendo el token de la consulta
      res.render('recupero02', { token: token }); // Pasando el token a la vista
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
  


  static async cargaProductos(req, res) {
    let { mensajeBienvenida } = req.query;
    let pagina = 1;
    if (req.query.pagina) {
      pagina = Number(req.query.pagina);
    }

    let limite;
    if (!req.query.limit) {
      limite = 10;
    } else {
      limite = Number(req.query.limit);
    }

    let category = req.query.category || null;
    let sort = req.query.sort || "asc";

    let filter = { deleted: false }; // Agrega el filtro para excluir los productos eliminados
    if (category) {
      filter.category = category;
    }

    let usuario = req.session.usuario;
    let products;
    try {
      products = await productsModelo.paginate(filter, {
        lean: true,
        page: pagina,
        limit: limite,
        sort: { price: sort },
      });

      let { totalPages, hasNextPage, hasPrevPage, prevPage, nextPage } =
        products;


      res.status(200).render("cargaProductos", {
        products: products.docs,
        totalPages,
        hasNextPage,
        hasPrevPage,
        prevPage,
        nextPage,
        limit: limite,
        category,
        sort,
        mensajeBienvenida,
        usuario

      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }



}
