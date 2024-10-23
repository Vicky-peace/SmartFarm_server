import { Hono } from "hono";
import { listingController } from "./listings.controllers";

export const listingRouter = new Hono()

//public routes
listingRouter.get('/listings/active',listingController.getActive);
listingRouter.get('/listings/search',listingController.searchByPriceRange)
listingRouter.get('/listings/:id',listingController.getById)

//Protected
listingRouter.get('/listings',listingController.getAll);
listingRouter.post('/listings',listingController.create)
listingRouter.put('/listings/:id/status',listingController.updateStatus)
listingRouter.delete('/listings/:id', listingController.deleteListing)