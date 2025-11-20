import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../config';

const AdminView = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [activeTab, setActiveTab] = useState('products');
   const [showStockModal, setShowStockModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [newStock, setNewStock] = useState('');
  const [formData, setFormData] = useState({
    description: '',
    image: '',
    price: '',
    stock: ''
  });

  useEffect(() => {
    fetchProducts();
    fetchOrders();
  }, []);

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/product`, { // Cambiado de /products a /product
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (response.ok && Array.isArray(data)) {
        setProducts(data);
      } else {
        console.error('Error fetching products:', data);
        setProducts([]);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
    }
  };

  const handleLogout = () => {
    // Clear JWT token from localStorage
    localStorage.removeItem('token');
    // Clear any other user data
    localStorage.clear();
    // Navigate to login page
    navigate('/');
  };

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('Fetching orders with token:', token ? 'Token exists' : 'No token');
      
      const response = await fetch(`${API_URL}/order`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log('Orders response status:', response.status);
      const data = await response.json();
      console.log('Orders data received:', data);
      
      if (response.ok && Array.isArray(data)) {
        setOrders(data);
        console.log('Orders set successfully, count:', data.length);
      } else {
        console.error('Error fetching orders - not ok or not array:', { 
          ok: response.ok, 
          isArray: Array.isArray(data), 
          data 
        });
        setOrders([]);
      }
    } catch (error) {
      console.error('Error fetching orders - exception:', error);
      setOrders([]);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/order/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        const updatedOrder = await response.json();
        setOrders(orders.map(order => 
          order._id === orderId ? updatedOrder : order
        ));
        alert('Estado de la orden actualizado exitosamente!');
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.error || 'No se pudo actualizar el estado'}`);
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Error al actualizar el estado de la orden');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/product`, { // Cambiado de /products a /product
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const newProduct = await response.json();
        setProducts(prevProducts => {
          const currentProducts = Array.isArray(prevProducts) ? prevProducts : [];
          return [newProduct, ...currentProducts];
        });
        setFormData({
          description: '',
          image: '',
          price: '',
          stock: ''
        });
        setShowForm(false);
        alert('Producto añadido exitosamente!');
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.error || 'No se pudo añadir el producto'}`);
      }
    } catch (error) {
      console.error('Error adding product:', error);
      alert('Error al añadir el producto');
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/product/${id}`, { // Cambiado de /products a /product
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setProducts(products.filter(product => product._id !== id));
        alert('Producto eliminado exitosamente!');
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.error || 'No se pudo eliminar el producto'}`);
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Error al eliminar el producto');
    }
  };

  const openStockModal = (product) => {
    setSelectedProduct(product);
    setNewStock(product.stock.toString());
    setShowStockModal(true);
  };

  const closeStockModal = () => {
    setShowStockModal(false);
    setSelectedProduct(null);
    setNewStock('');
  };

  const handleStockUpdate = async () => {
    if (!selectedProduct || newStock === '') return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/product/${selectedProduct._id}/stock`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ stock: parseInt(newStock) })
      });

      if (response.ok) {
        const updatedProduct = await response.json();
        setProducts(products.map(product => 
          product._id === selectedProduct._id ? updatedProduct : product
        ));
        alert('Stock actualizado exitosamente!');
        closeStockModal();
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.error || 'No se pudo actualizar el stock'}`);
      }
    } catch (error) {
      console.error('Error updating stock:', error);
      alert('Error al actualizar el stock');
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1400px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>Panel de Administración</h1>
        <button
          onClick={handleLogout}
          style={{
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 'bold'
          }}
        >
          🚪 Logout
        </button>
      </div>
      
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
          Gestión de Productos
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
          Historial de Órdenes
        </button>
      </div>

      {/* Products Tab */}
      {activeTab === 'products' && (
        <div>
          <div style={{ marginBottom: '20px' }}>
            <button 
              onClick={() => setShowForm(!showForm)}
              style={{
                backgroundColor: '#28a745',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >
              {showForm ? 'Cancelar' : 'Añadir Producto'}
            </button>
          </div>

          {showForm && (
            <div style={{ 
              backgroundColor: '#f8f9fa', 
              padding: '20px', 
              borderRadius: '5px', 
              marginBottom: '20px' 
            }}>
              <h3 style={{ color: '#000' }}>Añadir Nuevo Producto</h3>
              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '10px' }}>
                  <textarea
                    name="description"
                    placeholder="Descripción del producto"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    rows="3"
                    style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
                  />
                </div>
                <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                  <input
                    type="number"
                    name="price"
                    placeholder="Precio"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                    min="0"
                    step="0.01"
                    style={{ flex: 1, padding: '8px' }}
                  />
                  <input
                    type="number"
                    name="stock"
                    placeholder="Stock"
                    value={formData.stock}
                    onChange={handleInputChange}
                    required
                    min="0"
                    style={{ flex: 1, padding: '8px' }}
                  />
                </div>
                <div style={{ marginBottom: '10px' }}>
                  <input
                    type="url"
                    name="image"
                    placeholder="URL de la imagen"
                    value={formData.image}
                    onChange={handleInputChange}
                    required
                    style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
                  />
                </div>
                <button 
                  type="submit"
                  style={{
                    backgroundColor: '#28a745',
                    color: 'white',
                    border: 'none',
                    padding: '10px 20px',
                    borderRadius: '5px',
                    cursor: 'pointer'
                  }}
                >
                  Guardar Producto
                </button>
              </form>
            </div>
          )}

          <h2>Lista de Productos</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
            {Array.isArray(products) && products.length > 0 ? (
              products.map((product) => (
                <div 
                  key={product._id} 
                  style={{ 
                    border: '1px solid #ddd', 
                    padding: '20px', 
                    borderRadius: '10px',
                    backgroundColor: 'white',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '15px'
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
                        borderRadius: '8px' 
                      }}
                    />
                  )}
                  <div style={{ flex: 1 }}>
                    <h3 style={{ margin: '0 0 10px 0', fontSize: '18px' }}>Descripción</h3>
                    <p style={{ margin: '0 0 15px 0', color: '#000' }}>{product.description}</p>
                    
                    <div style={{ display: 'flex', gap: '20px', marginBottom: '15px' }}>
                      <div>
                        <strong style={{ display: 'block', fontSize: '14px', color: '#000' }}>Precio</strong>
                        <span style={{ fontSize: '20px', color: '#28a745', fontWeight: 'bold' }}>${product.price}</span>
                      </div>
                      <div>
                        <strong style={{ display: 'block', fontSize: '14px', color: '#000' }}>Stock</strong>
                        <span style={{ 
                          fontSize: '20px', 
                          fontWeight: 'bold',
                          color: product.stock === 0 ? '#dc3545' : product.stock < 10 ? '#ffc107' : '#28a745'
                        }}>
                          {product.stock}
                        </span>
                      </div>
                    </div>
                    
                    <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                      <button 
                        onClick={() => openStockModal(product)}
                        style={{
                          backgroundColor: '#007bff',
                          color: 'white',
                          border: 'none',
                          padding: '10px 15px',
                          borderRadius: '5px',
                          cursor: 'pointer',
                          flex: 1,
                          fontSize: '14px',
                          fontWeight: 'bold'
                        }}
                      >
                        Actualizar Stock
                      </button>
                      <button 
                        onClick={() => handleDelete(product._id)}
                        style={{
                          backgroundColor: '#dc3545',
                          color: 'white',
                          border: 'none',
                          padding: '10px 15px',
                          borderRadius: '5px',
                          cursor: 'pointer',
                          flex: 1,
                          fontSize: '14px',
                          fontWeight: 'bold'
                        }}
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p>No hay productos disponibles.</p>
            )}
          </div>
        </div>
      )}

      {/* Orders Tab */}
      {activeTab === 'orders' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2>Historial de Órdenes</h2>
            <button 
              onClick={fetchOrders}
              style={{
                backgroundColor: '#17a2b8',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >
              Refrescar Órdenes
            </button>
          </div>
          <p style={{ color: '#000', marginBottom: '15px' }}>
            Total de órdenes: {orders.length}
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {Array.isArray(orders) && orders.length > 0 ? (
              orders.map((order) => (
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
                      <h3 style={{ margin: '0 0 10px 0', color: '#000' }}>Orden #{order._id.slice(-6)}</h3>
                      <p style={{ margin: '0', color: '#000' }}>
                        Fecha: {new Date(order.createdAt).toLocaleString()}
                      </p>
                      {order.user && (
                        <p style={{ margin: '5px 0 0 0', color: '#000' }}>
                          Cliente: {order.user.name} {order.user.lastName} ({order.user.email})
                        </p>
                      )}
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ margin: '0 0 10px 0', fontSize: '24px', fontWeight: 'bold', color: '#28a745' }}>
                        ${order.totalPrice}
                      </p>
                      <select
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                        style={{
                          padding: '5px 10px',
                          borderRadius: '4px',
                          border: '1px solid #ddd',
                          color: '#000',
                          backgroundColor: order.status === 'pending' ? '#fff3cd' : 
                                         order.status === 'confirmed' ? '#d4edda' :
                                         order.status === 'shipped' ? '#cce5ff' :
                                         order.status === 'delivered' ? '#d1ecf1' : '#f8d7da'
                        }}
                      >
                        <option value="pending">Pendiente</option>
                        <option value="confirmed">Confirmada</option>
                        <option value="shipped">Enviada</option>
                        <option value="delivered">Entregada</option>
                        <option value="cancelled">Cancelada</option>
                      </select>
                    </div>
                  </div>
                  
                  <h4 style={{ marginBottom: '10px', color: '#000' }}>Productos:</h4>
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
                          {item.product?.name || item.product?.description || 'Producto'}
                        </p>
                        <p style={{ margin: '0', color: '#000' }}>
                          Cantidad: {item.quantity} × ${item.price} = ${(item.quantity * item.price).toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <p style={{ textAlign: 'center', color: '#000', fontSize: '18px' }}>
                No hay órdenes disponibles.
              </p>
            )}
          </div>
        </div>
      )}

      {/* Stock Update Modal */}
      {showStockModal && selectedProduct && (
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
            width: '400px',
            maxWidth: '90%'
          }}>
            <h3 style={{ marginTop: 0, marginBottom: '20px' }}>
              Actualizar Stock: {selectedProduct.description}
            </h3>
            
            <div style={{ marginBottom: '20px' }}>
              <p style={{ margin: '0 0 10px 0', color: '#000' }}>
                Stock actual: <strong>{selectedProduct.stock}</strong>
              </p>
              
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Nuevo stock:
              </label>
              <input
                type="number"
                value={newStock}
                onChange={(e) => setNewStock(e.target.value)}
                min="0"
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '16px'
                }}
                placeholder="Ingrese el nuevo stock"
              />
            </div>
            
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button
                onClick={closeStockModal}
                style={{
                  backgroundColor: '#6c757d',
                  color: 'white',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Cancelar
              </button>
              <button
                onClick={handleStockUpdate}
                disabled={newStock === '' || parseInt(newStock) < 0}
                style={{
                  backgroundColor: newStock !== '' && parseInt(newStock) >= 0 ? '#28a745' : '#ccc',
                  color: 'white',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '4px',
                  cursor: newStock !== '' && parseInt(newStock) >= 0 ? 'pointer' : 'not-allowed'
                }}
              >
                Actualizar Stock
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminView;