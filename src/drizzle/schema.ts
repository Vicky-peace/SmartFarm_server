import {pgTable,serial,varchar,text,integer,boolean,timestamp,decimal,pgEnum} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
//Enum definitions
export const roleEnum = pgEnum("roleEnum", ["farmer", "buyer", "admin"]);
export const listingStatusEnum = pgEnum("listingStatusEnum", ['active', 'sold', 'expired']);
export const paymentStatusEnum = pgEnum('paymentStatusEnum', ['pending', 'paid', 'failed']);
export const orderStatusEnum = pgEnum('orderStatusEnum', ['pending', 'confirmed', 'in_transit', 'delivered']);
export const paymentSettlementStatusEnum = pgEnum("paymentSettlementStatusEnum", ['pending', 'processed', 'failed']);
export const logisticsStatusEnum = pgEnum("logisticsStatusEnum", ['scheduled', 'in_progress', 'completed']);
export const marketDemandLevelEnum = pgEnum("marketDemandLevelEnum", ['low', 'medium', 'high']);
export const transactionStatusEnum = pgEnum('transactionStatusEnum', ['pending', 'completed', 'failed']);


export const users = pgTable('users',{
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    email:text('email').notNull().unique(),
    phoneNumber:varchar('phone_number',{length: 20}).notNull(),
    password: text('password').notNull(),
    role: roleEnum('role').default('farmer'), // 'farmer', 'buyer', 'admin'
   createdAt: timestamp('created_at').defaultNow(),
   updatedAt: timestamp('updated_at').defaultNow(),
})

