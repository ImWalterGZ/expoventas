import { NextResponse } from "next/server";
import db from "@/lib/db/db";

export async function GET() {
  try {
    const stmt = db.prepare(`
      SELECT 
        id,
        business,
        salesperson,
        price,
        description,
        datetime(created_at, 'localtime') as created_at
      FROM sales
      ORDER BY created_at DESC
    `);

    const sales = stmt.all();
    return NextResponse.json({ sales });
  } catch (error) {
    console.error("Error fetching sales:", error);
    return NextResponse.json(
      { error: "Error fetching sales" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const data = await request.json();

    // Validate required fields
    if (!data.business || !data.salesperson || !data.price) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Insert the sale into the database
    const stmt = db.prepare(`
      INSERT INTO sales (business, salesperson, price, description)
      VALUES (?, ?, ?, ?)
    `);

    const result = stmt.run(
      data.business,
      data.salesperson,
      data.price,
      data.description || null
    );

    return NextResponse.json({
      success: true,
      id: result.lastInsertRowid,
    });
  } catch (error) {
    console.error("Error saving sale:", error);
    return NextResponse.json({ error: "Error saving sale" }, { status: 500 });
  }
}
