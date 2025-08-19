// app/api/voltages/route.ts
import { NextResponse } from "next/server";
import { sql } from "@/lib/db";  

export async function GET() {
  try {
    const rows = await sql`
      SELECT id, ts, volt
      FROM dmg9000_data
      ORDER BY ts DESC
      LIMIT 10
    `;
    return NextResponse.json(rows);
  } catch (err) {
    console.error(err);
    return new NextResponse("Error consultando la BD", { status: 500 });
  }
}