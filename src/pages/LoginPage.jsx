// src/pages/LoginPage.jsx

import { useState, useContext } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/auth.context";
import Loader from "../components/Loader";
import "./LoginPage.css";

const API_URL = "http://localhost:5005";


function LoginPage(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(undefined);
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  
  const { storeToken, authenticateUser } = useContext(AuthContext);

  
  const handleEmail = (e) => setEmail(e.target.value);
  const handlePassword = (e) => setPassword(e.target.value);

  
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(undefined);
    const requestBody = { email, password };

    axios.post(`${API_URL}/auth/login`, requestBody)
      .then((response) => {
        console.log('JWT token', response.data.authToken );
      
        // Save the token in the localStorage.      
        storeToken(response.data.authToken);
        
        // Verify the token by sending a request 
        // to the server's JWT validation endpoint. 
        authenticateUser();                     // <== ADD
        navigate('/crear-cita');
      })
      .catch((error) => {
        const errorDescription = error.response.data.message;
        setErrorMessage(errorDescription);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  
  return (
    <div className="LoginPage">
      {loading ? (
        <Loader message="Iniciando sesión..." />
      ) : (
        <>
          <h1>Iniciar Sesión</h1>

          <form onSubmit={handleLoginSubmit}>
            <label>Correo Electrónico:</label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={handleEmail}
            />

            <label>Contraseña:</label>
            <input
              type="password"
              name="password"
              value={password}
              onChange={handlePassword}
            />

            <button type="submit">Iniciar Sesión</button>
          </form>
          { errorMessage && <p className="error-message">{errorMessage}</p> }

          <p>¿No tienes cuenta todavía?</p>
          <Link to="/signup"> Regístrate</Link>
        </>
      )}
    </div>
  )
}

export default LoginPage;

