"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline"; // Importa los iconos de Heroicons
import api from "../../api/utils/api";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    fechaNacimiento: "",
    metaconsumo: 0,
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false); // Estado para el indicador de carga
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: name === "metaconsumo" ? Number(value) : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true); // Activa el indicador de carga

    if (!formData.username || !formData.email || !formData.fechaNacimiento || !formData.password) {
      setError("Por favor, completa todos los campos.");
      setLoading(false);
      return;
    }

    if (formData.metaconsumo <= 0) {
      setError("La meta de consumo debe ser un valor positivo.");
      setLoading(false);
      return;
    }

    try {
      await api.post("/auth/register", formData);

      setSuccess("Usuario registrado exitosamente. Redirigiendo al inicio de sesión...");
      setTimeout(() => {
        router.push("/auth/login");
      }, 2000);

      setFormData({
        username: "",
        email: "",
        fechaNacimiento: "",
        metaconsumo: 0,
        password: "",
      });
    } catch (err) {
      const errorMessage = err.response?.data?.error || "Ocurrió un error al registrar el usuario.";
      setError(errorMessage);
    } finally {
      setLoading(false); // Desactiva el indicador de carga
    }
  };

  const navigateToLogin = () => {
    router.push("/auth/login");
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-lg p-6 w-full max-w-sm"
      >
        <h2 className="text-2xl font-bold text-black text-center mb-4">Registro</h2>

        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        {success && <p className="text-green-500 mb-4 text-center">{success}</p>}

        <div className="mb-4">
          <label htmlFor="username" className="block text-gray-700 font-medium text-sm">
            Nombre de usuario:
          </label>
          <input
            id="username"
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="w-full px-4 py-2 text-gray-700 border rounded-lg focus:ring focus:ring-blue-300"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 font-medium text-sm">
            Correo electrónico:
          </label>
          <input
            id="email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 text-gray-700 border rounded-lg focus:ring focus:ring-blue-300"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="fechaNacimiento" className="block text-gray-700 font-medium text-sm">
            Fecha de nacimiento:
          </label>
          <input
            id="fechaNacimiento"
            type="date"
            name="fechaNacimiento"
            value={formData.fechaNacimiento}
            onChange={handleChange}
            className="w-full px-4 py-2 text-gray-700 border rounded-lg focus:ring focus:ring-blue-300"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="metaconsumo" className="block text-gray-700 font-medium text-sm">
            Meta de consumo diario (vasos):
          </label>
          <input
            id="metaconsumo"
            type="number"
            name="metaconsumo"
            min="0.1"
            step="0.1"
            value={formData.metaconsumo}
            onChange={handleChange}
            className="w-full px-4 py-2 text-gray-700 border rounded-lg focus:ring focus:ring-blue-300"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="password" className="block text-gray-700 font-medium text-sm">
            Contraseña:
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 text-black border rounded-lg focus:ring focus:ring-blue-300"
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
        </div>

        <button
          type="submit"
          disabled={loading} // Desactiva el botón mientras carga
          className={`w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 active:bg-blue-800 transition ${
            loading ? "opacity-75 cursor-not-allowed" : ""
          }`}
        >
          {loading ? (
            <svg
              className="animate-spin h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              ></path>
            </svg>
          ) : (
            "Registrarse"
          )}
        </button>
      </form>

      <div className="mt-4">
        <p className="text-gray-600 text-center">
          ¿Ya tienes una cuenta?{" "}
          <button
            onClick={navigateToLogin}
            className="text-blue-600 font-bold hover:underline"
          >
            Volver al inicio de sesión
          </button>
        </p>
      </div>
    </div>
  );
}
