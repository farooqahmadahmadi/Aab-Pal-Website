import React, { useEffect, useState } from "react";
import { getCompany } from "../../services/companyService";
import {
  FiInbox,
  FiMail,
  FiMap,
  FiMapPin,
  FiPaperclip,
  FiPhoneCall,
} from "react-icons/fi";

export default function ReportFooter() {
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

  return (
    <div className="w-full text-center text-[11px] text-sky-700 font-semibold border-t pt-2">
      <div className="flex flex-wrap justify-center gap-3">
        {company?.company_phone && (
          <span className="flex gap-1 ">
            <FiPhoneCall size={14} />
            {company.company_phone}
          </span>
        )}

        {company?.company_email && (
          <span className="flex gap-1">
            <FiMail size={14} /> {company.company_email}
          </span>
        )}

        {company?.company_address && (
          <span className=" flex gap-1">
            <FiMapPin size={14} /> {company.company_address}
          </span>
        )}
      </div>
    </div>
  );
}
