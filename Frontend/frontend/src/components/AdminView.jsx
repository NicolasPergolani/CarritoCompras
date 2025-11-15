import React, { useEffect, useState } from 'react';

const AdminView = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Fetch products from the backend
    const fetchProducts = async () => {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/products', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setProducts(data);
    };

    fetchProducts();
  }, []);

  return (
    <div>
      <h1>Admin View</h1>
      <h2>Manage Products</h2>
      <ul>
        {products.map((product) => (
          <li key={product._id}>
            {product.description} - ${product.price} - Stock: {product.stock}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminView;