import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Package, CreditCard } from "lucide-react";
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

function Checkout() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    api
      .get(`/cart/${user.id}`)
      .then((res) => setItems(res.data))
      .catch(() => setError("Failed to load cart"))
      .finally(() => setLoading(false));
  }, [user, navigate]);

  const total = items.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0
  );

  const handlePlaceOrder = async () => {
    setPlacing(true);
    setError("");

    try {
      await api.post("/orders/checkout", { user_id: user.id });
      window.dispatchEvent(new Event("cart-updated"));
      navigate("/orders");
    } catch (err) {
      setError(err.response?.data?.message || "Checkout failed");
    } finally {
      setPlacing(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="max-w-3xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold tracking-tight mb-8">Checkout</h1>

        {loading && (
          <p className="text-muted-foreground text-center py-20">Loading...</p>
        )}

        {!loading && items.length === 0 && (
          <div className="text-center py-20">
            <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4">Your cart is empty</p>
            <Button asChild>
              <Link to="/home">Browse Products</Link>
            </Button>
          </div>
        )}

        {!loading && items.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between items-center py-2 border-b last:border-0">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Qty: {item.quantity} × ${Number(item.price).toFixed(2)}
                    </p>
                  </div>
                  <p className="font-semibold">
                    ${(Number(item.price) * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
              <div className="flex justify-between text-xl font-bold pt-4">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
              {error && (
                <p className="text-sm text-destructive">{error}</p>
              )}
            </CardContent>
            <CardFooter className="flex flex-col gap-3">
              <Button
                className="w-full"
                size="lg"
                onClick={handlePlaceOrder}
                disabled={placing}
              >
                <CreditCard className="h-4 w-4" />
                {placing ? "Placing Order..." : "Place Order"}
              </Button>
              <Button variant="outline" className="w-full" asChild>
                <Link to="/cart">Back to Cart</Link>
              </Button>
            </CardFooter>
          </Card>
        )}
      </main>
    </div>
  );
}

export default Checkout;
