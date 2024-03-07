import { mockingsModelo } from "../dao/models/mocking.model.js";
import { fakerES_MX as faker } from "@faker-js/faker";

export class mockingController {
    constuctor() { }

    static async createMockData(req, res) {
        const productosMocking = [];

        for (let i = 0; i < 100; i++) {
            productosMocking.push({
                nombre: faker.commerce.productName(),
                codigo: faker.string.alphanumeric(10),
                descrip: faker.commerce.productDescription(),
                precio: faker.commerce.price(),
                cantidad: faker.number.int({ min: 1, max: 20 })
            });
        }

        const mockData = new mockingsModelo({ productosMocking });

        try {
            await mockData.save();
            req.logger.info('Mock creado correctamente');
            res.setHeader("Content-Type", "application/json");
            return res.status(200).json({ status: "success", payload: mockData });
        } catch (error) {
            console.error('Error creando mock', error);
        }
    }
}