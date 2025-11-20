# Carrito de Compras
Un proyecto de ejemplo que implementa las funcionalidades básicas de un carrito de compras: 
listado de productos, añadir/quitar productos del carrito, cálculo de totales y proceso de pago (simulado). 



# Tabla de contenidos
- Características funcionalidad basica de creacion de productos gestion de ordenes y de usuarios para simular el carrito.
- Tecnologias desarrollo JWT para verificacion mediante middleware para el login. Realizado en MERN con un front basico realizado con IA para verificar funcionalidades y facilitar la visualizacion se realizo una conexion de DB a Atlas de mongo
- Instalacion, realizar npm install en ambas carpetas de front y de back el .env es publico por el momento para la conexion a la base de datos (sera eliminado luego del traslado para la presentacio) y correr localmente simplemente con npm start y npm run dev.
- Estructura del proyecto Monolito modular con ABM de usuarios productos y ordenes 
- Modelo de datos Json MongoDB Atlas
# Características
- Listado de productos (filtrado y búsqueda)
- Añadir productos al carrito
- Actualizar cantidad de artículos en el carrito
- Eliminar artículos del carrito
- Cálculo de subtotal y total
- Proceso de checkout simulado con persistencia en ordenes visibles para el usuario (las propias) y el admin con cambio de status y visualizacion del total de las ordenes. 

# Tecnologías
- Frontend: React, Vue
- Backend: Node.js + Express
- Base de datos: MongoDB
- Autenticación: JWT 

# Instalar dependencias:
frontend
cd frontend
npm install

# backend
cd "TP Backend"
npm in

# Copilot versio
# 🛒 CarritoCompras - E-commerce Full Stack Application

Una aplicación completa de e-commerce desarrollada con React + Vite (Frontend) y Node.js + Express + MongoDB (Backend).

## 📋 Tabla de Contenidos

