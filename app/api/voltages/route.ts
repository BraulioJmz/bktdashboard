// app/api/voltages/route.ts
import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export async function GET() {
  // Trae TODO para el MVP; luego puedes limitar por fecha
  const rows = await sql<{
    ts: string;   // ISO UTC desde Postgres
    volt: number;
  }>`SELECT ts, volt FROM dmg9000_data ORDER BY ts ASC`;

  return NextResponse.json({ rows });
}
