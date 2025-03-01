import db from "@/lib/db";

export async function POST(req) {
  try {
    const {
      uId,
      full_name,
      phone,
      email,
      auth_pin,
      avatar,
      dob,
      gender,
      auth_provider,
    } = await req.json();

    // if (!uId || !full_name || !phone || !email || !auth_pin) {
    //   return new Response(
    //     JSON.stringify({ success: false, error: "Missing required fields" }),
    //     {
    //       status: 400,
    //       headers: { "Content-Type": "application/json" },
    //     }
    //   );
    // }

    // **Check if user already exists**
    const [existingUser] = await db.execute(
      `SELECT id FROM users WHERE uId = ? LIMIT 1`,
      [uId]
    );

    const [alreadyExists] = await db.execute(
      `SELECT id FROM users WHERE phone = ? LIMIT 1`,
      [phone]
    );
    if (phone == "") {
    } else {
      if (alreadyExists.length > 0) {
        return new Response(
          JSON.stringify({
            success: false,
            message: "User with this phone number already exists",
          }),
          {
            status: 400,
            headers: { "Content-Type": "application/json" },
          }
        );
      }
    }

    if (existingUser.length > 0) {
      await db.execute(
        `UPDATE users SET last_signed_in = CURRENT_TIMESTAMP WHERE uId = ?`,
        [uId]
      );

      return new Response(
        JSON.stringify({
          success: true,
          message: "User already exists, last_signed_in updated",
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // **Insert new user**
    const [result] = await db.execute(
      `INSERT INTO users (uId, full_name, phone, email, auth_pin, avatar, dob, gender, auth_provider) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        uId,
        full_name,
        phone,
        email,
        auth_pin,
        avatar || null,
        dob || null,
        gender || null,
        auth_provider || "phone",
      ]
    );

    return new Response(
      JSON.stringify({
        success: true,
        message: "User created",
        userId: result.insertId,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error creating user:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
