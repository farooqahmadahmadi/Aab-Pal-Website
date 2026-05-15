import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { FiMail, FiPhone, FiMapPin, FiSend } from "react-icons/fi";

import { getHomePages } from "../../../services/homePage.service";

import { createContactMessage } from "../../../services/contactUsPage.service";

export default function HomeContactSection() {
  const navigate = useNavigate();

  const [section, setSection] = useState(null);

  const [loading, setLoading] = useState(false);

  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    contact_name: "",
    contact_email: "",
    contact_phone: "",
    contact_title: "",
    contact_message: "",
  });

  const BASE_URL = (import.meta.env.VITE_IMAGE_URL || "").replace(/\/$/, "");

  const langId = Number(localStorage.getItem("language_id")) || 1;

  // ================= FETCH SECTION =================
  const fetchSection = async () => {
    try {
      const res = await getHomePages();

      const list = res?.data?.data || res?.data || [];

      const contactSection = list.find(
        (i) =>
          i.is_active &&
          Number(i.language_id) === langId &&
          i.section_name?.toLowerCase().includes("contact"),
      );

      setSection(contactSection || null);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchSection();

    const handleLang = () => fetchSection();

    window.addEventListener("languageChanged", handleLang);

    return () => window.removeEventListener("languageChanged", handleLang);
  }, []);

  // ================= CHANGE =================
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ================= SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.contact_name || !form.contact_email || !form.contact_message)
      return;

    try {
      setLoading(true);

      await createContactMessage(form);

      setSuccess("Message sent successfully");

      setForm({
        contact_name: "",
        contact_email: "",
        contact_phone: "",
        contact_title: "",
        contact_message: "",
      });
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      className="
    py-20
    bg-gradient-to-r
    from-sky-200
    via-teal-100
    via-cyan-100
    to-blue-200
    bg-[length:300%_300%]
    animate-waterFlow
  "
    >
      {/* ================= HEADER ================= */}
      <div className="text-center max-w-3xl mx-auto mb-14 px-4">
        <h2 className="text-4xl font-bold text-gray-900 mb-3">
          {section?.section_title || "Contact Us"}
        </h2>

        <p className="text-gray-600">
          {section?.section_description ||
            "We are always ready to help you anytime"}
        </p>

        <button
          onClick={() => navigate("/contact-us")}
            className="mt-6 text-blue-600 font-semibold hover:underline hover:text-black bg-transparent border-none transition-all"
        >
          See More... →
        </button>
      </div>

      {/* ================= CONTENT ================= */}
      <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-10">
        {/* LEFT INFO */}
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-2xl shadow border flex gap-4">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 flex items-center justify-center rounded-xl">
              <FiMail />
            </div>
            <div>
              <h3 className="font-semibold">Email</h3>
              <p className="text-sm text-gray-500">support@example.com</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow border flex gap-4">
            <div className="w-12 h-12 bg-cyan-100 text-cyan-600 flex items-center justify-center rounded-xl">
              <FiPhone />
            </div>
            <div>
              <h3 className="font-semibold">Phone</h3>
              <p className="text-sm text-gray-500">+93 700 000 000</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow border flex gap-4">
            <div className="w-12 h-12 bg-indigo-100 text-indigo-600 flex items-center justify-center rounded-xl">
              <FiMapPin />
            </div>
            <div>
              <h3 className="font-semibold">Location</h3>
              <p className="text-sm text-gray-500">Kabul, Afghanistan</p>
            </div>
          </div>
        </div>

        {/* RIGHT FORM */}
        <div className="bg-white p-6 rounded-3xl shadow border">
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              name="contact_name"
              value={form.contact_name}
              onChange={handleChange}
              placeholder="Your Name"
              className="w-full border p-3 rounded-xl"
            />

            <input
              name="contact_email"
              value={form.contact_email}
              onChange={handleChange}
              placeholder="Email"
              className="w-full border p-3 rounded-xl"
            />

            <input
              name="contact_phone"
              value={form.contact_phone}
              onChange={handleChange}
              placeholder="Phone"
              className="w-full border p-3 rounded-xl"
            />

            <input
              name="contact_title"
              value={form.contact_title}
              onChange={handleChange}
              placeholder="Subject"
              className="w-full border p-3 rounded-xl"
            />

            <textarea
              name="contact_message"
              value={form.contact_message}
              onChange={handleChange}
              placeholder="Message"
              className="w-full border p-3 rounded-xl h-32"
            />

            {success && <p className="text-green-600 text-sm">{success}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-xl flex items-center justify-center gap-2"
            >
              <FiSend />
              {loading ? "Sending..." : "Send"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
