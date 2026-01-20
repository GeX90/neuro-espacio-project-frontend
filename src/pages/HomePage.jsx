import "./HomePage.css";
import Calendar from "../components/Calendar";

function HomePage() {
    
    return (
        <div className="HomePage">
            <div className="home-content">
                <h1>NEURO ESPACIO</h1>
                <p className="home-description">
                    Bienvenido a Neuro Espacio, tu centro de psicología y bienestar. 
                    Ofrecemos servicios profesionales de terapia individual, familiar y de pareja. 
                    Nuestro equipo especializado te acompañará en tu proceso de crecimiento personal 
                    y salud mental. Agenda tu cita y comienza tu camino hacia el bienestar.
                </p>
                <Calendar />
            </div>
        </div>
    )
}

export default HomePage;