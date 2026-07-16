import { useEffect, useRef, useState, type FormEvent } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { createFileRoute } from "@tanstack/react-router";
import ThreeBackground from "@/components/ThreeBackground";
import profileAsset from "@/assets/profile.jpg.asset.json";

export const Route = createFileRoute("/")({
  component: Portfolio,
});

// Register GSAP plugins on the client
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// ────────────────────────────────────────────────────────────
// Typing effect for hero subtitle
// ────────────────────────────────────────────────────────────
function useTypewriter(words: string[], speed = 90, pause = 1500) {
  const [text, setText] = useState("");
  const idx = useRef(0);
  const char = useRef(0);
  const deleting = useRef(false);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    const tick = () => {
      const word = words[idx.current];
      if (!deleting.current) {
        char.current++;
        setText(word.slice(0, char.current));
        if (char.current === word.length) {
          deleting.current = true;
          timeout = setTimeout(tick, pause);
          return;
        }
      } else {
        char.current--;
        setText(word.slice(0, char.current));
        if (char.current === 0) {
          deleting.current = false;
          idx.current = (idx.current + 1) % words.length;
        }
      }
      timeout = setTimeout(tick, deleting.current ? speed / 2 : speed);
    };
    timeout = setTimeout(tick, speed);
    return () => clearTimeout(timeout);
  }, [words, speed, pause]);

  return text;
}

// ────────────────────────────────────────────────────────────
// Custom animated cursor (dot + trailing ring)
// ────────────────────────────────────────────────────────────
function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    let x = 0, y = 0, rx = 0, ry = 0;
    const move = (e: MouseEvent) => {
      x = e.clientX;
      y = e.clientY;
      dot.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
    };
    const loop = () => {
      rx += (x - rx) * 0.15;
      ry += (y - ry) * 0.15;
      ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
      raf = requestAnimationFrame(loop);
    };
    let raf = requestAnimationFrame(loop);
    window.addEventListener("mousemove", move);

    const onEnter = () => ring.classList.add("scale-150");
    const onLeave = () => ring.classList.remove("scale-150");
    document.querySelectorAll("a,button").forEach((el) => {
      el.addEventListener("mouseenter", onEnter);
      el.addEventListener("mouseleave", onLeave);
    });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", move);
    };
  }, []);

  return (
    <>
      <div ref={ringRef} className="cursor-ring" />
      <div ref={dotRef} className="cursor-dot" />
    </>
  );
}

