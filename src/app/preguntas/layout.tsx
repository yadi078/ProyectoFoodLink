import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Preguntas Frecuentes - FoodLink",
  description:
    "Encuentra respuestas a las preguntas más comunes sobre FoodLink, cómo hacer pedidos, registrarse como vendedor y más.",
};

export default function PreguntasLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

