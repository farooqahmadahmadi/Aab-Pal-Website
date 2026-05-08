import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getProject } from "../../../services/ourProjectsPage.service";

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

  if (loading) return <p className="text-center py-20">Loading...</p>;

  if (!project) return <p className="text-center py-20">Not found</p>;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* IMAGE */}
      <div className="h-[450px] relative">
        <img
          src={
            project.project_image
              ? BASE_URL + project.project_image
              : "https://via.placeholder.com/1200"
          }
          className="w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-black/50" />

        <Link
          to="/our-projects"
          className="absolute top-5 left-5 bg-white/20 text-white px-4 py-2 rounded"
        >
          ← Back
        </Link>
      </div>

      {/* CONTENT */}
      <div className="max-w-4xl mx-auto p-8 bg-white -mt-20 rounded-2xl shadow-lg relative">
        <h1 className="text-3xl font-bold">{project.project_name}</h1>

        <p className="text-gray-500 mt-2">{project.project_address}</p>

        <span className="inline-block mt-4 px-4 py-1 bg-blue-100 text-blue-600 rounded-full">
          {project.project_status}
        </span>
      </div>
    </div>
  );
}
