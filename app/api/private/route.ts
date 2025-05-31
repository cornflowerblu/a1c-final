// app/api/private/route.ts (if using App Router)
// OR pages/api/private.ts (if using Pages Router)

import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@clerk/backend';

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization');  

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const token = authHeader.replace('Bearer ', '');

  try {
    const { userId, sessionId, claims } = await verifyToken(token, {
      secretKey: process.env.CLERK_SECRET_KEY,
    });
    
    return (NextResponse.json({userId})
  ) 
  } catch (err) {
    return new NextResponse('Invalid token', { status: 403 });
  }
}