"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useChat } from "ai/react"; // Usamos el hook de `useChat`

interface Pregunta {
  id: number;
  pregunta: string;
  opciones: string[];
}

const preguntas: Pregunta[] = [
  {
    id: 0,
    pregunta: "Orientación Solar",
    opciones: ["Óptima", "Buena", "Media", "Deficiente", "Problemas graves"],
  },
  {
    id: 1,
    pregunta: "Calidad de Materiales",
    opciones: ["Alta calidad", "Buena", "Estándar", "Inferior", "Mala"],
  },
  {
    id: 2,
    pregunta: "Instalaciones Eléctricas",
    opciones: [
      "Moderno y eficiente",
      "Buen estado",
      "Aceptable",
      "Antiguo",
      "Deficiente",
    ],
  },
  {
    id: 3,
    pregunta: "Medidas Estandarizadas y Espacios",
    opciones: [
      "Amplias y funcionales",
      "Adecuadas",
      "Estándar",
      "Reducidas",
      "Inadecuadas",
    ],
  },
  {
    id: 4,
    pregunta: "Ventilación y Circulación del Aire",
    opciones: ["Excelente", "Buena", "Aceptable", "Deficiente", "Mala"],
  },
  {
    id: 5,
    pregunta: "Eficiencia Energética",
    opciones: ["Excelente", "Buena", "Estándar", "Baja", "Deficiente"],
  },
];

export default function ResultadoPage() {
  const [respuestas, setRespuestas] = useState<Record<number, number>>({});
  const [promedio, setPromedio] = useState<number>(0);
  const [calificacion, setCalificacion] = useState<string>("");
  const [calificacionColor, setCalificacionColor] =
    useState<string>("text-black");
  const [chatResponse, setChatResponse] = useState<string>(""); // Para almacenar la respuesta del chatbot
  const router = useRouter();

  // Configuración del chat
  const { messages, input, handleInputChange, handleSubmit, isLoading, stop } =
    useChat({
      api: "/api/chat", // Cambiar a la ruta de tu API del chatbot
    });

  useEffect(() => {
    const storedRespuestas = localStorage.getItem("respuestas");
    if (storedRespuestas) {
      const parsedRespuestas: Record<number, number> =
        JSON.parse(storedRespuestas);
      setRespuestas(parsedRespuestas);
      console.log(parsedRespuestas);

      // Calcular el promedio de las respuestas seleccionadas
      const totalRespuestas = Object.values(parsedRespuestas).reduce(
        (acc: number, val: number) => acc + (5 - val), // Invertir el valor
        0
      );
      const numPreguntas = Object.keys(parsedRespuestas).length;
      const promedioCalculado = totalRespuestas / numPreguntas;
      setPromedio(promedioCalculado);

      // Convertir el promedio en una calificación de letra y color
      const { letra, color } = obtenerCalificacion(promedioCalculado);
      setCalificacion(letra);
      setCalificacionColor(color);

      // Crear el texto para enviar al chatbot
      const respuestasTexto = Object.values(parsedRespuestas)
        .map((respuesta, index) => {
          return `${preguntas[index].pregunta}: ${preguntas[index].opciones[respuesta]}`;
        })
        .join(", ");

      // Enviar las respuestas al chatbot
      sendToChatbot(respuestasTexto);
    }
  }, []);

  // Enviar al chatbot usando la estructura de useChat
  const sendToChatbot = async (respuestasTexto: string) => {
    try {
      const response = await handleSubmit(
        `Las calificaciones fueron: ${respuestasTexto}. Proporcióname un análisis de estos resultados.`
      );
      if (response) {
        setChatResponse(response.text); // Guardamos la respuesta del chatbot
      }
    } catch (error) {
      console.error("Error al obtener la respuesta del chatbot:", error);
    }
  };

  const obtenerCalificacion = (
    promedio: number
  ): { letra: string; color: string } => {
    if (promedio >= 4) return { letra: "A", color: "text-green-500" };
    if (promedio >= 3) return { letra: "B", color: "text-lime-500" };
    if (promedio >= 2) return { letra: "C", color: "text-yellow-500" };
    if (promedio >= 1.5) return { letra: "D", color: "text-orange-500" };
    return { letra: "E", color: "text-red-500" };
  };

  const getResultado = (preguntaId: number) => {
    const respuestaId = respuestas[preguntaId];
    if (respuestaId !== undefined) {
      const pregunta = preguntas.find((p) => p.id === preguntaId);
      return pregunta ? pregunta.opciones[respuestaId] : "Sin respuesta";
    }
    return "Sin respuesta";
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-black p-4">
      <h1 className="text-3xl font-semibold mb-4">Análisis de Resultados</h1>

      <div className="w-full max-w-lg mb-6">
        {/* Barra de colores */}
        <div className="relative h-8 rounded-full overflow-hidden bg-gradient-to-r from-red-500 via-yellow-500 to-green-500">
          <div
            className="absolute top-0 h-full w-1"
            style={{
              left: `${(promedio - 1) * 25}%`, // Ajustar la posición del marcador
              backgroundColor: "black",
            }}
          ></div>
        </div>

        {/* Mostrar calificación con color */}
        <p
          className={`text-center mt-2 text-xl font-bold ${calificacionColor}`}
        >
          Calificación: {calificacion}
        </p>
      </div>

      {/* Detalle de respuestas */}
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
        {preguntas.map((pregunta) => (
          <div key={pregunta.id} className="mb-4 border-b border-gray-200 pb-2">
            <h2 className="text-lg font-semibold mb-1">{pregunta.pregunta}</h2>
            <p className="text-black">Respuesta: {getResultado(pregunta.id)}</p>
          </div>
        ))}
      </div>

      {/* Cuadro de respuesta del chatbot */}

      <div className="mt-6 bg-white p-6 rounded-lg shadow-lg w-full max-w-lg border border-gray-200">
        <h2 className="text-lg font-semibold mb-2">Análisis del Chatbot</h2>
        <p className="text-black">{chatResponse}</p>
      </div>

      {/* Botones para volver al formulario o al inicio */}
      <div className="mt-6 flex space-x-4">
        <button
          onClick={() => router.push("/formulario")}
          className="px-4 py-2 bg-blue-500 text-white rounded-md"
        >
          Volver al Formulario
        </button>
        <button
          onClick={() => router.push("/")}
          className="px-4 py-2 bg-gray-500 text-white rounded-md"
        >
          Ir al Inicio
        </button>
      </div>
    </div>
  );
}
