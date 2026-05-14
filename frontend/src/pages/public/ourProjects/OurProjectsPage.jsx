import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getProjects } from "../../../services/ourProjectsPage.service";
import { getHomePages } from "../../../services/homePage.service";
import defaultImg from "../../../assets/images/default_image.png";
import Herobackground from "../../../assets/images/our-projects.webp";

export default function OurProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [hero, setHero] = useState(null);
  const [loading, setLoading] = useState(true);

  const BASE_URL = import.meta.env.VITE_IMAGE_URL;
  const languageId = Number(localStorage.getItem("language_id")) || 1;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [projectsRes, homeRes] = await Promise.all([
          getProjects(),
          getHomePages(),
        ]);

        const list = Array.isArray(projectsRes)
          ? projectsRes
          : projectsRes?.data || [];

        const homeList = Array.isArray(homeRes) ? homeRes : homeRes?.data || [];

        const heroSection = homeList.find(
          (h) =>
            h.is_active &&
            Number(h.language_id) === languageId &&
            h.section_name?.toLowerCase().includes("project"),
        );

        setHero(heroSection || null);

        const filtered = list.filter(
          (p) => Number(p.language_id) === languageId,
        );

        setProjects(filtered);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
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
          <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
            {hero?.section_title || "Our Projects"}
          </h1>

          <p className="text-sm md:text-base text-gray-200 leading-7">
            {hero?.section_description ||
              "Learn more about our projects, goals, and water management solutions."}
          </p>
        </div>
      </section>

      {/* GRID */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((p) => (
              <div
                key={p.project_id}
                className="
                  group
                  bg-white/80
                  backdrop-blur-xl
                  border border-white/40
                  rounded-3xl
                  overflow-hidden
                  shadow-md
                  hover:shadow-2xl
                  transition-all
                  duration-500
                  hover:-translate-y-2
                "
              >
                {/* IMAGE */}
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={
                      p.project_image ? BASE_URL + p.project_image : defaultImg
                    }
                    className="
    w-full
    h-full
    object-cover
    group-hover:scale-110
    transition duration-700
  "
                    onError={(e) => {
                      e.target.src = defaultImg;
                    }}
                  />

                  {/* overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

                  {/* status */}
                  <span
                    className="
                    absolute top-4 left-4
                    text-xs
                    px-3 py-1
                    bg-white/90
                    text-blue-700
                    rounded-full
                    font-semibold
                  "
                  >
                    {p.project_status}
                  </span>
                </div>

                {/* CONTENT */}
                <div className="p-6">
                  <h2 className="text-xl font-bold text-gray-800">
                    {p.project_name}
                  </h2>

                  <p className="text-gray-500 text-sm mt-2">
                    📍 {p.project_address}
                  </p>

                  <Link
                    to={`/our-projects/${p.project_id}`}
                    className="
                      inline-flex
                      items-center
                      gap-2
                      mt-5
                      text-blue-600
                      font-semibold
                      hover:gap-3
                      transition-all
                    "
                  >
                    See Details →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
