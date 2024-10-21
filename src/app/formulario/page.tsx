"use client";
import { useState, ChangeEvent, FormEvent } from "react";

interface Pregunta {
  id: number;
  pregunta: string;
  descripcion?: string;
  opciones: string[];
}

const preguntas: Pregunta[] = [
  {
    id: 1,
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
    id: 2,
    pregunta: "Calidad de Materiales",
    descripcion:
      "Evalúa la durabilidad, eficiencia energética, y sostenibilidad de los materiales utilizados en la construcción.",
    opciones: [
      "Uso de materiales de alta calidad, sostenibles y de larga durabilidad. (como madera certificada (FSC), bambú, y ladrillos de tierra comprimida, que no solo son renovables, sino que también tienen un ciclo de vida con baja huella de carbono. Además, se considera el uso de materiales reciclados o reciclables, como acero y vidrio reciclados).",
      "Materiales buenos, pero con algunas limitaciones en sostenibilidad o durabilidad. (paneles de yeso reciclado, hormigón con aditivos reciclados, y pinturas con bajo contenido de COV (Compuestos Orgánicos Volátiles).",
      "Materiales estándar que cumplen con las normativas mínimas. (ladrillo estándar y hormigón convencional).",
      "Materiales de calidad inferior, con posibles problemas de durabilidad. (plásticos tradicionales y ciertos tipos de cemento de alto consumo energético).",
      "Materiales de mala calidad, que podrían necesitar reemplazo o reparación. (altos costos ambientales, difícil reciclaje, y alto impacto en la huella de carbono, como PVC y otros plásticos no reciclables).",
    ],
  },
  {
    id: 3,
    pregunta: "Instalaciones Eléctricas",
    descripcion:
      "Verifica la seguridad, eficiencia y capacidad de las instalaciones eléctricas.",
    opciones: [
      "Sistema eléctrico moderno, eficiente, con buena capacidad y cumplimiento de todas las normativas de seguridad.(cableado de alta eficiencia, integración de sistemas de energía renovable (como paneles solares), y uso de dispositivos de bajo consumo energético (certificados ENERGY STAR, por ejemplo). La instalación incluye sistemas de automatización y gestión de energía, como medidores inteligentes, que optimizan el consumo y reducen la carga eléctrica. También, debe contar con protecciones avanzadas, como disyuntores con diferencial y sistemas de supresión de sobretensiones).",
      "Instalaciones en buen estado, con pequeñas limitaciones en capacidad o eficiencia. (cableado moderno y suficiente capacidad para la demanda actual y futura, pero con una integración limitada de energías renovables. Incluye protecciones adecuadas y dispositivos de eficiencia media-alta).",
      "Instalaciones aceptables, pero con riesgo de necesitar actualización.",
      "Sistema antiguo o con problemas menores de seguridad o capacidad.",
      "Instalaciones deficientes que representan un riesgo significativo.",
    ],
  },
  {
    id: 4,
    pregunta: "Medidas Estandarizadas y Espacios",
    descripcion:
      "Evaluación de si los espacios cumplen con los estándares modernos de comodidad y funcionalidad.",
    opciones: [
      "Medidas amplias y bien distribuidas, con buena funcionalidad de los espacios.",
      "Espacios adecuados, con ligeras limitaciones en distribución.",
      "Medidas estándar, aceptables, pero con limitaciones en comodidad. ",
      "Espacios reducidos o mal distribuidos.",
      "Medidas inadecuadas que dificultan la habitabilidad.",
    ],
  },
  {
    id: 5,
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
    id: 6,
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

export default function Home() {
  const [indice, setIndice] = useState<number>(0);
  const [respuestas, setRespuestas] = useState<Record<number, number>>({});

  const handleChange = (opcionIndex: number) => {
    setRespuestas({ ...respuestas, [indice]: opcionIndex });
  };

  const siguientePregunta = () => {
    if (indice < preguntas.length - 1) setIndice(indice + 1);
  };

  const anteriorPregunta = () => {
    if (indice > 0) setIndice(indice - 1);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Respuestas:", respuestas);
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-11/12">
        <h1 className="text-xl font-semibold mb-4">
          Pregunta {indice + 1} de {preguntas.length}
        </h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <p className="block text-gray-700 mb-2 text-3xl font-semibold">
              {preguntas[indice].pregunta}
            </p>
            <p className="block text-gray-700 mb-2 text-xl border-b border-gray-200 pb-2">
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
                  <span className="ml-2">{opcion}</span>
                </label>
              </div>
            ))}
          </div>

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
    </div>
  );
}
