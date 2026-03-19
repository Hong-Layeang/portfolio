import React from "react";
import type { IconType } from "react-icons";
import {
  SiC,
  SiCplusplus,
  SiCss,
  SiExpress,
  SiFirebase,
  SiHtml5,
  SiJavascript,
  SiJsonwebtokens,
  SiMysql,
  SiNodedotjs,
  SiOpenapiinitiative,
  SiPostgresql,
  SiPostman,
  SiReact,
  SiSequelize,
  SiSharp,
  SiSwagger,
  SiTailwindcss,
  SiTypescript,
} from "react-icons/si";
import { SKILLS } from "../data/portfolio";

type SkillLogo = {
  Icon: IconType;
  color: string;
};

const SKILL_LOGOS: Record<string, SkillLogo> = {
  HTML: { Icon: SiHtml5, color: "#E34F26" },
  CSS: { Icon: SiCss, color: "#1572B6" },
  JavaScript: { Icon: SiJavascript, color: "#F7DF1E" },
  TypeScript: { Icon: SiTypescript, color: "#3178C6" },
  React: { Icon: SiReact, color: "#61DAFB" },
  "Tailwind CSS": { Icon: SiTailwindcss, color: "#06B6D4" },
  "Node.js": { Icon: SiNodedotjs, color: "#5FA04E" },
  "Express.js": { Icon: SiExpress, color: "#FFFFFF" },
  MySQL: { Icon: SiMysql, color: "#4479A1" },
  "PostgreSQL (psql)": { Icon: SiPostgresql, color: "#4169E1" },
  Sequelize: { Icon: SiSequelize, color: "#52B0E7" },
  Firebase: { Icon: SiFirebase, color: "#FFCA28" },
  "REST API": { Icon: SiOpenapiinitiative, color: "#6BA539" },
  JWT: { Icon: SiJsonwebtokens, color: "#FFFFFF" },
  Swagger: { Icon: SiSwagger, color: "#85EA2D" },
  Postman: { Icon: SiPostman, color: "#FF6C37" },
  C: { Icon: SiC, color: "#A8B9CC" },
  "C++": { Icon: SiCplusplus, color: "#00599C" },
  "C#": { Icon: SiSharp, color: "#239120" },
};

const Skills: React.FC = () => (
  <section id="skills" className="section section--3d-perspective">
    <div className="section__container">
      <div className="section__header reveal">
        <span className="section__number">02</span>
        <h2 className="section__title section__title--3d">SKILLS</h2>
        <p className="section__subtitle">
          Technologies and tools I work with daily.
        </p>
      </div>

      {/* 3D orbiting decoration */}
      <div className="skills__orbit" aria-hidden="true">
        <div className="skills__orbit-ring" />
        <div className="skills__orbit-dot" />
      </div>

      <div className="skills__icon-grid">
        {SKILLS.map((skill, i) => (
          <div
            key={skill.name}
            className={`skills__icon-item skills__icon-item--3d tilt-3d reveal-scale reveal-delay-${(i % 8) + 1}`}
          >
            <div className="skills__icon-shine" />
            <span className="skills__icon-symbol" aria-label={skill.name}>
              {(() => {
                const logo = SKILL_LOGOS[skill.name];
                if (!logo) {
                  return <span style={{ fontSize: 24, fontWeight: 700 }}>{skill.name.slice(0, 2)}</span>;
                }

                const { Icon, color } = logo;
                return <Icon size={40} color={color} />;
              })()}
            </span>
            <span className="skills__icon-name">{skill.name}</span>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default Skills;
