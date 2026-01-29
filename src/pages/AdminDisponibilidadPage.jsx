import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/auth.context";
import Loader from "../components/Loader";
import "./AdminDisponibilidadPage.css";

const API_URL = import.meta.env.VITE_API_URL;

// Horarios de sesiones (cada sesión dura 1 hora)
const HORARIOS_DISPONIBLES = [
  "09:00 - 10:00",
  "10:00 - 11:00",
  "11:00 - 12:00",
  "12:00 - 13:00",
  "13:00 - 14:00",
  "14:00 - 15:00",
  "15:00 - 16:00",
  "16:00 - 17:00",
  "17:00 - 18:00"
];

// Extraer solo la hora de inicio para guardar en BD
const getHoraInicio = (horario) => horario.split(' - ')[0];

function AdminDisponibilidadPage() {
  const { isLoggedIn, isAdmin, isLoading } = useContext(AuthContext);
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [disponibilidad, setDisponibilidad] = useState({});
  const [cambiosPendientes, setCambiosPendientes] = useState({});
  const [selectedDay, setSelectedDay] = useState(null);
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
      setCambiosPendientes({});
    } catch (error) {
      console.error("Error cargando disponibilidad:", error);
      showMessage('error', 'Error al cargar la disponibilidad');
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  const toggleDisponibilidad = (fecha, horario) => {
    const hora = getHoraInicio(horario);
    const key = `${fecha}_${hora}`;
    const nuevoEstado = !disponibilidad[key];

    // Actualizar UI inmediatamente
    setDisponibilidad(prev => ({
      ...prev,
      [key]: nuevoEstado
    }));

    // Marcar como cambio pendiente
    setCambiosPendientes(prev => ({
      ...prev,
      [key]: { fecha, hora, disponible: nuevoEstado }
    }));
  };

  const guardarCambios = async () => {
    const cambiosArray = Object.values(cambiosPendientes);
    
    if (cambiosArray.length === 0) {
      showMessage('error', 'No hay cambios pendientes para guardar');
      return;
    }

    setSaving(true);
    try {
      const storedToken = localStorage.getItem('authToken');
      
      // Guardar todos los cambios en batch
      await axios.put(
        `${API_URL}/api/admin/disponibilidad/batch`,
        { horarios: cambiosArray },
        {
          headers: { Authorization: `Bearer ${storedToken}` }
        }
      );

      setCambiosPendientes({});
      showMessage('success', `${cambiosArray.length} cambio${cambiosArray.length !== 1 ? 's' : ''} guardado${cambiosArray.length !== 1 ? 's' : ''} correctamente`);
    } catch (error) {
      console.error("Error guardando cambios:", error);
      showMessage('error', 'Error al guardar los cambios');
    } finally {
      setSaving(false);
    }
  };

  const marcarDiaCompleto = async (fecha, disponible) => {
    const horarios = HORARIOS_DISPONIBLES.map(horario => {
      const hora = getHoraInicio(horario);
      return { fecha, hora, disponible };
    });

    // Actualizar UI inmediatamente
    const newDisp = { ...disponibilidad };
    const newCambios = { ...cambiosPendientes };
    
    HORARIOS_DISPONIBLES.forEach(horario => {
      const hora = getHoraInicio(horario);
      const key = `${fecha}_${hora}`;
      newDisp[key] = disponible;
      newCambios[key] = { fecha, hora, disponible };
    });
    
    setDisponibilidad(newDisp);
    setCambiosPendientes(newCambios);
    
    showMessage('success', 'Cambios marcados. Haz clic en "Guardar cambios" para aplicarlos');
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
    setSelectedDay(null);
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    setSelectedDay(null);
  };

  const contarHorasDisponibles = (dia) => {
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const dayStr = String(dia).padStart(2, '0');
    const fecha = `${year}-${month}-${dayStr}`;

    return HORARIOS_DISPONIBLES.filter(horario => {
      const hora = getHoraInicio(horario);
      const key = `${fecha}_${hora}`;
      return disponibilidad[key] === true;
    }).length;
  };

  const getFechaString = (dia) => {
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const dayStr = String(dia).padStart(2, '0');
    return `${year}-${month}-${dayStr}`;
  };

  const handleDayClick = (dia) => {
    setSelectedDay(dia);
  };

  const isHoraDisponible = (horario) => {
    if (!selectedDay) return false;
    const fecha = getFechaString(selectedDay);
    const hora = getHoraInicio(horario);
    const key = `${fecha}_${hora}`;
    return disponibilidad[key] === true;
  };

  const renderCalendar = () => {
    const { daysInMonth, startingDayOfWeek } = getDaysInMonth();
    const days = [];
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];

    // Espacios en blanco
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(<div key={`empty-${i}`} className="disp-calendar-day empty"></div>);
    }

    // Días del mes
    for (let day = 1; day <= daysInMonth; day++) {
      const horasDisponibles = contarHorasDisponibles(day);
      const totalHoras = HORARIOS_DISPONIBLES.length;
      const porcentaje = (horasDisponibles / totalHoras) * 100;
      const fechaStr = getFechaString(day);
      const isToday = fechaStr === todayStr;
      const isSelected = selectedDay === day;

      days.push(
        <div 
          key={day} 
          className={`disp-calendar-day ${isSelected ? 'selected' : ''} ${isToday ? 'today' : ''}`}
          onClick={() => handleDayClick(day)}
        >
          <div className="day-header">
            <span className="day-number">{day}</span>
            <span className="hours-available">{horasDisponibles}/{totalHoras}</span>
          </div>
          <div className="day-progress">
            <div 
              className="progress-bar" 
              style={{ 
                width: `${porcentaje}%`,
                backgroundColor: porcentaje === 100 ? 'var(--color-success)' : porcentaje > 0 ? 'var(--color-warning)' : 'var(--color-error)'
              }}
            />
          </div>
        </div>
      );
    }

    return days;
  };

  if (isLoading || loading) {
    return <Loader message="Cargando disponibilidad..." />;
  }

  const selectedFecha = selectedDay ? getFechaString(selectedDay) : null;
  const selectedDate = selectedDay ? new Date(currentDate.getFullYear(), currentDate.getMonth(), selectedDay) : null;

  return (
    <div className="AdminDisponibilidadPage">
      <div className="disp-container">
        <div className="disp-header">
          <h1>Gestión de Disponibilidad</h1>
          <p className="subtitle">
            Selecciona un día y marca los horarios disponibles
          </p>
        </div>

        {message && (
          <div className={`message ${message.type}`}>
            {message.text}
          </div>
        )}

        <div className="disp-layout">
          <div className="disp-calendar-section">
            <div className="disp-calendar">
              <div className="calendar-header">
                <button onClick={previousMonth} className="calendar-nav">❮</button>
                <h2 className="calendar-month">
                  {currentDate.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
                </h2>
                <button onClick={nextMonth} className="calendar-nav">❯</button>
              </div>

              <div className="calendar-weekdays">
                <div>D</div>
                <div>L</div>
                <div>M</div>
                <div>X</div>
                <div>J</div>
                <div>V</div>
                <div>S</div>
              </div>

              <div className="disp-calendar-grid">
                {renderCalendar()}
              </div>
            </div>

            <div className="disp-legend">
              <div className="legend-item">
                <div className="legend-color available"></div>
                <span>Completo</span>
              </div>
              <div className="legend-item">
                <div className="legend-color partial"></div>
                <span>Parcial</span>
              </div>
              <div className="legend-item">
                <div className="legend-color unavailable"></div>
                <span>No disponible</span>
              </div>
            </div>
          </div>

          <div className="horarios-section">
            {selectedDay ? (
              <>
                <div className="horarios-header">
                  <h3>
                    {selectedDate.toLocaleDateString('es-ES', { 
                      weekday: 'long', 
                      day: 'numeric', 
                      month: 'long' 
                    })}
                  </h3>
                  <div className="save-controls">
                    {Object.keys(cambiosPendientes).length > 0 && (
                      <span className="pending-changes">
                        {Object.keys(cambiosPendientes).length} cambio{Object.keys(cambiosPendientes).length !== 1 ? 's' : ''} pendiente{Object.keys(cambiosPendientes).length !== 1 ? 's' : ''}
                      </span>
                    )}
                    <button
                      onClick={guardarCambios}
                      disabled={saving || Object.keys(cambiosPendientes).length === 0}
                      className="btn-save-changes"
                    >
                      {saving ? 'Guardando...' : 'Guardar cambios'}
                    </button>
                    {Object.keys(cambiosPendientes).length > 0 && (
                      <button
                        onClick={() => {
                          setCambiosPendientes({});
                          cargarDisponibilidad();
                          showMessage('success', 'Cambios descartados');
                        }}
                        disabled={saving}
                        className="btn-discard-changes"
                      >
                        Descartar
                      </button>
                    )}
                  </div>
                  <div className="day-actions-compact">
                    <button
                      onClick={() => marcarDiaCompleto(selectedFecha, true)}
                      disabled={saving}
                      className="btn-mark-all available"
                      title="Marcar todo disponible"
                    >
                      Todos disponible
                    </button>
                    <button
                      onClick={() => marcarDiaCompleto(selectedFecha, false)}
                      disabled={saving}
                      className="btn-mark-all unavailable"
                      title="Marcar todo no disponible"
                    >
                      Todos no disponible
                    </button>
                  </div>
                </div>

                <div className="horarios-grid">
                  {HORARIOS_DISPONIBLES.map(hora => {
                    const disponible = isHoraDisponible(hora);
                    return (
                      <button
                        key={hora}
                        className={`horario-btn ${disponible ? 'disponible' : 'no-disponible'}`}
                        onClick={() => toggleDisponibilidad(selectedFecha, hora)}
                        disabled={saving}
                      >
                        {hora}
                      </button>
                    );
                  })}
                </div>
              </>
            ) : (
              <div className="no-selection">
                <div className="no-selection-icon">📅</div>
                <p>Selecciona un día del calendario para gestionar sus horarios</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDisponibilidadPage;
