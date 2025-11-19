import React, { useState, useEffect } from 'react';
import { API_URL } from '../config';

const UserView = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [error, setError] = useState('');
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [showOrderSuccess, setShowOrderSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState('products');
  const [userOrders, setUserOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (activeTab === 'orders') {
      fetchUserOrders();
    }
  }, [activeTab]);

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

  const fetchUserOrders = async () => {
    setLoadingOrders(true);
    setError(''); // Clear any previous errors
    try {
      const token = localStorage.getItem('token');
      console.log('🔍 Fetching user orders with token:', token ? 'Token exists' : 'No token');
      
      const response = await fetch(`${API_URL}/order/my-orders`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log('📡 Orders API response status:', response.status);
      console.log('📡 Orders API response headers:', Object.fromEntries(response.headers.entries()));
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ User orders data received:', data);
        console.log('📊 Orders count:', Array.isArray(data) ? data.length : 'Not an array');
        
        if (Array.isArray(data)) {
          setUserOrders(data);
          console.log('🔄 Orders state updated with', data.length, 'orders');
        } else {
          setUserOrders([]);
          console.error('❌ Orders is not an array:', data);
          setError('Invalid data format received from server');
        }
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        console.error('❌ Error response:', response.status, errorData);
        setError(errorData.error || `Error loading orders (${response.status})`);
        setUserOrders([]);
      }
    } catch (error) {
      console.error('💥 Exception fetching user orders:', error);
      setError('Error connecting to server: ' + error.message);
      setUserOrders([]);
    } finally {
      setLoadingOrders(false);
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

  const handleCheckout = async () => {
    if (cart.length === 0) {
      alert('Your cart is empty');
      return;
    }

    setIsCheckingOut(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      
      // Prepare the order data
      const orderData = {
        products: cart.map(item => ({
          product: item._id,
          quantity: item.quantity
        }))
      };

      const response = await fetch(`${API_URL}/order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(orderData)
      });

      if (response.ok) {
        const order = await response.json();
        setCurrentOrder(order);
        setShowOrderSuccess(true);
        setCart([]); // Clear cart after successful order
        // Refresh orders if user is on orders tab
        if (activeTab === 'orders') {
          fetchUserOrders();
        }
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Error creating order');
      }
    } catch (error) {
      setError('Error connecting to server');
      console.error('Error creating order:', error);
    } finally {
      setIsCheckingOut(false);
    }
  };

  // Order Success Modal Component
  const OrderSuccessModal = () => (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '8px',
        maxWidth: '600px',
        width: '90%',
        maxHeight: '80%',
        overflow: 'auto'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <h2 style={{ color: '#4caf50', marginBottom: '10px' }}>✅ Order Created Successfully!</h2>
          <p style={{ color: '#000' }}>Your order has been placed and is being processed.</p>
        </div>

        {currentOrder && (
          <div>
            <h3 style={{ color: '#000' }}>Order Details:</h3>
            <div style={{ backgroundColor: '#f5f5f5', padding: '15px', borderRadius: '4px', marginBottom: '15px' }}>
              <p style={{ color: '#000' }}><strong>Order ID:</strong> {currentOrder._id}</p>
              <p style={{ color: '#000' }}><strong>Status:</strong> <span style={{ color: '#ff9800', fontWeight: 'bold' }}>{currentOrder.status}</span></p>
              <p style={{ color: '#000' }}><strong>Total:</strong> <span style={{ color: '#4caf50', fontWeight: 'bold' }}>${currentOrder.totalPrice}</span></p>
              <p style={{ color: '#000' }}><strong>Date:</strong> {new Date(currentOrder.createdAt).toLocaleString()}</p>
            </div>

            <h4 style={{ color: '#000' }}>Products:</h4>
            {currentOrder.products && currentOrder.products.map((item, index) => (
              <div key={index} style={{ 
                border: '1px solid #ddd', 
                padding: '10px', 
                borderRadius: '4px',
                marginBottom: '10px'
              }}>
                <p style={{ color: '#000' }}><strong>{item.product?.name || item.product?.description || 'Product'}</strong></p>
                <p style={{ color: '#000' }}>Quantity: {item.quantity}</p>
                <p style={{ color: '#000' }}>Price: ${item.price}</p>
                <p style={{ color: '#000' }}><strong>Subtotal: ${(item.price * item.quantity).toFixed(2)}</strong></p>
              </div>
            ))}

            {currentOrder.user && (
              <div style={{ marginTop: '15px', backgroundColor: '#e3f2fd', padding: '10px', borderRadius: '4px' }}>
                <h4 style={{ color: '#000' }}>Customer Information:</h4>
                <p style={{ color: '#000' }}><strong>Name:</strong> {currentOrder.user.name} {currentOrder.user.lastName}</p>
                <p style={{ color: '#000' }}><strong>Email:</strong> {currentOrder.user.email}</p>
              </div>
            )}
          </div>
        )}

        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <button
            onClick={() => {
              setShowOrderSuccess(false);
              setCurrentOrder(null);
            }}
            style={{
              backgroundColor: '#2196f3',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '1em'
            }}
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ padding: '20px', maxWidth: '1400px', margin: '0 auto' }}>
      <h1>User Dashboard</h1>
      
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

      {showOrderSuccess && <OrderSuccessModal />}

      {/* Tabs Navigation */}
      <div style={{ 
        marginBottom: '30px', 
        borderBottom: '2px solid #ddd',
        display: 'flex',
        gap: '0'
      }}>
        <button 
          onClick={() => setActiveTab('products')}
          style={{
            backgroundColor: activeTab === 'products' ? '#007bff' : 'transparent',
            color: activeTab === 'products' ? 'white' : '#007bff',
            border: 'none',
            padding: '15px 30px',
            cursor: 'pointer',
            borderBottom: activeTab === 'products' ? 'none' : '2px solid transparent',
            fontSize: '16px',
            fontWeight: 'bold'
          }}
        >
          Products & Shopping
        </button>
        <button 
          onClick={() => setActiveTab('orders')}
          style={{
            backgroundColor: activeTab === 'orders' ? '#007bff' : 'transparent',
            color: activeTab === 'orders' ? 'white' : '#007bff',
            border: 'none',
            padding: '15px 30px',
            cursor: 'pointer',
            borderBottom: activeTab === 'orders' ? 'none' : '2px solid transparent',
            fontSize: '16px',
            fontWeight: 'bold'
          }}
        >
          My Orders
        </button>
      </div>

      {/* Products Tab */}
      {activeTab === 'products' && (
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
                  onClick={handleCheckout}
                  disabled={isCheckingOut}
                  style={{
                    width: '100%',
                    padding: '15px',
                    backgroundColor: isCheckingOut ? '#ccc' : '#2196f3',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: isCheckingOut ? 'not-allowed' : 'pointer',
                    fontSize: '1.1em',
                    fontWeight: 'bold',
                    marginTop: '10px'
                  }}
                >
                  {isCheckingOut ? 'Processing...' : 'Checkout'}
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
      )}

      {/* Orders Tab */}
      {activeTab === 'orders' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ color: '#000' }}>My Orders</h2>
            <button 
              onClick={fetchUserOrders}
              disabled={loadingOrders}
              style={{
                backgroundColor: '#17a2b8',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '5px',
                cursor: loadingOrders ? 'not-allowed' : 'pointer'
              }}
            >
              {loadingOrders ? 'Loading...' : 'Refresh Orders'}
            </button>
          </div>
          
          <p style={{ color: '#000', marginBottom: '15px' }}>
            Total orders: {userOrders.length}
          </p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {loadingOrders ? (
              <div style={{ textAlign: 'center', padding: '40px' }}>
                <p style={{ fontSize: '18px', color: '#007bff' }}>
                  🔄 Loading your orders...
                </p>
              </div>
            ) : Array.isArray(userOrders) && userOrders.length > 0 ? (
              userOrders.map((order) => (
                <div 
                  key={order._id} 
                  style={{ 
                    border: '1px solid #ddd', 
                    padding: '20px', 
                    borderRadius: '10px',
                    backgroundColor: 'white',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                    <div>
                      <h3 style={{ margin: '0 0 10px 0', color: '#000' }}>Order #{order._id.slice(-6)}</h3>
                      <p style={{ margin: '0', color: '#000' }}>
                        Date: {new Date(order.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ margin: '0 0 10px 0', fontSize: '24px', fontWeight: 'bold', color: '#28a745' }}>
                        ${order.totalPrice}
                      </p>
                      <span style={{
                        padding: '5px 15px',
                        borderRadius: '20px',
                        fontSize: '14px',
                        fontWeight: 'bold',
                        color: '#000',
                        backgroundColor: order.status === 'pending' ? '#fff3cd' : 
                                       order.status === 'confirmed' ? '#d4edda' :
                                       order.status === 'shipped' ? '#cce5ff' :
                                       order.status === 'delivered' ? '#d1ecf1' : '#f8d7da'
                      }}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </div>
                  </div>
                  
                  <h4 style={{ marginBottom: '10px', color: '#000' }}>Products:</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '10px' }}>
                    {order.products && order.products.map((item, index) => (
                      <div 
                        key={index}
                        style={{ 
                          border: '1px solid #eee', 
                          padding: '10px', 
                          borderRadius: '5px',
                          backgroundColor: '#f9f9f9'
                        }}
                      >
                        <p style={{ margin: '0 0 5px 0', fontWeight: 'bold', color: '#000' }}>
                          {item.product?.name || item.product?.description || 'Product'}
                        </p>
                        <p style={{ margin: '0', color: '#000' }}>
                          Quantity: {item.quantity} × ${item.price} = ${(item.quantity * item.price).toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div style={{ textAlign: 'center', padding: '40px' }}>
                <p style={{ fontSize: '18px', color: '#000', marginBottom: '10px' }}>
                  No orders found
                </p>
                <p style={{ color: '#666' }}>
                  Start shopping to see your orders here!
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserView;