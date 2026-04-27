import React, { useEffect, useState } from "react";
import { getCompany } from "../../services/companyService";

const BASE_URL = import.meta.env.VITE_IMAGE_URL;
// const BASE_URL = import.meta.env.VITE_API_URL;

export default function ReportHeader({ title = "Report" }) {
  const [company, setCompany] = useState(null);

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const res = await getCompany();
        setCompany(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchCompany();
  }, []);

  const logoUrl = company?.company_logo_url
    ? `${BASE_URL}${company.company_logo_url}`
    : "/default-logo.png";

  return (
    <div className="w-full text-center">
      {/* LOGO */}
     
<div className="w-28 h-28 mx-auto flex items-center justify-center overflow-hidden">
  <img
    src={logoUrl}
    alt="logo"
    className="w-28 h-28 object-contain"
    style={{
      objectFit: "contain",
      transform: "translateZ(0)", // 🔥 fixes html2canvas distortion
      WebkitTransform: "translateZ(0)",
    }}
  />
</div>

<div>
      </div>

      {/* COMPANY NAME */}
      <h2 className="text-lg font-bold mt-0">
        {company?.company_name || "Company"}
      </h2>

      {/* TITLE + DATE */}
      <div className="mt-2 border-b pb-2 flex justify-between font-semibold">
        <span className="text-md font-bold">
          <h2>{title}</h2>
        </span>
        <span className="text-xs text-gray-600 ">
          <sapn className="text-blue-700">CC-MIS - </sapn>
          {new Date().toLocaleString()}
        </span>
      </div>
    </div>
  );
}
