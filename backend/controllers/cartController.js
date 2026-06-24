const db = require("../config/db");

// ADD TO CART
exports.addToCart = (req, res) => {
  const { user_id, product_id, quantity = 1 } = req.body;

  if (!user_id || !product_id) {
    return res.status(400).json({ message: "user_id and product_id required" });
  }

  const checkSql =
    "SELECT * FROM cart WHERE user_id = ? AND product_id = ?";

  db.query(checkSql, [user_id, product_id], (err, results) => {
    if (err) return res.status(500).json(err);

    if (results.length > 0) {
      const newQty = results[0].quantity + quantity;
      const updateSql = "UPDATE cart SET quantity = ? WHERE id = ?";

      db.query(updateSql, [newQty, results[0].id], (err) => {
        if (err) return res.status(500).json(err);
        res.json({ message: "Cart updated", quantity: newQty });
      });
      return;
    }

    const insertSql =
      "INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)";

    db.query(insertSql, [user_id, product_id, quantity], (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Product added to cart" });
    });
  });
};

// GET CART ITEMS (for one user)
exports.getCart = (req, res) => {
  const userId = req.params.userId;

  const sql = `
    SELECT cart.id, cart.product_id, products.name, products.price,
           products.image, cart.quantity
    FROM cart
    JOIN products ON cart.product_id = products.id
    WHERE cart.user_id = ?
  `;

  db.query(sql, [userId], (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
};

// DELETE ITEM FROM CART
exports.deleteCartItem = (req, res) => {
  const sql = "DELETE FROM cart WHERE id = ?";

  db.query(sql, [req.params.id], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Item removed from cart" });
  });
};

// UPDATE CART ITEM QUANTITY
exports.updateCartItem = (req, res) => {
  const { quantity } = req.body;

  if (!quantity || quantity < 1) {
    return res.status(400).json({ message: "Quantity must be at least 1" });
  }

  const sql = "UPDATE cart SET quantity = ? WHERE id = ?";

  db.query(sql, [quantity, req.params.id], (err, result) => {
    if (err) return res.status(500).json(err);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Cart item not found" });
    }
    res.json({ message: "Quantity updated" });
  });
};
