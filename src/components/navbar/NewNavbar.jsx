import React from "react";
import Searchbox from "./Searchbox";

const NewNavbar = () => {
  return (
    <nav className="sticky top-0 z-10 bg-surface/95 backdrop-blur-xl shadow-card border-b border-mist">
      <div className="mx-auto px-10">
        <div className="flex items-center justify-between h-16">
          <div className="flex gap-10">
            <span className="text-2xl text-primary font-semibold">
              UdyanSaathi
            </span>
          </div>

          <div className="flex space-x-4 text-ink items-center">
            <a
              href="/air-quality"
              className="nav-link hover:text-primary transition ease-in-out delay-100"
            >
              Air Quality
            </a>
            {/* COMMENTED OUT: Water Quality feature disabled */}
            {/* <a
              href="/water-quality"
              className="nav-link hover:text-primary transition ease-in-out delay-100"
            >
              Water Quaity
            </a> */}
            <a
              href="/stats"
              className="nav-link hover:text-primary transition ease-in-out delay-100"
            >
              Blogs
            </a>
            <Searchbox />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NewNavbar;
