import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import NavBar from "../components/NavBar";
import Footer from "../sections/Footer";
import ContactForm from "../components/ContactForm";
import { contactDetails, contactSteps, socialImgs } from "../constants";

/** Inline icon set keyed by the `icon` field on each contact detail. */
const ICONS = {
  mail: (
    <>
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m2 7 10 6 10-6" />
    </>
  ),
  whatsapp: (
    <>
      <path d="M21 11.5a8.5 8.5 0 0 1-12.7 7.4L3 20.5l1.7-5.1A8.5 8.5 0 1 1 21 11.5Z" />
      <path d="M8.5 9.5c0 3 2 5 5 5 1 0 1.5-.5 1.5-1l-1.5-1-1 .8c-1-.4-1.9-1.3-2.3-2.3l.8-1L10 8.5c-.5 0-1.5.2-1.5 1Z" />
    </>
  ),
  linkedin: (
    <>
      <path d="M4.5 9v10.5M4.5 5.2v.1" />
      <path d="M10 19.5V9m0 3.5c0-2 1.4-3.5 3.4-3.5S17 10.4 17 12.6v6.9" />
    </>
  ),
};

const ContactPage = () => {
  const [time, setTime] = useState("");

  // Local clock so visitors can gauge whether they're catching me awake.
  useEffect(() => {
    const updateTime = () => {
      setTime(
        new Date().toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          timeZoneName: "short",
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex min-h-screen flex-col overflow-hidden bg-black text-white">
      <NavBar />

      <main className="mx-auto w-full max-w-7xl flex-1 px-6 pb-20 pt-32">
        {/* Back Link */}
        <div className="mb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 font-mono text-xs text-white/60 transition-all duration-200 hover:border-white/30 hover:text-white"
          >
            ← Back to Home
          </Link>
        </div>

        {/* Header */}
        <div className="mx-auto mb-14 max-w-3xl text-center">
          <p className="mb-3 font-mono text-xs uppercase tracking-[0.3em] text-blue-400 sm:text-sm">
            📬 Let's Build Something Together
          </p>
          <h1 className="mb-6 bg-gradient-to-r from-white via-blue-100 to-blue-400 bg-clip-text text-4xl font-extrabold tracking-tight text-transparent sm:text-6xl">
            Get In Touch
          </h1>
          <p className="text-base leading-relaxed text-white/60 sm:text-lg">
            Have a project, a role, or an idea you want to talk through? Send a message below or reach
            me directly on any of the channels listed — whichever suits you best.
          </p>
        </div>

        {/* Availability strip */}
        <div className="mx-auto mb-14 flex w-fit flex-col items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-4 text-sm backdrop-blur-xl sm:flex-row sm:gap-8">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-blue-500" />
            </span>
            <span className="text-white">Available for freelance work</span>
          </div>
          <span className="hidden h-4 w-px bg-white/15 sm:block" />
          <span className="font-mono text-xs text-white/50">My local time: {time}</span>
        </div>

        {/* Contact details + form */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-10">
          {/* Left: direct channels */}
          <div className="flex flex-col gap-4">
            {contactDetails.map((detail) => (
              <a
                key={detail.label}
                href={detail.href}
                target={detail.href.startsWith("http") ? "_blank" : undefined}
                rel={detail.href.startsWith("http") ? "noopener noreferrer" : undefined}
                className="group relative flex items-start gap-4 overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-black-200/60 to-black-100/20 p-6 backdrop-blur-xl transition-all duration-500 hover:-translate-y-1 hover:border-blue-400/40 hover:shadow-[0_0_40px_-12px_rgba(82,174,255,0.35)]"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-blue-500/10 text-blue-400 transition-colors duration-300 group-hover:border-blue-400/40 group-hover:bg-blue-500/20">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    {ICONS[detail.icon]}
                  </svg>
                </span>

                <span className="min-w-0 flex-1">
                  <span className="mb-1 block font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">
                    {detail.label}
                  </span>
                  <span className="block truncate font-semibold text-white transition-colors duration-300 group-hover:text-blue-400">
                    {detail.value}
                  </span>
                  <span className="mt-1.5 block text-xs leading-relaxed text-white/45">
                    {detail.hint}
                  </span>
                </span>

                <span className="mt-1 shrink-0 text-white/30 transition-all duration-300 group-hover:translate-x-1 group-hover:text-blue-400">
                  →
                </span>
              </a>
            ))}

            {/* Socials */}
            <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur-xl">
              <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">
                Elsewhere on the internet
              </p>
              <div className="flex gap-3">
                {socialImgs.map((social) => (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={social.name}
                    aria-label={social.name}
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 transition-all duration-300 hover:-translate-y-1 hover:border-blue-400 hover:bg-blue-500/10 hover:shadow-[0_0_20px_rgba(82,174,255,0.4)]"
                  >
                    <img
                      src={social.imgPath}
                      alt=""
                      className="h-4 w-4 object-contain"
                      style={{ filter: "invert(1) brightness(2)" }}
                    />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Right: the form */}
          <ContactForm
            heading="Send Me A Message"
            subtitle="Fill in the form and it lands straight in my inbox. The more context you give, the more useful my reply will be."
          />
        </div>

        {/* What happens next */}
        <div className="mt-24">
          <h2 className="mb-8 flex items-center gap-3 border-b border-white/10 pb-4 text-2xl font-bold text-white">
            <span>🚀</span> What Happens Next
          </h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {contactSteps.map((item) => (
              <div
                key={item.step}
                className="group relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-black-200/60 to-black-100/20 p-7 backdrop-blur-xl transition-all duration-500 hover:border-white/25"
              >
                <span className="mb-4 block font-mono text-4xl font-bold text-white/10 transition-colors duration-500 group-hover:text-blue-500/30">
                  {item.step}
                </span>
                <h3 className="mb-2.5 text-lg font-bold text-white">{item.title}</h3>
                <p className="text-sm leading-relaxed text-white/55">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ContactPage;
