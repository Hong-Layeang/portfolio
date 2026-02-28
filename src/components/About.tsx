import React from "react";
import { PERSONAL } from "../data/portfolio";
import profileImg from "../assets/images/profile.png";

const About: React.FC = () => (
  <section id="about" className="section section--alt">
    <div className="section__container">
      <div className="section__header reveal">
        <span className="section__number">01</span>
        <h2 className="section__title">ABOUT</h2>
      </div>

      <div className="about__grid">
        {/* Profile Photo */}
        <div className="about__photo reveal-left">
          <div className="about__photo-glow" />
          <img
            src={profileImg}
            alt={PERSONAL.name}
            className="about__photo-img"
          />
          <div className="about__photo-border" />
          <div className="about__photo-corner about__photo-corner--tl" />
          <div className="about__photo-corner about__photo-corner--br" />
        </div>

        {/* Text */}
        <div className="reveal-right">
          <p className="about__bio">{PERSONAL.bio}</p>

          {/* Education */}
          <div className="about__education">
            <div className="about__edu-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                <path d="M6 12v5c0 1.1 2.7 3 6 3s6-1.9 6-3v-5" />
              </svg>
            </div>
            <div className="about__edu-details">
              <span className="about__edu-degree">B.Sc. Computer Science — Software Engineering</span>
              <span className="about__edu-school">Cambodia Academy of Digital Technology (CADT)</span>
              <span className="about__edu-year">2024 — Present · Year 3</span>
            </div>
          </div>

          <div className="about__stats">
            <div className="about__stat">
              <div className="about__stat-number">Intern</div>
              <div className="about__stat-label">Current Role</div>
            </div>
            <div className="about__stat">
              <div className="about__stat-number">15+</div>
              <div className="about__stat-label">Projects Built</div>
            </div>
            <div className="about__stat">
              <div className="about__stat-number">∞</div>
              <div className="about__stat-label">Curiosity</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default About;
