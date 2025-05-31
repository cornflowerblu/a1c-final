import { decodeJwt } from '@clerk/backend/jwt';
import { getAuth, verifyToken } from '@clerk/nextjs/server';
import { PrismaClient } from '@prisma/client';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';


const prisma = new PrismaClient();

type User = {
  id: string;
  clerkId: string;
  email: string;
  name: string;
  role: string;
  createdAt: Date;       
  updatedAt: Date;       
  glucoseReadings: any[];
  glucoseRuns: any[]; };


async function getAllUsers(userId?: string) {
  const users = await prisma.user.findMany({
    include: {
      glucoseReadings: true,
      glucoseRuns: true,      
    },
    where: {
      clerkId: userId
    },
  });
  return users as unknown as User;
}



export async function GET(req: NextRequest) {
    
  const cookieStore = cookies();
  const rawToken = (await cookieStore).get('__session')?.value;

  if (!rawToken) {
    return NextResponse.json({ error: 'No auth token' }, { status: 401 });
  }

  try {
    // Decode and verify the Clerk JWT
    const { userId } = await verifyToken(rawToken, {
      secretKey: process.env.CLERK_SECRET_KEY!,
    });
    
    const users = await getAllUsers(userId as any)

  return NextResponse.json({ users })
  } catch (error) {
    console.error('Authentication error:', error);
    return NextResponse.json({ error: 'Failed to authenticate' }, { status: 403 });
  }
}
