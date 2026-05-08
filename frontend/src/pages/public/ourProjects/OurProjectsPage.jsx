import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getProjects } from "../../../services/ourProjectsPage.service";
import { getHomePages } from "../../../services/homePage.service";

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
    <div className="min-h-screen bg-gray-50">
      {/* HERO */}
      <section
        className="relative py-24 text-center text-white"
        style={{
          backgroundImage: hero?.section_image
            ? `url(${BASE_URL + hero.section_image})`
            : "linear-gradient(135deg,#1e3a8a,#2563eb,#06b6d4)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/60" />

        <div className="relative z-10">
          <h1 className="text-4xl font-bold">
            {hero?.section_title || "Our Projects"}
          </h1>
        </div>
      </section>

      {/* GRID */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        {loading ? (
          <p className="text-center">Loading...</p>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            {projects.map((p) => (
              <div
                key={p.project_id}
                className="bg-white rounded-2xl shadow hover:shadow-xl transition overflow-hidden"
              >
                <img
                  src={
                    p.project_image
                      ? BASE_URL + p.project_image
                      : "https://via.placeholder.com/500"
                  }
                  className="h-56 w-full object-cover"
                />

                <div className="p-5">
                  <h2 className="text-xl font-bold">{p.project_name}</h2>

                  <p className="text-gray-500 text-sm mt-1">
                    {p.project_address}
                  </p>

                  <span className="inline-block mt-3 text-xs px-3 py-1 bg-blue-100 text-blue-600 rounded-full">
                    {p.project_status}
                  </span>

                  <Link
                    to={`/our-projects/${p.project_id}`}
                    className="block mt-4 text-blue-600 font-medium"
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