export const farmers = pgTable('farmers', {
    id: serial('id').primaryKey(),
    userId: integer('user_id').references(() => users.id), // Relationship: One-to-One with Users
    location: text('location').notNull(),
    farmSize: decimal('farm_size'),
    primaryCrops: text('primary_crops'),
  });
  
  export const buyers = pgTable('buyers', {
    id: serial('id').primaryKey(),
    userId: integer('user_id').references(() => users.id), // Relationship: One-to-One with Users
    companyName: text('company_name'),
    businessType: text('business_type'),
  });
  
  export const products = pgTable('products', {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    category: text('category').notNull(),
    unit: text('unit').notNull(), // e.g., 'kg', 'ton'
  });

  export const listings = pgTable('listings', {
    id: serial('id').primaryKey(),
    farmerId: integer('farmer_id').references(() => farmers.id), // Relationship: Many-to-One with Farmers
    productId: integer('product_id').references(() => products.id), // Relationship: Many-to-One with Products
    quantity: decimal('quantity').notNull(),
    price: decimal('price').notNull(),
    availableDate: timestamp('available_date').notNull(),
    status: listingStatusEnum("status").default('active'), // 'active', 'sold', 'expired'
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
  });
  
  export const orders = pgTable('orders', {
    id: serial('id').primaryKey(),
    buyerId: integer('buyer_id').references(() => buyers.id), // Relationship: Many-to-One with Buyers
    listingId: integer('listing_id').references(() => listings.id), // Relationship: Many-to-One with Listings
    quantity: decimal('quantity').notNull(),
    totalPrice: decimal('total_price').notNull(),
    orderStatus: orderStatusEnum('orderStatus').default('pending'), // 'pending', 'confirmed', 'in_transit', 'delivered'
    paymentStatus: paymentStatusEnum('paymentStatus').default('pending'), // 'pending', 'paid', 'failed'
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
  });
  


  export const transactions = pgTable('transactions', {
    id: serial('id').primaryKey(),
    orderId: integer('order_id').references(() => orders.id), // Relationship: Many-to-One with Orders
    amount: decimal('amount').notNull(),
    currency: text('currency').notNull().default('KES'),
    status: transactionStatusEnum('status').default('pending'), // 'pending', 'completed', 'failed'
    providerTransactionId: text('provider_transaction_id'),
    providerTransactionDate: timestamp('provider_transaction_date'),
    metadata: text('metadata'), // JSON string for additional transaction details
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
  });
  
  export const mpesaTransactions = pgTable('mpesa_transactions', {
    id: serial('id').primaryKey(),
    transactionId: integer('transaction_id').references(() => transactions.id), // Relationship: Many-to-One with Transactions
    mpesaReceiptNumber: text('mpesa_receipt_number').notNull(),
    phoneNumber: varchar('phone_number', {length: 20}).notNull(),
    mpesaTransactionDate: timestamp('mpesa_transaction_date').notNull(),
    accountReference: text('account_reference'),
    transactionType: text('transaction_type').notNull(), // 'CustomerPayBillOnline', 'CustomerBuyGoodsOnline', etc.
    transactionDescription: text('transaction_description'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
  });
  
  export const paymentSettlements = pgTable('payment_settlements', {
    id: serial('id').primaryKey(),
    farmerId: integer('farmer_id').references(() => farmers.id), // Relationship: Many-to-One with Farmers
    orderId: integer('order_id').references(() => orders.id), // Relationship: Many-to-One with Orders
    amount: decimal('amount').notNull(),
    status: paymentSettlementStatusEnum('status').default('pending'), // 'pending', 'processed', 'failed'
    settlementDate: timestamp('settlement_date'),
    transactionId: integer('transaction_id').references(() => transactions.id), // Relationship: Many-to-One with Transactions
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
  });


  export const logistics = pgTable('logistics', {
    id: serial('id').primaryKey(),
    orderId: integer('order_id').references(() => orders.id), // Relationship: Many-to-One with Orders
    pickupLocation: text('pickup_location').notNull(),
    deliveryLocation: text('delivery_location').notNull(),
    status: logisticsStatusEnum("status").default('in_progress'), // 'scheduled', 'in_progress', 'completed'
    estimatedDeliveryDate: timestamp('estimated_delivery_date'),
    actualDeliveryDate: timestamp('actual_delivery_date'),
  });
  
  export const marketTrends = pgTable('market_trends', {
    id: serial('id').primaryKey(),
    productId: integer('product_id').references(() => products.id), // Relationship: Many-to-One with Products
    date: timestamp('date').notNull(),
    averagePrice: decimal('average_price').notNull(),
    demandLevel: marketDemandLevelEnum('demandLevel').default('high'), // 'low', 'medium', 'high'
  });


  export const knowledgeSharing = pgTable('knowledge_sharing', {
  id: serial('id').primaryKey(),
  authorId: integer('author_id').references(() => users.id), // Relationship: Many-to-One with Users
  title: text('title').notNull(),
  content: text('content').notNull(),
  category: text('category').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const ratings = pgTable('ratings', {
    id: serial('id').primaryKey(),
    raterId: integer('rater_id').references(() => users.id), // Relationship: Many-to-One with Users
    ratedId: integer('rated_id').references(() => users.id), // Relationship: Many-to-One with Users
    orderId: integer('order_id').references(() => orders.id), // Relationship: Many-to-One with Orders
    rating: integer('rating').notNull(),
    comment: text('comment'),
    createdAt: timestamp('created_at').defaultNow(),
  });
  
  //Relationships
  //Users <-> Farmers / Buyers:
export const userRoleRelations = relations(users, ({one}) =>({
    farmer: one(farmers, {
        fields: [users.id],
        references: [farmers.userId],
      }),
      buyer: one(buyers, {
        fields: [users.id],
        references: [buyers.userId],
      }),
}))

//Farmers <-> Listings
export const farmerListingsRelations = relations(farmers, ({ many }) => ({
    listings: many(listings),
  }));
  
  //Buyers <-> Orders
  export const buyerOrdersRelations = relations(buyers, ({ many }) => ({
    orders: many(orders),
  }));
  
  //Listings <-> Orders
  export const listingOrdersRelations = relations(listings, ({ many }) => ({
    orders: many(orders),
  }));
  
  //Orders <-> Payments
  export const orderPaymentRelations = relations(orders, ({ one }) => ({
    payment: one(transactions, {
      fields: [orders.id],
      references: [transactions.orderId],
    }),
  }));
  
  //Orders <-> Logistics
  export const orderLogisticsRelations = relations(orders, ({ one }) => ({
    logistics: one(logistics, {
      fields: [orders.id],
      references: [logistics.orderId],
    }),
  }));
  
//Transactions <-> M-Pesa Transactions
export const transactionMpesaRelations = relations(transactions, ({ one }) => ({
    mpesa: one(mpesaTransactions, {
      fields: [transactions.id],
      references: [mpesaTransactions.transactionId],
    }),
  }));
  

  //Farmers <-> Payment Settlements
  export const farmerPaymentSettlementRelations = relations(farmers, ({ many }) => ({
    settlements: many(paymentSettlements),
  }));

  //Payment Settlements <-> Farmers
  export const paymentSettlementsFarmerRelations = relations(paymentSettlements, ({ one }) => ({
    farmer: one(farmers, {
      fields: [paymentSettlements.farmerId],
      references: [farmers.id],
    }),
}));

  

  //Products <-> Listings
  export const productListingRelations = relations(products, ({ many }) => ({
    listings: many(listings),
  }));

  //MarketTrends <-> Products
  export const marketTrendsProductRelations = relations(marketTrends, ({ one }) => ({
    product: one(products, {
      fields: [marketTrends.productId],
      references: [products.id],
    }),
  }));
  
  //KnowledgeSharing <-> Users
  export const knowledgeSharingUserRelations = relations(knowledgeSharing, ({ one }) => ({
    author: one(users, {
      fields: [knowledgeSharing.authorId],
      references: [users.id],
    }),
  }));
  

  export type TIUsers = typeof users.$inferInsert;
export type TSUsers = typeof users.$inferSelect;
export type TIFarmers = typeof farmers.$inferInsert;
export type TSFarmers = typeof farmers.$inferSelect;

export type TIBuyers = typeof buyers.$inferInsert;
export type TSBuyers = typeof buyers.$inferSelect;
export type TIProducts = typeof products.$inferInsert;
export type TSProducts = typeof products.$inferSelect;

export type TIListings = typeof listings.$inferInsert;
export type TSListings = typeof listings.$inferSelect;
export type TIOrders = typeof orders.$inferInsert;
export type TSOrders = typeof orders.$inferSelect;

export type TITransactions = typeof transactions.$inferInsert;
export type TSTransactions = typeof transactions.$inferSelect;

export type TIMpesaTransactions = typeof mpesaTransactions.$inferInsert;
export type TSMpesaTransactions = typeof mpesaTransactions.$inferSelect;

export type TIPaymentSettlements = typeof paymentSettlements.$inferInsert;
export type TSPaymentSettlements = typeof paymentSettlements.$inferSelect;

export type TILogistics = typeof logistics.$inferInsert;
export type TSLogistics = typeof logistics.$inferSelect;

export type TIMarketTrends = typeof marketTrends.$inferInsert;
export type TSMarketTrends = typeof marketTrends.$inferSelect;

export type TIKnowledgeSharing = typeof knowledgeSharing.$inferInsert;
export type TSKnowledgeSharing = typeof knowledgeSharing.$inferSelect;

export type TIRatings = typeof ratings.$inferInsert;
export type TSRatings = typeof ratings.$inferSelect;







