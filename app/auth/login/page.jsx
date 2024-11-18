"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { FaSpinner } from "react-icons/fa"; // Importamos el icono de carga de react-icons
import api from "../../api/utils/api";

export default function LoginPage() {
  const [formData, setFormData] = useState({ identifier: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false); // Estado para el indicador de carga
  const [error, setError] = useState("");
  const router = useRouter();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true); // Activa el indicador de carga

    try {
      const response = await api.post("/auth/login", formData);
      localStorage.setItem("token", response.data.token);

      router.push("/");
    } catch (err) {
      setError(err.response?.data?.error || "Error en las credenciales.");
    } finally {
      setLoading(false); // Desactiva el indicador de carga al terminar
    }
  };

  const navigateToRegister = () => {
    router.push("/auth/register");
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-lg p-6 w-full max-w-sm"
      >
        <h2 className="text-2xl text-black font-bold text-center mb-4">Iniciar Sesión</h2>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <input
          type="text"
          name="identifier"
          placeholder="Nombre de usuario o correo"
          value={formData.identifier}
          onChange={handleChange}
          className="w-full px-4 py-2 mb-4 text-black border rounded-lg"
          required
        />

        <div className="relative mb-4">
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Contraseña"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-2 text-black border rounded-lg"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-3 flex items-center text-gray-600 hover:text-gray-900 focus:outline-none"
          >
            {showPassword ? (
              <EyeSlashIcon className="w-5 h-5" />
            ) : (
              <EyeIcon className="w-5 h-5" />
            )}
          </button>
        </div>

        <button
          type="submit"
          disabled={loading} // Desactiva el botón mientras carga
          className={`w-full flex justify-center items-center bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 ${
            loading ? "opacity-75 cursor-not-allowed" : ""
          }`}
        >
          {loading ? (
            <FaSpinner className="animate-spin text-white w-5 h-5" />
          ) : (
            "Iniciar Sesión"
          )}
        </button>
      </form>

      <div className="mt-4">
        <p className="text-gray-600 text-center">
          ¿No tienes una cuenta?{" "}
          <button
            onClick={navigateToRegister}
            className="text-blue-600 font-bold hover:underline"
          >
            Regístrate
          </button>
        </p>
      </div>
    </div>
  );
}
