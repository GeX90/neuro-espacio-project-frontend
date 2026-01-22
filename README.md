# 🧠 Neuro Espacio - Frontend

Aplicación web para gestión de citas de psicología especializada en ansiedad, estrés y autoestima. Este proyecto proporciona una plataforma intuitiva para que los usuarios puedan reservar citas con profesionales de la salud mental.

## 🌐 Demo en Vivo

**[Ver Demo](https://neuro-espacio.vercel.app/)**

## 📋 Descripción

Neuro Espacio es una plataforma moderna y profesional que conecta a pacientes con servicios de psicología. La aplicación permite a los usuarios:

- Registrarse y acceder con autenticación segura
- Reservar y gestionar citas
- Ver detalles de sus citas programadas
- Acceder a información sobre los profesionales
- Panel de administración para gestionar usuarios y citas

## ✨ Características

- **Autenticación de Usuarios**: Sistema completo de registro e inicio de sesión
- **Gestión de Citas**: Los usuarios pueden crear, editar y ver sus citas
- **Panel de Administración**: Área administrativa para gestionar usuarios y todas las citas
- **Rutas Protegidas**: Sistema de autorización con rutas privadas y públicas
- **Diseño Responsivo**: Interfaz adaptable a todos los dispositivos
- **Calendario Interactivo**: Visualización de disponibilidad y citas
- **Información Profesional**: Sección "Sobre Nosotros" con detalles del servicio

## 🛠️ Tecnologías

- **React 19** - Biblioteca de interfaz de usuario
- **React Router DOM 7** - Enrutamiento de la aplicación
- **Axios** - Cliente HTTP para consumir APIs
- **Vite** - Herramienta de construcción y desarrollo
- **CSS Modules** - Estilos modulares para componentes

## 📁 Estructura del Proyecto

```
neuro-espacio-project-frontend/
├── src/
│   ├── components/
│   │   ├── Calendar.jsx         # Componente de calendario
│   │   ├── Footer.jsx           # Pie de página
│   │   ├── Navbar.jsx           # Barra de navegación
│   │   ├── Loader.jsx           # Indicador de carga
│   │   ├── IsPrivate.jsx        # HOC para rutas privadas
│   │   └── IsAnon.jsx           # HOC para rutas públicas
│   ├── pages/
│   │   ├── HomePage.jsx         # Página de inicio
│   │   ├── SignupPage.jsx       # Registro de usuarios
│   │   ├── LoginPage.jsx        # Inicio de sesión
│   │   ├── CitasPage.jsx        # Listado de citas del usuario
│   │   ├── CitaDetailsPage.jsx  # Detalles de una cita
│   │   ├── CreateCitasPage.jsx  # Crear nueva cita
│   │   ├── EditCitasPage.jsx    # Editar cita existente
│   │   ├── AboutUsPage.jsx      # Información sobre el servicio
│   │   ├── AdminUsersPage.jsx   # Admin: gestión de usuarios
│   │   └── AdminCitasPage.jsx   # Admin: gestión de citas
│   ├── context/
│   │   └── auth.context.jsx     # Contexto de autenticación
│   ├── App.jsx                  # Componente principal
│   └── main.jsx                 # Punto de entrada
├── public/                      # Archivos estáticos
├── index.html
├── package.json
├── vite.config.js
└── vercel.json                  # Configuración de Vercel
```

## 🚀 Instalación y Uso

### Prerrequisitos

- Node.js (versión 16 o superior)
- npm o yarn

### Instalación

1. Clona el repositorio:
```bash
git clone <url-del-repositorio>
cd neuro-espacio-project-frontend
```

2. Instala las dependencias:
```bash
npm install
```

3. Configura las variables de entorno:
Crea un archivo `.env` en la raíz del proyecto y añade la URL de tu backend:
```env
VITE_API_URL=<url-de-tu-backend>
```

4. Inicia el servidor de desarrollo:
```bash
npm run dev
```

5. Abre tu navegador en `http://localhost:5173`

## 📦 Scripts Disponibles

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Construye la aplicación para producción
- `npm run preview` - Previsualiza la construcción de producción
- `npm run lint` - Ejecuta el linter

## 🔐 Rutas de la Aplicación

### Rutas Públicas
- `/` - Página de inicio
- `/about` - Sobre nosotros
- `/signup` - Registro de usuario
- `/login` - Inicio de sesión

### Rutas Privadas (requieren autenticación)
- `/citas` - Mis citas
- `/citas/:id` - Detalles de una cita
- `/crear-cita` - Crear nueva cita
- `/editar-citas` - Editar citas

### Rutas de Administrador
- `/admin/users` - Gestión de usuarios
- `/admin/citas` - Gestión de todas las citas

## 🎨 Características de Diseño

- Diseño moderno y profesional
- Paleta de colores enfocada en bienestar y confianza
- Navegación intuitiva
- Feedback visual para acciones del usuario
- Componente de carga para mejorar la experiencia de usuario

## 🌐 Despliegue

La aplicación está desplegada en Vercel y se actualiza automáticamente con cada push a la rama principal.

**URL de producción**: https://neuro-espacio.vercel.app/

## 👨‍💻 Desarrollador

**Jorge Jiménez Morgado**
- GitHub: [GeX90](https://github.com/GeX90)

## 📄 Licencia

Este proyecto es privado y fue desarrollado como proyecto educativo.

## 🤝 Contribuciones

Este es un proyecto educativo. Para sugerencias o mejoras, por favor contacta al desarrollador.

---

⭐ Si te gusta este proyecto, dale una estrella en GitHub!
