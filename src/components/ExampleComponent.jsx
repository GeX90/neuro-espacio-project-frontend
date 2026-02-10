import { useTheme } from "../hooks/useTheme";
import "./ExampleComponent.css";

/**
 * Ejemplo de componente que usa Dark Mode
 * Muestra diferentes patrones de uso del tema
 */

function ExampleComponent() {
  const { theme } = useTheme();

  return (
    <div className="example-container">
      {/* Card con estilos CSS */}
      <div className="example-card">
        <h2>Card con CSS Variables</h2>
        <p>Este card usa variables CSS que cambian automáticamente con el tema.</p>
        <p className="theme-indicator">Tema actual: <strong>{theme}</strong></p>
      </div>

      {/* Formulario */}
      <form className="example-form">
        <h3>Formulario de Ejemplo</h3>
        
        <label htmlFor="name">Nombre</label>
        <input 
          type="text" 
          id="name" 
          placeholder="Tu nombre"
        />

        <label htmlFor="email">Email</label>
        <input 
          type="email" 
          id="email" 
          placeholder="tu@email.com"
        />

        <label htmlFor="message">Mensaje</label>
        <textarea 
          id="message" 
          rows="4"
          placeholder="Escribe tu mensaje..."
        />

        <div className="button-group">
          <button type="submit" className="btn-primary">
            Enviar
          </button>
          <button type="button" className="btn-secondary">
            Cancelar
          </button>
        </div>
      </form>

      {/* Estados */}
      <div className="status-examples">
        <h3>Estados de UI</h3>
        <div className="status-grid">
          <div className="status-badge success">
            ✓ Éxito
          </div>
          <div className="status-badge warning">
            ⚠ Advertencia
          </div>
          <div className="status-badge error">
            ✕ Error
          </div>
          <div className="status-badge info">
            ℹ Info
          </div>
        </div>
      </div>

      {/* Lista */}
      <div className="example-list">
        <h3>Lista de Elementos</h3>
        <ul>
          <li>Elemento con hover effect</li>
          <li>Otro elemento interactivo</li>
          <li>Tercer elemento de la lista</li>
        </ul>
      </div>
    </div>
  );
}

export default ExampleComponent;
