import React from "react";
import { PERSONAL } from "../data/portfolio";
import UnityScene from "./UnityScene";
import resumePdf from "../assets/pdf/Hong_Layeang-Resume.pdf";

const Hero: React.FC = () => (
  <section id="hero" className="hero">
    <UnityScene />
    <div className="hero__vignette" />

    {/* 3D floating geometric shapes */}
    <div className="hero__shapes" aria-hidden="true">
      <div className="hero__shape hero__shape--ring" data-parallax="-0.15" />
      <div className="hero__shape hero__shape--cube" data-parallax="-0.1" />
      <div className="hero__shape hero__shape--diamond" data-parallax="-0.2" />
      <div className="hero__shape hero__shape--cross" data-parallax="-0.08" />
      <div className="hero__shape hero__shape--dot-cluster" data-parallax="-0.12" />
    </div>

    <div className="hero__content">
      <p className="hero__overline">
        <span className="hero__overline-line" />
        {PERSONAL.title}
        <span className="hero__overline-line" />
      </p>
      <h1 className="hero__name hero__name--3d">
        {PERSONAL.firstName}
        <br />
        {PERSONAL.lastName}
      </h1>
      <p className="hero__title">{PERSONAL.title}</p>
      <p className="hero__tagline">{PERSONAL.tagline}</p>
      <div className="hero__divider" />
      <div className="hero__actions">
        <a href="#projects" className="btn btn--primary btn--3d">
          View Projects
        </a>
        <a
          href={resumePdf}
          className="btn btn--outline btn--3d"
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

    {/* Depth gradient layers for parallax */}
    <div className="hero__depth-layer hero__depth-layer--1" data-parallax="-0.05" />
    <div className="hero__depth-layer hero__depth-layer--2" data-parallax="-0.12" />
  </section>
);

export default Hero;
