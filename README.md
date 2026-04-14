# Automatización Boyeros - Frontend

Panel de control interactivo para la gestión y monitoreo de boyeros (sistemas de riego automático). Interfaz responsive desarrollada con React y Vite que se sincroniza en tiempo real con el backend mediante WebSocket.

## 🚀 Características

- **Autenticación Segura**: Sistema de PIN de 6 dígitos con protección de rutas
- **Entrada Flexible**:
  - En desktop: ingreso por teclado físico del PC
  - En mobile: numpad personalizado visual
- **Dashboard Interactivo**: Gestión en tiempo real de boyeros y dispositivos ESP
- **Sincronización en Vivo**: WebSocket para actualizaciones instantáneas desde el servidor
- **Tema Personalizable**: Modo claro/oscuro con persistencia local
- **Interfaz Responsive**: Optimizada para desktop, tablet y mobile
- **Modales CRUD**: Crear, editar y eliminar boyeros y configuraciones ESP

## 📋 Requisitos

- Node.js >= 18
- npm o yarn
- Acceso a la API backend de Boyeros

## 🔧 Instalación

```bash
# Clonar el repositorio
git clone https://github.com/ttofalo/automatizacion-boyeros-frontend.git
cd automatizacion-boyeros-frontend

# Instalar dependencias
npm install

# Crear archivo de configuración local
cp .env.example .env.local
```

## 📁 Configuración

Editar `.env.local` con los datos del servidor:

```env
VITE_API_URL=http://localhost:8000
VITE_WS_URL=ws://localhost:8000/ws
```

## 🏃 Desarrollo

```bash
# Iniciar servidor de desarrollo
npm run dev

# Compilar para producción
npm run build

# Preview de la build
npm run preview

# Linting
npm run lint
```

El servidor de desarrollo se abrirá en `http://localhost:5173`

## 📦 Dependencias Principales

- **React 19**: Framework UI
- **Vite 7**: Build tool y dev server
- **Axios**: Cliente HTTP
- **Lucide React**: Iconografía
- **ESLint**: Linting

## 🏗️ Estructura del Proyecto

```
src/
├── components/           # Componentes React
│   ├── LoginPage.jsx    # Pantalla de autenticación
│   ├── BoyeroCard.jsx   # Tarjeta de boyero individual
│   ├── EditBoyeroModal.jsx
│   ├── CreateBoyeroModal.jsx
│   ├── CreateEspModal.jsx
│   └── ProtectedRoute.jsx
├── services/            # Servicios API
│   ├── authService.js   # Gestión de autenticación
│   ├── boyeroService.js # Operaciones CRUD boyeros
│   ├── espService.js    # Gestión ESP
│   ├── api.js          # Cliente HTTP base
│   └── boyeroService.js
├── hooks/               # Custom React hooks
│   └── useBoyeroWebSocket.js
├── styles/              # CSS global
│   ├── main.css
│   └── login.css
└── App.jsx              # Componente principal
```

## 🔐 Autenticación

La aplicación requiere un PIN de 6 dígitos para acceder. Los tokens se almacenan en localStorage.

**En Desktop**: Usa el teclado numérico o los números del teclado principal
**En Mobile**: Usa el numpad personalizado en pantalla

## 🔄 WebSocket

La aplicación mantiene una conexión WebSocket abierta para recibir actualizaciones en tiempo real:

- Cambios de estado de boyeros
- Nuevos dispositivos agregados
- Actualizaciones de configuración

## 🎨 Temas

El tema se guarda en localStorage y persiste entre sesiones:

```javascript
// Light theme (por defecto)
// Dark theme
```

Variables CSS disponibles:
- `--bg-color`: Fondo principal
- `--text-primary`: Texto principal
- `--text-secondary`: Texto secundario
- `--text-tertiary`: Texto terciario
- `--border-color`: Color de bordes
- `--danger-color`: Color de error
- `--success-color`: Color de éxito

## 🚀 Deployment

### Producción

```bash
npm run build
```

La carpeta `dist/` contiene los archivos listos para deployar.

### Systemd Service

Se incluye archivo `boyeros-frontend.service` para deployment en Linux con systemd.

## 📝 API Endpoints

La aplicación interactúa con los siguientes endpoints:

- `POST /login` - Autenticación
- `GET /boyeros` - Listar boyeros
- `POST /boyeros` - Crear boyero
- `PUT /boyeros/:id` - Actualizar boyero
- `DELETE /boyeros/:id` - Eliminar boyero
- `POST /esp` - Configurar ESP
- `WS /ws` - WebSocket para actualizaciones en vivo

## 🐛 Troubleshooting

**PIN incorrecto**: Asegúrate de tener la conectividad con el servidor y que el PIN sea correcto

**WebSocket no se conecta**: Verifica que la URL de WebSocket en `.env.local` sea correcta y que el servidor esté activo

**CORS errors**: Configura correctamente los CORS en el backend para permitir solicitudes desde el frontend

## 📄 Licencia

Proyecto privado - Automatización Boyeros

## 👨‍💻 Autor

Desarrollado por [Tobias Tofalo](https://github.com/ttofalo)

- LinkedIn: [tobiastofalo](https://www.linkedin.com/in/tobiastofalo)
- GitHub: [@ttofalo](https://github.com/ttofalo)

---

**Última actualización**: Abril 2026
