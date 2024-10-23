import { Hono } from "hono";
import { productController } from "./products.controller";

export const productRouter = new Hono()

productRouter.get('/products', productController.getAll);
productRouter.get('/products/search', productController.search);
productRouter.get('/products/category/:category', productController.getByCategory);
productRouter.get('/products/:id', productController.getById);
productRouter.post('/products', productController.create);
productRouter.put('/products/:id', productController.update)
productRouter.delete('/products/:id', productController.delete)
