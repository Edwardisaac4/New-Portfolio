import { useState } from "react";
import emailjs from "@emailjs/browser";

/** Quick-select chips so a visitor can label their enquiry without writing a subject line. */
const TOPICS = ["Project Inquiry", "Job Opportunity", "Collaboration", "Just Saying Hi"];

const MESSAGE_LIMIT = 1000;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const EMAILJS_CONFIG = {
  serviceID: import.meta.env.VITE_EMAILJS_SERVICE_ID || "service_2x2bgc1",
  templateID: import.meta.env.VITE_EMAILJS_TEMPLATE_ID || "template_x20chb5",
  publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY || "Oxph2KDjiH8h84J62",
};

const EMPTY_FORM = { name: "", email: "", message: "", topic: TOPICS[0], botField: "" };

/**
 * A floating-label input or textarea.
 * The label sits inside the field and shrinks to the top edge once the field is
 * focused or holds a value. Float state is driven from React rather than CSS
 * pseudo-classes so the two states can never fight over specificity.
 */
const Field = ({ id, label, value, error, textarea = false, onBlur, ...props }) => {
  const [focused, setFocused] = useState(false);
  const floated = focused || String(value ?? "").length > 0;
  const Tag = textarea ? "textarea" : "input";

  return (
    <div className="relative">
      <Tag
        id={id}
        value={value}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        onFocus={() => setFocused(true)}
        onBlur={(e) => {
          setFocused(false);
          onBlur?.(e);
        }}
        className={`peer w-full rounded-xl border bg-black-100/60 px-4 pb-2.5 pt-7 text-white outline-none transition-colors duration-300 ${
          textarea ? "resize-none" : ""
        } ${
          error
            ? "border-red-400/70 focus:border-red-400"
            : "border-white/10 focus:border-blue-400/70 focus:bg-blue-500/[0.04]"
        }`}
        {...props}
      />

      <label
        htmlFor={id}
        className={`pointer-events-none absolute left-4 transition-all duration-200 ${
          floated
            ? "top-2.5 translate-y-0 font-mono text-[10px] uppercase tracking-[0.15em]"
            : textarea
              ? "top-7 translate-y-0 text-sm"
              : "top-1/2 -translate-y-1/2 text-sm"
        } ${error ? "text-red-400" : focused ? "text-blue-400" : "text-white/45"}`}
      >
        {label}
      </label>

      {error && (
        <p id={`${id}-error`} className="mt-1.5 pl-1 text-xs text-red-400">
          {error}
        </p>
      )}
    </div>
  );
};

/**
 * The contact form, shared by the homepage Contact section and the dedicated
 * /contact page. Sends messages client-side through EmailJS and reports the
 * outcome in a modal overlay.
 *
 * @param {object} props
 * @param {React.RefObject} props.cardRef  Attached to the card wrapper so callers can animate it.
 * @param {string} props.heading           Card heading.
 * @param {string} props.subtitle          Supporting copy under the heading.
 */
