import db from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { phone, newPin } = await req.json();

    if (!phone || !newPin) {
      return NextResponse.json(
        { error: "Phone number and new PIN are required" },
        { status: 400 }
      );
    }

    const [result] = await db.query(
      "UPDATE users SET auth_pin = ? WHERE phone = ?",
      [newPin, phone]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "PIN updated successfully",
    });
  } catch (error) {
    console.error("Error updating PIN:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
