"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();

  const handleStart = () => {
    // Inicializar el almacenamiento local si es necesario
    localStorage.setItem("respuestas", JSON.stringify({}));
    router.push("/formulario");
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-10 bg-gray-100">
      <h1 className="text-4xl font-bold mb-6 text-black">Evaluación energética de tu hogar</h1>
      <p className="text-lg text-center mb-10 text-black">
        Haz clic en el botón para comenzar el formulario de evaluación.
      </p>
      <button
        onClick={handleStart}
        className="px-6 py-3 bg-blue-500 text-white rounded-md text-lg hover:bg-blue-600"
      >
        Ir al Formulario
      </button>
    </main>
  );
}
