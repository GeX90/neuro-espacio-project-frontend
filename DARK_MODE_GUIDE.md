# Dark Mode / Light Mode - Documentación

## 📚 Descripción General

Sistema completo de modo oscuro/claro implementado con React Context API, hooks personalizados y CSS Variables. El sistema es completamente accesible (WCAG AA), responsivo y compatible con SSR/Next.js (sin flicker).

## ✨ Características

### ✅ Funcionalidades Principales

1. **Detección automática** - Detecta la preferencia del sistema operativo (`prefers-color-scheme`)
2. **Toggle manual** - Botón accesible para alternar entre modos
3. **Persistencia** - Guarda la preferencia en `localStorage`
4. **Sin flicker** - Script de prevención en `index.html` para evitar parpadeo al cargar
5. **Accesibilidad completa** - ARIA labels, focus visible, keyboard navigation
6. **Responsive** - Adaptado para móviles, tablets y desktop
7. **Alto contraste** - Paleta de colores optimizada para WCAG AA/AAA

### 🎨 Paleta de Colores

#### Modo Claro
- Background principal: `#FAFBF9`
- Background cards: `#FFFFFF`
- Primary: `#0F7C8C`
- Texto principal: `#1a1a1a`
- Título: `#2D4A2B`

#### Modo Oscuro  
- Background principal: `#0f1419`
- Background cards: `#1e2936`
- Primary: `#3dd4e4`
- Texto principal: `#f0f4f8`
- Título: `#b8e994`

## 🚀 Uso Rápido

### 1. Usar el Hook en cualquier componente

```jsx
import { useTheme } from "../hooks/useTheme";

function MiComponente() {
  const { theme, toggleTheme, setTheme } = useTheme();
  
  return (
    <div>
      <p>Tema actual: {theme}</p>
      <button onClick={toggleTheme}>Cambiar tema</button>
      {/* O establecer un tema específico */}
      <button onClick={() => setTheme('dark')}>Modo Oscuro</button>
    </div>
  );
}
```

### 2. Usar el componente ThemeToggle

```jsx
import ThemeToggle from "../components/ThemeToggle";

function MiPagina() {
  return (
    <div>
      <h1>Mi Aplicación</h1>
      <ThemeToggle />
    </div>
  );
}
```

### 3. Aplicar estilos con CSS Variables

```css
.mi-componente {
  background: var(--color-bg-card);
  color: var(--color-text-main);
  border: 1px solid var(--color-border);
}

.mi-titulo {
  color: var(--color-title);
}

.mi-boton {
  background: var(--color-primary);
  color: var(--color-text-on-primary);
}

.mi-boton:hover {
  background: var(--color-primary-hover);
}
```

## 📖 Variables CSS Disponibles

### Backgrounds
- `--color-bg-main` - Fondo principal de la página
- `--color-bg-section` - Fondo de secciones destacadas
- `--color-bg-card` - Fondo de tarjetas y contenedores
- `--color-bg-input` - Fondo de campos de formulario
- `--color-bg-hover` - Fondo al pasar el ratón

### Colores Primarios
- `--color-primary` - Color principal de la marca
- `--color-primary-hover` - Color primary al hover
- `--color-primary-light` - Versión clara del primary

### Textos
- `--color-title` - Títulos y headings
- `--color-text-main` - Texto principal
- `--color-text-secondary` - Texto secundario
- `--color-text-muted` - Texto tenue (placeholders)
- `--color-text-on-primary` - Texto sobre primary

### UI
- `--color-border` - Bordes normales
- `--color-border-hover` - Bordes al hover
- `--color-success` - Estados de éxito
- `--color-warning` - Estados de advertencia
- `--color-error` - Estados de error
- `--color-info` - Estados informativos

### Sombras
- `--shadow-sm` - Sombra pequeña
- `--shadow-md` - Sombra mediana
- `--shadow-lg` - Sombra grande

## 🔧 Estructura de Archivos

```
src/
├── context/
│   └── theme.context.jsx       # Context Provider del tema
├── hooks/
│   └── useTheme.js             # Hook personalizado
├── components/
│   ├── ThemeToggle.jsx         # Componente de toggle
│   └── ThemeToggle.css         # Estilos del toggle
├── index.css                   # Variables CSS globales
└── main.jsx                    # Wrapper del ThemeProvider
```

## 🎯 Accesibilidad

### Características de Accesibilidad Implementadas

✅ **ARIA Labels descriptivos**
```jsx
<button 
  aria-label={theme === "light" ? "Activar modo oscuro" : "Activar modo claro"}
>
```

✅ **Focus visible**
```css
.theme-toggle-button:focus {
  outline: 3px solid var(--color-primary);
  outline-offset: 3px;
}
```

✅ **Tamaños mínimos de touch targets** (44x44px mínimo)

✅ **Contraste de color WCAG AA** (4.5:1 para texto normal)

