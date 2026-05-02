import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

// Components
import PublicNavbar from "../components/Public/Navbar";
import Footer from "../components/Public/Footer";

export default function PublicLayout({ children }) {
  const { i18n } = useTranslation();
  const [dir, setDir] = useState("ltr");

  useEffect(() => {
    const currentDir =
      i18n.language === "fa" || i18n.language === "ps" ? "rtl" : "ltr";

    setDir(currentDir);
    document.documentElement.dir = currentDir;
  }, [i18n.language]);

  return (
    <div
      className={`min-h-screen flex flex-col bg-gray-50 ${
        dir === "rtl" ? "rtl" : "ltr"
      }`}
    >
      {/* ===== NAVBAR ===== */}
      <header className="sticky top-0 z-50 bg-white shadow-sm print:hidden">
        <PublicNavbar />
      </header>

      {/* ===== MAIN ===== */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-4">
        {children}
      </main>

      {/* ===== FOOTER ===== */}
      <Footer />
    </div>
  );
}
