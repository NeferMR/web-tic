"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useChat } from "ai/react";
import Markdown from "react-markdown";
import { SendIcon, SquareIcon } from "lucide-react";
import Image from "next/image";

interface Pregunta {
  id: number;
  pregunta: string;
  descripcion?: string;
  opciones: string[];
}

interface Pregunta {
  id: number;
  pregunta: string;
  descripcion?: string;
  opciones: string[];
}

const preguntas: Pregunta[] = [
  {
    id: 0,
    pregunta: "Orientación Solar",
    descripcion:
      "Evalúa la orientación de la propiedad en relación con el sol, lo que afecta la iluminación natural y el confort térmico.",
    opciones: [
      "Orientación óptima (sur en el hemisferio norte, norte en el hemisferio sur) que maximiza la luz natural y reduce la necesidad de calefacción/refrigeración.",
      "Buena orientación, pero con ligeras desventajas.",
      "Orientación media que podría requerir ajustes para optimizar la luz natural.",
      "Orientación deficiente que requiere iluminación artificial significativa o tiene problemas térmicos.",
      "Orientación que resulta en problemas graves de iluminación y temperatura.",
    ],
  },
  {
    id: 1,
    pregunta: "Calidad de Materiales",
    descripcion:
      "Evalúa la durabilidad, eficiencia energética, y sostenibilidad de los materiales utilizados en la construcción.",
    opciones: [
      "Uso de materiales de alta calidad, sostenibles y de larga durabilidad.",
      "Materiales buenos, pero con algunas limitaciones en sostenibilidad o durabilidad.",
      "Materiales estándar que cumplen con las normativas mínimas.",
      "Materiales de calidad inferior, con posibles problemas de durabilidad.",
      "Materiales de mala calidad, que podrían necesitar reemplazo o reparación.",
    ],
  },
  {
    id: 2,
    pregunta: "Instalaciones Eléctricas",
    descripcion:
      "Verifica la seguridad, eficiencia y capacidad de las instalaciones eléctricas.",
    opciones: [
      "Sistema eléctrico moderno y eficiente, con buena capacidad y cumplimiento de todas las normativas.",
      "Instalaciones en buen estado, con pequeñas limitaciones en capacidad o eficiencia.",
      "Instalaciones aceptables, pero con riesgo de necesitar actualización.",
      "Sistema antiguo o con problemas menores de seguridad o capacidad.",
      "Instalaciones deficientes que representan un riesgo significativo.",
    ],
  },
  {
    id: 3,
    pregunta: "Medidas Estandarizadas y Espacios",
    descripcion:
      "Evaluación de si los espacios cumplen con los estándares modernos de comodidad y funcionalidad.",
    opciones: [
      "Medidas amplias y bien distribuidas, con buena funcionalidad de los espacios.",
      "Espacios adecuados, con ligeras limitaciones en distribución.",
      "Medidas estándar, aceptables, pero con limitaciones en comodidad.",
      "Espacios reducidos o mal distribuidos.",
      "Medidas inadecuadas que dificultan la habitabilidad.",
    ],
  },
  {
    id: 4,
    pregunta: "Ventilación y Circulación del Aire",
    descripcion:
      "Evaluación de la calidad del aire y la ventilación natural de la propiedad.",
    opciones: [
      "Excelente circulación de aire y buena ventilación natural, sin necesidad de sistemas de ventilación mecánica.",
      "Buena ventilación con alguna necesidad de apoyo mecánico.",
      "Ventilación aceptable pero que podría mejorarse con sistemas adicionales.",
      "Ventilación deficiente que requiere intervención mecánica constante.",
      "Mala ventilación, con riesgo de humedad o mala calidad del aire.",
    ],
  },
  {
    id: 5,
    pregunta: "Eficiencia Energética",
    descripcion:
      "Medida de la capacidad de la propiedad para conservar energía y minimizar los costos energéticos.",
    opciones: [
      "Propiedad con excelente eficiencia energética, bajo consumo y uso de energías renovables.",
      "Buena eficiencia energética con algunas áreas de mejora.",
      "Eficiencia energética estándar, que cumple con las normativas mínimas.",
      "Baja eficiencia energética, con altos costos operativos.",
      "Propiedad con deficiencias energéticas graves y altos costos.",
    ],
  },
];

