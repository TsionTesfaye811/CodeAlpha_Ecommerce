const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const mysql = require("mysql2");

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Same product, different angle/crop/color — built from one base photo per product
const productImageSets = {
  "Wireless Headphones": [
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&fit=crop",
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&fit=crop&crop=top",
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&fit=crop&sat=-40",
  ],
  "Smart Watch": [
    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&fit=crop",
    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&fit=crop&crop=entropy",
    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&fit=crop&hue=20",
  ],
  "Running Shoes": [
    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&fit=crop",
    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&fit=crop&crop=left",
    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&fit=crop&sat=30",
  ],
  "Leather Backpack": [
    "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&fit=crop",
    "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&fit=crop&crop=faces",
    "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&fit=crop&brightness=10",
  ],
  "iPhone 15": [
    "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&fit=crop",
    "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&fit=crop&crop=entropy",
    "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&fit=crop&sat=-20",
  ],
};

function getImagesForProduct(name, primaryImage) {
  if (productImageSets[name]) {
    return productImageSets[name];
  }

  if (primaryImage && primaryImage.startsWith("http")) {
    const base = primaryImage.split("?")[0];
    return [
      `${base}?w=800&fit=crop`,
      `${base}?w=800&fit=crop&crop=top`,
      `${base}?w=800&fit=crop&sat=-30`,
    ];
  }

  return [primaryImage, primaryImage, primaryImage].filter(Boolean);
}

db.connect((err) => {
  if (err) {
    console.log("❌ MySQL Error:", err.message);
    process.exit(1);
  }

  db.query("SELECT id, name, image FROM products", (err, products) => {
    if (err) {
      console.log("❌ Query error:", err.message);
      process.exit(1);
    }

    if (products.length === 0) {
      console.log("✅ No products found");
      db.end();
      return;
    }

    let done = 0;

    products.forEach((product) => {
      const images = getImagesForProduct(product.name, product.image);

      db.query("DELETE FROM product_images WHERE product_id = ?", [product.id], () => {
        const values = images.map((url, index) => [
          product.id,
          url,
          index === 0,
          index,
        ]);

        db.query(
          "INSERT INTO product_images (product_id, image_url, is_primary, sort_order) VALUES ?",
          [values],
          () => {
            db.query(
              "UPDATE products SET image = ? WHERE id = ?",
              [images[0], product.id],
              () => {
                done++;
                if (done === products.length) {
                  console.log(`✅ Updated images for ${products.length} products`);
                  db.end();
                }
              }
            );
          }
        );
      });
    });
  });
});
