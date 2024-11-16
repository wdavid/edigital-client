"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { isTokenValid, getToken, getUserIdFromToken, fetchAuthenticatedUser } from "../utils/auth";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

// Registrar componentes necesarios de Chart.js
ChartJS.register(ArcElement, Tooltip, Legend);

// Función para obtener datos del usuario con Axios
const fetchUserConsumption = async (userId, token) => {
  try {
    const response = await axios.get(
      `https://edigital-service.vercel.app/api/post/daily/${userId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const data = response.data;

    if (data.length > 0) {
      const { totalVolumen, totalVasos, user } = data[0];
      return {
        totalLitros: totalVolumen,
        totalVasos,
        user,
      };
    }

    return { totalLitros: 0, totalVasos: 0, user: null };
  } catch (error) {
    console.error("Error fetching user consumption:", error);
    return { totalLitros: 0, totalVasos: 0, user: null };
  }
};

export default function WelcomePage() {
  const [litros, setLitros] = useState(0);
  const [vasos, setVasos] = useState(0);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const validateTokenAndFetchData = async () => {
      const token = getToken();

      if (!isTokenValid(token)) {
        alert("Por favor, inicia sesión.");
        router.push("/auth/login");
        return;
      }

      let userId = getUserIdFromToken();
      if (!userId) {
        const authenticatedUser = await fetchAuthenticatedUser();
        if (!authenticatedUser) {
          alert("No se pudo obtener la información del usuario.");
          router.push("/auth/login");
          return;
        }
        userId = authenticatedUser._id;
        setUser(authenticatedUser);
      }

      const { totalLitros, totalVasos, user: userData } = await fetchUserConsumption(userId, token);
      setLitros(totalLitros);
      setVasos(totalVasos);
      if (!user) setUser(userData);
      setLoading(false);
    };

    validateTokenAndFetchData();
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-blue-50">
        <p className="text-xl text-gray-700">Cargando...</p>
      </div>
    );
  }

  // Configuración de datos para el gráfico
  const progress = vasos; // Vasos consumidos
  const goal = user?.metaconsumo || 0; // Meta diaria de consumo
  const remaining = Math.max(goal - progress, 0); // Vasos restantes para alcanzar la meta

  const data = {
    labels: ["Consumido", "Restante"],
    datasets: [
      {
        data: [progress, remaining],
        backgroundColor: ["#3b82f6", "#e5e7eb"], // Colores para las secciones
        hoverBackgroundColor: ["#2563eb", "#d1d5db"],
      },
    ],
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-blue-50">
      <div className="bg-white shadow-lg rounded-lg p-6 md:p-10 w-11/12 md:w-1/2 text-center">
        <h1 className="text-3xl font-bold text-blue-600 mb-4">
          ¡Bienvenido, {user?.username || "Usuario"}!
        </h1>
        <p className="text-lg text-gray-700 mb-4 font-bold">Correo: <span className="font-normal">{user?.email}</span></p>
        <p className="text-lg text-gray-700 mb-4 font-bold">
          Meta de consumo: <span className="font-normal">{user?.metaconsumo} vasos</span>
        </p>
        <p className="text-lg text-gray-700 mb-4">
          Aquí está tu progreso de hidratación para hoy:
        </p>

        <div className="flex flex-col items-center">
          <div className="flex justify-center items-center w-52 gap-6 mb-4">
            <Doughnut data={data}/>
          </div>
        </div>

        <div className="flex justify-center items-center gap-6 mb-4">
          <div className="flex flex-col items-center">
            <span className="text-4xl font-bold text-blue-600">{litros.toFixed(2)}</span>
            <span className="text-gray-500">Litros</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-4xl font-bold text-blue-600">{vasos}</span>
            <span className="text-gray-500">Vasos</span>
          </div>
        </div>

        <button
          onClick={() => alert("¡Sigue hidratándote!")}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          ¡Mantén el ritmo!
        </button>
      </div>
    </div>
  );
}
