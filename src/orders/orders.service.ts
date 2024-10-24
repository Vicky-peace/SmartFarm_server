import { db } from "../drizzle/db";
import { orders, listings } from "../drizzle/schema";
import { eq } from "drizzle-orm";
import { OrderStatus,PaymentStatus,CreateOrderInput,Order } from "../validators/validator";

export const orderService = {
    create: async (data: CreateOrderInput): Promise<Order> => {
        try {
            // Check listing availability
            const listing = await db.query.listings.findFirst({
                where: eq(listings.id, data.listingId)
            });

            if (!listing) {
                throw new Error('Listing not found');
            }

            // Convert strings to decimals for comparison
            const listingQuantity = parseFloat(listing.quantity);
            const orderQuantity = parseFloat(data.quantity);

            if (listingQuantity < orderQuantity) {
                throw new Error('Insufficient quantity available');
            }

            if (listing.status !== 'active') {
                throw new Error('Listing is not active');
            }

            //Ensure buyerId is not null
            if (data.buyerId === null || data.buyerId === undefined) {
                throw new Error('Buyer ID is required');
            }

            // Create order with explicit type assertion
            const [orderResult] = await db.insert(orders)
                .values({
                    buyerId: data.buyerId,
                    listingId: data.listingId,
                    quantity: data.quantity,
                    totalPrice: data.totalPrice,
                    orderStatus: 'pending',
                    paymentStatus: 'pending'
                })
                .returning();

            // Update listing quantity
            const newQuantity = (listingQuantity - orderQuantity).toFixed(2);
            await db.update(listings)
                .set({ 
                    quantity: newQuantity,
                    status: newQuantity === '0.00' ? 'sold' : 'active',
                    updatedAt: new Date()
                })
                .where(eq(listings.id, data.listingId));

            // Assert the returned order matches the Order type
            const order: Order = {
                id: orderResult.id,
                createdAt: orderResult.createdAt ?? new Date(),
                updatedAt: orderResult.updatedAt ?? new Date(),
                quantity: orderResult.quantity,
                buyerId: orderResult.buyerId!,
                listingId: orderResult.listingId!,
                totalPrice: orderResult.totalPrice,
                orderStatus: orderResult.orderStatus as OrderStatus,
                paymentStatus: orderResult.paymentStatus as PaymentStatus
            };

            return order;
        } catch (error) {
            console.error("Error creating order:", error);
            throw error;
        }
    },
}