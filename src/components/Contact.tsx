import * as React from "react";
import { SOCIAL_LINKS } from "../data/portfolio";

const Contact: React.FC = () => {
  const [formState, setFormState] = React.useState({
    name: "",
    email: "",
    message: "",
  });
  const [submitted, setSubmitted] = React.useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormState((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In production, wire this to Netlify Forms, Formspree, or your backend
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
    setFormState({ name: "", email: "", message: "" });
  };

  return (
    <section className="section" id="contact">
      <div className="section__container">
        <div className="section__header reveal">
          <div className="section__number">04</div>
          <h2 className="section__title">CONTACT</h2>
          <p className="section__subtitle">
            Have a project in mind? Let's build something together.
          </p>
        </div>

        <div className="contact__grid">
          {/* Left — info + socials */}
          <div className="reveal reveal-delay-1">
            <p className="contact__info-text">
              I'm currently an intern looking for opportunities to grow —
              whether it's a junior developer role, a collaborative project, or
              a mentorship. Have a question or just want to say hello? My inbox
              is always open.
            </p>

            <div className="contact__socials">
              {SOCIAL_LINKS.map((link) => (
                <a
                  key={link.platform}
                  href={link.url}
                  className="contact__social-link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {link.label}
                  <span>→</span>
                </a>
              ))}
            </div>
          </div>

          {/* Right — form */}
          <div className="reveal reveal-delay-2">
            <form
              className="form"
              onSubmit={handleSubmit}
              name="contact"
              method="POST"
              data-netlify="true"
            >
              <input type="hidden" name="form-name" value="contact" />

              <div className="form__group">
                <label className="form__label" htmlFor="name">
                  Your Name
                </label>
                <input
                  className="form__input"
                  type="text"
                  id="name"
                  name="name"
                  value={formState.name}
                  onChange={handleChange}
                  required
                  placeholder="John Doe"
                />
              </div>

              <div className="form__group">
                <label className="form__label" htmlFor="email">
                  Email Address
                </label>
                <input
                  className="form__input"
                  type="email"
                  id="email"
                  name="email"
                  value={formState.email}
                  onChange={handleChange}
                  required
                  placeholder="john@example.com"
                />
              </div>

              <div className="form__group">
                <label className="form__label" htmlFor="message">
                  Message
                </label>
                <textarea
                  className="form__textarea"
                  id="message"
                  name="message"
                  value={formState.message}
                  onChange={handleChange}
                  required
                  placeholder="Tell me about your project..."
                />
              </div>

              <button
                type="submit"
                className="btn btn--primary form__submit"
              >
                {submitted ? "SENT ✓" : "SEND MESSAGE"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
