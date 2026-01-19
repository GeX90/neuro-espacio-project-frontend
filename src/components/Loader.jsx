import "./Loader.css";

function Loader({ message = "Cargando..." }) {
  return (
    <div className="loader-container">
      <div className="loader-spinner"></div>
      <p className="loader-message">{message}</p>
    </div>
  );
}

export default Loader;
