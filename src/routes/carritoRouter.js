
import { Router } from 'express'
import path from 'path'
import __dirname from '../utils.js'
const routerC = Router()
let ruta = path.join(__dirname, '..', 'json', 'carritos.json')
import { CarritoController } from '../controllers/carrito.controller.js'

// GET CARRITO

routerC.get('/', CarritoController.getCarrito)

routerC.get('/:cid', CarritoController.getCarritoById)

// POST CARRITO VACÍO con id

routerC.post('/', CarritoController.postCarrito)

// 65767deca82549cce38c3cec - id del carrito creado
// 657129cbe743b59b019b8c8b - id del primer producto


// PUT CARRITO - Añadir un producto al carrito creado
routerC.post('/:cid/products/:pid', CarritoController.postCarritoProducto)

routerC.delete('/:cid/products/:pid', CarritoController.deleteCarritoProducto)

routerC.delete('/:cid', CarritoController.deleteCarrito)

routerC.put('/:cid/products/:pid', CarritoController.putCarritoProducto)



export default routerC