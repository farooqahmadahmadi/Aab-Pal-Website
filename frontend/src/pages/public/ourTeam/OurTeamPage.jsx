import { useEffect, useState, useRef } from "react";
import { getTeamMembers } from "../../../services/ourTeamPage.service";
import { getHomePages } from "../../../services/homePage.service";
import Herobackground from "../../../assets/images/testimonials.jpg";

export default function OurTeamPage() {
  // ================= STATES =================
  const [team, setTeam] = useState([]);
  const [hero, setHero] = useState(null);
  const [loading, setLoading] = useState(true);

  const [expandedId, setExpandedId] = useState(null);

  const BASE_URL = import.meta.env.VITE_IMAGE_URL;

  const getLanguageId = () => Number(localStorage.getItem("language_id")) || 1;

  const [languageId] = useState(getLanguageId());

  const containerRef = useRef(null);

  // ================= OUTSIDE CLICK =================
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setExpandedId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ================= FETCH =================
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [teamRes, homeRes] = await Promise.all([
          getTeamMembers(),
          getHomePages(),
        ]);

        const teamList = Array.isArray(teamRes) ? teamRes : teamRes?.data || [];

        const homeList = Array.isArray(homeRes) ? homeRes : homeRes?.data || [];

        const heroSection = homeList.find(
          (h) =>
            h.is_active &&
            Number(h.language_id) === Number(languageId) &&
            h.section_name?.toLowerCase().includes("team"),
        );

        setHero(heroSection || null);

        const filtered = teamList.filter(
          (m) => Number(m.language_id) === Number(languageId),
        );

        const shuffled = [...filtered].sort(() => Math.random() - 0.5);

        setTeam(shuffled);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [languageId]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100">
      {/* HERO */}
      <section
        className="w-full min-h-screen flex items-center justify-center px-4 text-center text-white relative"
        style={{
          backgroundImage: hero?.section_image
            ? `url(${BASE_URL + hero.section_image})`
            : `url(${Herobackground})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/60" />

        <div className="relative z-10 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-extrabold">
            {hero?.section_title || "Our Team"}
          </h1>

          <p className="mt-4 text-gray-200 text-sm md:text-base">
            {hero?.section_description}
          </p>
        </div>
      </section>

      {/* TEAM */}
      <section ref={containerRef} className="max-w-7xl mx-auto px-4 py-20">
        {loading && (
          <p className="text-center text-gray-500">Loading team...</p>
        )}

        {!loading && team.length === 0 && (
          <p className="text-center text-gray-500">No team members found.</p>
        )}

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-24">
          {team.map((member) => {
            const isOpen = expandedId === member.team_member_id;

            return (
              <div
                key={member.team_member_id}
                className="relative bg-white/70 backdrop-blur-xl border border-white/40 rounded-3xl shadow-lg hover:shadow-2xl transition duration-300 hover:-translate-y-2"
              >
                {/* AVATAR */}
                <div className="flex justify-center">
                  <img
                    src={
                      member.member_photo
                        ? BASE_URL + member.member_photo
                        : "https://via.placeholder.com/150"
                    }
                    className="w-36 h-36 -mt-16 rounded-full object-cover border-4 border-white shadow-2xl"
                  />
                </div>

                {/* CONTENT */}
                <div className="p-6 text-center">
                  <h3 className="text-xl font-bold text-gray-800">
                    {member.member_full_name}
                  </h3>

                  <p className="text-blue-600 text-sm font-semibold mt-1">
                    {member.member_position}
                  </p>

                  {/* ✅ ONLY CHANGE: JUSTIFY ADDED */}
                  <p
                    className={`
                      text-gray-500
                      text-sm
                      mt-4
                      leading-7
                      text-justify
                      transition-all duration-300
                      ${isOpen ? "" : "line-clamp-4"}
                    `}
                  >
                    {member.member_biography}
                  </p>

                  {member.member_biography?.length > 120 && (
                    <button
                      onClick={() =>
                        setExpandedId(isOpen ? null : member.team_member_id)
                      }
                      className="mt-4 text-sm text-blue-600 font-semibold hover:underline"
                    >
                      {isOpen ? "Show Less" : "Read More"}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
