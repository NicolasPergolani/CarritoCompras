import React, { useState, useEffect } from 'react';
import { API_URL } from '../config';

const UserView = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/product`, { // Cambiado de /products a /product
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('Products data:', data);
        if (Array.isArray(data)) {
          setProducts(data);
        } else {
          setProducts([]);
          console.error('Products is not an array:', data);
        }
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Error loading products');
        console.error('Error response:', errorData);
      }
    } catch (error) {
      setError('Error connecting to server');
      console.error('Error fetching products:', error);
    }
  };

  const addToCart = (product) => {
    const existingItem = cart.find(item => item._id === product._id);
    if (existingItem) {
      setCart(cart.map(item =>
        item._id === product._id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
    alert('Product added to cart!');
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item._id !== productId));
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
    } else {
      setCart(cart.map(item =>
        item._id === productId
          ? { ...item, quantity: newQuantity }
          : item
      ));
    }
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>User View - Products</h1>
      
      {error && (
        <div style={{ 
          padding: '10px', 
          backgroundColor: '#ffebee', 
          color: '#c62828',
          borderRadius: '4px',
          marginBottom: '20px'
        }}>
          {error}
        </div>
      )}

      <div style={{ display: 'flex', gap: '20px' }}>
        {/* Products Section */}
        <div style={{ flex: 2 }}>
          <h2>Available Products</h2>
          {Array.isArray(products) && products.length > 0 ? (
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', 
              gap: '20px' 
            }}>
              {products.map((product) => (
                <div 
                  key={product._id} 
                  style={{ 
                    border: '1px solid #ddd', 
                    borderRadius: '8px',
                    padding: '15px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                  }}
                >
                  {product.image && (
                    <img 
                      src={product.image} 
                      alt={product.description}
                      style={{ 
                        width: '100%', 
                        height: '200px', 
                        objectFit: 'cover',
                        borderRadius: '4px',
                        marginBottom: '10px'
                      }}
                    />
                  )}
                  <h3 style={{ marginTop: '10px', marginBottom: '10px' }}>
                    {product.description}
                  </h3>
                  <p style={{ 
                    fontSize: '1.2em', 
                    fontWeight: 'bold', 
                    color: '#2e7d32',
                    margin: '10px 0'
                  }}>
                    ${product.price}
                  </p>
                  <p style={{ 
                    color: product.stock > 0 ? '#1976d2' : '#d32f2f',
                    marginBottom: '10px'
                  }}>
                    Stock: {product.stock}
                  </p>
                  <button
                    onClick={() => addToCart(product)}
                    disabled={product.stock === 0}
                    style={{
                      width: '100%',
                      padding: '10px',
                      backgroundColor: product.stock > 0 ? '#4caf50' : '#9e9e9e',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: product.stock > 0 ? 'pointer' : 'not-allowed'
                    }}
                  >
                    {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p>No products available</p>
          )}
        </div>

        {/* Cart Section */}
        <div style={{ 
          flex: 1, 
          border: '1px solid #ddd', 
          borderRadius: '8px',
          padding: '20px',
          height: 'fit-content',
          position: 'sticky',
          top: '20px'
        }}>
          <h2>Shopping Cart</h2>
          {cart.length > 0 ? (
            <>
              {cart.map((item) => (
                <div 
                  key={item._id}
                  style={{ 
                    borderBottom: '1px solid #eee',
                    padding: '10px 0',
                    marginBottom: '10px'
                  }}
                >
                  <p style={{ fontWeight: 'bold', marginBottom: '5px' }}>
                    {item.description}
                  </p>
                  <p style={{ color: '#2e7d32', marginBottom: '5px' }}>
                    ${item.price} each
                  </p>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '10px',
                    marginBottom: '5px'
                  }}>
                    <button
                      onClick={() => updateQuantity(item._id, item.quantity - 1)}
                      style={{ padding: '5px 10px' }}
                    >
                      -
                    </button>
                    <span>Quantity: {item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item._id, item.quantity + 1)}
                      style={{ padding: '5px 10px' }}
                    >
                      +
                    </button>
                  </div>
                  <p style={{ fontWeight: 'bold' }}>
                    Subtotal: ${(item.price * item.quantity).toFixed(2)}
                  </p>
                  <button
                    onClick={() => removeFromCart(item._id)}
                    style={{
                      backgroundColor: '#f44336',
                      color: 'white',
                      border: 'none',
                      padding: '5px 10px',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      marginTop: '5px'
                    }}
                  >
                    Remove
                  </button>
                </div>
              ))}
              <div style={{ 
                marginTop: '20px', 
                paddingTop: '20px', 
                borderTop: '2px solid #333' 
              }}>
                <h3>Total: ${getTotalPrice()}</h3>
                <button
                  style={{
                    width: '100%',
                    padding: '15px',
                    backgroundColor: '#2196f3',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '1.1em',
                    fontWeight: 'bold',
                    marginTop: '10px'
                  }}
                >
                  Checkout
                </button>
              </div>
            </>
          ) : (
            <p style={{ textAlign: 'center', color: '#999' }}>
              Your cart is empty
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserView;