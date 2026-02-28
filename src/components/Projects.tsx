import React, { useState, useEffect, useCallback, useRef } from "react";
import { PROJECTS, Project } from "../data/portfolio";

/* ============================================
   Projects — Card grid with hover video autoplay,
   image carousel, and click-to-open detail modal.
   ============================================ */

/* ── Image Carousel (crossfade every 2.5s) ── */
const ImageCarousel: React.FC<{ images: string[]; alt: string }> = ({
  images,
  alt,
}) => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="project-card__carousel">
      {images.map((src, i) => (
        <img
          key={i}
          src={src}
          alt={`${alt} ${i + 1}`}
          className={`project-card__carousel-img${
            i === current ? " active" : ""
          }`}
          loading="lazy"
        />
      ))}
      {images.length > 1 && (
        <div className="project-card__carousel-dots">
          {images.map((_, i) => (
            <span
              key={i}
              className={`project-card__carousel-dot${
                i === current ? " active" : ""
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

/* ── YouTube Hover Player ────────────────── */
const VideoPreview: React.FC<{ videoId: string; title: string; isCardHovered: boolean }> = ({
  videoId,
  title,
  isCardHovered,
}) => {
  const [showIframe, setShowIframe] = useState(false);
  const [iframeError, setIframeError] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (isCardHovered) {
      timeoutRef.current = setTimeout(() => setShowIframe(true), 300);
    } else {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      setShowIframe(false);
    }
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [isCardHovered]);

  const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&disablekb=1&fs=0&rel=0&modestbranding=1&playsinline=1`;

  return (
    <div className="project-card__video">
      {/* Thumbnail */}
      <img
        src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
        alt={`${title} thumbnail`}
        className={`project-card__video-thumb${showIframe && !iframeError ? " hidden" : ""}`}
        loading="lazy"
      />
      {/* Play icon overlay */}
      <div className={`project-card__play-icon${showIframe && !iframeError ? " hidden" : ""}`}>
        <svg viewBox="0 0 68 48" width="48" height="34">
          <path
            d="M66.52 7.74c-.78-2.93-2.49-5.41-5.42-6.19C55.79.13 34 0 34 0S12.21.13 6.9 1.55C3.97 2.33 2.27 4.81 1.48 7.74.06 13.05 0 24 0 24s.06 10.95 1.48 16.26c.78 2.93 2.49 5.41 5.42 6.19C12.21 47.87 34 48 34 48s21.79-.13 27.1-1.55c2.93-.78 4.64-3.26 5.42-6.19C67.94 34.95 68 24 68 24s-.06-10.95-1.48-16.26z"
            fill="rgba(255,255,255,0.15)"
          />
          <path d="M45 24L27 14v20" fill="rgba(255,255,255,0.7)" />
        </svg>
      </div>
      {/* Iframe loads on hover */}
      {showIframe && !iframeError && (
        <iframe
          className="project-card__video-iframe"
          src={embedUrl}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          referrerPolicy="strict-origin-when-cross-origin"
          onError={() => setIframeError(true)}
        />
      )}
    </div>
  );
};

const Projects: React.FC = () => {
  const [selected, setSelected] = useState<Project | null>(null);
  const [hoveredCardId, setHoveredCardId] = useState<string | null>(null);

  const openModal = useCallback((p: Project) => {
    setSelected(p);
    document.body.style.overflow = "hidden";
  }, []);

  const closeModal = useCallback(() => {
    setSelected(null);
    document.body.style.overflow = "";
  }, []);

  /* Close on ESC */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [closeModal]);

  return (
    <>
    <section id="projects" className="section section--alt section--3d-perspective">
      <div className="section__container">
        {/* Header */}
        <div className="section__header reveal">
          <span className="section__number">03</span>
          <h2 className="section__title section__title--3d">PROJECTS</h2>
          <p className="section__subtitle">
            A selection of things I've built — hover to preview, click for
            details.
          </p>
        </div>

        {/* Grid */}
        <div className="projects__grid">
          {PROJECTS.map((p, i) => (
            <article
              key={p.id}
              className={`project-card project-card--3d tilt-3d reveal reveal-delay-${(i % 4) + 1}`}
              onClick={() => openModal(p)}
              onMouseEnter={() => setHoveredCardId(p.id)}
              onMouseLeave={() => setHoveredCardId(null)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && openModal(p)}
            >
              {/* Profile-style hover decorations */}
              <div className="project-card__glow" />
              <div className="project-card__corner project-card__corner--tl" />
              <div className="project-card__corner project-card__corner--br" />
              <div className="project-card__border-offset" />

              <div className="project-card__image">
                <div
                  className={`project-card__gradient project-card__gradient--${p.id}`}
                />

                {/* Media: Video, Images, or fallback wireframe */}
                {p.videoId ? (
                  <VideoPreview videoId={p.videoId} title={p.title} isCardHovered={hoveredCardId === p.id} />
                ) : p.images && p.images.length > 0 ? (
                  <ImageCarousel images={p.images} alt={p.title} />
                ) : (
                  <div className="project-card__wireframe">
                    <div className="project-card__wireframe-shape" />
                  </div>
                )}

                <span className="project-card__category">{p.category}</span>
                <span className="project-card__id">{p.id}</span>
              </div>
              <div className="project-card__content">
                <h3 className="project-card__title">{p.title}</h3>
                <p className="project-card__desc">{p.description}</p>
                <div className="project-card__tags">
                  {p.tags.map((t) => (
                    <span key={t} className="project-card__tag">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>

      {/* ── Modal (outside perspective container) ── */}
      <div
        className={`project-modal-backdrop${selected ? " active" : ""}`}
        onClick={(e) => {
          if (e.target === e.currentTarget) closeModal();
        }}
      >
        {selected && (
          <div className="project-modal">
            <div className="project-modal__header">
              <div>
                <span className="project-modal__tag">{selected.category}</span>
                <h2 className="project-modal__title">{selected.title}</h2>
              </div>
              <button className="project-modal__close" onClick={closeModal}>
                CLOSE ✕
              </button>
            </div>

            {/* Modal media: video embed or image carousel */}
            {selected.videoId && (
              <div className="project-modal__video">
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${selected.videoId}?rel=0&modestbranding=1&enablejsapi=1&origin=${typeof window !== "undefined" ? encodeURIComponent(window.location.origin) : ""}`}
                  title={selected.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                  className="project-modal__video-iframe"
                />
              </div>
            )}
            {selected.images && selected.images.length > 0 && (
              <div className="project-modal__images">
                <ImageCarousel images={selected.images} alt={selected.title} />
              </div>
            )}

            <p className="project-modal__desc">{selected.description}</p>

            <div className="project-modal__meta">
              {selected.tags.map((t) => (
                <span key={t} className="project-modal__meta-tag">
                  {t}
                </span>
              ))}
            </div>

            <div className="project-modal__links">
              {selected.github && (
                <a
                  href={selected.github}
                  className="project-modal__link"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                >
                  GitHub →
                </a>
              )}
              {selected.live && (
                <a
                  href={selected.live}
                  className="project-modal__link"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                >
                  Live Demo →
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Projects;
