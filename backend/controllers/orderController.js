const db = require("../config/db");

// ===============================
// CREATE ORDER (CHECKOUT)
// ===============================
exports.createOrder = (req, res) => {
  const { user_id } = req.body;

  if (!user_id) {
    return res.status(400).json({ message: "user_id required" });
  }

  const cartSql = `
    SELECT cart.product_id, cart.quantity, products.price
    FROM cart
    JOIN products ON cart.product_id = products.id
    WHERE cart.user_id = ?
  `;

  db.query(cartSql, [user_id], (err, cartItems) => {
    if (err) return res.status(500).json(err);

    if (cartItems.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    let total = 0;
    cartItems.forEach((item) => {
      total += Number(item.price) * item.quantity;
    });

    const orderSql =
      "INSERT INTO orders (user_id, total, status) VALUES (?, ?, 'pending')";

    db.query(orderSql, [user_id, total], (err, orderResult) => {
      if (err) return res.status(500).json(err);

      const orderId = orderResult.insertId;

      const orderItemsSql =
        "INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ?";

      const values = cartItems.map(item => [
        orderId,
        item.product_id,
        item.quantity,
        item.price
      ]);

      db.query(orderItemsSql, [values], (err) => {
        if (err) return res.status(500).json(err);

        const deleteCartSql = "DELETE FROM cart WHERE user_id = ?";

        db.query(deleteCartSql, [user_id], () => {
          res.json({
            message: "Order placed successfully",
            orderId,
            total
          });
        });
      });
    });
  });
};


// ===============================
// GET USER ORDERS (HISTORY)
// ===============================
exports.getUserOrders = (req, res) => {
  const userId = req.params.user_id || req.params.id;

  if (!userId) {
    return res.status(400).json({ message: "User id required" });
  }

  const orderSql = "SELECT * FROM orders WHERE user_id = ?";

  db.query(orderSql, [userId], (err, orders) => {
    if (err) return res.status(500).json(err);

    if (orders.length === 0) {
      return res.json([]);
    }

    let result = [];
    let completed = 0;

    orders.forEach(order => {
      const itemSql = `
        SELECT oi.quantity, oi.price, p.name
        FROM order_items oi
        JOIN products p ON oi.product_id = p.id
        WHERE oi.order_id = ?
      `;

      db.query(itemSql, [order.id], (err, items) => {
        if (err) return res.status(500).json(err);

        result.push({
          order_id: order.id,
          total: order.total,
          status: order.status,
          created_at: order.created_at,
          items: items
        });

        completed++;

        if (completed === orders.length) {
          result.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
          res.json(result);
        }
      });
    });
  });
};