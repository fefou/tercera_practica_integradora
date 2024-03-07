import mongoose from "mongoose";
const mockingsEsquema = new mongoose.Schema({


    productosMocking: [
        {
            nombre: String,
            codigo: String,
            descrip: String,
            precio: Number,
            cantidad: Number,
        }
    ]
}, {
    timestamps: {
        updatedAt: "fecha modificacion", createdAt: "fecha alta"
    }
})

export const mockingsModelo = mongoose.model("mockings", mockingsEsquema)