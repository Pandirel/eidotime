"use client";
import Logo from "@/app/img/Logo.webp";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";

export default function Clock() {
  const [timeLeft, setTimeLeft] = useState(null);
  const [isDay, setIsDay] = useState(null);
  const [expiry, setExpiry] = useState(null);
  const [loading, setLoading] = useState(true);
  const intervalRef = useRef(null); // Usar un ref para controlar el intervalo
  const apiUpdateIntervalRef = useRef(null); // Ref para el intervalo que actualiza desde la API

  // Función para obtener el ciclo de Cetus desde la API
  const fetchCetusCycle = async () => {
    try {
      const response = await fetch(`https://api.warframestat.us/pc/cetusCycle?language=en`);
      const data = await response.json();

      const newExpiry = new Date(data.expiry).getTime(); // Guardamos el tiempo de expiración como timestamp
      setIsDay(data.isDay); // Guardamos el estado actual de día/noche
      setExpiry(newExpiry); // Guardamos el nuevo expiry

      // Calculamos el tiempo restante solo una vez, y permitimos que el intervalo lo gestione.
      setTimeLeft(calculateTimeLeft(newExpiry));
      setLoading(false);
    } catch (error) {
      console.error("Error fetching Cetus cycle data:", error);
      setLoading(false);
    }
  };

  // Función para calcular el tiempo restante
  const calculateTimeLeft = (expiryTime) => {
    const now = Date.now();
    const distance = expiryTime - now;

    if (distance < 0) {
      return null; // Devolvemos null si ha expirado
    }

    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    return `${hours > 0 ? hours + "h " : ""}${minutes > 0 ? minutes + "m " : ""}${seconds}s`.trim();
  };

  // Efecto para configurar el ciclo inicial y actualizar periódicamente desde la API
  useEffect(() => {
    const initializeCycle = async () => {
      await fetchCetusCycle(); // Hacemos la primera llamada para obtener los datos

      // Actualizamos los datos desde la API cada 60 segundos
      apiUpdateIntervalRef.current = setInterval(() => {
        fetchCetusCycle(); // Llamada periódica para mantener los datos actualizados
      }, 60000); // Cada 60 segundos
    };
    initializeCycle();

    return () => {
      clearInterval(apiUpdateIntervalRef.current); // Limpiamos el intervalo de la API al desmontar
    };
  }, []);

  // Efecto para actualizar el contador cada segundo
  useEffect(() => {
    if (expiry) {
      intervalRef.current = setInterval(() => {
        const timeLeftValue = calculateTimeLeft(expiry);

        if (timeLeftValue === null) {
          // Cuando expira el tiempo, cambiamos el ciclo localmente sin hacer otra llamada a la API
          const nextCycleIsDay = !isDay;
          setIsDay(nextCycleIsDay);

          // Reinicia el temporizador: 100 min día (6000000ms), 50 min noche (3000000ms)
          const newExpiry = Date.now() + (nextCycleIsDay ? 6000000 : 3000000); 
          setExpiry(newExpiry);
          setTimeLeft(calculateTimeLeft(newExpiry));
        } else {
          setTimeLeft(timeLeftValue); // Actualizamos el tiempo restante
        }
      }, 500); // Intervalo de actualización cada 1 segundo

      return () => clearInterval(intervalRef.current); // Limpiamos el intervalo al desmontar
    }
  }, [expiry, isDay]);

  if (loading) {
    return (
      <div className="ClockEido grid justify-center items-center">
        <h1 className="text-center text-2xl font-bold animate-spin h-5 w-5 mr-3"></h1>
      </div>
    );
  }

  return (
    <div className="ClockEido grid justify-center items-center">
      <Image
        priority={true}
        className="Logo items-center justify-center"
        src={Logo}
        alt={"Logo"}
        width={225}
        height={225}
        sizes="100vw"
      />
      <h1
        className={`title text-center text-5xl font-bold ${
          isDay
            ? "text-yellow-500 [text-shadow:_0_2px_5px_#deec64]"
            : "text-blue-500 [text-shadow:_0_2px_5px_#2e8069]"
        }`}
      >
        Cetus Cycle
      </h1>
      <h1 className="countdown text-center py-4">
        {isDay ? "Day expires in " : "Night expires in "}
      </h1>
      <h1 className="text-center text-3xl py-1">{timeLeft}</h1>
    </div>
  );
}
