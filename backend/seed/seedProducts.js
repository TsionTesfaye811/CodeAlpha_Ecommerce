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
  CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    description TEXT,
    price DECIMAL(10, 2),
    image VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`;

const products = [
  {
    name: "Wireless Headphones",
    description: "Premium noise-cancelling headphones with 30-hour battery life and crystal-clear sound.",
    price: 99.99,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600",
  },
  {
    name: "Smart Watch",
    description: "Track your fitness, receive notifications, and stay connected on the go.",
    price: 199.99,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600",
  },
  {
    name: "Running Shoes",
    description: "Lightweight, breathable running shoes designed for comfort and performance.",
    price: 129.99,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600",
  },
  {
    name: "Leather Backpack",
    description: "Stylish and durable leather backpack with padded laptop compartment.",
    price: 79.99,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600",
  },
];

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

    db.query("SELECT COUNT(*) AS count FROM products", (err, results) => {
      if (err) {
        console.log("❌ Query error:", err.message);
        process.exit(1);
      }

      if (results[0].count >= 4) {
        console.log(`✅ Products table ready (${results[0].count} products already exist)`);
        db.end();
        return;
      }

      const sql = "INSERT INTO products (name, description, price, image) VALUES ?";
      const values = products.map((p) => [p.name, p.description, p.price, p.image]);

      db.query(sql, [values], (err) => {
        if (err) {
          console.log("❌ Seed error:", err.message);
          process.exit(1);
        }

        console.log(`✅ Seeded ${products.length} products successfully`);
        db.end();
      });
    });
  });
});
