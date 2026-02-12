import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact | Nur Mohammad",
  description: "Get in touch with Nur Mohammad for web development, WordPress design, security services, or automation projects.",
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
