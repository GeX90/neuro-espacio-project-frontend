import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/auth.context";
import Loader from "../components/Loader";
import "./CalendarPage.css";

const API_URL = import.meta.env.VITE_API_URL;

function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [citasData, setCitasData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isLoggedIn, user, isAdmin } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn || !isAdmin) {
      navigate("/");
      return;
    }

    // Obtener todas las citas del mes actual
    const storedToken = localStorage.getItem('authToken');
    axios
      .get(`${API_URL}/api/admin/citas`, {
        headers: { Authorization: `Bearer ${storedToken}` }
      })
      .then((response) => {
        setCitasData(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error obteniendo citas:", error);
        setLoading(false);
      });
  }, [isLoggedIn, isAdmin, navigate]);

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek };
  };

  const getCitasForDay = (day) => {
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const dayStr = String(day).padStart(2, '0');
    const dateStr = `${year}-${month}-${dayStr}`;
    
    return citasData.filter(cita => {
      const citaDate = new Date(cita.fecha).toISOString().split('T')[0];
      return citaDate === dateStr && cita.estado !== 'Cancelada';
    });
  };

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const renderCalendar = () => {
    const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentDate);
    const days = [];

    // Espacios en blanco antes del primer día
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }

    // Días del mes
    for (let day = 1; day <= daysInMonth; day++) {
      const citas = getCitasForDay(day);
      const hasCitas = citas.length > 0;
      
      days.push(
        <div
          key={day}
          className={`calendar-day ${hasCitas ? 'has-citas' : 'no-citas'}`}
        >
          <span className="day-number">{day}</span>
          {hasCitas && (
            <div className="citas-indicator">
              <span className="citas-count">{citas.length}</span>
            </div>
          )}
        </div>
      );
    }

    return days;
  };

  if (loading) {
    return <Loader message="Cargando calendario..." />;
  }

  return (
    <div className="CalendarPage">
      <div className="calendar-page-container">
        <h1>Calendario de Citas</h1>
        <p className="calendar-subtitle">Vista general de todas las citas programadas</p>

        <div className="calendar-legend">
          <div className="legend-item">
            <div className="legend-color has-citas"></div>
            <span>Días con citas</span>
          </div>
          <div className="legend-item">
            <div className="legend-color no-citas"></div>
            <span>Días sin citas</span>
          </div>
        </div>

        <div className="calendar-large">
          <div className="calendar-header">
            <button onClick={previousMonth} className="calendar-nav">❮</button>
            <h2 className="calendar-month">
              {currentDate.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
            </h2>
            <button onClick={nextMonth} className="calendar-nav">❯</button>
          </div>

          <div className="calendar-weekdays">
            <div className="weekday">Dom</div>
            <div className="weekday">Lun</div>
            <div className="weekday">Mar</div>
            <div className="weekday">Mié</div>
            <div className="weekday">Jue</div>
            <div className="weekday">Vie</div>
            <div className="weekday">Sáb</div>
          </div>

          <div className="calendar-grid">
            {renderCalendar()}
          </div>
        </div>

        <div className="calendar-stats">
          <div className="stat-card">
            <div className="stat-number">{citasData.length}</div>
            <div className="stat-label">Total de Citas</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">
              {citasData.filter(c => c.estado === 'Confirmada').length}
            </div>
            <div className="stat-label">Confirmadas</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">
              {citasData.filter(c => c.estado === 'Pendiente').length}
            </div>
            <div className="stat-label">Pendientes</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CalendarPage;
