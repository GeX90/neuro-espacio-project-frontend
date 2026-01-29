import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/auth.context";
import Loader from "../components/Loader";
import "./AdminDisponibilidadPage.css";

const API_URL = import.meta.env.VITE_API_URL;

// Horarios típicos de consulta (9:00 a 18:00)
const HORARIOS_DISPONIBLES = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
  "15:00", "15:30", "16:00", "16:30", "17:00", "17:30"
];

function AdminDisponibilidadPage() {
  const { isLoggedIn, isAdmin, isLoading } = useContext(AuthContext);
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [disponibilidad, setDisponibilidad] = useState({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    if (isLoading) return;
    
    if (!isLoggedIn || !isAdmin) {
      navigate("/");
      return;
    }

    cargarDisponibilidad();
  }, [isLoggedIn, isAdmin, isLoading, navigate, currentDate]);

  const cargarDisponibilidad = async () => {
    setLoading(true);
    try {
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();
      
      const fechaInicio = new Date(year, month, 1).toISOString().split('T')[0];
      const fechaFin = new Date(year, month + 1, 0).toISOString().split('T')[0];

      const storedToken = localStorage.getItem('authToken');
      const response = await axios.get(
        `${API_URL}/api/admin/disponibilidad?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`,
        {
          headers: { Authorization: `Bearer ${storedToken}` }
        }
      );

      // Convertir array a objeto para búsqueda rápida
      const dispObj = {};
      response.data.forEach(item => {
        const fecha = new Date(item.fecha).toISOString().split('T')[0];
        const key = `${fecha}_${item.hora}`;
        dispObj[key] = item.disponible;
      });

      setDisponibilidad(dispObj);
    } catch (error) {
      console.error("Error cargando disponibilidad:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleDisponibilidad = async (fecha, hora) => {
    const key = `${fecha}_${hora}`;
    const nuevoEstado = !disponibilidad[key];

    // Actualizar UI inmediatamente
    setDisponibilidad(prev => ({
      ...prev,
      [key]: nuevoEstado
    }));

    // Guardar en backend
    try {
      const storedToken = localStorage.getItem('authToken');
      await axios.post(
        `${API_URL}/api/admin/disponibilidad`,
        {
          fecha,
          hora,
          disponible: nuevoEstado
        },
        {
          headers: { Authorization: `Bearer ${storedToken}` }
        }
      );
    } catch (error) {
      console.error("Error actualizando disponibilidad:", error);
      // Revertir cambio si falla
      setDisponibilidad(prev => ({
        ...prev,
        [key]: !nuevoEstado
      }));
    }
  };

  const marcarDiaCompleto = async (dia, disponible) => {
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const dayStr = String(dia).padStart(2, '0');
    const fecha = `${year}-${month}-${dayStr}`;

    const horarios = HORARIOS_DISPONIBLES.map(hora => ({
      fecha,
      hora,
      disponible
    }));

    setSaving(true);
    try {
      const storedToken = localStorage.getItem('authToken');
      await axios.put(
        `${API_URL}/api/admin/disponibilidad/batch`,
        { horarios },
        {
          headers: { Authorization: `Bearer ${storedToken}` }
        }
      );

      // Actualizar UI
      const newDisp = { ...disponibilidad };
      HORARIOS_DISPONIBLES.forEach(hora => {
        const key = `${fecha}_${hora}`;
        newDisp[key] = disponible;
      });
      setDisponibilidad(newDisp);
      
      setMessage({
        type: 'success',
        text: `Día ${dia} marcado como ${disponible ? 'disponible' : 'no disponible'}`
      });
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error("Error actualizando día completo:", error);
      setMessage({
        type: 'error',
        text: 'Error al actualizar la disponibilidad'
      });
    } finally {
      setSaving(false);
    }
  };

  const getDaysInMonth = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek };
  };

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const contarHorasDisponibles = (dia) => {
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const dayStr = String(dia).padStart(2, '0');
    const fecha = `${year}-${month}-${dayStr}`;

    return HORARIOS_DISPONIBLES.filter(hora => {
      const key = `${fecha}_${hora}`;
      return disponibilidad[key] === true;
    }).length;
  };

  const renderCalendar = () => {
    const { daysInMonth, startingDayOfWeek } = getDaysInMonth();
    const days = [];

    // Espacios en blanco
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(<div key={`empty-${i}`} className="disp-calendar-day empty"></div>);
    }

    // Días del mes
    for (let day = 1; day <= daysInMonth; day++) {
      const horasDisponibles = contarHorasDisponibles(day);
      const totalHoras = HORARIOS_DISPONIBLES.length;
      const porcentaje = (horasDisponibles / totalHoras) * 100;

      days.push(
        <div key={day} className="disp-calendar-day">
          <div className="day-header">
            <span className="day-number">{day}</span>
            <span className="hours-available">{horasDisponibles}/{totalHoras}</span>
          </div>
          <div className="day-progress">
            <div 
              className="progress-bar" 
              style={{ 
                width: `${porcentaje}%`,
                backgroundColor: porcentaje === 100 ? '#28a745' : porcentaje > 0 ? '#ffc107' : '#dc3545'
              }}
            />
          </div>
          <div className="day-actions">
            <button
              onClick={() => marcarDiaCompleto(day, true)}
              disabled={saving}
              className="btn-mark-available"
              title="Marcar todo disponible"
            >
              ✓
            </button>
            <button
              onClick={() => marcarDiaCompleto(day, false)}
              disabled={saving}
              className="btn-mark-unavailable"
              title="Marcar todo no disponible"
            >
              ✗
            </button>
          </div>
        </div>
      );
    }

    return days;
  };

  if (isLoading || loading) {
    return <Loader message="Cargando disponibilidad..." />;
  }

  return (
    <div className="AdminDisponibilidadPage">
      <div className="disp-container">
        <div className="disp-header">
          <h1>Gestión de Disponibilidad</h1>
          <p className="subtitle">
            Define los horarios disponibles para que los pacientes puedan agendar citas
          </p>
        </div>

        {message && (
          <div className={`message ${message.type}`}>
            {message.text}
          </div>
        )}

        <div className="disp-calendar">
          <div className="calendar-header">
            <button onClick={previousMonth} className="calendar-nav">❮</button>
            <h2 className="calendar-month">
              {currentDate.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
            </h2>
            <button onClick={nextMonth} className="calendar-nav">❯</button>
          </div>

          <div className="disp-legend">
            <div className="legend-item">
              <div className="legend-color available"></div>
              <span>Completamente disponible</span>
            </div>
            <div className="legend-item">
              <div className="legend-color partial"></div>
              <span>Parcialmente disponible</span>
            </div>
            <div className="legend-item">
              <div className="legend-color unavailable"></div>
              <span>No disponible</span>
            </div>
          </div>

          <div className="calendar-weekdays">
            <div>Dom</div>
            <div>Lun</div>
            <div>Mar</div>
            <div>Mié</div>
            <div>Jue</div>
            <div>Vie</div>
            <div>Sáb</div>
          </div>

          <div className="disp-calendar-grid">
            {renderCalendar()}
          </div>
        </div>

        <div className="instructions">
          <h3>Instrucciones:</h3>
          <ul>
            <li>✓ = Marcar todo el día como disponible</li>
            <li>✗ = Marcar todo el día como no disponible</li>
            <li>Los pacientes solo verán los horarios que marques como disponibles</li>
            <li>Por defecto, todos los horarios están NO disponibles</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default AdminDisponibilidadPage;