✅ **Soporte para prefers-reduced-motion**
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation: none !important;
    transition: none !important;
  }
}
```

✅ **Navegación por teclado** - Completamente funcional

## 🌐 Prevención de Flicker (SSR Compatible)

El script en `index.html` aplica el tema antes de que React se monte:

```html
<script>
  (function() {
    try {
      const savedTheme = localStorage.getItem('theme');
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const theme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
      document.documentElement.setAttribute('data-theme', theme);
    } catch (e) {
      document.documentElement.setAttribute('data-theme', 'light');
    }
  })();
</script>
```

## 📱 Responsive Design

### Desktop
- Botón con texto e icono
- Tamaño: 44px altura mínima
- Padding: 0.5rem 1rem

### Tablet  
- Igual que desktop

### Móvil (< 768px)
- Solo icono (sin texto)
- Botón circular
- Tamaño: 44x44px mínimo

## 🎨 Ejemplos de Uso

### Ejemplo 1: Card con Dark Mode

```jsx
function MiCard({ title, content }) {
  return (
    <div className="mi-card">
      <h3>{title}</h3>
      <p>{content}</p>
    </div>
  );
}
```

```css
.mi-card {
  background: var(--color-bg-card);
  color: var(--color-text-main);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: var(--shadow-md);
  transition: all 0.3s ease;
}

.mi-card:hover {
  box-shadow: var(--shadow-lg);
  transform: translateY(-2px);
}

.mi-card h3 {
  color: var(--color-title);
  margin-bottom: 1rem;
}
```

### Ejemplo 2: Formulario con Dark Mode

```jsx
function MiFormulario() {
  return (
    <form className="mi-form">
      <label htmlFor="nombre">Nombre</label>
      <input 
        type="text" 
        id="nombre"
        placeholder="Tu nombre"
      />
      <button type="submit">Enviar</button>
    </form>
  );
}
```

```css
.mi-form {
  background: var(--color-bg-card);
  padding: 2rem;
  border-radius: 16px;
  box-shadow: var(--shadow-md);
}

.mi-form label {
  color: var(--color-text-main);
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
}

.mi-form input {
  background: var(--color-bg-input);
  color: var(--color-text-main);
  border: 2px solid var(--color-border);
  padding: 0.75rem 1rem;
  border-radius: 8px;
  width: 100%;
}

.mi-form input:focus {
  border-color: var(--color-primary);
  outline: none;
  box-shadow: 0 0 0 4px var(--color-primary-light);
}

.mi-form input::placeholder {
  color: var(--color-text-muted);
}

.mi-form button {
  background: var(--color-primary);
  color: var(--color-text-on-primary);
  border: none;
  padding: 0.75rem 2rem;
  border-radius: 50px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
}

.mi-form button:hover {
  background: var(--color-primary-hover);
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}
```

### Ejemplo 3: Estado de Carga con Dark Mode

```jsx
function LoadingSpinner() {
  return (
    <div className="spinner-container">
      <div className="spinner"></div>
      <p>Cargando...</p>
    </div>
  );
}
```

```css
.spinner-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid var(--color-border);
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.spinner-container p {
  color: var(--color-text-secondary);
  margin-top: 1rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
```

## 🔍 Testing

### Test Manual

1. Cambiar tema desde el botón
2. Verificar que se guarda en localStorage
3. Recargar la página y verificar que persiste
4. Cambiar preferencia del sistema (Settings > Appearance)
5. Verificar que no hay flicker al cargar
6. Navegar con teclado (Tab + Enter)
7. Verificar contraste con herramientas de accesibilidad

### Herramientas Recomendadas

- **WAVE** - Web Accessibility Evaluation Tool
- **axe DevTools** - Análisis de accesibilidad
- **Lighthouse** - Auditoría de performance y accesibilidad
- **Contrast Checker** - Verificar ratios de contraste WCAG

## 📝 Notas Importantes

1. **Siempre usar variables CSS** - No usar colores hardcodeados
2. **Probar en ambos temas** - Cada nuevo componente
3. **Verificar contraste** - Especialmente para textos pequeños
4. **Keyboard navigation** - Asegurar que todo es accesible por teclado
5. **Reducir motion** - Respetar preferencia de usuario

## 🐛 Troubleshooting

### El tema no persiste al recargar
- Verificar que localStorage está disponible
- Revisar console para errores
- Verificar que ThemeProvider envuelve toda la app

### Flicker al cargar
- Verificar que el script está en `<head>` del index.html
- Asegurarse que ejecuta antes de cargar React

### Colores no cambian
- Verificar que usas variables CSS (--color-xxx)
- Revisar que no hay !important bloqueando
- Inspeccionar elemento para ver valores aplicados

## 📚 Referencias

- [MDN - prefers-color-scheme](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme)
- [WCAG 2.1 Contrast Guidelines](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html)
- [React Context API](https://react.dev/reference/react/useContext)
- [CSS Custom Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)

---

**Desarrollado con ❤️ para Neuro Espacio**
