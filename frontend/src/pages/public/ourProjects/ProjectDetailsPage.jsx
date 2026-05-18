import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getProject } from "../../../services/ourProjectsPage.service";
import { FiArrowLeft } from "react-icons/fi";

import defaultImg from "../../../assets/images/default_image.png";

export default function ProjectDetailsPage() {
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  const { projectId } = useParams();
  const BASE_URL = import.meta.env.VITE_IMAGE_URL;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getProject(projectId);
        setProject(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [projectId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <p className="text-gray-500 text-lg">Loading project...</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex items-center justify-center py-32">
        <p className="text-gray-500 text-lg">Project not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100">

      {/* HERO */}
      <section className="relative h-[450px] overflow-hidden">
        <img
          src={
            project.project_image
              ? BASE_URL + project.project_image
              : defaultImg
          }
          className="w-full h-full object-cover"
          alt="project"
        />

        <div className="absolute inset-0 bg-black/60" />

        {/* BACK BUTTON */}
        <Link
          to="/our-projects"
          className="absolute top-6 left-6 z-20 flex items-center gap-2 bg-white/20 backdrop-blur-md border border-white/30 text-white px-4 py-2 rounded-xl hover:bg-white/30 transition"
        >
          <FiArrowLeft />
          Back
        </Link>

        {/* TITLE */}
        <div className="absolute inset-0 flex items-center z-10">
          <div className="max-w-5xl mx-auto px-4 w-full">

            <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight">
              {project.project_name}
            </h1>

            <p className="text-white/80 mt-3 text-sm md:text-base">
              {project.project_address}
            </p>

          </div>
        </div>
      </section>

      {/* CONTENT CARD */}
      <section className="max-w-5xl mx-auto px-4 py-20">
        <div className="bg-white/80 backdrop-blur-xl border border-white/40 rounded-3xl shadow-xl p-8 md:p-12">

          {/* STATUS BADGE */}
          <div className="mb-6">
            <span className="inline-block bg-blue-100 text-blue-700 px-5 py-2 rounded-full text-sm font-medium">
              {project.project_status}
            </span>
          </div>

          {/* TITLE */}
          <h2 className="text-3xl font-bold text-gray-800 mb-6">
            Project Overview
          </h2>

          {/* ADDRESS */}
          <p className="text-gray-600 leading-8 mb-6">
            {project.project_address}
          </p>

          {/* ⭐ NEW DESCRIPTION FIELD */}
          {project.project_description && (
            <p className="text-gray-700 leading-8 whitespace-pre-line">
              {project.project_description}
            </p>
          )}

          {/* FOOTER */}
          <div className="mt-10 pt-6 border-t flex items-center justify-between flex-wrap gap-4">

            <span className="bg-green-100 text-green-700 px-5 py-2 rounded-full text-sm font-medium">
              Active Project
            </span>

            <Link
              to="/our-projects"
              className="text-sm text-gray-600 hover:text-blue-600 transition"
            >
              ← Back to Projects
            </Link>

          </div>

        </div>
      </section>
    </div>
  );
}