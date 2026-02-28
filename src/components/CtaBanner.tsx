import React from "react";
import { PERSONAL } from "../data/portfolio";
import resumePdf from "../assets/pdf/Hong_Layeang-Resume.pdf";

const CtaBanner: React.FC = () => (
  <section className="cta-banner">
    <div className="cta-banner__inner">
      <div className="cta-banner__glow" />
      <p className="cta-banner__label">INTERESTED?</p>
      <h2 className="cta-banner__heading">
        Let's Work Together
      </h2>
      <p className="cta-banner__sub">
        Grab a copy of my resume or get in touch — I'd love to hear from you.
      </p>
      <div className="cta-banner__actions">
        <a
          href={resumePdf}
          className="btn btn--primary"
          download="Hong_Layeang-Resume.pdf"
        >
          Download Resume ↓
        </a>
        <a href={`mailto:${PERSONAL.email}`} className="btn btn--outline">
          Say Hello →
        </a>
      </div>
    </div>
  </section>
);

export default CtaBanner;
