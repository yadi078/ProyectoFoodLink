import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contacto - FoodLink",
  description:
    "Contáctanos si tienes preguntas o necesitas ayuda. Estamos aquí para ayudarte.",
};

export default function ContactoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

