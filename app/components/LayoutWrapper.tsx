"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Check if current path starts with /admin or /client
  const isBackend =
    pathname.startsWith("/admin/") || pathname.startsWith("/client/");

  return (
    <>
      {!isBackend && <Navbar />}
      <main>{children}</main>
      {!isBackend && <Footer />}
    </>
  );
}
