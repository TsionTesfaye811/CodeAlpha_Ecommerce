const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const mysql = require("mysql2");
const bcrypt = require("bcryptjs");

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

const createImagesTable = `
  CREATE TABLE IF NOT EXISTS product_images (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    is_primary BOOLEAN DEFAULT FALSE,
    sort_order INT DEFAULT 0
  )
`;

const extraImagesByName = {
  "Wireless Headphones": [
    "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=600",
    "https://images.unsplash.com/photo-1618366712010-f156ae789808?w=600",
  ],
  "Smart Watch": [
    "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=600",
    "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=600",
  ],
  "Running Shoes": [
    "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600",
    "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600",
  ],
  "Leather Backpack": [
    "https://images.unsplash.com/photo-1622560480605-d83c853a5e2c?w=600",
    "https://images.unsplash.com/photo-1491637639811-60e2756cc1c7?w=600",
  ],
};

db.connect((err) => {
  if (err) {
    console.log("❌ MySQL Error:", err.message);
    process.exit(1);
  }

  db.query(createImagesTable, (err) => {
    if (err) {
      console.log("❌ product_images table error:", err.message);
      process.exit(1);
    }

    db.query("SELECT id, name, image FROM products", (err, products) => {
      if (err) {
        console.log("❌ Query error:", err.message);
        process.exit(1);
      }

      if (products.length === 0) {
        console.log("✅ product_images table ready (no products to seed)");
        seedAdminUser();
        return;
      }

      let done = 0;
      let seeded = 0;

      products.forEach((product) => {
        db.query(
          "SELECT COUNT(*) AS count FROM product_images WHERE product_id = ?",
          [product.id],
          (err, rows) => {
            if (err) {
              console.log("❌ Count error:", err.message);
              process.exit(1);
            }

            if (rows[0].count > 0) {
              done++;
              if (done === products.length) finish(seeded);
              return;
            }

            const extras = extraImagesByName[product.name] || [
              product.image,
              product.image,
            ];
            const allImages = [product.image, extras[0], extras[1]].filter(
              Boolean
            );

            const values = allImages.map((url, index) => [
              product.id,
              url,
              index === 0,
              index,
            ]);

            db.query(
              "INSERT INTO product_images (product_id, image_url, is_primary, sort_order) VALUES ?",
              [values],
              (err) => {
                done++;
                if (!err) seeded++;
                if (done === products.length) finish(seeded);
              }
            );
          }
        );
      });

      function finish(seededCount) {
        console.log(`✅ product_images ready (seeded ${seededCount} products)`);
        seedAdminUser();
      }
    });
  });
});

function seedAdminUser() {
  db.query(
    "ALTER TABLE users ADD COLUMN role ENUM('customer', 'admin') DEFAULT 'customer'",
    () => {
      db.query(
        "SELECT id FROM users WHERE email = ?",
        ["admin@shopalpha.com"],
        (err, rows) => {
          if (err) {
            console.log("❌ Admin check error:", err.message);
            db.end();
            return;
          }

          if (rows.length > 0) {
            db.query(
              "UPDATE users SET role = 'admin' WHERE email = ?",
              ["admin@shopalpha.com"],
              () => {
                console.log("✅ Admin user already exists");
                db.end();
              }
            );
            return;
          }

          bcrypt.hash("admin123", 10, (err, hash) => {
            if (err) {
              console.log("❌ Bcrypt error:", err.message);
              db.end();
              return;
            }

            db.query(
              "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
              ["Admin", "admin@shopalpha.com", hash, "admin"],
              (err) => {
                if (err) {
                  console.log("❌ Admin seed error:", err.message);
                } else {
                  console.log("✅ Admin user created (admin@shopalpha.com / admin123)");
                }
                db.end();
              }
            );
          });
        }
      );
    }
  );
}
