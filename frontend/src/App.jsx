import React, { useEffect, useState } from "react";

const initialForm = {
  name: "",
  category: "",
  price: "",
  description: "",
  status: "Active",
};

function App() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");

  
  const loadProducts = () => {
    fetch("http://localhost:5000/products")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch products");
        return res.json();
      })
      .then((data) => setProducts(data))
      .catch(() => alert("Error loading products"));
  };

  useEffect(() => {
    loadProducts();
  }, []);

  
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.name || !form.category || !form.price) {
      alert("Please fill all mandatory fields");
      return;
    }

    const url = editingId
      ? `http://localhost:5000/products/${editingId}`
      : "http://localhost:5000/products";

    const method = editingId ? "PUT" : "POST";

    fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Save failed");
        return res.json();
      })
      .then(() => {
        setMessage(
          editingId ? "Product updated successfully" : "Product added successfully"
        );
        setForm(initialForm);
        setEditingId(null);
        loadProducts();
      })
      .catch(() => alert("Error saving product"));
  };

  
  const handleEdit = (product) => {
    const { name, category, price, description, status } = product;
    setForm({ name, category, price, description, status });
    setEditingId(product.id);
  };

 
  const handleDelete = (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    fetch(`http://localhost:5000/products/${id}`, {
      method: "DELETE",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Delete failed");
        setMessage("Product deleted successfully");
        loadProducts();
      })
      .catch(() => alert("Error deleting product"));
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto bg-white p-6 rounded shadow">
        <h1 className="text-3xl font-bold mb-6 text-center">
          Product Management Dashboard
        </h1>

        {message && (
          <div className="mb-4 p-2 bg-green-100 text-green-700 rounded text-center">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4 mb-8">
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Product Name *"
            className="border p-2 rounded-2xl"
          />

          <input
            name="category"
            value={form.category}
            onChange={handleChange}
            placeholder="Category *"
            className="border p-2 rounded-2xl"
          />

          <input
            type="number"
            name="price"
            value={form.price}
            onChange={handleChange}
            placeholder="Price *"
            className="border p-2 rounded-2xl"
          />

          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="border p-2 rounded-2xl"
          >
            <option>Active</option>
            <option>Inactive</option>
          </select>

          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Description"
            className="border p-2 rounded-2xl col-span-2"
          />

          <button
            type="submit"
            className="col-span-2 bg-blue-600 text-white p-2 rounded-2xl hover:bg-blue-700"
          >
            {editingId ? "Update Product" : "Add Product"}
          </button>
        </form>

        
        <table className="w-full border">
          <thead className="bg-gray-200">
            <tr>
              <th className="border p-2">Name</th>
              <th className="border p-2">Category</th>
              <th className="border p-2">Price</th>
              <th className="border p-2">Status</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center p-4">
                  No products available
                </td>
              </tr>
            ) : (
              products.map((p) => (
                <tr key={p.id} className="text-center">
                  <td className="border p-2">{p.name}</td>
                  <td className="border p-2">{p.category}</td>
                  <td className="border p-2">{p.price}</td>
                  <td className="border p-2">{p.status}</td>
                  <td className="border p-2 space-x-2">
                    <button
                      onClick={() => handleEdit(p)}
                      className="bg-yellow-400 px-3 py-1 rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default App;
