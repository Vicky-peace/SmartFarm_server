import { TSUsers, users, farmers, buyers } from "../drizzle/schema";
import { eq } from "drizzle-orm";
import { db } from "../drizzle/db";
import bcrypt from "bcryptjs";

// Define the types for role-specific data
interface FarmerData {
  location?: string;
  farmSize?: string;
  primaryCrops?: string;
}

interface BuyerData {
  companyName?: string;
  businessType?: string;
}

// Extend the TIUsers type to include role-specific data
type TIUsers = {
  name: string;
  email: string;
  phoneNumber: string;
  password: string;
  id?: number;
  role?: "farmer" | "buyer" | "admin" | null;
  createdAt?: Date | null;
  updatedAt?: Date | null;
} & Partial<FarmerData & BuyerData>;

//List all users, with ptional pagination
export const listUserService = async (
  limit?: number
): Promise<TSUsers[] | null> => {
  if (limit) {
    return await db.query.users.findMany({
      limit: limit,
    });
  }
  return await db.query.users.findMany();
};

// Get a single user by ID
export const getUserService = async (
  id: number
): Promise<TSUsers | undefined> => {
  return await db.query.users.findFirst({
    where: eq(users.id, id),
  });
};

// Update user details in the database, including role-specific updates
export const updateUserService = async (
  id: number,
  updatedUserData: Partial<TIUsers>
): Promise<string> => {
  const { password, ...userUpdateData } = updatedUserData;

  //update the common user fields in the users table ,excluding password
  await db.update(users).set(userUpdateData).where(eq(users.id, id)).execute();

  // Fetch the user's existing role from the database
  const user = await db.query.users.findFirst({
    where: eq(users.id, id),
  });

  if (!user) {
    throw new Error('User not found');
  }

  const userRole = user.role;

    // Update the common user fields in the 'users' table, excluding password
    await db.update(users)
    .set(userUpdateData)
    .where(eq(users.id, id))
    .execute();

  // If password is provided, hash it and update it separately
  if (password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    await db.update(users)
      .set({ password: hashedPassword })
      .where(eq(users.id, id))
      .execute();
  }
  // Prepare role-specific data based on the user's role
  if (userRole === 'farmer') {
    const farmerData: Partial<typeof farmers.$inferInsert> = {};
    if (updatedUserData.location !== undefined) farmerData.location = updatedUserData.location;
    if (updatedUserData.farmSize !== undefined) farmerData.farmSize = updatedUserData.farmSize;
    if (updatedUserData.primaryCrops !== undefined) farmerData.primaryCrops = updatedUserData.primaryCrops;

    // Update the farmers table if there is role-specific data to update
    if (Object.keys(farmerData).length > 0) {
      await db.update(farmers)
        .set(farmerData)
        .where(eq(farmers.userId, id))
        .execute();
    }
  } else if (userRole === 'buyer') {
    const buyerData: Partial<typeof buyers.$inferInsert> = {};
    if (updatedUserData.companyName !== undefined) buyerData.companyName = updatedUserData.companyName;
    if (updatedUserData.businessType !== undefined) buyerData.businessType = updatedUserData.businessType;

    // Update the buyers table if there is role-specific data to update
    if (Object.keys(buyerData).length > 0) {
      await db.update(buyers)
        .set(buyerData)
        .where(eq(buyers.userId, id))
        .execute();
    }
  }

  return 'User updated successfully';
};

// Delete a user by ID
export const deleteUserService = async (id: number): Promise<string> => {
  await db.delete(users).where(eq(users.id, id)).execute();
  return "User deleted successfully";
};
