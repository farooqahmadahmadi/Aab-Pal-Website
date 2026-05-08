import { useEffect, useState } from "react";
import { FiMail, FiPhone, FiMapPin, FiSend } from "react-icons/fi";

import { getHomePages } from "../../../services/homePage.service";
import { createContactMessage } from "../../../services/contactUsPage.service";

export default function ContactUsPage() {
  const [hero, setHero] = useState(null);

  const [loading, setLoading] = useState(false);

  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    contact_name: "",
    contact_email: "",
    contact_phone: "",
    contact_title: "",
    contact_message: "",
  });

  const BASE_URL = import.meta.env.VITE_IMAGE_URL;

  // ================= LANGUAGE =================
  const getLanguageId = () => Number(localStorage.getItem("language_id")) || 1;

  const [languageId, setLanguageId] = useState(getLanguageId());

  // ================= LANGUAGE LISTENER =================
  useEffect(() => {
    const handleLanguageChange = () => {
      setLanguageId(getLanguageId());
    };

    window.addEventListener("languageChanged", handleLanguageChange);

    return () => {
      window.removeEventListener("languageChanged", handleLanguageChange);
    };
  }, []);

  // ================= FETCH HERO =================
  useEffect(() => {
    const fetchHero = async () => {
      try {
        const homeRes = await getHomePages();

        const homeList = Array.isArray(homeRes) ? homeRes : homeRes?.data || [];

        const heroSection = homeList.find(
          (h) =>
            h.is_active &&
            Number(h.language_id) === Number(languageId) &&
            h.section_name?.toLowerCase().includes("contact"),
        );

        setHero(heroSection || null);
      } catch (err) {
        console.error("CONTACT HERO ERROR:", err);
      }
    };

    fetchHero();
  }, [languageId]);

  // ================= HANDLE CHANGE =================
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // ================= SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !form.contact_name.trim() ||
      !form.contact_email.trim() ||
      !form.contact_message.trim()
    ) {
      return;
    }

    try {
      setLoading(true);
      setSuccess("");

      await createContactMessage(form);

      setSuccess("Your message has been sent successfully.");

      setForm({
        contact_name: "",
        contact_email: "",
        contact_phone: "",
        contact_title: "",
        contact_message: "",
      });
    } catch (err) {
      console.error("CONTACT PAGE ERROR:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* ================= HERO ================= */}
      <section
        className="relative w-full py-24 px-4 text-white overflow-hidden"
        style={{
          backgroundImage: hero?.section_image
            ? `url(${BASE_URL + hero.section_image})`
            : "linear-gradient(135deg, #1e3a8a, #2563eb, #06b6d4)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* OVERLAY */}
        <div className="absolute inset-0 bg-black/60" />

        {/* CONTENT */}
        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <div className="inline-block px-4 py-1 rounded-full bg-white/10 border border-white/20 backdrop-blur mb-5 text-sm">
            Contact Us
          </div>

          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            {hero?.section_title || "Get In Touch With Us"}
          </h1>

          <p className="mt-5 text-gray-200 max-w-2xl mx-auto leading-7">
            {hero?.section_description ||
              "We are always ready to help you. Send us your questions, feedback, or suggestions anytime."}
          </p>
        </div>
      </section>

      {/* ================= CONTENT ================= */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-2 gap-10 items-start">
          {/* ================= LEFT SIDE ================= */}
          <div className="space-y-6">
            {/* TITLE */}
            <div>
              <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider">
                Contact Information
              </span>

              <h2 className="text-3xl font-bold text-gray-900 mt-2">
                Let’s Talk About Your Ideas
              </h2>

              <p className="text-gray-600 leading-7 mt-4">
                Feel free to contact us for support, partnership, feedback, or
                any other inquiries related to our services.
              </p>
            </div>

            {/* INFO CARDS */}
            <div className="space-y-4">
              {/* EMAIL */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-start gap-4 hover:shadow-md transition">
                <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center text-xl">
                  <FiMail />
                </div>

                <div>
                  <h3 className="font-semibold text-gray-800">Email Address</h3>

                  <p className="text-sm text-gray-500 mt-1">
                    support@example.com
                  </p>
                </div>
              </div>

              {/* PHONE */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-start gap-4 hover:shadow-md transition">
                <div className="w-12 h-12 rounded-xl bg-cyan-100 text-cyan-600 flex items-center justify-center text-xl">
                  <FiPhone />
                </div>

                <div>
                  <h3 className="font-semibold text-gray-800">Phone Number</h3>

                  <p className="text-sm text-gray-500 mt-1">+93 700 000 000</p>
                </div>
              </div>

              {/* LOCATION */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-start gap-4 hover:shadow-md transition">
                <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center text-xl">
                  <FiMapPin />
                </div>

                <div>
                  <h3 className="font-semibold text-gray-800">
                    Office Address
                  </h3>

                  <p className="text-sm text-gray-500 mt-1">
                    Kabul, Afghanistan
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ================= FORM ================= */}
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 md:p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Send Message</h2>

              <p className="text-gray-500 text-sm mt-2">
                Fill out the form below and we’ll get back to you soon.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* NAME */}
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">
                  Full Name
                </label>

                <input
                  type="text"
                  name="contact_name"
                  value={form.contact_name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* EMAIL */}
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">
                  Email Address
                </label>

                <input
                  type="email"
                  name="contact_email"
                  value={form.contact_email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* PHONE */}
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">
                  Phone Number
                </label>

                <input
                  type="text"
                  name="contact_phone"
                  value={form.contact_phone}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                  className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* SUBJECT */}
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">
                  Subject
                </label>

                <input
                  type="text"
                  name="contact_title"
                  value={form.contact_title}
                  onChange={handleChange}
                  placeholder="Message subject"
                  className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* MESSAGE */}
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">
                  Message
                </label>

                <textarea
                  rows={6}
                  name="contact_message"
                  value={form.contact_message}
                  onChange={handleChange}
                  placeholder="Write your message..."
                  className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              {/* SUCCESS */}
              {success && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-2xl text-sm">
                  {success}
                </div>
              )}

              {/* BUTTON */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-2xl font-medium transition disabled:opacity-50"
              >
                <FiSend />

                {loading ? "Sending..." : "Send Message"}
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