export default function Formulario() {
  const [indice, setIndice] = useState<number>(0);
  const [respuestas, setRespuestas] = useState<Record<number, number>>({});
  const [error, setError] = useState<string | null>(null);
  const [mensaje, setMensaje] = useState<string>("");
  const [chatMessages, setChatMessages] = useState<string[]>([]);
  const [mostrarChat, setMostrarChat] = useState(false); // Estado para mostrar u ocultar el chatbot
  const router = useRouter();

  // Lógica del Chatbot (de Código 2)
  const { messages, input, handleInputChange, handleSubmit, isLoading, stop } = useChat({
    api: "api/chat",
  });

  const handleChange = (opcionIndex: number) => {
    const updatedRespuestas = { ...respuestas, [indice]: opcionIndex };
    setRespuestas(updatedRespuestas);
    setError(null); // Limpiar el mensaje de error si el usuario selecciona una respuesta
    localStorage.setItem("respuestas", JSON.stringify(updatedRespuestas));
  };

  const siguientePregunta = () => {
    if (respuestas[indice] === undefined) {
      setError("Por favor, selecciona una respuesta antes de continuar.");
    } else {
      setIndice(indice + 1);
      setError(null); // Limpiar el mensaje de error al avanzar
    }
  };

  const anteriorPregunta = () => {
    if (indice > 0) setIndice(indice - 1);
  };

  const handleFormularioSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    localStorage.setItem("respuestas", JSON.stringify(respuestas));
    router.push("/resultado");
  };

  const enviarMensaje = () => {
    if (mensaje.trim() === "") return; // No enviar mensajes vacíos
    setChatMessages([...chatMessages, `Tú: ${mensaje}`]); // Agregar el mensaje al chat
    setMensaje(""); // Limpiar el campo de entrada
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Mostrar el formulario inicialmente */}
      {!mostrarChat && (
        <div className="flex justify-center items-center flex-1">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-screen-2xl w-full">
            <h1 className="text-xl font-semibold mb-4 text-black">
              Pregunta {indice + 1} de {preguntas.length}
            </h1>
            <form onSubmit={handleFormularioSubmit} className="flex flex-col">
              <div className="mb-4">
                <p className="block text-black mb-2 text-3xl font-semibold">
                  {preguntas[indice].pregunta}
                </p>
                <p className="block text-black mb-2 text-xl border-b border-gray-200 pb-2">
                  {preguntas[indice].descripcion}
                </p>
                {preguntas[indice].opciones.map((opcion, idx) => (
                  <div key={idx} className="mb-2">
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name={`pregunta-${indice}`}
                        value={opcion}
                        checked={respuestas[indice] === idx}
                        onChange={() => handleChange(idx)}
                        className="form-radio text-blue-500"
                        required
                      />
                      <span className="ml-2 text-black">{opcion}</span>
                    </label>
                  </div>
                ))}
              </div>

              {error && <p className="text-red-500 mb-4">{error}</p>}

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={anteriorPregunta}
                  className={`px-4 py-2 rounded-md ${
                    indice === 0 ? "bg-gray-300" : "bg-blue-500 text-white"
                  }`}
                  disabled={indice === 0}
                >
                  Anterior
                </button>

                {indice < preguntas.length - 1 ? (
                  <button
                    type="button"
                    onClick={siguientePregunta}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md"
                  >
                    Siguiente
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="px-4 py-2 bg-green-500 text-white rounded-md"
                  >
                    Enviar
                  </button>
                )}
              </div>
            </form>

            {/* Botón para abrir el chat */}
            <div className="mt-4 text-center">
              <button
                onClick={() => setMostrarChat(true)}
                className="px-4 py-2 bg-blue-500 text-white rounded-md"
              >
                ¿Necesitas ayuda? Utiliza nuestro chatbot
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mostrar chat y formulario juntos si se ha activado el chatbot */}
      {mostrarChat && (
        <div className="flex flex-col flex-1">
          <div className="h-1/2 p-8 bg-gray-100 overflow-y-auto">
            <h1 className="text-xl font-semibold mb-4 text-black">
              Pregunta {indice + 1} de {preguntas.length}
            </h1>
            <form onSubmit={handleFormularioSubmit} className="flex flex-col">
              <div className="mb-4">
                <p className="block text-black mb-2 text-3xl font-semibold">
                  {preguntas[indice].pregunta}
                </p>
                <p className="block text-black mb-2 text-xl border-b border-gray-200 pb-2">
                  {preguntas[indice].descripcion}
                </p>
                {preguntas[indice].opciones.map((opcion, idx) => (
                  <div key={idx} className="mb-2">
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name={`pregunta-${indice}`}
                        value={opcion}
                        checked={respuestas[indice] === idx}
                        onChange={() => handleChange(idx)}
                        className="form-radio text-blue-500"
                        required
                      />
                      <span className="ml-2 text-black">{opcion}</span>
                    </label>
                  </div>
                ))}
              </div>

              {error && <p className="text-red-500 mb-4">{error}</p>}

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={anteriorPregunta}
                  className={`px-4 py-2 rounded-md ${
                    indice === 0 ? "bg-gray-300" : "bg-blue-500 text-white"
                  }`}
                  disabled={indice === 0}
                >
                  Anterior
                </button>

                {indice < preguntas.length - 1 ? (
                  <button
                    type="button"
                    onClick={siguientePregunta}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md"
                  >
                    Siguiente
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="px-4 py-2 bg-green-500 text-white rounded-md"
                  >
                    Enviar
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Chat */}
          <div className="h-1/2 p-8 bg-gray-200 flex flex-col">
            <h2 className="text-xl font-semibold mb-4 text-black">Chat</h2>

            <div className="bg-white p-4 rounded-lg shadow-lg flex-1 overflow-y-auto mb-4">
              {/* Mensajes del chat */}
              <div className="flex flex-col space-y-4">
                {messages.length === 0 && (
                  <div className="flex flex-col justify-center items-center h-full">
                    <p className="text-lg text-muted-foreground mt-4">
                      Bienvenido al chat, ¿cómo puedo ayudarte?
                    </p>
                  </div>
                )}
                {messages.map((message, idx) => (
                  <div
                    key={idx}
                    className={message.role === "assistant" ? "flex items-start gap-3" : "flex justify-end"}
                  >
                    <div
                      className={`p-2 ${message.role === "assistant" ? "border-gray-700" : "bg-primary"} rounded-full`}
                    >
                    </div>
                    <div
                      className={`p-3 max-w-[70%] rounded-lg ${message.role === "assistant" ? "bg-muted" : "bg-primary"}`}
                    >
                      <Markdown className="text-sm text-muted-foreground">
                        {message.content}
                      </Markdown>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Entrada de mensaje */}
            <div className="flex items-center space-x-2">
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="Escribe un mensaje..."
                value={input}
                onChange={handleInputChange}
              />
              {!isLoading ? (
                <button
                  onClick={handleSubmit}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md"
                >
                  <SendIcon className="w-5 h-5" />
                </button>
              ) : (
                <button
                  onClick={stop}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md"
                >
                  <SquareIcon className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}