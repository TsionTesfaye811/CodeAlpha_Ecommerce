const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const mysql = require("mysql2");

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

const createOrdersTable = `
  CREATE TABLE IF NOT EXISTS orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    total DECIMAL(10, 2),
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`;

const createOrderItemsTable = `
  CREATE TABLE IF NOT EXISTS order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT,
    price DECIMAL(10, 2)
  )
`;

db.connect((err) => {
  if (err) {
    console.log("❌ MySQL Error:", err.message);
    process.exit(1);
  }

  db.query(createOrdersTable, (err) => {
    if (err) {
      console.log("❌ Orders table error:", err.message);
      process.exit(1);
    }

    db.query(createOrderItemsTable, (err) => {
      if (err) {
        console.log("❌ Order items table error:", err.message);
        process.exit(1);
      }

      console.log("✅ Orders & order_items tables ready");
      db.end();
    });
  });
});
