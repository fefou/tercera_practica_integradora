export const errorData = () => {
    return `ERROR, Inserte todos los campos requeridos.
           Campos requeridos:
        
           - title: 'string'
           - description: 'string'
           - code: 'string'
           - price: 'number'
           - status: 'boolean'
           - stock: 'number'
           - category: 'string'`
}

export const errorLogin = () => {
    return 'Error de logueo: Debes estar logueado.'
}

export const errorConflict = () => {
    return ` Conflicto en la creacion o actualizacion de informacion `
}

export const errorRequest = () => {
    return `Error de peticion, datos incorrectos. `
}