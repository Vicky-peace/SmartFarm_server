import { db } from '../drizzle/db';
import { users,farmers,buyers } from '../drizzle/schema';
import { RegisterInput,LoginInput } from '../validators/validator';
import { hashPassword,comparePasswords, generateToken } from '../utils/auth';
import { HTTPException } from 'hono/http-exception';
import { eq } from 'drizzle-orm';

export const registerUser = async (input: RegisterInput) => {
    // Check if email exists
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, input.email),
    });
  
    if (existingUser) {
      throw new HTTPException(409, { message: 'Email already registered' });
    }
  
    const hashedPassword = await hashPassword(input.password);

    // Create user
    const [user] = await db.insert(users)
      .values({
        name: input.name ?? '',
        email: input.email ?? '',
        phoneNumber: input.phoneNumber,
        password: hashedPassword,
        role: input.role ?? '', //
      })
      .returning();

    // Create role-specific profile
    if (input.role === 'farmer') {
      await db.insert(farmers)
        .values({
          userId: user.id,
          location: '', // These can be updated later
          farmSize: "0",
          primaryCrops: '',
        });
    } else if (input.role === 'buyer') {
      await db.insert(buyers)
        .values({
          userId: user.id,
          companyName: '',
          businessType: '',
        });
    }

    // Generate JWT token
    const token = await generateToken({
      userId: user.id,
      role: user.role ?? '',
    });

    // Return user data without password
    const { password: _, ...userData } = user;
    return {
      user: userData,
      token,
    };
};

  

  export const loginUser = async (input: LoginInput) => {
    // Find user by email
    const user = await db.query.users.findFirst({
      where: eq(users.email, input.email),
    });
  
    if (!user) {
      throw new HTTPException(401, { message: 'Invalid credentials' });
    }
  
    // Verify password
    const isValidPassword = await comparePasswords(input.password, user.password);
    if (!isValidPassword) {
      throw new HTTPException(401, { message: 'Invalid credentials' });
    }
  
    // Generate JWT token
    const token = await generateToken({
      userId: user.id,
      role: user.role ?? '',
    });
  
    // Return user data without password
    const { password: _, ...userData } = user;
    return {
      user: userData,
      token,
    };
  };
  