import { useContext } from "react";
import { ThemeContext } from "../context/theme.context";

/**
 * Custom hook para acceder al contexto del tema
 * @returns {Object} Objeto con theme, toggleTheme, setTheme e isLoading
 */
export function useTheme() {
  const context = useContext(ThemeContext);
  
  if (!context) {
    throw new Error("useTheme debe usarse dentro de un ThemeProviderWrapper");
  }
  
  return context;
}
