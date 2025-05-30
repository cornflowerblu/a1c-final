// lib/auth.ts
import { verifyToken } from '@clerk/backend';

export async function requireAuth(req: Request) {
  const authHeader = req.headers.get('authorization');

  if (!authHeader?.startsWith('Bearer ')) {
    throw new Error('Missing Authorization header');
  }

  const token = authHeader.replace('Bearer ', '');
  return await verifyToken(token, {
    secretKey: process.env.CLERK_SECRET_KEY,
  });
}