# Guía de Migración de Colores Hardcodeados a Variables CSS

## 🎨 Tabla de Conversión Rápida

### Backgrounds

| Color Hardcodeado | Variable CSS | Uso |
|------------------|--------------|-----|
| `white` | `var(--color-bg-card)` | Fondos de tarjetas, modales |
| `#FFFFFF` | `var(--color-bg-card)` | Fondos de tarjetas, modales |
| `#f0f0f0`, `#f5f5f5` | `var(--color-bg-hover)` | Estados hover |
| `#FAFBF9` | `var(--color-bg-main)` | Fondo principal |

### Textos

| Color Hardcodeado | Variable CSS | Uso |
|------------------|--------------|-----|
| `#3f3f3a` | `var(--color-text-main)` | Texto principal |
| `black`, `#000000` | `var(--color-text-main)` | Texto principal |
| `#6B7440` | `var(--color-title)` | Títulos y headings |
| `#a0a0a0`, `#999` | `var(--color-text-muted)` | Placeholders, texto deshabilitado |
| `white` (sobre primary) | `var(--color-text-on-primary)` | Texto sobre botones primary |

### Colores de Estado

| Color Hardcodeado | Variable CSS | Uso |
|------------------|--------------|-----|
| `#28a745`, `#3d9b40` | `var(--color-success)` | Éxito, confirmación |
| `#dc3545`, `#d32f2f` | `var(--color-error)` | Error, eliminar |
| `#ffa726`, `#ff9800` | `var(--color-warning)` | Advertencia |
| `#6c757d`, `#ccc` | `var(--color-text-muted)` | Deshabilitado, inactivo |

### Bordes

| Color Hardcodeado | Variable CSS | Uso |
|------------------|--------------|-----|
| `#E6E6E6`, `#e2e2e2` | `var(--color-border)` | Bordes normales |
| `#3a3a3a` | `var(--color-border)` | Bordes en dark mode |
| `rgba(255,255,255,0.2)` | `var(--color-border)` | Bordes transparentes |

## 🔄 Ejemplos de Migración

### ❌ ANTES
```css
.my-component {
  background: white;
  color: #3f3f3a;
  border: 1px solid #e6e6e6;
}

.my-component:hover {
  background: #f5f5f5;
}

.my-button {
  background: #0F7C8C;
  color: white;
}

.my-button:hover {
  background: #0A6F7A;
}
```

### ✅ DESPUÉS
```css
.my-component {
  background: var(--color-bg-card);
  color: var(--color-text-main);
  border: 1px solid var(--color-border);
}

.my-component:hover {
  background: var(--color-bg-hover);
}

.my-button {
  background: var(--color-primary);
  color: var(--color-text-on-primary);
}

.my-button:hover {
  background: var(--color-primary-hover);
}
```

## 🛠️ Script de Búsqueda y Reemplazo

### Buscar colores hardcodeados (Regex)
```regex
(background|color):\s*(white|#[0-9a-fA-F]{3,6})
```

### Pasos para migrar un archivo CSS

1. **Identificar colores hardcodeados**
   ```bash
   # Buscar en VS Code con regex
   (background|color):\s*(white|#[a-f0-9]{3,6})
   ```

2. **Determinar el propósito del color**
   - ¿Es fondo de card? → `--color-bg-card`
   - ¿Es texto? → `--color-text-main`
   - ¿Es título? → `--color-title`
   - ¿Es borde? → `--color-border`
   - ¿Es estado (error/success)? → `--color-error` / `--color-success`

3. **Reemplazar con la variable apropiada**

4. **Probar en ambos temas**
   - Activar dark mode
   - Verificar contraste
   - Ajustar si es necesario

## 📋 Checklist de Migración

Para cada archivo CSS:

- [ ] Buscar `background: white` → reemplazar con var apropiada
- [ ] Buscar `background: #xxx` → reemplazar con var apropiada
- [ ] Buscar `color: #xxx` → reemplazar con var apropiada
- [ ] Buscar `border-color: #xxx` → reemplazar con var apropiada
- [ ] Buscar rgba/hsla hardcodeados → evaluar si necesitan variable
- [ ] Verificar que no hay gradientes con colores fijos
- [ ] Probar componente en dark mode
- [ ] Verificar contraste con herramienta WCAG

## 🎯 Casos Especiales

