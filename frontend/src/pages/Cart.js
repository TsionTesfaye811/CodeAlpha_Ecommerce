import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Trash2, ShoppingBag, Minus, Plus } from "lucide-react";
import api from "../api/api";
import Navbar from "../components/layout/Navbar";
import { Button } from "components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "components/ui/card";

function Cart() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchCart = () => {
    if (!user) return;

    api
      .get(`/cart/${user.id}`)
      .then((res) => setItems(res.data))
      .catch(() => setError("Failed to load cart"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    fetchCart();
  }, [user, navigate]);

  const handleRemove = async (cartId) => {
    try {
      await api.delete(`/cart/${cartId}`);
      setItems((prev) => prev.filter((item) => item.id !== cartId));
      window.dispatchEvent(new Event("cart-updated"));
    } catch {
      setError("Failed to remove item");
    }
  };

  const handleQuantityChange = async (cartId, newQty) => {
    if (newQty < 1) return;

    try {
      await api.put(`/cart/${cartId}`, { quantity: newQty });
      setItems((prev) =>
        prev.map((item) =>
          item.id === cartId ? { ...item, quantity: newQty } : item
        )
      );
      window.dispatchEvent(new Event("cart-updated"));
    } catch {
      setError("Failed to update quantity");
    }
  };

  const total = items.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0
  );

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="max-w-6xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold tracking-tight mb-8">Your Cart</h1>

        {loading && (
          <p className="text-muted-foreground text-center py-20">Loading cart...</p>
        )}

        {error && (
          <p className="text-destructive text-center py-20">{error}</p>
        )}

        {!loading && !error && items.length === 0 && (
          <div className="text-center py-20">
            <ShoppingBag className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4">Your cart is empty</p>
            <Button asChild>
              <Link to="/home">Browse Products</Link>
            </Button>
          </div>
        )}

        {!loading && items.length > 0 && (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <Card key={item.id}>
                  <CardContent className="flex items-center gap-4 p-4">
                    <div className="h-20 w-20 rounded-md overflow-hidden bg-slate-100 shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold truncate">{item.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        ${Number(item.price).toFixed(2)} each
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() =>
                            handleQuantityChange(item.id, item.quantity - 1)
                          }
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center font-medium">
                          {item.quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() =>
                            handleQuantityChange(item.id, item.quantity + 1)
                          }
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                      <p className="font-bold mt-2">
                        ${(Number(item.price) * item.quantity).toFixed(2)}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleRemove(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="h-fit">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" size="lg" asChild>
                  <Link to="/checkout">Proceed to Checkout</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}

export default Cart;
