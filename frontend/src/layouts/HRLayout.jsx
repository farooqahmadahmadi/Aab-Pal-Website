import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export default function HRLayout({ children }) {
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
      className={`flex h-screen bg-gray-50 print:bg-white ${
        dir === "rtl" ? "flex-row-reverse" : "flex-row"
      }`}
    >
      {/*  hide in print */}
      <div className="print:hidden">
        <Sidebar role="HR" />
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        {/*  hide in print */}
        <div className="print:hidden">
          <Navbar role="HR" />
        </div>

        {/*  report area */}
        <main className="p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
