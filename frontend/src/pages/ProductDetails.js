import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, ShoppingCart, Check, Minus, Plus } from "lucide-react";
import api from "../api/api";
import Navbar from "../components/layout/Navbar";
import { Button } from "components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "components/ui/card";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const userId = user?.id;

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    if (!userId) {
      navigate("/login");
      return;
    }

    setLoading(true);
    setError("");
    setQuantity(1);
    setActiveImage(0);
    setAdded(false);

    api
      .get(`/products/${id}`)
      .then((res) => setProduct(res.data))
      .catch(() => setError("Product not found"))
      .finally(() => setLoading(false));
  }, [id, userId, navigate]);

  const images =
    product?.images?.length > 0
      ? product.images
      : product?.image
        ? [product.image]
        : [];

  const unitPrice = Number(product?.price || 0);
  const lineTotal = unitPrice * quantity;

  const increaseQuantity = () => {
    setQuantity((prev) => Math.min(99, prev + 1));
    setAdded(false);
  };

  const decreaseQuantity = () => {
    setQuantity((prev) => Math.max(1, prev - 1));
    setAdded(false);
  };

  const selectImage = (index) => {
    setActiveImage(index);
  };

  const handleAddToCart = async () => {
    setAdding(true);
    setAdded(false);
    setError("");

    try {
      await api.post("/cart", {
        user_id: userId,
        product_id: product.id,
        quantity,
      });
      setAdded(true);
      window.dispatchEvent(new Event("cart-updated"));
    } catch {
      setError("Failed to add to cart");
    } finally {
      setAdding(false);
    }
  };

  if (!userId) return null;

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="max-w-6xl mx-auto px-6 py-10">
        <Button variant="ghost" size="sm" className="mb-6" asChild>
          <Link to="/home">
            <ArrowLeft className="h-4 w-4" />
            Back to products
          </Link>
        </Button>

        {loading && (
          <p className="text-muted-foreground text-center py-20">Loading product...</p>
        )}

        {error && !product && (
          <p className="text-destructive text-center py-20">{error}</p>
        )}

        {!loading && product && (
          <div className="grid md:grid-cols-2 gap-10">
            <div className="space-y-4">
              <div className="aspect-square overflow-hidden rounded-lg bg-white border">
                <img
                  key={images[activeImage] || "main"}
                  src={images[activeImage] || product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transition-opacity duration-200"
                />
              </div>

              {images.length > 1 && (
                <div className="flex gap-3 flex-wrap">
                  {images.map((img, index) => (
                    <button
                      key={`${img}-${index}`}
                      type="button"
                      aria-label={`View image ${index + 1}`}
                      aria-pressed={activeImage === index}
                      onClick={() => selectImage(index)}
                      className={`h-20 w-20 rounded-md overflow-hidden border-2 cursor-pointer shrink-0 ${
                        activeImage === index
                          ? "border-slate-900 ring-2 ring-slate-900 ring-offset-2"
                          : "border-slate-200 hover:border-slate-400"
                      }`}
                    >
                      <img
                        src={img}
                        alt={`${product.name} view ${index + 1}`}
                        className="w-full h-full object-cover pointer-events-none"
                        draggable={false}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <Card className="h-fit">
              <CardHeader>
                <CardTitle className="text-3xl">{product.name}</CardTitle>
                <CardDescription className="text-2xl font-bold text-foreground pt-2">
                  ${unitPrice.toFixed(2)}
                  <span className="text-sm font-normal text-muted-foreground ml-2">
                    per item
                  </span>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-muted-foreground leading-relaxed">
                  {product.description}
                </p>

                <div className="space-y-2">
                  <p className="text-sm font-medium">Quantity</p>
                  <div className="inline-flex items-center gap-3 border rounded-lg p-1">
                    <button
                      type="button"
                      onClick={decreaseQuantity}
                      disabled={quantity <= 1}
                      className="h-10 w-10 flex items-center justify-center rounded-md border bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-12 text-center text-lg font-semibold select-none">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={increaseQuantity}
                      disabled={quantity >= 99}
                      className="h-10 w-10 flex items-center justify-center rounded-md border bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
                      aria-label="Increase quantity"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="rounded-lg bg-muted p-4 flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Subtotal</span>
                  <span className="text-xl font-bold">${lineTotal.toFixed(2)}</span>
                </div>

                {error && (
                  <p className="text-sm text-destructive">{error}</p>
                )}

                <Button
                  className="w-full"
                  size="lg"
                  onClick={handleAddToCart}
                  disabled={adding}
                >
                  {added ? (
                    <>
                      <Check className="h-4 w-4" />
                      Added {quantity} to Cart
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="h-4 w-4" />
                      {adding
                        ? "Adding..."
                        : `Add ${quantity} to Cart — $${lineTotal.toFixed(2)}`}
                    </>
                  )}
                </Button>

                {added && (
                  <Button variant="outline" className="w-full" asChild>
                    <Link to="/cart">View Cart</Link>
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}

export default ProductDetails;
