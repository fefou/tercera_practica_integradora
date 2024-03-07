import { Router } from 'express'
import fs from 'fs'
import path from 'path'
import __dirname from '../utils.js'
import { ProductosController } from '../controllers/productos.controller.js'

const routerP = Router()
let ruta = path.join(__dirname, 'json', 'productos.json')



function saveProducts(productos) {
    fs.writeFileSync(ruta, JSON.stringify(productos, null, 5))
}



routerP.get('/', ProductosController.getProductos)

routerP.get('/:id', ProductosController.getProductoById)


// POST

routerP.post('/', ProductosController.postProducto)

// UPDATE

routerP.put('/:id', ProductosController.putProducto)


// DELETE 

routerP.delete('/:id', ProductosController.deleteProducto)

export default routerP