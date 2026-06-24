const db = require("../config/db");

function getProductImages(productId, callback) {
  const sql = `
    SELECT image_url, is_primary, sort_order
    FROM product_images
    WHERE product_id = ?
    ORDER BY sort_order ASC
  `;
  db.query(sql, [productId], callback);
}

function attachImagesToProduct(product, callback) {
  if (!product) return callback(null, null);

  getProductImages(product.id, (err, images) => {
    if (err) return callback(err);

    const imageUrls =
      images.length > 0
        ? images.map((img) => img.image_url)
        : product.image
          ? [product.image]
          : [];

    callback(null, {
      ...product,
      images: imageUrls,
      image: imageUrls[0] || product.image,
    });
  });
}

function saveProductImages(productId, images, callback) {
  if (!images || images.length === 0) return callback(null);

  const deleteSql = "DELETE FROM product_images WHERE product_id = ?";
  db.query(deleteSql, [productId], (err) => {
    if (err) return callback(err);

    const values = images.map((url, index) => [
      productId,
      url,
      index === 0,
      index,
    ]);

    db.query(
      "INSERT INTO product_images (product_id, image_url, is_primary, sort_order) VALUES ?",
      [values],
      callback
    );
  });
}

module.exports = {
  getProductImages,
  attachImagesToProduct,
  saveProductImages,
};
