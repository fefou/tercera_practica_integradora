req.logger.info('hola, ws.js script!')
const socket = io()



// socket on de json de productos
socket.on("productos", productos=> {
    req.logger.info(productos)
//    let ulProductos=document.querySelector('ul')
//    let liNuevoProducto=document.createElement('li')
//    liNuevoProducto.innerHTML=productos
//    ulProductos.append(liNuevoProducto)
document.location.href='/realtimeproducts'
   
})
