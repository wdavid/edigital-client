import jwt from "jsonwebtoken";

export const decodeToken = (token) => {
  try {
    console.log("Token recibido:", token);
    const decoded = jwt.decode(token);
    console.log("Token decodificado:", decoded);
    return decoded;
  } catch (error) {
    console.error("Error al decodificar el token:", error.message);
    return null;
  }
};

export const isTokenValid = (token) => {
    if (!token) {
      console.error("Token no encontrado.");
      return false;
    }
  
    try {
        const decoded = jwt.decode(token);

        if (!decoded || !decoded.exp) {
            console.error("El token no tiene un campo 'exp'.");
            return false;
        }

        const currentTime = Math.floor(Date.now() / 1000); 

        return decoded.exp > currentTime; 
    } catch (error) {
        console.error("Error al validar el token:", error.message);
        return false;
    }
  };
  
  

export const getToken = () => localStorage.getItem("token");

export const removeToken = () => localStorage.removeItem("token");
