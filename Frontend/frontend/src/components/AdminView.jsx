import React, { useEffect, useState } from 'react';
import { API_URL } from '../config';

const AdminView = () => {
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    description: '',
    image: '',
    price: '',
    stock: ''
  });

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

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>Panel de Administración</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={() => setShowForm(!showForm)}
          style={{
            backgroundColor: '#007bff',
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
          <h3>Añadir Nuevo Producto</h3>
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
                <p style={{ margin: '0 0 15px 0', color: '#666' }}>{product.description}</p>
                
                <div style={{ display: 'flex', gap: '20px', marginBottom: '15px' }}>
                  <div>
                    <strong style={{ display: 'block', fontSize: '14px', color: '#666' }}>Precio</strong>
                    <span style={{ fontSize: '20px', color: '#28a745', fontWeight: 'bold' }}>${product.price}</span>
                  </div>
                  <div>
                    <strong style={{ display: 'block', fontSize: '14px', color: '#666' }}>Stock</strong>
                    <span style={{ fontSize: '20px', fontWeight: 'bold' }}>{product.stock}</span>
                  </div>
                </div>
                
                <button 
                  onClick={() => handleDelete(product._id)}
                  style={{
                    backgroundColor: '#dc3545',
                    color: 'white',
                    border: 'none',
                    padding: '10px 20px',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    width: '100%',
                    fontSize: '14px',
                    fontWeight: 'bold'
                  }}
                >
                  Eliminar Producto
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>No hay productos disponibles.</p>
        )}
      </div>
    </div>
  );
};

export default AdminView;