// ────────────────────────────────────────────────────────────
// Loader screen
// ────────────────────────────────────────────────────────────
function Loader({ done }: { done: boolean }) {
  return (
    <div
      className={`fixed inset-0 z-[200] flex items-center justify-center bg-background transition-opacity duration-700 ${
        done ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
    >
      <div className="flex flex-col items-center gap-6">
        <div className="relative h-24 w-24">
          <div className="absolute inset-0 rounded-full border-2 border-white/10" />
          <div className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-[#a78bfa] border-r-[#7dd3fc]" />
        </div>
        <div className="text-gradient font-display text-2xl font-bold tracking-widest">
          RAAHIM JAMIL
        </div>
        <div className="text-xs uppercase tracking-[0.4em] text-white/40">
          Loading Experience
        </div>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────
// Scroll progress bar
// ────────────────────────────────────────────────────────────
function ScrollProgress() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onScroll = () => {
      const h = document.documentElement;
      const p = h.scrollTop / (h.scrollHeight - h.clientHeight);
      el.style.transform = `scaleX(${p})`;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return <div ref={ref} className="scroll-progress" />;
}

// ────────────────────────────────────────────────────────────
// Reveal-on-scroll helper hook
// ────────────────────────────────────────────────────────────
function useReveal(selector: string, deps: unknown[] = []) {
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(selector).forEach((el) => {
        gsap.from(el, {
          opacity: 0,
          y: 60,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        });
      });
    });
    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

// ────────────────────────────────────────────────────────────
// Data
// ────────────────────────────────────────────────────────────
const stats = [
  { value: "4+", label: "Years Learning Technology" },
  { value: "5+", label: "Years Pro Esports Experience" },
  { value: "15+", label: "Projects Completed" },
  { value: "∞", label: "Cups of Coffee" },
];

const journey = [
  {
    icon: "fa-graduation-cap",
    title: "Bachelor of Computer Science",
    period: "2022 — 2026",
    desc: "Currently pursuing a CS degree with focus on AI, product management, and software quality engineering.",
  },
  {
    icon: "fa-bug",
    title: "Software Quality Assurance Intern",
    period: "Internship",
    desc: "Manual + API testing, bug reporting, browser compatibility testing, and QA documentation across web products.",
  },
  {
    icon: "fa-compass-drafting",
    title: "Product Owner Experience",
    period: "Hands-on",
    desc: "Owned product roadmaps, wrote user stories, prioritized backlogs and collaborated cross-functionally with engineering.",
  },
  {
    icon: "fa-brain",
    title: "AI Product Research",
    period: "Ongoing",
    desc: "Researching AI-powered applications, prompt engineering patterns and UX for LLM-driven products.",
  },
  {
    icon: "fa-flag-checkered",
    title: "Final Year Project",
    period: "2025 — 2026",
    desc: "Building an AI-driven fitness recommendation & training-split platform end-to-end.",
  },
];

const projects = [
  {
    title: "Gym Recommendation & Training Split System",
    tag: "AI · Fitness · Web",
    desc: "AI-powered fitness platform that recommends personalized workouts and training splits based on user goals, experience and equipment.",
    icon: "fa-dumbbell",
  },
  {
    title: "AI Product Research",
    tag: "Research · LLM · UX",
    desc: "Investigating AI-powered applications, evaluating models and shaping user experiences that make AI feel effortless.",
    icon: "fa-microchip",
  },
  {
    title: "QA Testing Portfolio",
    tag: "QA · Testing · Docs",
    desc: "Manual & API testing, bug reports, browser testing, and a full quality-assurance documentation showcase.",
    icon: "fa-clipboard-check",
  },
];

const skills = [
  {
    icon: "fa-code",
    title: "Programming",
    items: ["HTML", "CSS", "JavaScript", "Python"],
  },
  {
    icon: "fa-vial",
    title: "Testing",
    items: [
      "Manual Testing",
      "API Testing",
      "Postman",
      "Bug Reporting",
      "UI Testing",
      "Browser DevTools",
    ],
  },
  {
    icon: "fa-diagram-project",
    title: "Product",
    items: ["Product Owner", "Requirement Analysis", "User Stories", "AI Research"],
  },
  {
    icon: "fa-toolbox",
    title: "Tools",
    items: [
      "GitHub",
      "Cursor",
      "VS Code",
      "Figma",
      "Postman",
      "Notion",
      "Supabase",
      "Vercel",
    ],
  },
];

const interests = [
  { icon: "fa-microchip", label: "Technology" },
  { icon: "fa-robot", label: "Artificial Intelligence" },
  { icon: "fa-gamepad", label: "Gaming" },
  { icon: "fa-camera-retro", label: "Photography" },
  { icon: "fa-plane", label: "Travel" },
  { icon: "fa-lightbulb", label: "Innovation" },
  { icon: "fa-mobile-screen", label: "Gadgets" },
  { icon: "fa-puzzle-piece", label: "Problem Solving" },
];

// ────────────────────────────────────────────────────────────
// Main portfolio component
// ────────────────────────────────────────────────────────────
function Portfolio() {
  const [loaded, setLoaded] = useState(false);
  const [showTop, setShowTop] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const typed = useTypewriter([
    "Product Owner",
    "Software Quality Assurance Intern",
    "Technology Enthusiast",
    "Former Professional Esports Athlete",
  ]);

  // Loader
  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 1400);
    return () => clearTimeout(t);
  }, []);

  // Back-to-top visibility
  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 600);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Hero mouse parallax on foreground layers
  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const layers = el.querySelectorAll<HTMLElement>("[data-parallax]");
      const cx = (e.clientX / window.innerWidth - 0.5) * 2;
      const cy = (e.clientY / window.innerHeight - 0.5) * 2;
      layers.forEach((layer) => {
        const depth = Number(layer.dataset.parallax ?? "10");
        layer.style.transform = `translate3d(${cx * depth}px, ${cy * depth}px, 0)`;
      });
    };
    el.addEventListener("mousemove", onMove);
    return () => el.removeEventListener("mousemove", onMove);
  }, []);

  // GSAP hero timeline
  useEffect(() => {
    if (!loaded) return;
    const ctx = gsap.context(() => {
      gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .from(".hero-eyebrow", { opacity: 0, y: 20, duration: 0.8 })
        .from(".hero-title span", {
          opacity: 0,
          y: 80,
          duration: 1,
          stagger: 0.05,
        }, "-=0.4")
        .from(".hero-sub", { opacity: 0, y: 20, duration: 0.8 }, "-=0.4")
        .from(".hero-cta > *", {
          opacity: 0,
          y: 20,
          duration: 0.6,
          stagger: 0.1,
        }, "-=0.4")
        .from(".hero-portrait", {
          opacity: 0,
          scale: 0.85,
          duration: 1.1,
          ease: "power4.out",
        }, "-=1");
    });
    return () => ctx.revert();
  }, [loaded]);

  useReveal(".reveal", [loaded]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const btn = e.currentTarget.querySelector("button[type=submit]");
    if (btn) {
      btn.textContent = "Message Sent ✓";
      btn.setAttribute("disabled", "true");
    }
    e.currentTarget.reset();
  };

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="relative min-h-screen overflow-hidden font-body">
      <Loader done={loaded} />
      <CustomCursor />
      <ScrollProgress />
      <ThreeBackground />

      {/* Static ambient blurred blobs */}
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-20">
        <div
          className="blob"
          style={{
            width: 500,
            height: 500,
            top: "-10%",
            left: "-10%",
            background: "radial-gradient(circle, #a78bfa, transparent 70%)",
          }}
        />
        <div
          className="blob"
          style={{
            width: 600,
            height: 600,
            top: "40%",
            right: "-15%",
            background: "radial-gradient(circle, #7dd3fc, transparent 70%)",
            animationDelay: "-8s",
          }}
        />
        <div
          className="blob"
          style={{
            width: 450,
            height: 450,
            bottom: "-10%",
            left: "20%",
            background: "radial-gradient(circle, #f0abfc, transparent 70%)",
            animationDelay: "-14s",
          }}
        />
        <div className="grid-bg absolute inset-0 opacity-40" />
      </div>

      {/* Navigation */}
      <nav className="fixed left-1/2 top-6 z-50 -translate-x-1/2">
        <div className="glass flex items-center gap-1 rounded-full px-2 py-2 text-sm">
          <span className="text-gradient hidden px-4 font-display font-bold sm:inline">
            RJ
          </span>
          {[
            ["Home", "hero"],
            ["About", "about"],
            ["Journey", "journey"],
            ["Esports", "esports"],
            ["Work", "projects"],
            ["Skills", "skills"],
            ["Contact", "contact"],
          ].map(([label, id]) => (
            <button
              key={id}
              onClick={() => scrollTo(id)}
              className="rounded-full px-3 py-1.5 text-white/70 transition hover:bg-white/10 hover:text-white sm:px-4"
            >
              {label}
            </button>
          ))}
        </div>
      </nav>

      {/* ─── HERO ─── */}
      <section
        id="hero"
        ref={heroRef}
        className="relative flex min-h-screen items-center justify-center px-6 pt-32"
      >
        <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-14 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <div className="hero-eyebrow section-eyebrow mb-6">
              <i className="fa-solid fa-sparkles mr-2" />
              Portfolio · 2026
            </div>
            <h1 className="hero-title font-display text-5xl font-bold tracking-tight sm:text-6xl lg:text-8xl">
              <span className="block leading-[1.1] pb-2">
                {"RAAHIM".split("").map((c, i) => (
                  <span key={`a${i}`} className="inline-block">
                    {c}
                  </span>
                ))}
              </span>
              <span className="text-gradient block leading-[1.1] pb-2">
                {"JAMIL".split("").map((c, i) => (
                  <span key={`b${i}`} className="inline-block">
                    {c}
                  </span>
                ))}
              </span>
            </h1>

            <div className="hero-sub mt-8 flex items-center gap-3 text-lg text-white/70 sm:text-xl">
              <span className="inline-block h-2 w-2 rounded-full bg-[#a78bfa] shadow-[0_0_10px_#a78bfa]" />
              <span className="font-medium text-white/90">{typed}</span>
              <span className="inline-block h-6 w-[2px] animate-pulse bg-[#a78bfa]" />
            </div>

            <p data-parallax="6" className="mt-6 max-w-xl text-white/60">
              Building thoughtful digital products at the intersection of AI,
              quality engineering, and human experience — with a competitive
              edge forged in professional esports.
            </p>

            <div className="hero-cta mt-10 flex flex-wrap items-center gap-4">
              <button
                onClick={() => scrollTo("journey")}
                className="btn-primary rounded-full px-7 py-3.5 font-medium text-white"
              >
                <i className="fa-solid fa-compass mr-2" />
                View My Journey
              </button>
              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                className="btn-ghost rounded-full px-7 py-3.5 font-medium text-white"
              >
                <i className="fa-solid fa-download mr-2" />
                Download Resume
              </a>
              <button
                onClick={() => scrollTo("contact")}
                className="btn-ghost rounded-full px-7 py-3.5 font-medium text-white"
              >
                <i className="fa-regular fa-envelope mr-2" />
                Contact Me
              </button>
            </div>
          </div>

          {/* Portrait */}
          <div data-parallax="14" className="flex justify-center lg:justify-end">
            <div className="hero-portrait profile-ring animate-float relative aspect-square w-64 rounded-full sm:w-80 lg:w-[22rem]">
              <img
                src={profileAsset.url}
                alt="Portrait of Raahim Jamil"
                width={768}
                height={768}
                className="animate-glow-pulse h-full w-full rounded-full object-cover"
              />
              <div className="glass absolute -bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full px-4 py-2 text-xs">
                <i className="fa-solid fa-circle mr-2 text-emerald-400 text-[8px]" />
                Available for opportunities
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <div className="flex flex-col items-center gap-2 text-xs uppercase tracking-[0.3em] text-white/40">
            <span>Scroll</span>
            <div className="relative h-10 w-6 rounded-full border border-white/20">
              <div className="absolute left-1/2 top-2 h-2 w-1 -translate-x-1/2 animate-bounce rounded-full bg-white/60" />
            </div>
          </div>
        </div>
      </section>

      {/* ─── ABOUT ─── */}
      <section id="about" className="relative px-6 py-28">
        <div className="mx-auto max-w-6xl">
          <div className="reveal mb-12 text-center">
            <span className="section-eyebrow">01 · About</span>
            <h2 className="mt-4 font-display text-4xl font-bold sm:text-5xl">
              About <span className="text-gradient">Me</span>
            </h2>
          </div>

          <div className="glass reveal rounded-3xl p-8 sm:p-12">
            <div className="grid gap-8 lg:grid-cols-[1fr_auto]">
              <div className="space-y-5 text-lg leading-relaxed text-white/75">
                <p>
                  I'm an enthusiastic Computer Science student with a strong
                  passion for technology, artificial intelligence, software
                  quality assurance and digital product management.
                </p>
                <p>
                  I enjoy creating user-focused software experiences while
                  continuously learning modern technologies — from clean
                  frontends to AI-driven backends.
                </p>
                <p>
                  Beyond software, I have a competitive background in esports
                  where I represented{" "}
                  <span className="text-gradient font-semibold">Pakistan</span>{" "}
                  professionally in PUBG Mobile and Call of Duty Mobile
                  tournaments.
                </p>
                <p>
                  I care about gadgets, innovation, UI/UX, automation, AI and
                  building products that solve real-world problems.
                </p>
              </div>

              <div className="flex flex-wrap gap-2 lg:max-w-[220px] lg:flex-col">
                {[
                  "🇵🇰 Pakistan",
                  "🎓 CS Student",
                  "🧪 QA Engineer",
                  "🧭 Product Owner",
                  "🎮 Ex-Pro Gamer",
                ].map((t) => (
                  <div key={t} className="pill w-fit">
                    {t}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
            {stats.map((s) => (
              <div
                key={s.label}
                className="glass tilt-card reveal rounded-2xl p-6 text-center"
              >
                <div className="text-gradient font-display text-4xl font-bold sm:text-5xl">
                  {s.value}
                </div>
                <div className="mt-2 text-xs uppercase tracking-widest text-white/60">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── JOURNEY / TIMELINE ─── */}
      <section id="journey" className="relative px-6 py-28">
        <div className="mx-auto max-w-5xl">
          <div className="reveal mb-16 text-center">
            <span className="section-eyebrow">02 · Journey</span>
            <h2 className="mt-4 font-display text-4xl font-bold sm:text-5xl">
              My <span className="text-gradient">Journey</span>
            </h2>
          </div>

          <div className="relative">
            <div className="timeline-line absolute left-4 top-0 h-full w-[2px] md:left-1/2 md:-translate-x-1/2" />

            <div className="space-y-12">
              {journey.map((j, i) => {
                const left = i % 2 === 0;
                return (
                  <div
                    key={j.title}
                    className={`reveal relative grid grid-cols-[auto_1fr] gap-6 md:grid-cols-2 md:gap-12 ${
                      left ? "" : "md:[&>*:first-child]:col-start-2"
                    }`}
                  >
                    {/* Dot */}
                    <div className="absolute left-4 top-6 -translate-x-1/2 md:left-1/2">
                      <div className="animate-glow-pulse h-4 w-4 rounded-full bg-gradient-to-br from-[#7dd3fc] to-[#a78bfa]" />
                    </div>

                    <div
                      className={`col-start-2 md:col-start-auto ${
                        left ? "md:pr-12 md:text-right" : "md:col-start-2 md:pl-12"
                      }`}
                    >
                      <div className="glass tilt-card rounded-2xl p-6">
                        <div
                          className={`mb-3 flex items-center gap-3 ${
                            left ? "md:justify-end" : ""
                          }`}
                        >
                          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-[#a78bfa]/30 to-[#7dd3fc]/30">
                            <i className={`fa-solid ${j.icon} text-[#c4b5fd]`} />
                          </div>
                          <span className="text-xs uppercase tracking-widest text-white/50">
                            {j.period}
                          </span>
                        </div>
                        <h3 className="font-display text-xl font-semibold">
                          {j.title}
                        </h3>
                        <p className="mt-2 text-sm text-white/65">{j.desc}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ─── ESPORTS ─── */}
      <section id="esports" className="relative overflow-hidden px-6 py-28">
        <div
          className="absolute inset-0 -z-10 opacity-40"
          style={{
            background:
              "radial-gradient(ellipse at 50% 40%, rgba(240,171,252,0.25), transparent 60%)",
          }}
        />
        <div className="mx-auto max-w-6xl">
          <div className="reveal mb-14 text-center">
            <span className="section-eyebrow">03 · Esports</span>
            <h2 className="mt-4 font-display text-4xl font-bold sm:text-5xl">
              Professional <span className="text-gradient">Gaming Career</span>
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-white/60">
              Representing Pakistan on the global stage — where split-second
              decisions, coordination, and pressure handling shaped everything I
              build today.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="glass tilt-card reveal relative overflow-hidden rounded-3xl p-8">
              <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[#f0abfc]/20 blur-3xl" />
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#f0abfc]/10 px-3 py-1 text-xs text-[#f0abfc]">
                <i className="fa-solid fa-flag" />
                Represented Pakistan
              </div>
              <h3 className="font-display text-2xl font-bold">
                Professional PUBG Mobile
              </h3>
              <p className="mt-3 text-white/65">
                Competed at national and international tournaments as part of
                Pakistan's competitive scene — tactical rotations, team IGL
                communication, high-pressure late-game closures.
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                {["IGL Comms", "Rotations", "Late Game", "Meta Analysis"].map(
                  (t) => (
                    <span key={t} className="pill">
                      {t}
                    </span>
                  ),
                )}
              </div>
            </div>

            <div className="glass tilt-card reveal relative overflow-hidden rounded-3xl p-8">
              <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[#7dd3fc]/20 blur-3xl" />
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#7dd3fc]/10 px-3 py-1 text-xs text-[#7dd3fc]">
                <i className="fa-solid fa-crosshairs" />
                International Tournaments
              </div>
              <h3 className="font-display text-2xl font-bold">
                Professional Call of Duty Mobile
              </h3>
              <p className="mt-3 text-white/65">
                Multiplayer and Battle Royale competitive circuits — precision
                aim, objective control, split-decision team play at the top
                level.
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                {[
                  "Objective Control",
                  "Precision Aim",
                  "Team Play",
                  "Adaptability",
                ].map((t) => (
                  <span key={t} className="pill">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {[
              { i: "fa-chess", t: "Competitive Mindset" },
              { i: "fa-users", t: "Team Coordination" },
              { i: "fa-lightbulb", t: "Strategic Decisions" },
              { i: "fa-fire", t: "Pressure Handling" },
              { i: "fa-trophy", t: "Tournament Experience" },
            ].map((x) => (
              <div
                key={x.t}
                className="glass reveal flex items-center gap-3 rounded-2xl p-4"
              >
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-gradient-to-br from-[#a78bfa]/30 to-[#7dd3fc]/20">
                  <i className={`fa-solid ${x.i} text-[#c4b5fd]`} />
                </div>
                <span className="text-sm font-medium">{x.t}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PROJECTS ─── */}
      <section id="projects" className="relative px-6 py-28">
        <div className="mx-auto max-w-6xl">
          <div className="reveal mb-14 text-center">
            <span className="section-eyebrow">04 · Work</span>
            <h2 className="mt-4 font-display text-4xl font-bold sm:text-5xl">
              Selected <span className="text-gradient">Projects</span>
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((p) => (
              <article
                key={p.title}
                className="glass tilt-card reveal group relative overflow-hidden rounded-3xl p-8"
              >
                <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[#a78bfa]/0 via-[#7dd3fc]/0 to-[#f0abfc]/0 opacity-0 transition-opacity duration-500 group-hover:opacity-20" />
                <div className="mb-6 grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-[#a78bfa]/30 to-[#7dd3fc]/20 text-2xl text-[#c4b5fd]">
                  <i className={`fa-solid ${p.icon}`} />
                </div>
                <div className="mb-3 text-xs uppercase tracking-widest text-[#c4b5fd]/80">
                  {p.tag}
                </div>
                <h3 className="font-display text-xl font-semibold leading-tight">
                  {p.title}
                </h3>
                <p className="mt-3 text-sm text-white/65">{p.desc}</p>
                <div className="mt-6 inline-flex items-center gap-2 text-sm text-white/80 transition group-hover:gap-3 group-hover:text-white">
                  Case study
                  <i className="fa-solid fa-arrow-right" />
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ─── SKILLS ─── */}
      <section id="skills" className="relative px-6 py-28">
        <div className="mx-auto max-w-6xl">
          <div className="reveal mb-14 text-center">
            <span className="section-eyebrow">05 · Skills</span>
            <h2 className="mt-4 font-display text-4xl font-bold sm:text-5xl">
              Skills & <span className="text-gradient">Tooling</span>
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {skills.map((s) => (
              <div
                key={s.title}
                className="glass tilt-card reveal rounded-3xl p-8"
              >
                <div className="mb-5 flex items-center gap-3">
                  <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-[#a78bfa]/30 to-[#7dd3fc]/20 text-xl text-[#c4b5fd]">
                    <i className={`fa-solid ${s.icon}`} />
                  </div>
                  <h3 className="font-display text-xl font-semibold">
                    {s.title}
                  </h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {s.items.map((it) => (
                    <span key={it} className="pill">
                      {it}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── INTERESTS ─── */}
      <section id="interests" className="relative px-6 py-28">
        <div className="mx-auto max-w-6xl">
          <div className="reveal mb-14 text-center">
            <span className="section-eyebrow">06 · Interests</span>
            <h2 className="mt-4 font-display text-4xl font-bold sm:text-5xl">
              Things I <span className="text-gradient">Love</span>
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {interests.map((x) => (
              <div
                key={x.label}
                className="glass tilt-card reveal flex flex-col items-center gap-3 rounded-2xl p-6 text-center"
              >
                <div className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-[#a78bfa]/30 to-[#7dd3fc]/20 text-2xl text-[#c4b5fd]">
                  <i className={`fa-solid ${x.icon}`} />
                </div>
                <div className="text-sm font-medium">{x.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CONTACT ─── */}
      <section id="contact" className="relative px-6 py-28">
        <div className="mx-auto max-w-4xl">
          <div className="reveal mb-14 text-center">
            <span className="section-eyebrow">07 · Contact</span>
            <h2 className="mt-4 font-display text-4xl font-bold sm:text-5xl">
              Let's <span className="text-gradient">Connect</span>
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-white/60">
              Have a product, role, or idea worth exploring? Drop a message —
              I read everything.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="glass reveal grid gap-4 rounded-3xl p-8 sm:p-10"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="flex flex-col gap-2 text-sm">
                <span className="text-white/60">Name</span>
                <input
                  required
                  type="text"
                  placeholder="Your name"
                  className="glass-strong rounded-xl px-4 py-3 text-white outline-none transition focus:border-[#a78bfa]/60"
                />
              </label>
              <label className="flex flex-col gap-2 text-sm">
                <span className="text-white/60">Email</span>
                <input
                  required
                  type="email"
                  placeholder="you@example.com"
                  className="glass-strong rounded-xl px-4 py-3 text-white outline-none transition focus:border-[#a78bfa]/60"
                />
              </label>
            </div>
            <label className="flex flex-col gap-2 text-sm">
              <span className="text-white/60">Message</span>
              <textarea
                required
                rows={5}
                placeholder="Tell me about your project…"
                className="glass-strong resize-none rounded-xl px-4 py-3 text-white outline-none transition focus:border-[#a78bfa]/60"
              />
            </label>
            <button
              type="submit"
              className="btn-primary mt-2 rounded-full px-8 py-4 font-semibold text-white"
            >
              <i className="fa-solid fa-paper-plane mr-2" />
              Send Message
            </button>
          </form>

          <div className="mt-10 flex flex-wrap justify-center gap-4">
            {[
              { i: "fa-github", href: "#" },
              { i: "fa-linkedin-in", href: "#" },
              { i: "fa-instagram", href: "#" },
              { i: "fa-envelope", href: "#", solid: true },
            ].map((s) => (
              <a
                key={s.i}
                href={s.href}
                aria-label={s.i}
                className="glass tilt-card grid h-14 w-14 place-items-center rounded-2xl text-lg text-white/80 transition hover:text-white"
              >
                <i
                  className={`${s.solid ? "fa-solid" : "fa-brands"} ${s.i}`}
                />
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="relative border-t border-white/5 px-6 py-10 text-center text-sm text-white/50">
        <div className="text-gradient mb-2 font-display text-lg font-bold">
          RAAHIM JAMIL
        </div>
        <div>
          Made with <span className="text-[#f472b6]">❤</span> by Raahim Jamil
          {" · "}© {new Date().getFullYear()}
        </div>
      </footer>

      {/* Back to top */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="Back to top"
        className={`btn-primary fixed bottom-6 right-6 z-50 grid h-12 w-12 place-items-center rounded-full text-white transition-all ${
          showTop ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <i className="fa-solid fa-arrow-up" />
      </button>
    </div>
  );
}
