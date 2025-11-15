import React, { useEffect, useState } from 'react';

const UserView = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    // Fetch products from the backend
    const fetchProducts = async () => {
      const response = await fetch('http://localhost:5000/products');
      const data = await response.json();
      setProducts(data);
    };

    fetchProducts();
  }, []);

  const addToCart = (product) => {
    setCart((prevCart) => [...prevCart, product]);
  };

  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item._id !== productId));
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price, 0);
  };

  return (
    <div>
      <header>
        <h1>Product Store</h1>
        <h2>Total: ${calculateTotal()}</h2>
      </header>
      <div className="product-list">
        {products.map((product) => (
          <div key={product._id} className="product-card">
            <h3>{product.description}</h3>
            <img src={product.image} alt={product.description} />
            <p>Price: ${product.price}</p>
            <p>Stock: {product.stock}</p>
            <button onClick={() => addToCart(product)}>Add to Cart</button>
          </div>
        ))}
      </div>
      <div className="cart">
        <h2>Cart</h2>
        {cart.map((item) => (
          <div key={item._id} className="cart-item">
            <h3>{item.description}</h3>
            <p>Price: ${item.price}</p>
            <button onClick={() => removeFromCart(item._id)}>Remove</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserView;