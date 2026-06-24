import { ShoppingBag } from "lucide-react";

function AuthLayout({ children }) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="hidden lg:flex flex-col justify-between bg-slate-900 text-white p-12">
        <div className="flex items-center gap-2 text-lg font-semibold">
          <ShoppingBag className="h-6 w-6" />
          <span>ShopAlpha</span>
        </div>
        <div>
          <h1 className="text-4xl font-bold leading-tight mb-4">
            Shop smarter.
            <br />
            Live better.
          </h1>
          <p className="text-slate-300 text-lg max-w-md">
            Your one-stop ecommerce store. Browse products, manage your cart,
            and checkout seamlessly.
          </p>
        </div>
        <p className="text-sm text-slate-400">
          &copy; 2026 ShopAlpha. All rights reserved.
        </p>
      </div>

      <div className="flex items-center justify-center p-6 sm:p-12 bg-slate-50">
        <div className="w-full max-w-md">
          <div className="flex items-center gap-2 text-lg font-semibold mb-8 lg:hidden">
            <ShoppingBag className="h-6 w-6" />
            <span>ShopAlpha</span>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;
