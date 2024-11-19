"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Doughnut, Line } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement } from "chart.js";
import { isTokenValid, getToken, getUserIdFromToken, fetchAuthenticatedUser } from "../utils/auth";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement);

const fetchUserConsumption = async (url, token) => {
  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching data from ${url}:`, error);
    return null;
  }
};

/*const sendConfigToArduino = async (userId, token) => {
  try {
    const response = await axios.post("http://arduino.local/api/config", {
      userId,
      token,
    });
    alert("Configuración enviada al Arduino exitosamente.");
  } catch (error) {
    console.error("Error enviando configuración al Arduino:", error);
    alert("Error al enviar configuración al Arduino.");
  }
};*/
export default function WelcomePage() {
  //const [vasos, setVasos] = useState(0);
  const [volumen, setVolumen] = useState(0);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [weeklyData, setWeeklyData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [view, setView] = useState("daily");
  const router = useRouter();

  const logout = () => {
    localStorage.removeItem("token");
    router.push("/auth/login");
  };

  useEffect(() => {
    const fetchData = async () => {
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

      const dailyData = await fetchUserConsumption(
        `https://edigital-service.vercel.app/api/post/daily/${userId}`,
        token
      );

      const weeklyData = await fetchUserConsumption(
        `https://edigital-service.vercel.app/api/post/weekly/${userId}`,
        token
      );

      const monthlyData = await fetchUserConsumption(
        `https://edigital-service.vercel.app/api/post/monthly/${userId}`,
        token
      );

      if (dailyData) {
        setVolumen(dailyData.totalVolumen || 0);
        setUser(dailyData.user || null);
      }

      setWeeklyData(weeklyData?.weeklyConsumption || []);
      setMonthlyData(monthlyData?.monthlyConsumption || []);
      setLoading(false);
    };

    fetchData();
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-blue-50">
        <p className="text-xl text-gray-700">Cargando...</p>
      </div>
    );
  }

  const dailyChartData = {
    labels: ["Consumido", "Restante"],
    datasets: [
      {
        data: [volumen, Math.max(user?.metaconsumo - volumen, 0)],
        backgroundColor: ["#3b82f6", "#e5e7eb"],
        hoverBackgroundColor: ["#2563eb", "#d1d5db"],
      },
    ],
  };

  const weeklyChartData = {
    labels: weeklyData.map((item) => item.dayOfWeek),
    datasets: [
      {
        label: "Litros",
        data: weeklyData.map((item) => item.totalVolumen),
        borderColor: "#3b82f6",
        backgroundColor: "rgba(59, 130, 246, 0.2)",
        tension: 0.3,
      },
    ],
  };

  const monthlyChartData = {
    labels: monthlyData.map((item) => `Día ${item.day}`),
    datasets: [
      {
        label: "Litros",
        data: monthlyData.map((item) => item.totalVolumen),
        borderColor: "#10b981",
        backgroundColor: "rgba(16, 185, 129, 0.2)",
        tension: 0.3,
      },
    ],
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-blue-50">
      <div className="bg-white shadow-lg rounded-lg p-6 md:p-10 w-11/12 md:w-1/2 text-center">
        <h1 className="text-3xl font-bold text-blue-600 mb-2">
          ¡Bienvenido, {user?.username || "Usuario"}!
        </h1>
        <div className="flex flex-col items-center">
          <img src="/logo.png" alt="logo" className="w-20" />
        </div>
        <p className="text-base text-gray-700 font-bold">Correo: <span className="font-normal">{user?.email}</span></p>
        <p className="text-base text-gray-700 font-bold">
          Meta de consumo diaria: <span className="font-normal">{user?.metaconsumo} Litros</span>
        </p>
        <p className="text-base text-gray-700 mb-6 font-bold">Litros consumidos hoy: <span className="font-normal">{volumen} Litros</span></p>

        <div className="flex justify-center gap-4 mb-6">
          <button
            onClick={() => setView("daily")}
            className={`px-4 py-1 rounded-lg ${view === "daily" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"}`}
          >
            Diario
          </button>
          <button
            onClick={() => setView("weekly")}
            className={`px-4 py-1 rounded-lg ${view === "weekly" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"}`}
          >
            Semanal
          </button>
          <button
            onClick={() => setView("monthly")}
            className={`px-4 py-1 rounded-lg ${view === "monthly" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"}`}
          >
            Mensual
          </button>
        </div>

        {view === "daily" && (
          <div className="flex flex-col items-center">
            <div className="flex justify-center w-60">
              <Doughnut data={dailyChartData} />
            </div>
          </div>
        )}

        {view === "weekly" && (
          <div className="flex justify-center">
            <Line data={weeklyChartData} />
          </div>
        )}

        {view === "monthly" && (
          <div className="flex justify-center">
            <Line data={monthlyChartData} />
          </div>
        )}

        <div className="space-x-3">
          <button
            onClick={() => sendConfigToArduino(user?._id, getToken())}
            className="bg-green-500 text-white px-6 py-2 mt-6 rounded-lg hover:bg-green-600 transition"
          >
            Configurar Arduino
          </button>

          <button
            onClick={logout}
            className="bg-red-500 text-white px-6 py-2 mt-6 rounded-lg hover:bg-red-600 transition"
          >
            Cerrar sesión
          </button>
        </div>
      </div>
    </div>
  );
}
