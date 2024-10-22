import {sign,verify} from 'hono/jwt';
import {compare, hash} from 'bcryptjs'
import "dotenv/config";

const JWT_SECRET = process.env.JWT_SECRET;
const SALT_ROUNDS = 10;

export async function hashPassword(password: string):Promise<string>{
    return await hash(password,SALT_ROUNDS)
}

export async function comparePasswords(password: string, hashedPassword: string): Promise<boolean>{
    return await compare(password, hashedPassword);
}

export async function generateToken(payload:{userId: number; role: string}): Promise<string>{
    if (!JWT_SECRET) {
        throw new Error("JWT_SECRET is not defined");
    }
    return await sign(payload, JWT_SECRET);
}

export async function verifyToken(token: string) {
    if (!JWT_SECRET) {
        throw new Error("JWT_SECRET is not defined");
    }
    try {
      return await verify(token, JWT_SECRET);
    } catch (error) {
      return null;
    }
}