import Database from "better-sqlite3";
import path from "path";

// Initialize database
const db = new Database(path.join(process.cwd(), "sales.db"));

// Create tables if they don't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS sales (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    business TEXT NOT NULL,
    salesperson TEXT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

export default db;
