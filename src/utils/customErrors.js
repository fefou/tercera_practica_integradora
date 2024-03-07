export class CustomError{
    static CustomError(nombre, mensaje, statusCode, descripcion=""){
        let error=new Error(mensaje)
        error.name=nombre
        error.codigo=statusCode
        error.descripcion=descripcion

        return error
    }
}