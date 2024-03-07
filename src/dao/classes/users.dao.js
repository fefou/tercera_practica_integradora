import { usuariosModelo } from "../models/users.model.js";

export class Usuario{
    constructor(){}

    async get(){
        try {
            return await usuariosModelo.find().lean()
        } catch (error) {
            req.logger.error(error.message)
           return null 
        }
    }

    async getById(){
        try {
            return await usuariosModelo.findOne({_id: id}).lean()
        } catch (error) {
           req.logger.error(error.message)
           return null 
        }
    }

    async create(usuario){
        try {
            return await usuariosModelo.create(usuario)
        } catch (error) {
            req.logger.error(error.message)
           return null 
        }
    }

    async update(id, usuario){
        try {
            return await usuariosModelo.updateOne({_id:id}, usuario)
        } catch (error) {
            req.logger.error(error.message)
           return null 
        }
    }
}