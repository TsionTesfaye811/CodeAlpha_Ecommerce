import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingBag, LogOut, ShoppingCart, Package, User } from "lucide-react";
import api from "../../api/api";
import { Button } from "components/ui/button";

function Navbar() {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const [cartCount, setCartCount] = useState(0);

  const fetchCartCount = () => {
    if (!user) return;

    api
      .get(`/cart/${user.id}`)
      .then((res) => {
        const count = res.data.reduce((sum, item) => sum + item.quantity, 0);
        setCartCount(count);
      })
      .catch(() => setCartCount(0));
  };

  useEffect(() => {
    fetchCartCount();

    const handleUpdate = () => fetchCartCount();
    window.addEventListener("cart-updated", handleUpdate);
    return () => window.removeEventListener("cart-updated", handleUpdate);
  }, [user]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <header className="border-b bg-white sticky top-0 z-10">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/home" className="flex items-center gap-2 font-semibold text-lg hover:opacity-80">
          <ShoppingBag className="h-5 w-5" />
          <span>ShopAlpha</span>
        </Link>

        <div className="flex items-center gap-3">
          {user && (
            <Button variant="ghost" size="sm" className="hidden sm:flex" asChild>
              <Link to="/profile">
                <User className="h-4 w-4" />
                {user.name}
              </Link>
            </Button>
          )}
          <Button variant="outline" size="sm" asChild>
            <Link to="/orders">
              <Package className="h-4 w-4" />
              Orders
            </Link>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link to="/cart" className="relative">
              <ShoppingCart className="h-4 w-4" />
              Cart
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
          </Button>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
