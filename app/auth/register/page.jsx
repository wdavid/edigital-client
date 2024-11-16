"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "../../api/utils/api";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    fechaNacimiento: "",
    metaconsumo: 0,
    password: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter(); // Para redirigir al usuario

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Convertir metaconsumo a número si corresponde
    setFormData({
      ...formData,
      [name]: name === "metaconsumo" ? Number(value) : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validaciones simples
    if (!formData.username || !formData.email || !formData.fechaNacimiento || !formData.password) {
      setError("Por favor, completa todos los campos.");
      return;
    }

    if (formData.metaconsumo <= 0) {
      setError("La meta de consumo debe ser un valor positivo.");
      return;
    }

    try {
      const response = await api.post("/auth/register", formData);

      setSuccess("Usuario registrado exitosamente. Redirigiendo al inicio de sesión...");
      setTimeout(() => {
        router.push("/auth/login"); // Redirige al login tras unos segundos
      }, 2000); // Espera 2 segundos antes de redirigir

      // Limpia el formulario tras un registro exitoso
      setFormData({
        username: "",
        email: "",
        fechaNacimiento: "",
        metaconsumo: 0,
        password: "",
      });
    } catch (err) {
      console.error("Error en el registro:", err);
      setError(err.response?.data?.error || "Algo salió mal.");
    }
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

        <input
          type="text"
          name="username"
          placeholder="Nombre de usuario"
          value={formData.username}
          onChange={handleChange}
          className="w-full px-4 text-gray-700 py-2 mb-4 border rounded-lg focus:ring focus:ring-blue-300"
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Correo electrónico"
          value={formData.email}
          onChange={handleChange}
          className="w-full px-4 text-gray-700 py-2 mb-4 border rounded-lg focus:ring focus:ring-blue-300"
          required
        />

        <input
          type="date"
          name="fechaNacimiento"
          placeholder="Fecha de Nacimiento"
          value={formData.fechaNacimiento}
          onChange={handleChange}
          className="w-full px-4 text-gray-700 py-2 mb-4 border rounded-lg focus:ring focus:ring-blue-300"
          required
        />

        <input
          type="number"
          name="metaconsumo"
          placeholder="Meta de Consumo (Litros)"
          value={formData.metaconsumo}
          onChange={handleChange}
          className="w-full px-4 text-gray-700 py-2 mb-4 border rounded-lg focus:ring focus:ring-blue-300"
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Contraseña"
          value={formData.password}
          onChange={handleChange}
          className="w-full px-4 text-gray-700 py-2 mb-4 border rounded-lg focus:ring focus:ring-blue-300"
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 active:bg-blue-800 transition"
        >
          Registrarse
        </button>
      </form>
    </div>
  );
}
