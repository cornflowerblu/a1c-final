import { supabase } from '@/app/lib/db'
import { NextResponse } from 'next/server'

async function getData() {
  // Use the standard Supabase client for public data
  const { data } = await supabase.from('User').select('*')
  return data
}

export async function GET() {
  const data = await getData()
  return NextResponse.json({ data })
}