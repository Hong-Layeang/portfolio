import React from "react";
import { PERSONAL } from "../data/portfolio";
import UnityScene from "./UnityScene";
import resumePdf from "../assets/pdf/Hong_Layeang-Resume.pdf";

const Hero: React.FC = () => (
  <section id="hero" className="hero">
    <UnityScene />
    <div className="hero__vignette" />
    <div className="hero__content">
      <p className="hero__overline">
        <span className="hero__overline-line" />
        {PERSONAL.title}
        <span className="hero__overline-line" />
      </p>
      <h1 className="hero__name">
        {PERSONAL.firstName}
        <br />
        {PERSONAL.lastName}
      </h1>
      <p className="hero__title">{PERSONAL.title}</p>
      <p className="hero__tagline">{PERSONAL.tagline}</p>
      <div className="hero__divider" />
      <div className="hero__actions">
        <a href="#projects" className="btn btn--primary">
          View Projects
        </a>
        <a
          href={resumePdf}
          className="btn btn--outline"
          download="Hong_Layeang-Resume.pdf"
        >
          Download Resume ↓
        </a>
      </div>
    </div>
    <div className="hero__scroll">
      <span>Scroll</span>
      <div className="hero__scroll-line" />
    </div>
  </section>
);

export default Hero;
