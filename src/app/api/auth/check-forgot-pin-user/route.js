import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function POST(req) {
  try {
    const { phone } = await req.json();

    if (!phone) {
      return NextResponse.json(
        { error: "Phone number is required" },
        { status: 400 }
      );
    }

    const [user] = await db.query("SELECT * FROM users WHERE phone = ?", [
      phone,
    ]);

    if (user.length === 0) {
      return NextResponse.json(
        { exists: false, message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ exists: true, message: "User exists" });
  } catch (error) {
    console.error("Error checking user:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
