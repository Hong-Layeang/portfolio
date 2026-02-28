import * as React from "react";
import { SOCIAL_LINKS, NAV_LINKS } from "../data/portfolio";

const Footer: React.FC = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="footer footer--3d">
      <div className="footer__inner">
        <span className="footer__copy">
          © {year} HONG LAYEANG — ALL RIGHTS RESERVED
        </span>

        <div className="footer__links">
          {NAV_LINKS.map((link) => (
            <a key={link.href} href={link.href} className="footer__link">
              {link.label}
            </a>
          ))}
          {SOCIAL_LINKS.map((s) => (
            <a
              key={s.platform}
              href={s.url}
              className="footer__link"
              target="_blank"
              rel="noopener noreferrer"
            >
              {s.label}
            </a>
          ))}
        </div>

        <a href="#hero" className="footer__back-top">
          BACK TO TOP ↑
        </a>
      </div>
    </footer>
  );
};

export default Footer;
