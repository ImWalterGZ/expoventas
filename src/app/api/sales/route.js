import { NextResponse } from "next/server";
import sqlite3 from "sqlite3";
import { open } from "sqlite";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get("date");

  try {
    const db = await open({
      filename: "./sales.db",
      driver: sqlite3.Database,
    });

    let query = `
      SELECT 
        id,
        business,
        salesperson,
        price,
        description,
        datetime(created_at, 'localtime') as created_at
      FROM sales 
      WHERE date(created_at, 'localtime') = date(?, 'localtime')
      ORDER BY created_at DESC
    `;
    const sales = await db.all(query, [date]);

    await db.close();

    return NextResponse.json({ sales });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: "Error al acceder a la base de datos" },
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

    const db = await open({
      filename: "./sales.db",
      driver: sqlite3.Database,
    });

    // Insert the sale into the database
    const query = `
      INSERT INTO sales (business, salesperson, price, description)
      VALUES (?, ?, ?, ?)
    `;

    const result = await db.run(query, [
      data.business,
      data.salesperson,
      data.price,
      data.description || null,
    ]);

    await db.close();

    return NextResponse.json({
      success: true,
      id: result.lastID,
    });
  } catch (error) {
    console.error("Error saving sale:", error);
    return NextResponse.json({ error: "Error saving sale" }, { status: 500 });
  }
}
