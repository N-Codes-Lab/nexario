import db from "@/lib/db"; // Your database connection file

export async function POST(req) {
  try {
    const { phone, pin } = await req.json(); // Parse JSON request body
    console.log(phone);

    // Check if user exists
    const [rows] = await db.execute("SELECT * FROM users WHERE phone = ?", [
      phone,
    ]);

    if (rows.length === 0) {
      return new Response(JSON.stringify({ message: "User not found" }), {
        status: 404,
      });
    }

    const user = rows[0];

    // Check if the entered pin matches the stored auth_pin
    console.log(user.phone);

    if (user.auth_pin != pin) {
      return new Response(JSON.stringify({ message: "Invalid PIN" }), {
        status: 401,
      });
    }

    // Update last_signed_in field with current timestamp
    await db.execute(
      "UPDATE users SET last_signed_in = CURRENT_TIMESTAMP() WHERE phone = ?",
      [phone]
    );

    return new Response(
      JSON.stringify({ message: "User verified", user, success: true }),
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Database Error:", error);
    return new Response(JSON.stringify({ message: "Internal Server Error" }), {
      status: 500,
    });
  }
}
