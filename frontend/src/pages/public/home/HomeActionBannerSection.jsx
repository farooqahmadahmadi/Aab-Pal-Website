import { Link } from "react-router-dom";

import { FiArrowRight, FiPhoneCall } from "react-icons/fi";

export default function HomeActionBannerSection() {
  return (
    <section
      className="
        relative
        overflow-hidden
        py-20
        px-4
      "
    >
      {/* BACKGROUND */}
      <div
        className="
          absolute
          inset-0
          bg-gradient-to-r
          from-blue-700
          via-cyan-600
          to-sky-500
        "
      />

      {/* GLOW EFFECTS */}
      <div
        className="
          absolute
          top-0
          right-0
          w-72
          h-72
          bg-white/10
          rounded-full
          blur-3xl
        "
      />

      <div
        className="
          absolute
          bottom-0
          left-0
          w-72
          h-72
          bg-white/10
          rounded-full
          blur-3xl
        "
      />

      {/* CONTENT */}
      <div
        className="
          relative
          z-10
          max-w-5xl
          mx-auto
          text-center
          text-white
        "
      >

        {/* TITLE */}
        <h2
          className="
            text-4xl
            md:text-5xl
            font-extrabold
            leading-tight
          "
        >
          Ready To Build Your
          <span className="block mt-2">Smart Digital System?</span>
        </h2>

        {/* DESCRIPTION */}
        <p
          className="
            mt-6
            text-white/90
            text-lg
            max-w-3xl
            mx-auto
            leading-8
          "
        >
          Modern management solutions for water systems, smart monitoring,
          digital operations, and powerful business automation tools.
        </p>

        {/* BUTTONS */}
        <div
          className="
            mt-10
            flex
            flex-col
            sm:flex-row
            items-center
            justify-center
            gap-4
          "
        >
          {/* CONTACT */}
          <Link
            to="/contact-us"
            className="
              inline-flex
              items-center
              gap-2
              bg-white
              text-blue-700
              px-7
              py-3
              rounded-2xl
              font-bold
              shadow-xl
              hover:scale-105
              transition-all
            "
          >
            <FiPhoneCall />
            Contact Us
          </Link>

          {/* SECOND BUTTON */}
          <Link
            to="/our-services"
            className="
              inline-flex
              items-center
              gap-2
              bg-white/10
              backdrop-blur-md
              border
              border-white/20
              text-white
              px-7
              py-3
              rounded-2xl
              font-semibold
              hover:bg-white/20
              hover:text-white
              transition-all
            "
          >
            Explore Services
            <FiArrowRight />
          </Link>
        </div>
      </div>
    </section>
  );
}
