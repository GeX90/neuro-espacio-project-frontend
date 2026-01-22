import "./HomePage.css";
import Calendar from "../components/Calendar";
import { Link } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/auth.context";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

function HomePage() {
    const { isLoggedIn, user } = useContext(AuthContext);
    const [nextAppointment, setNextAppointment] = useState(null);
    const [upcomingAppointments, setUpcomingAppointments] = useState([]);

    // Fetch user's appointments if logged in
    useEffect(() => {
        if (isLoggedIn && user) {
            const storedToken = localStorage.getItem('authToken');
            
            axios.get(`${API_URL}/citas`, {
                headers: { Authorization: `Bearer ${storedToken}` }
            })
            .then(response => {
                const citas = response.data;
                const now = new Date();
                const upcoming = citas
                    .filter(cita => new Date(cita.fecha) > now && cita.estado !== 'Cancelada')
                    .sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
                
                setUpcomingAppointments(upcoming);
                if (upcoming.length > 0) {
                    setNextAppointment(upcoming[0]);
                }
            })
            .catch(err => console.log(err));
        }
    }, [isLoggedIn, user]);

    const isAdmin = user?.role === 'admin';
    
    return (
        <div className="HomePage">
            <div className="home-content">
                {/* Hero Section */}
                <header className="home-hero">
                    <h1 className="neuro-espacio-title">NEURO ESPACIO</h1>
                    <h2 className="home-main-message">Psicología para tu Bienestar</h2>
                    <p className="home-subtitle">Acompañamiento profesional y cercano</p>
                    
                    <div className="home-cta-buttons">
                        {!isLoggedIn ? (
                            <>
                                <Link to="/signup" className="btn-cta primary">
                                    Reservar Cita
                                </Link>
                                <Link to="/about" className="btn-cta secondary">
                                    Conoce más
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link to="/citas/create" className="btn-cta primary">
                                    Reservar Cita
                                </Link>
                                <Link to="/citas" className="btn-cta secondary">
                                    Mis Citas
                                </Link>
                            </>
                        )}
                    </div>
                </header>

                {/* Patient Quick Actions - Only for logged-in non-admin users */}
                {isLoggedIn && !isAdmin && (
                    <section className="patient-quick-actions">
                        <h3 className="section-title-small">Acceso Rápido</h3>
                        
                        {nextAppointment ? (
                            <div className="quick-action-card next-appointment">
                                <div className="card-header">
                                    <span className="card-icon">📅</span>
                                    <h4>Próxima Cita</h4>
                                </div>
                                <div className="appointment-details">
                                    <p className="appointment-date">
                                        {new Date(nextAppointment.fecha).toLocaleDateString('es-ES', {
                                            weekday: 'long',
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </p>
                                    <p className="appointment-time">
                                        {new Date(nextAppointment.fecha).toLocaleTimeString('es-ES', {
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </p>
                                    {nextAppointment.modalidad && (
                                        <p className="appointment-modality">
                                            {nextAppointment.modalidad === 'Presencial' ? '🏥 Presencial' : '💻 Online'}
                                        </p>
                                    )}
                                </div>
                                <div className="card-actions">
                                    <Link to={`/citas/${nextAppointment._id}`} className="btn-action primary-action">
                                        Ver Detalles
                                    </Link>
                                </div>
                            </div>
                        ) : (
                            <div className="quick-action-card empty-state">
                                <span className="card-icon">📅</span>
                                <h4>Sin citas programadas</h4>
                                <p>Reserva tu próxima sesión</p>
                                <Link to="/citas/create" className="btn-action primary-action">
                                    Reservar Ahora
                                </Link>
                            </div>
                        )}

                        <div className="quick-action-grid">
                            <Link to="/citas" className="quick-action-card">
                                <span className="card-icon">📋</span>
                                <h4>Historial</h4>
                                <p>Consulta tus sesiones</p>
                            </Link>

                            <Link to="/citas/create" className="quick-action-card">
                                <span className="card-icon">➕</span>
                                <h4>Nueva Cita</h4>
                                <p>Reserva una sesión</p>
                            </Link>

                            <Link to="/about" className="quick-action-card">
                                <span className="card-icon">👩‍⚕️</span>
                                <h4>Terapeuta</h4>
                                <p>Conoce más</p>
                            </Link>
                        </div>
                    </section>
                )}

                {/* Admin Section - Only for admin users */}
                {isLoggedIn && isAdmin && (
                    <section className="admin-quick-actions">
                        <h3 className="section-title-small">Panel Administrativo</h3>
                        
                        <div className="admin-grid">
                            <Link to="/admin/citas" className="admin-card">
                                <span className="admin-icon">📅</span>
                                <h4>Gestionar Citas</h4>
                                <p>Ver y administrar todas las citas</p>
                            </Link>

                            <Link to="/admin/users" className="admin-card">
                                <span className="admin-icon">👥</span>
                                <h4>Pacientes</h4>
                                <p>Lista de pacientes registrados</p>
                            </Link>

                            <Link to="/citas" className="admin-card">
                                <span className="admin-icon">📊</span>
                                <h4>Calendario</h4>
                                <p>Vista completa de citas</p>
                            </Link>
                        </div>

                        <div className="admin-calendar-preview">
                            <h4 className="calendar-preview-title">Vista de Disponibilidad</h4>
                            <Calendar />
                        </div>
                    </section>
                )}

                {/* Therapist Info Section */}
                <section className="professional-section">
                    <div className="professional-card">
                        <div className="professional-image">
                            <img src="/psicologaejemplo.jpg" alt="Psicóloga Profesional" />
                        </div>
                        <div className="professional-info">
                            <h3 className="professional-name">Dra. María Fernández</h3>
                            <p className="professional-title">Psicóloga Clínica y Neuropsicóloga</p>
                            
                            <div className="professional-specialties">
                                <div className="specialty-tags">
                                    <span className="specialty-tag">Ansiedad</span>
                                    <span className="specialty-tag">Estrés</span>
                                    <span className="specialty-tag">Autoestima</span>
                                    <span className="specialty-tag">Depresión</span>
                                </div>
                            </div>

                            <p className="professional-bio">
                                Hola, soy María. Durante más de 10 años he acompañado a personas en sus procesos 
                                de cambio y crecimiento personal. Mi enfoque combina la psicología clínica con 
                                la neuropsicología para ofrecer un tratamiento integral y personalizado.
                            </p>
                            
                            <Link to="/about" className="btn-learn-more">
                                Conoce más sobre mí
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Services Section */}
                <section className="services-section">
                    <h3 className="section-title">¿Cómo puedo ayudarte?</h3>
                    
                    <div className="services-grid">
                        <div className="service-card">
                            <div className="service-icon">😟</div>
                            <h4>Ansiedad y Estrés</h4>
                            <p>Técnicas efectivas para recuperar tu tranquilidad y bienestar.</p>
                        </div>

                        <div className="service-card">
                            <div className="service-icon">💪</div>
                            <h4>Autoestima</h4>
                            <p>Fortalece tu confianza y alcanza tu máximo potencial.</p>
                        </div>

                        <div className="service-card">
                            <div className="service-icon">💔</div>
                            <h4>Estado de Ánimo</h4>
                            <p>Recupera tu energía y disfruta de nuevo de la vida.</p>
                        </div>

                        <div className="service-card">
                            <div className="service-icon">🧠</div>
                            <h4>Neuropsicología</h4>
                            <p>Evaluación y rehabilitación de funciones cognitivas.</p>
                        </div>
                    </div>

                    <div className="services-modality">
                        <p>💻 Online • 🏥 Presencial • 50-60 minutos</p>
                    </div>
                </section>

                {/* Calendar Section - For all users */}
                <section className="home-calendar-section">
                    <h3 className="calendar-title">Consulta Disponibilidad</h3>
                    <p className="calendar-subtitle">
                        {isLoggedIn && !isAdmin 
                            ? "Selecciona un día disponible para reservar tu cita" 
                            : !isLoggedIn 
                            ? "Días disponibles en verde. Regístrate para reservar tu cita" 
                            : "Días disponibles para los pacientes"}
                    </p>
                    <Calendar />
                </section>
            </div>
        </div>
    )
}

export default HomePage;