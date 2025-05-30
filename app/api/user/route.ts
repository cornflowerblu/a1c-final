import { PrismaClient } from '@prisma/client';
import { requireAuth } from "@/app/lib/auth"
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


async function getAllUsers() {
  const users = await prisma.user.findMany({
    include: {
      glucoseReadings: true,
      glucoseRuns: true,
    },
  });
  return users;
}



export async function GET(req: NextRequest) {
  try{
   await requireAuth(req)
   return NextResponse.json({
     users: await getAllUsers()
   })
  } catch {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }    
}