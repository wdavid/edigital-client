import jwt from "jsonwebtoken";
import api from "../app/api/utils/api";

// Obtener el token del almacenamiento local
export const getToken = () => {
  return localStorage.getItem("token");
};

// Remover el token del almacenamiento local (Logout)
export const removeToken = () => {
  localStorage.removeItem("token");
};

// Verificar si el token es válido
export const isTokenValid = (token) => {
  if (!token) return false;

  try {
    const decoded = jwt.decode(token); // Decodifica el token
    const currentTime = Math.floor(Date.now() / 1000); // Tiempo actual en segundos

    if (!decoded || !decoded.exp) {
      console.error("El token no tiene un campo 'exp'.");
      return false;
    }

    return decoded.exp > currentTime; // Retorna true si el token no ha expirado
  } catch (error) {
    console.error("Error al validar el token:", error.message);
    return false;
  }
};

// Obtener el userId desde el token JWT
export const getUserIdFromToken = () => {
  const token = getToken();
  if (!token) return null;

  try {
    const decoded = jwt.decode(token); // Decodifica el token
    return decoded?.sub || null; // Devuelve el `sub` como userId
  } catch (error) {
    console.error("Error al decodificar el token:", error.message);
    return null;
  }
};

// Obtener información del usuario autenticado desde el backend
export const fetchAuthenticatedUser = async () => {
  const token = getToken();
  if (!token) {
    console.error("No se encontró un token.");
    return null;
  }

  try {
    const response = await api.get("/auth/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data; // Devuelve los datos del usuario
  } catch (error) {
    console.error("Error al obtener el usuario autenticado:", error.message);
    return null;
  }
};

// Renovar el token
export const refreshToken = async () => {
  try {
    const oldToken = getToken();
    if (!oldToken) return null;

    const response = await api.post("/auth/refresh", { token: oldToken });
    const newToken = response.data.token;

    // Almacenar el nuevo token
    localStorage.setItem("token", newToken);
    return newToken;
  } catch (error) {
    console.error("Error al renovar el token:", error.message);
    removeToken();
    return null;
  }
};

// Redirigir al login si no está autenticado
export const redirectToLogin = (router) => {
  removeToken(); // Limpia el token
  router.push("/auth/login"); // Redirige al login
};

// Verificar si el usuario está autenticado
export const isAuthenticated = () => {
  const token = getToken();
  return isTokenValid(token);
};
