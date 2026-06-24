import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Mail, Calendar, Package, ShoppingBag } from "lucide-react";
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

function Profile() {
  const navigate = useNavigate();
  const storedUser = JSON.parse(localStorage.getItem("user") || "null");
  const [profile, setProfile] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!storedUser) {
      navigate("/login");
      return;
    }

    Promise.all([
      api.get(`/user/${storedUser.id}`),
      api.get(`/user/${storedUser.id}/orders`),
    ])
      .then(([profileRes, ordersRes]) => {
        setProfile(profileRes.data);
        setOrders(ordersRes.data);
      })
      .catch((err) => {
        const msg = err.response?.data?.message || err.message;
        setError(msg || "Failed to load profile. Restart the backend server.");
      })
      .finally(() => setLoading(false));
  }, [storedUser, navigate]);

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const totalSpent = orders.reduce(
    (sum, order) => sum + Number(order.total),
    0
  );

  const recentOrders = orders.slice(0, 3);

  if (!storedUser) return null;

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="max-w-3xl mx-auto px-6 py-10">
        {loading && (
          <p className="text-muted-foreground text-center py-20">Loading profile...</p>
        )}

        {error && (
          <p className="text-destructive text-center py-20">{error}</p>
        )}

        {!loading && !error && profile && (
          <div className="space-y-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold">
                    {profile.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold">{profile.name}</h1>
                    <p className="text-muted-foreground">{profile.email}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid sm:grid-cols-3 gap-4">
              <Card>
                <CardContent className="pt-6 text-center">
                  <Package className="h-6 w-6 mx-auto text-muted-foreground mb-2" />
                  <p className="text-2xl font-bold">{orders.length}</p>
                  <p className="text-sm text-muted-foreground">Total Orders</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6 text-center">
                  <ShoppingBag className="h-6 w-6 mx-auto text-muted-foreground mb-2" />
                  <p className="text-2xl font-bold">${totalSpent.toFixed(2)}</p>
                  <p className="text-sm text-muted-foreground">Total Spent</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6 text-center">
                  <Calendar className="h-6 w-6 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm font-bold">
                    {formatDate(profile.created_at)}
                  </p>
                  <p className="text-sm text-muted-foreground">Member Since</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Account Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Email:</span>
                  <span className="font-medium">{profile.email}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Joined:</span>
                  <span className="font-medium">{formatDate(profile.created_at)}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Recent Orders</CardTitle>
                  <CardDescription>Your latest purchases</CardDescription>
                </div>
                {orders.length > 0 && (
                  <Button variant="outline" size="sm" asChild>
                    <Link to="/orders">View All</Link>
                  </Button>
                )}
              </CardHeader>
              <CardContent>
                {recentOrders.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">No orders yet</p>
                    <Button asChild>
                      <Link to="/home">Start Shopping</Link>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {recentOrders.map((order) => (
                      <div
                        key={order.order_id}
                        className="flex justify-between items-center py-3 border-b last:border-0"
                      >
                        <div>
                          <p className="font-medium">Order #{order.order_id}</p>
                          <p className="text-sm text-muted-foreground">
                            {order.items.length} item(s) · {formatDate(order.created_at)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">${Number(order.total).toFixed(2)}</p>
                          <span className="text-xs capitalize text-muted-foreground">
                            {order.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}

export default Profile;
