import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getTeamMembers } from "../../../services/ourTeamPage.service";
import { getHomePages } from "../../../services/homePage.service";

import defaultImg from "../../../assets/images/default_image.png";

export default function HomeOurTeamSection() {
  const [team, setTeam] = useState([]);
  const [section, setSection] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const BASE_URL = (import.meta.env.VITE_IMAGE_URL || "").replace(/\/$/, "");
  const langId = Number(localStorage.getItem("language_id")) || 1;

  // ================= SHUFFLE =================
  const shuffle = (arr) => {
    return [...arr].sort(() => Math.random() - 0.5);
  };

  // ================= FETCH =================
  const fetchData = async () => {
    try {
      setLoading(true);

      const [teamRes, homeRes] = await Promise.all([
        getTeamMembers(),
        getHomePages(),
      ]);

      // ================= SECTION =================
      const homeList = Array.isArray(homeRes?.data)
        ? homeRes.data
        : homeRes?.data?.data || [];

      const teamSection = homeList.find(
        (h) =>
          h.section_name?.toLowerCase().includes("team") &&
          Number(h.language_id) === langId &&
          h.is_active,
      );

      setSection(teamSection || null);

      // ================= TEAM =================
      const teamList = Array.isArray(teamRes?.data)
        ? teamRes.data
        : teamRes?.data?.data || [];

      const filtered = teamList.filter((m) => Number(m.language_id) === langId);

      setTeam(shuffle(filtered));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    // AUTO REFRESH (RESHUFFLE ONLY)
    const interval = setInterval(() => {
      setTeam((prev) => shuffle(prev));
    }, 8000); // After 8 Second

    // LANGUAGE CHANGE
    const handleLang = () => fetchData();
    window.addEventListener("languageChanged", handleLang);

    return () => {
      clearInterval(interval);
      window.removeEventListener("languageChanged", handleLang);
    };
  }, []);

  // ================= LOADING =================
  if (loading) {
    return (
      <div className="py-20 flex justify-center">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <section
      className="
        py-20
        bg-gradient-to-b
        from-cyan-50
        to-cyan-100
      "
    >
      {/* ================= HEADER ================= */}
      <div className="text-center max-w-3xl mx-auto mb-12 px-4">
        <h2 className="text-4xl font-bold text-gray-900">
          {section?.section_title || "Our Team"}
        </h2>

        <p className="text-gray-600 mt-3">{section?.section_description}</p>

        <button
          onClick={() => navigate("/our-team")}
          className="mt-6 text-blue-600 font-semibold hover:underline"
        >
          See All →
        </button>
      </div>

      {/* ================= ONLY 3 CARDS ================= */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {team.slice(0, 3).map((member) => (
            <div
              key={member.team_member_id}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl transition p-6 text-center"
            >
              {/* IMAGE */}
              <div className="flex justify-center -mt-12">
                <img
                  src={
                    member.member_photo
                      ? BASE_URL + member.member_photo
                      : defaultImg
                  }
                  onError={(e) => (e.target.src = defaultImg)}
                  className="w-24 h-24 rounded-full object-cover border-4 border-white shadow"
                />
              </div>

              {/* INFO */}
              <h3 className="mt-4 text-lg font-bold text-gray-800">
                {member.member_full_name}
              </h3>

              <p className="text-sm text-blue-600 font-semibold mt-1">
                {member.member_position}
              </p>

              <p className="text-gray-500 text-sm mt-4 line-clamp-4">
                {member.member_biography}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
