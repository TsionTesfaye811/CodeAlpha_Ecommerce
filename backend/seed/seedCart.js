const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const mysql = require("mysql2");

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

const createTable = `
  CREATE TABLE IF NOT EXISTS cart (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`;

db.connect((err) => {
  if (err) {
    console.log("❌ MySQL Error:", err.message);
    process.exit(1);
  }

  db.query(createTable, (err) => {
    if (err) {
      console.log("❌ Table error:", err.message);
      process.exit(1);
    }

    console.log("✅ Cart table ready");
    db.end();
  });
});
