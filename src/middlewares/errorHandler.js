
export const errorHandler = (error, req, res, next) => {

    if (error) {
        if (error.code) {
            req.logger.error(`Error:${error.name}-code:${error.code} Detalle:${error.descripcion}`)
            return res.setHeader('Content-Type', 'application/json')
        } else {
            res.setHeader('Content-Type', 'application/json')
            return res.status(500).json({ ERROR: 'Error inesperado, intente mas tarde' , message: error.message})
        }
    }
    next()
}

