import { useEffect, useState } from "react";

import HomeHeroSection from "./HomeHeroSection";
import HomeServicesSection from "./HomeServicesSection";
import HomeProjectsSection from "./HomeProjectsSection";
import HomeFaqSection from "./HomeFaqSection";
import HomeTestimonialsSection from "./HomeTestimonialsSection";
import HomeContactSection from "./HomeContactSection";
import HomeOurTeamSection from "./HomeOurTeamSection";
import HomeBlogSection from "./HomeBlogSection";
import HomeActionBannerSection from "./HomeActionBannerSection";
import HomeAboutSection from "./HomeAboutSection";

import { getHomePages } from "../../../services/homePage.service";
import { getServices } from "../../../services/servicesPage.service";
import { getProjects } from "../../../services/ourProjectsPage.service";

import homeBg from "../../../assets/images/Hero-Section.png";

// ================= COMPONENT =================
export default function HomePage() {
  // ================= STATES =================
  const [homeSections, setHomeSections] = useState([]);

  const [services, setServices] = useState([]);

  const [projects, setProjects] = useState([]);

  const [loading, setLoading] = useState(true);

  // ================= CURRENT LANGUAGE =================
  const getCurrentLanguageId = () =>
    Number(localStorage.getItem("language_id")) || 1;

  // ================= FETCH =================
  const fetchData = async () => {
    try {
      setLoading(true);

      const currentLanguageId = getCurrentLanguageId();

      // ================= HOME =================
      const homeData = await getHomePages();

      const homeSectionsData = Array.isArray(homeData?.data)
        ? homeData.data
        : Array.isArray(homeData)
          ? homeData
          : [];

      const filteredHome = homeSectionsData
        .filter(
          (item) =>
            Number(item.language_id) === currentLanguageId && item.is_active,
        )
        .sort((a, b) => a.display_order - b.display_order);

      setHomeSections(filteredHome);

      // ================= SERVICES =================
      const serviceData = await getServices();

      const servicesArray = Array.isArray(serviceData) ? serviceData : [];

      const filteredServices = servicesArray.filter(
        (item) =>
          Number(item.language_id) === currentLanguageId && item.is_active,
      );

      setServices(filteredServices);

      // ================= PROJECTS =================
      const projectData = await getProjects();

      const projectsArray = Array.isArray(projectData) ? projectData : [];

      const filteredProjects = projectsArray.filter(
        (item) =>
          Number(item.language_id) === currentLanguageId && item.is_active,
      );

      setProjects(filteredProjects);
    } catch (err) {
      console.error("HOME PAGE ERROR:", err);
    } finally {
      setLoading(false);
    }
  };

  // ================= LOAD =================
  useEffect(() => {
    fetchData();

    const handleLanguageChange = () => {
      fetchData();
    };

    window.addEventListener("languageChanged", handleLanguageChange);

    return () => {
      window.removeEventListener("languageChanged", handleLanguageChange);
    };
  }, []);

  // ================= LOADING =================
  if (loading) {
    return (
      <div
        className="
          min-h-screen
          flex
          items-center
          justify-center
          bg-white
        "
      >
        <div
          className="
            w-12
            h-12
            border-4
            border-blue-500
            border-t-transparent
            rounded-full
            animate-spin
          "
        />
      </div>
    );
  }

  // ================= FIND SECTIONS =================
  const heroSection = homeSections.find(
    (item) => item.section_name?.toLowerCase()?.trim() === "hero",
  );

  const servicesSection = homeSections.find(
    (item) => item.section_name?.toLowerCase()?.trim() === "services",
  );

  const projectsSection = homeSections.find(
    (item) => item.section_name?.toLowerCase()?.trim() === "projects",
  );

  const faqSection = homeSections.find(
    (item) => item.section_name?.toLowerCase()?.trim() === "faqs",
  );

  return (
    <div
      className="
        w-full
        overflow-x-hidden
        bg-white
      "
    >
      {/* ================= HERO ================= */}
      <HomeHeroSection data={heroSection} bgImage={homeBg} />

      {/* ================= SERVICES ================= */}
      <HomeServicesSection sectionData={servicesSection} services={services} />

      {/* ================= PROJECTS ================= */}
      <HomeProjectsSection sectionData={projectsSection} projects={projects} />

      {/* ================= ABOUT ================= */}
      <HomeAboutSection />

      {/* ================= TESTIMONIALS ================= */}
      <HomeTestimonialsSection />

      {/* ================= ACTION BANNER ================= */}
      <HomeActionBannerSection />

      {/* ================= OUR TEAM ================= */}
      <HomeOurTeamSection />

      {/* ================= BLOG ================= */}
      <HomeBlogSection />

      {/* ================= FAQS ================= */}
      <HomeFaqSection sectionData={faqSection} />

      {/* ================= CONTACT ================= */}
      <HomeContactSection />
    </div>
  );
}
