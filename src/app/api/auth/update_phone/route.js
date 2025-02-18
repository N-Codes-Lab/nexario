import db from "@/lib/db";

export async function POST(req) {
  try {
    const { uId, phone } = await req.json();

    if (!uId || !phone) {
      return Response.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    const [result] = await db.execute(
      "UPDATE users SET phone = ?, modified_on = NOW() WHERE uId = ?",
      [phone, uId]
    );

    if (result.affectedRows > 0) {
      return Response.json(
        { success: true, message: "Phone number updated" },
        { status: 200 }
      );
    } else {
      return Response.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error("Database error:", error);
    return Response.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