const ContactForm = ({
  cardRef,
  heading = "Drop A Message",
  subtitle = "Whether you have a question, a project in mind, or just want to say hi, my inbox is always open.",
}) => {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState({ open: false, success: true, message: "" });

  const validateField = (name, value) => {
    if (name === "name") return value.trim() ? "" : "Please tell me your name.";
    if (name === "email") {
      if (!value.trim()) return "An email address is required so I can reply.";
      return EMAIL_PATTERN.test(value.trim()) ? "" : "That doesn't look like a valid email address.";
    }
    if (name === "message") {
      return value.trim().length >= 10 ? "" : "Please write at least 10 characters.";
    }
    return "";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Clear an existing error as soon as the field becomes valid again.
    setErrors((prev) => (prev[name] ? { ...prev, [name]: validateField(name, value) } : prev));
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const nextErrors = {
      name: validateField("name", form.name),
      email: validateField("email", form.email),
      message: validateField("message", form.message),
    };
    setErrors(nextErrors);
    if (Object.values(nextErrors).some(Boolean)) return;

    // Honeypot: bots fill hidden inputs, humans never see this one.
    if (form.botField) {
      setModal({ open: true, success: true, message: "Thank you! I will get back to you as soon as possible." });
      setForm(EMPTY_FORM);
      return;
    }

    setLoading(true);

    emailjs
      .send(
        EMAILJS_CONFIG.serviceID,
        EMAILJS_CONFIG.templateID,
        {
          from_name: form.name,
          to_name: "Isaac Edward",
          from_email: form.email,
          to_email: "eddiethedev4@gmail.com",
          subject: form.topic,
          // Prepend the topic so it still shows up in templates without a subject variable.
          message: `[${form.topic}]\n\n${form.message}`,
        },
        EMAILJS_CONFIG.publicKey
      )
      .then(
        () => {
          setLoading(false);
          setModal({ open: true, success: true, message: "Thank you! I will get back to you as soon as possible." });
          setForm(EMPTY_FORM);
          setErrors({});
        },
        (error) => {
          setLoading(false);
          console.error(error);
          setModal({
            open: true,
            success: false,
            message: "Something went wrong sending your message. Please try again, or email me directly at eddiethedev4@gmail.com.",
          });
        }
      );
  };

  const charsLeft = MESSAGE_LIMIT - form.message.length;

  return (
    <>
      <div
        ref={cardRef}
        className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-black-200/80 to-black-100/40 p-7 shadow-2xl backdrop-blur-2xl md:p-10"
      >
        {/* Ambient glow */}
        <div className="pointer-events-none absolute -right-10 -top-10 h-64 w-64 rounded-full bg-blue-500/10 blur-[80px]" />

        <div className="relative z-10">
          <h3 className="mb-3 text-2xl font-bold text-white md:text-3xl">{heading}</h3>
          <p className="mb-8 text-sm leading-relaxed text-white/60 md:text-base">{subtitle}</p>

          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
            {/* Topic chips */}
            <fieldset>
              <legend className="mb-3 font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">
                What's this about?
              </legend>
              <div className="flex flex-wrap gap-2">
                {TOPICS.map((topic) => {
                  const active = form.topic === topic;
                  return (
                    <button
                      key={topic}
                      type="button"
                      aria-pressed={active}
                      onClick={() => setForm((prev) => ({ ...prev, topic }))}
                      className={`cursor-pointer rounded-full px-3.5 py-1.5 text-xs font-medium transition-all duration-300 ${
                        active
                          ? "bg-blue-500 text-white shadow-[0_0_20px_rgba(59,130,246,0.35)]"
                          : "border border-white/10 bg-white/5 text-white/60 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      {topic}
                    </button>
                  );
                })}
              </div>
            </fieldset>

            <Field
              id="contact-name"
              name="name"
              label="Your Name"
              autoComplete="name"
              value={form.name}
              error={errors.name}
              onChange={handleChange}
              onBlur={handleBlur}
            />

            <Field
              id="contact-email"
              name="email"
              type="email"
              label="Email Address"
              autoComplete="email"
              value={form.email}
              error={errors.email}
              onChange={handleChange}
              onBlur={handleBlur}
            />

            <div>
              <Field
                id="contact-message"
                name="message"
                label="Your Message"
                textarea
                rows={5}
                maxLength={MESSAGE_LIMIT}
                value={form.message}
                error={errors.message}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <p
                className={`mt-1.5 pr-1 text-right font-mono text-[10px] ${
                  charsLeft < 100 ? "text-blue-400" : "text-white/30"
                }`}
              >
                {charsLeft} characters left
              </p>
            </div>

            {/* Honeypot — hidden from people, tempting to bots */}
            <input
              type="text"
              name="botField"
              value={form.botField}
              onChange={handleChange}
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              className="pointer-events-none absolute -left-[9999px] h-0 w-0 opacity-0"
            />

            <div className="mt-2 flex flex-col-reverse items-center gap-4 sm:flex-row sm:justify-between">
              <p className="text-center text-xs text-white/40 sm:text-left">
                Typically replies within 24 hours.
              </p>

              <button
                type="submit"
                disabled={loading}
                className="magnetic-btn flex w-full cursor-pointer items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 px-8 py-4 font-semibold tracking-wide text-white transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(82,174,255,0.4)] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
              >
                {loading ? (
                  <>
                    <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity="0.25" strokeWidth="3" />
                      <path d="M22 12a10 10 0 0 0-10-10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                    </svg>
                    Sending...
                  </>
                ) : (
                  <>
                    Send Message
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="22" y1="2" x2="11" y2="13" />
                      <polygon points="22 2 15 22 11 13 2 9 22 2" />
                    </svg>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Success / error modal */}
      {modal.open && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-9999 flex cursor-pointer items-center justify-center px-4"
          onClick={() => setModal((prev) => ({ ...prev, open: false }))}
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.75)",
            backdropFilter: "blur(8px)",
            animation: "modalFadeIn 0.3s ease-out",
          }}
        >
          <div
            className="relative w-full max-w-md cursor-default rounded-3xl border border-white/10 p-10 text-center"
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "linear-gradient(135deg, rgba(40, 39, 50, 0.95) 0%, rgba(20, 20, 25, 0.98) 100%)",
              boxShadow: modal.success
                ? "0 0 60px rgba(82, 174, 255, 0.2), 0 0 120px rgba(82, 174, 255, 0.05)"
                : "0 0 60px rgba(255, 80, 80, 0.2), 0 0 120px rgba(255, 80, 80, 0.05)",
              animation: "modalScaleIn 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)",
            }}
          >
            <div
              className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full"
              style={{
                background: modal.success
                  ? "linear-gradient(135deg, rgba(82, 174, 255, 0.2), rgba(82, 174, 255, 0.05))"
                  : "linear-gradient(135deg, rgba(255, 80, 80, 0.2), rgba(255, 80, 80, 0.05))",
                border: `2px solid ${modal.success ? "rgba(82, 174, 255, 0.4)" : "rgba(255, 80, 80, 0.4)"}`,
              }}
            >
              {modal.success ? (
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#52aeff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              ) : (
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#ff5050" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              )}
            </div>

            <h4 className="mb-3 text-2xl font-bold text-white">
              {modal.success ? "Message Sent! 🎉" : "Oops!"}
            </h4>

            <p className="mb-8 text-base leading-relaxed text-white/60">{modal.message}</p>

            <p className="text-sm tracking-wide text-white/30">Click anywhere to dismiss</p>
          </div>
        </div>
      )}

      <style>{`
        @keyframes modalFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes modalScaleIn {
          from { opacity: 0; transform: scale(0.85) translateY(20px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </>
  );
};

export default ContactForm;
