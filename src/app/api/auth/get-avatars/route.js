import db from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { uId } = await req.json();

    if (!uId) {
      return NextResponse.json(
        { success: false, error: "uId is required" },
        { status: 400 }
      );
    }

    // Get user gender
    const [user] = await db.query("SELECT gender FROM users WHERE uId = ?", [
      uId,
    ]);

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    // Get avatars based on gender
    const [avatars] = await db.query(
      "SELECT id, avatar_url FROM avatars WHERE gender = ?",
      [user[0].gender]
    );

    return NextResponse.json({ success: true, avatars }, { status: 200 });
  } catch (error) {
    console.error("Error fetching avatars:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
