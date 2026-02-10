import { createContext, useState, useEffect } from "react";

const ThemeContext = createContext();

function ThemeProviderWrapper({ children }) {
  // Función para obtener el tema inicial
  const getInitialTheme = () => {
    // 1. Intentar obtener de localStorage
    try {
      const savedTheme = localStorage.getItem("theme");
      if (savedTheme === "light" || savedTheme === "dark") {
        return savedTheme;
      }
    } catch (error) {
      console.warn("Error accessing localStorage:", error);
    }
    
    // 2. Usar preferencia del sistema
    if (typeof window !== "undefined" && window.matchMedia) {
      const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      return systemPrefersDark ? "dark" : "light";
    }
    
    // 3. Por defecto usar light
    return "light";
  };

  const [theme, setTheme] = useState(getInitialTheme);
  const [isLoading, setIsLoading] = useState(true);

  // Toggle entre light y dark mode
  const toggleTheme = () => {
    setTheme((prevTheme) => {
      const newTheme = prevTheme === "light" ? "dark" : "light";
      return newTheme;
    });
  };

  // Función para establecer un tema específico
  const setSpecificTheme = (newTheme) => {
    if (newTheme === "light" || newTheme === "dark") {
      setTheme(newTheme);
    }
  };

  // Aplicar tema al documento y guardar en localStorage
  useEffect(() => {
    try {
      // Aplicar atributo data-theme al HTML
      document.documentElement.setAttribute("data-theme", theme);
      
      // Guardar en localStorage
      localStorage.setItem("theme", theme);
      
      // Agregar clase para transiciones suaves después de la carga inicial
      if (isLoading) {
        setTimeout(() => setIsLoading(false), 100);
      }
    } catch (error) {
      console.warn("Error saving theme:", error);
    }
  }, [theme, isLoading]);

  // Escuchar cambios en la preferencia del sistema
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    
    const handleChange = (e) => {
      // Solo cambiar si el usuario no ha establecido una preferencia manual
      const hasManualPreference = localStorage.getItem("theme");
      if (!hasManualPreference) {
        setTheme(e.matches ? "dark" : "light");
      }
    };

    // Agregar listener para cambios en la preferencia del sistema
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handleChange);
    } else {
      // Fallback para navegadores antiguos
      mediaQuery.addListener(handleChange);
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener("change", handleChange);
      } else {
        mediaQuery.removeListener(handleChange);
      }
    };
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme: setSpecificTheme, isLoading }}>
      {children}
    </ThemeContext.Provider>
  );
}

export { ThemeContext, ThemeProviderWrapper };
