import { PrismaClient } from '@prisma/client';
import { NextRequest } from 'next/server';

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


async function getAllUsers() {
  const users = await prisma.user.findMany({
    include: {
      glucoseReadings: true,
      glucoseRuns: true,
    },
  });
  return users;
}



export async function GET() {
    return new Response(JSON.stringify(await getAllUsers()), {
        status: 200,
        headers: {
            'Content-Type': 'application/json',
        },
    });
}