- [Descripción General](#descripción-general)
- [Tecnologías Utilizadas](#tecnologías-utilizadas)
- [Arquitectura del Sistema](#arquitectura-del-sistema)
- [Flujo de la Aplicación](#flujo-de-la-aplicación)
- [Funcionalidades](#funcionalidades)
- [Instalación y Configuración](#instalación-y-configuración)
- [API Endpoints](#api-endpoints)
- [Base de Datos](#base-de-datos)

## 🎯 Descripción General

CarritoCompras es una aplicación de e-commerce completa que permite a los usuarios navegar productos, realizar compras y gestionar órdenes, mientras que los administradores pueden gestionar inventario y órdenes del sistema.

## 🛠️ Tecnologías Utilizadas

### Frontend
- **React 18** - Biblioteca de interfaces de usuario
- **Vite** - Herramienta de construcción y desarrollo
- **JavaScript (ES6+)** - Lenguaje de programación
- **CSS Inline Styles** - Estilos de componentes

### Backend
- **Node.js** - Entorno de ejecución de JavaScript
- **Express.js** - Framework web para Node.js
- **MongoDB** - Base de datos NoSQL
- **Mongoose** - ODM para MongoDB
- **JWT** - Autenticación basada en tokens
- **bcrypt** - Hash de contraseñas
- **CORS** - Manejo de políticas de origen cruzado

### Base de Datos
- **MongoDB Atlas** - Base de datos en la nube
- **MongoDB Compass** - Cliente GUI para MongoDB

## 🏗️ Arquitectura del Sistema

```
📁 CarritoCompras/
├── 📁 Frontend/frontend/          # Aplicación React
│   ├── 📁 src/
│   │   ├── 📁 components/         # Componentes React
│   │   │   ├── Auth.jsx          # Autenticación (Login/Register)
│   │   │   ├── UserView.jsx      # Vista del usuario
│   │   │   └── AdminView.jsx     # Panel de administración
│   │   ├── config.js             # Configuración de API
│   │   └── main.jsx              # Punto de entrada
│   └── package.json
│
└── 📁 TP Backend/                 # API REST Node.js
    ├── 📁 app/
    │   ├── 📁 controllers/        # Lógica de negocio
    │   │   ├── users.js          # Gestión de usuarios
    │   │   ├── product.js        # Gestión de productos
    │   │   └── order.js          # Gestión de órdenes
    │   ├── 📁 models/             # Modelos de datos
    │   │   ├── users.js          # Schema de usuarios
    │   │   ├── product.js        # Schema de productos
    │   │   └── order.js          # Schema de órdenes
    │   ├── 📁 routes/             # Definición de rutas
    │   ├── 📁 middleware/         # Middlewares de autenticación
    │   └── 📁 utils/              # Utilidades (JWT, password)
    ├── 📁 config/                 # Configuraciones
    │   └── mongo.js              # Conexión a MongoDB
    ├── app.js                    # Configuración principal del servidor
    └── package.json
```

## 🔄 Flujo de la Aplicación

### 1. 🔐 **Proceso de Autenticación**
```mermaid
graph TD
    A[Usuario accede] --> B{¿Está autenticado?}
    B -->|No| C[Mostrar Login/Register]
    B -->|Sí| D{¿Es admin?}
    C --> E[Validar credenciales]
    E -->|Éxito| F[Generar JWT Token]
    E -->|Error| C
    F --> D
    D -->|Sí| G[AdminView]
    D -->|No| H[UserView]
```

### 2. 🛍️ **Flujo de Compra (Usuario)**
```mermaid
graph TD
    A[UserView - Pestaña Products] --> B[Ver productos disponibles]
    B --> C[Agregar al carrito]
    C --> D[Modificar cantidades]
    D --> E[Revisar carrito]
    E --> F[Checkout]
    F --> G[Crear orden]
    G --> H[Reducir stock automáticamente]
    H --> I[Mostrar confirmación]
    I --> J[UserView - Pestaña My Orders]
    J --> K[Ver historial de órdenes]
```

### 3. ⚙️ **Flujo de Administración**
```mermaid
graph TD
    A[AdminView] --> B{Seleccionar pestaña}
    B -->|Productos| C[Gestión de Productos]
    B -->|Órdenes| D[Gestión de Órdenes]
    
    C --> E[Ver/Crear/Eliminar productos]
    C --> F[Actualizar stock]
    
    D --> G[Ver todas las órdenes]
    D --> H[Cambiar estado de órdenes]
    H --> I{¿Estado = Cancelada?}
    I -->|Sí| J[Restaurar stock automáticamente]
    I -->|No| K[Solo cambiar estado]
```

### 4. 📊 **Gestión de Stock**
```mermaid
graph TD
    A[Producto con stock] --> B[Usuario realiza pedido]
    B --> C[Validar stock disponible]
    C -->|Insuficiente| D[Error: Stock insuficiente]
    C -->|Suficiente| E[Crear orden]
    E --> F[Reducir stock automáticamente]
    F --> G[Orden confirmada]
    
    H[Admin cancela orden] --> I[Restaurar stock automáticamente]
    J[Admin actualiza stock] --> K[Modificar stock directamente]
```

## ✨ Funcionalidades

### 👥 **Gestión de Usuarios**
- ✅ Registro de nuevos usuarios
- ✅ Login con email y contraseña
- ✅ Autenticación JWT
- ✅ Roles diferenciados (user/admin)
- ✅ Hash seguro de contraseñas con bcrypt

### 🛍️ **Funcionalidades de Usuario**
- ✅ **Vista de productos**
  - Navegación de catálogo
  - Visualización de stock en tiempo real
  - Imágenes, precios y descripciones
- ✅ **Carrito de compras**
  - Agregar/quitar productos
  - Modificar cantidades
  - Cálculo automático de totales
- ✅ **Proceso de checkout**
  - Validación de stock antes de la compra
  - Creación automática de órdenes
  - Reducción automática de inventario
- ✅ **Historial de órdenes**
  - Ver todas las órdenes realizadas
  - Detalles completos (productos, precios, fechas)
  - Estados de órdenes en tiempo real

### 🔧 **Panel de Administración**
- ✅ **Gestión de productos**
  - Crear/editar/eliminar productos
  - Actualización de stock con modal
  - Indicadores visuales de inventario (rojo/amarillo/verde)
- ✅ **Gestión de órdenes**
  - Ver todas las órdenes del sistema
  - Cambiar estados (pending → confirmed → shipped → delivered)
  - Cancelar órdenes con restauración automática de stock
  - Información completa de clientes y productos

### 🔄 **Gestión Inteligente de Inventario**
- ✅ **Validación en tiempo real**
  - Verificación de stock antes de cada compra
  - Prevención de overselling
- ✅ **Actualización automática**
  - Reducción de stock al crear órdenes
  - Restauración de stock al cancelar órdenes
- ✅ **Control manual**
  - Actualización directa de stock por administradores
  - Validación de cantidades negativas

## 🚀 Instalación y Configuración

### Prerrequisitos
- Node.js (v16 o superior)
- MongoDB Atlas account
- Git

### 1. Clonar el repositorio
```bash
git clone https://github.com/NicolasPergolani/CarritoCompras.git
cd CarritoCompras
```

### 2. Configurar Backend
```bash
cd "TP Backend"
npm install

# Crear archivo .env
echo "MONGO_URI=mongodb+srv://usuario:contraseña@cluster0.xxxxx.mongodb.net/mydatabase?retryWrites=true&w=majority" > .env
echo "PORT=3000" >> .env

# Iniciar servidor
npm start
```

### 3. Configurar Frontend
```bash
cd "../Frontend/frontend"
npm install

# Iniciar aplicación
npm run dev
```

### 4. Acceder a la aplicación
- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:3000

## 📡 API Endpoints

### 🔐 Autenticación
```http
POST /register          # Registrar usuario
POST /login             # Iniciar sesión
```

### 👤 Usuarios
```http
GET /users              # Obtener usuarios (admin)
GET /users/:id          # Obtener usuario por ID
PUT /users/:id          # Actualizar usuario
DELETE /users/:id       # Eliminar usuario (admin)
```

### 🛍️ Productos
```http
GET /product            # Obtener todos los productos
GET /product/:id        # Obtener producto por ID
POST /product           # Crear producto (admin)
PUT /product/:id        # Actualizar producto (admin)
PATCH /product/:id/stock # Actualizar solo stock (admin)
DELETE /product/:id     # Eliminar producto (admin)
```

### 📦 Órdenes
```http
GET /order              # Obtener todas las órdenes (admin)
GET /order/my-orders    # Obtener órdenes del usuario
GET /order/:id          # Obtener orden específica
POST /order             # Crear nueva orden
PATCH /order/:id/status # Actualizar estado (admin)
PATCH /order/:id/add-product    # Agregar producto a orden
PATCH /order/:id/remove-product # Quitar producto de orden
```

## 🗄️ Base de Datos

### Colecciones MongoDB

#### Users
```javascript
{
  _id: ObjectId,
  name: String,
  lastName: String,
  email: String (único),
  password: String (hasheado),
  rol: String (enum: ['user', 'admin']),
  createdAt: Date,
  updatedAt: Date
}
```

#### Products
```javascript
{
  _id: ObjectId,
  description: String,
  image: String (URL),
  price: Number,
  stock: Number,
  createdAt: Date,
  updatedAt: Date
}
```

#### Orders
```javascript
{
  _id: ObjectId,
  user: ObjectId (ref: 'Users'),
  products: [{
    product: ObjectId (ref: 'Product'),
    quantity: Number,
    price: Number
  }],
  totalPrice: Number (calculado automáticamente),
  status: String (enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled']),
  createdAt: Date,
  updatedAt: Date
}
```

## 🔒 Seguridad

### Autenticación y Autorización
- **JWT Tokens**: Autenticación stateless
- **bcrypt**: Hash seguro de contraseñas (salt rounds: 10)
- **Middleware de autenticación**: Protección de rutas
- **Roles**: Separación de permisos user/admin

### Validaciones
- **Validación de stock**: Prevención de overselling
- **Validación de permisos**: Los usuarios solo pueden ver/modificar sus órdenes
- **Sanitización de datos**: Validación en modelos Mongoose

## 🚀 Funcionalidades Avanzadas

### Sistema de Stock Inteligente
- **Reserva temporal**: Durante el proceso de checkout
- **Rollback automático**: En caso de errores o cancelaciones
- **Concurrencia**: Manejo seguro de múltiples compras simultáneas

### Dashboard Administrativo
- **Métricas en tiempo real**: Total de órdenes, productos, etc.
- **Gestión visual**: Indicadores de color para stock
- **Interfaz intuitiva**: Modales y confirmaciones para acciones críticas

### Experiencia de Usuario
- **Feedback visual**: Estados de carga, errores y éxitos
- **Navegación por pestañas**: Organización clara de funcionalidades
- **Responsive design**: Adaptable a diferentes dispositivos

---

## 👨‍💻 Desarrollado por

**Nicolás Pergolani**
- GitHub: [@NicolasPergolani](https://github.com/NicolasPergolani)

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.
