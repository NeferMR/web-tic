"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Markdown from "react-markdown";

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
  const [chatMessages, setChatMessages] = useState<string[]>([]);
  const router = useRouter();

  useEffect(() => {
    const storedRespuestas = localStorage.getItem("respuestas");
    if (storedRespuestas) {
      const parsedRespuestas: Record<number, number> =
        JSON.parse(storedRespuestas);
      setRespuestas(parsedRespuestas);

      const totalRespuestas = Object.values(parsedRespuestas).reduce(
        (acc: number, val: number) => acc + (5 - val),
        0
      );
      const promedioCalculado =
        totalRespuestas / Object.keys(parsedRespuestas).length;
      setPromedio(promedioCalculado);

      const { letra, color } = obtenerCalificacion(promedioCalculado);
      setCalificacion(letra);
      setCalificacionColor(color);

      const respuestasTexto = Object.values(parsedRespuestas)
        .map((respuesta, index) => {
          return `${preguntas[index].pregunta}: ${preguntas[index].opciones[respuesta]}`;
        })
        .join(", ");
      obtenerAnalisisDelBot(respuestasTexto);
    }
  }, []);

  const obtenerAnalisisDelBot = async (respuestasTexto: string) => {
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [
            { role: "system", content: "Eres un asistente útil que analiza propiedades,  damela salida de texto sin formato." },
            {
              role: "user",
              content: `Las calificaciones fueron: ${respuestasTexto}. Proporcióname un análisis detallado de los resultados en texto plano, damela salida de texto sin formato.`,
            },
          ],
        }),
      });
  
      if (!response.ok) {
        console.error("Error en la respuesta del servidor:", await response.text());
        setChatMessages(["Hubo un problema al procesar la solicitud."]);
        return;
      }
  
      const contentType = response.headers.get("Content-Type") || "";
      let rawText = "";
  
      if (contentType.includes("application/json")) {
        const data = await response.json();
        rawText = data.text || "No se pudo obtener un análisis del chatbot.";
      } else {
        rawText = await response.text();
      }
  
      // Limpiar y formatear la respuesta
      const cleanedText = rawText
        .split("\n") // Dividir en líneas
        .filter((line) => line.trim() !== "") // Eliminar líneas vacías
        .join("\n"); // Unir nuevamente en un bloque de texto
  
      setChatMessages([cleanedText]); // Guardar en el estado
    } catch (error) {
      console.error("Error al enviar los datos al chatbot:", error);
      setChatMessages(["Ocurrió un error al conectar con el chatbot."]);
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
      <h1 className="text-3xl font-semibold mb-4 text-center">
        Análisis de Resultados
      </h1>

      <div className="w-full max-w-lg mb-6 text-center">
        <div className="relative h-8 rounded-full overflow-hidden bg-gradient-to-r from-red-500 via-yellow-500 to-green-500">
          <div
            className="absolute top-0 h-full w-1"
            style={{
              left: `${(promedio - 1) * 25}%`,
              backgroundColor: "black",
            }}
          ></div>
        </div>
        <p className={`text-center mt-2 text-xl font-bold ${calificacionColor}`}>
          Calificación: {calificacion}
        </p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
        {preguntas.map((pregunta) => (
          <div
            key={pregunta.id}
            className="mb-4 border-b border-gray-200 pb-2 text-center"
          >
            <h2 className="text-lg font-semibold mb-1">{pregunta.pregunta}</h2>
            <p className="text-black">Respuesta: {getResultado(pregunta.id)}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 bg-gray-100 p-6 rounded-lg shadow-lg w-full max-w-lg">
  <h2 className="text-xl font-semibold mb-4 text-center">Análisis del Chatbot</h2>
  <div className="bg-white p-4 rounded-lg shadow-lg overflow-y-auto max-h-96">
    {chatMessages.length === 0 ? (
      <p className="text-center text-gray-500">Cargando análisis...</p>
    ) : (
      chatMessages.map((message, index) => (
        <div key={index} className="mb-4">
          <Markdown className="prose text-black">{message}</Markdown>
        </div>
      ))
    )}
  </div>
</div>


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
