const db = require("../config/db");
const { attachImagesToProduct, saveProductImages } = require("../utils/productImages");

// GET ALL PRODUCTS
exports.getProducts = (req, res) => {
  const sql = "SELECT * FROM products ORDER BY created_at DESC";

  db.query(sql, (err, results) => {
    if (err) return res.status(500).json(err);

    if (results.length === 0) return res.json([]);

    let completed = 0;
    const products = [];

    results.forEach((product) => {
      attachImagesToProduct(product, (err, fullProduct) => {
        if (err) return res.status(500).json(err);
        products.push(fullProduct);
        completed++;
        if (completed === results.length) {
          products.sort((a, b) => b.id - a.id);
          res.json(products);
        }
      });
    });
  });
};

// GET SINGLE PRODUCT
exports.getProductById = (req, res) => {
  const sql = "SELECT * FROM products WHERE id = ?";

  db.query(sql, [req.params.id], (err, result) => {
    if (err) return res.status(500).json(err);
    if (!result[0]) return res.status(404).json({ message: "Product not found" });

    attachImagesToProduct(result[0], (err, product) => {
      if (err) return res.status(500).json(err);
      res.json(product);
    });
  });
};

// ADD PRODUCT (admin)
exports.addProduct = (req, res) => {
  const { name, description, price, images } = req.body;
  const imageList = images?.length ? images : req.body.image ? [req.body.image] : [];

  if (!name || !description || price == null || imageList.length === 0) {
    return res.status(400).json({
      message: "name, description, price, and at least one image required",
    });
  }

  const sql =
    "INSERT INTO products (name, description, price, image) VALUES (?, ?, ?, ?)";

  db.query(
    sql,
    [name, description, price, imageList[0]],
    (err, result) => {
      if (err) return res.status(500).json(err);

      saveProductImages(result.insertId, imageList, (err) => {
        if (err) return res.status(500).json(err);
        res.json({ message: "Product added successfully", id: result.insertId });
      });
    }
  );
};

// UPDATE PRODUCT (admin)
exports.updateProduct = (req, res) => {
  const { name, description, price, images } = req.body;
  const productId = req.params.id;
  const imageList = images?.length ? images : undefined;

  const sql =
    "UPDATE products SET name = ?, description = ?, price = ?, image = COALESCE(?, image) WHERE id = ?";

  db.query(
    sql,
    [
      name,
      description,
      price,
      imageList ? imageList[0] : null,
      productId,
    ],
    (err, result) => {
      if (err) return res.status(500).json(err);
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Product not found" });
      }

      if (!imageList) {
        return res.json({ message: "Product updated successfully" });
      }

      saveProductImages(productId, imageList, (err) => {
        if (err) return res.status(500).json(err);
        res.json({ message: "Product updated successfully" });
      });
    }
  );
};

// DELETE PRODUCT (admin)
exports.deleteProduct = (req, res) => {
  const productId = req.params.id;

  db.query("DELETE FROM product_images WHERE product_id = ?", [productId], () => {
    db.query("DELETE FROM products WHERE id = ?", [productId], (err, result) => {
      if (err) return res.status(500).json(err);
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json({ message: "Product deleted successfully" });
    });
  });
};
