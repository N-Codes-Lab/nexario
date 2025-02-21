import db from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { uId, avatarUrl } = await req.json();

    if (!uId || !avatarUrl) {
      return NextResponse.json(
        { success: false, error: "Missing required fields." },
        { status: 400 }
      );
    }

    // Update avatar in users table
    await db.query("UPDATE users SET avatar = ? WHERE uId = ?", [
      avatarUrl,
      uId,
    ]);

    return NextResponse.json(
      { success: true, message: "Avatar updated successfully!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating avatar:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error." },
      { status: 500 }
    );
  }
}
