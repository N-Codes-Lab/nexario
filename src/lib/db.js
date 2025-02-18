import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const db = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASS || "",
  database: process.env.DB_NAME || "nexario",
  waitForConnections: true,
  connectionLimit: 10, // Adjust based on your load
  queueLimit: 0, // 0 means unlimited queue
  multipleStatements: false, // Set to true only if needed
  namedPlaceholders: true, // Enables named placeholders for queries
});

export default db;
