import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import PublicNavbar from "../components/Public/Navbar";
import Footer from "../components/Public/Footer";

export default function PublicLayout({ children }) {
  const { i18n } = useTranslation();
  const [dir, setDir] = useState("ltr");

  // ================= RTL / LTR =================
  useEffect(() => {
    const currentDir =
      i18n.language === "fa" || i18n.language === "ps" ? "rtl" : "ltr";

    setDir(currentDir);

    document.documentElement.dir = currentDir;
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  return (
    <div
      className={`
        min-h-screen
        flex flex-col
        bg-gray-50
        text-gray-800
        overflow-x-hidden
        ${dir}
      `}
    >
      {/* ================= NAVBAR ================= */}
      <header className="print:hidden w-full">
        <PublicNavbar />
      </header>

      {/* ================= MAIN ================= */}
      <main className="flex-1 w-svw">
      
          {children}
        
      </main>

      {/* ================= FOOTER ================= */}
      <footer className="w-full">
        <Footer />
      </footer>
    </div>
  );
}