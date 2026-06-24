import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import api from "../../api/api";
import AdminLayout from "../../components/admin/AdminLayout";
import { Button } from "components/ui/button";
import { Input } from "components/ui/input";
import { Label } from "components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "components/ui/card";

function AdminProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    image1: "",
    image2: "",
    image3: "",
  });
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isEdit) return;

    api
      .get(`/products/${id}`)
      .then((res) => {
        const p = res.data;
        const imgs = p.images || [p.image];
        setForm({
          name: p.name,
          description: p.description,
          price: String(p.price),
          image1: imgs[0] || "",
          image2: imgs[1] || "",
          image3: imgs[2] || "",
        });
      })
      .catch(() => setError("Failed to load product"))
      .finally(() => setLoading(false));
  }, [id, isEdit]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    const images = [form.image1, form.image2, form.image3].filter(Boolean);

    if (images.length === 0) {
      setError("At least one image URL is required");
      setSaving(false);
      return;
    }

    const payload = {
      name: form.name,
      description: form.description,
      price: parseFloat(form.price),
      images,
    };

    try {
      if (isEdit) {
        await api.put(`/products/${id}`, payload);
      } else {
        await api.post("/products", payload);
      }
      navigate("/admin/products");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save product");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout>
      <Button variant="ghost" size="sm" className="mb-6" asChild>
        <Link to="/admin/products">
          <ArrowLeft className="h-4 w-4" />
          Back to products
        </Link>
      </Button>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>{isEdit ? "Edit Product" : "Add Product"}</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-muted-foreground">Loading...</p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Price ($)</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={form.price}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-3 pt-2">
                <p className="text-sm font-medium">Product Images (URLs)</p>
                <div className="space-y-2">
                  <Label htmlFor="image1">Image 1 (primary)</Label>
                  <Input
                    id="image1"
                    name="image1"
                    placeholder="https://..."
                    value={form.image1}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="image2">Image 2 (optional)</Label>
                  <Input
                    id="image2"
                    name="image2"
                    placeholder="https://..."
                    value={form.image2}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="image3">Image 3 (optional)</Label>
                  <Input
                    id="image3"
                    name="image3"
                    placeholder="https://..."
                    value={form.image3}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {error && <p className="text-sm text-destructive">{error}</p>}

              <Button type="submit" className="w-full" disabled={saving}>
                {saving ? "Saving..." : isEdit ? "Update Product" : "Add Product"}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </AdminLayout>
  );
}

export default AdminProductForm;
