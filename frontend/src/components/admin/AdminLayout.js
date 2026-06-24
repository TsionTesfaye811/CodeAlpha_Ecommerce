import { Link, useNavigate } from "react-router-dom";
import { LayoutDashboard, Package, LogOut, Store } from "lucide-react";
import { Button } from "components/ui/button";

function AdminLayout({ children }) {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  if (!user || user.role !== "admin") {
    navigate("/login");
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-100 flex">
      <aside className="w-64 bg-slate-900 text-white flex flex-col">
        <div className="p-6 border-b border-slate-700">
          <div className="flex items-center gap-2 font-semibold text-lg">
            <Store className="h-5 w-5" />
            <span>Admin Panel</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">{user.email}</p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          <Link
            to="/admin/products"
            className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-slate-800 text-sm"
          >
            <Package className="h-4 w-4" />
            Products
          </Link>
          <Link
            to="/home"
            className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-slate-800 text-sm text-slate-300"
          >
            <LayoutDashboard className="h-4 w-4" />
            View Store
          </Link>
        </nav>

        <div className="p-4 border-t border-slate-700">
          <Button
            variant="ghost"
            className="w-full justify-start text-slate-300 hover:text-white hover:bg-slate-800"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </aside>

      <main className="flex-1 p-8 overflow-auto">{children}</main>
    </div>
  );
}

export default AdminLayout;