### Gradientes
```css
/* ❌ NO recomendado */
background: linear-gradient(135deg, #2d3436 0%, #3f3f3a 100%);

/* ✅ Mejor */
background: var(--color-bg-section);
/* O si realmente necesitas gradient: */
background: linear-gradient(135deg, 
  var(--color-bg-section) 0%, 
  var(--color-bg-card) 100%
);
```

### Transparencias
```css
/* ❌ NO recomendado */
background: rgba(255, 255, 255, 0.1);

/* ✅ Mejor - crear variable específica si se usa mucho */
:root {
  --overlay-light: rgba(255, 255, 255, 0.1);
}
[data-theme="dark"] {
  --overlay-light: rgba(0, 0, 0, 0.2);
}

/* Uso */
background: var(--overlay-light);
```

### Sombras con color
```css
/* ❌ Evitar */
box-shadow: 0 4px 12px rgba(74, 86, 50, 0.3);

/* ✅ Usar variables de sombra */
box-shadow: var(--shadow-md);
```

## 📁 Archivos Prioritarios para Migrar

1. **Alta Prioridad** (componentes principales)
   - [ ] `src/components/Navbar.css` ✅ COMPLETADO
   - [ ] `src/components/Footer.css` ✅ COMPLETADO
   - [ ] `src/pages/HomePage.css` ✅ COMPLETADO
   - [ ] `src/pages/AboutUsPage.css` ✅ COMPLETADO
   - [ ] `src/index.css` ✅ COMPLETADO

2. **Media Prioridad** (páginas de usuario)
   - [ ] `src/pages/CitasPage.css`
   - [ ] `src/pages/CreateCitasPage.css`
   - [ ] `src/pages/EditCitasPage.css`
   - [ ] `src/pages/CitaDetailsPage.css`

3. **Baja Prioridad** (admin)
   - [ ] `src/pages/AdminCitasPage.css`
   - [ ] `src/pages/AdminUsersPage.css`
   - [ ] `src/pages/AdminDisponibilidadPage.css`
   - [ ] `src/pages/CalendarPage.css`

## 🧪 Testing después de Migración

Para cada archivo migrado:

```javascript
// Test checklist
1. ✅ Componente se ve bien en light mode
2. ✅ Componente se ve bien en dark mode
3. ✅ Transición suave entre temas
4. ✅ Contraste del texto es legible (usar herramienta WCAG)
5. ✅ Estados hover funcionan correctamente
6. ✅ Estados focus son visibles
7. ✅ Formularios son legibles y accesibles
8. ✅ Bordes son visibles pero no intrusivos
9. ✅ No hay elementos "perdidos" en dark mode
10. ✅ Imágenes/iconos se ven bien en ambos temas
```

## 💡 Tips y Mejores Prácticas

### 1. No usar colores absolutos
```css
/* ❌ Evitar */
.text { color: black; }

/* ✅ Preferir */
.text { color: var(--color-text-main); }
```

### 2. Aprovechar las transiciones
```css
/* Añadir transición suave al cambiar tema */
.my-component {
  transition: background-color 0.3s ease, 
              color 0.3s ease,
              border-color 0.3s ease;
}
```

### 3. Pensar en contraste siempre
```css
/* Si combinas colores, verifica que tienen buen contraste */
.badge {
  background: var(--color-primary);
  color: var(--color-text-on-primary); /* NO var(--color-text-main) */
}
```

### 4. Crear variables específicas si es necesario
```css
/* Si un componente necesita color único, créalo */
:root {
  --table-header-bg: #f8f9fa;
}

[data-theme="dark"] {
  --table-header-bg: #262c36;
}
```

## 🎨 Herramientas Útiles

- **DevTools** - Inspeccionar valores calculados
- **Contrast Checker** - https://webaim.org/resources/contrastchecker/
- **ColorBox** - Generar paletas accesibles
- **Find & Replace (VS Code)** - Con regex para búsquedas avanzadas

## 📞 Soporte

Si encuentras dificultades:
1. Revisa la documentación en `DARK_MODE_GUIDE.md`
2. Verifica que las variables CSS están definidas en `index.css`
3. Inspecciona el elemento con DevTools para ver qué variable se aplica
4. Prueba en ambos temas antes de confirmar

---

**Happy coding! 🚀**
