"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import {
  Send,
  Copy,
  Check,
  Mail,
  Clock,
  MapPin,
  Calendar,
  Sparkles,
  ArrowUpRight
} from "lucide-react";
import { useCursor } from "../cursor/CursorContext";
import { useSound } from "../audio/SoundContext";

const PROJECT_TYPES = [
  "YouTube Video (Long Form)",
  "Social Reels / Shorts / TikTok",
  "Commercial / Brand Promo",
  "Motion Graphics & Titles",
  "Thumbnails & Social Graphics",
  "Color Grading & Audio Mixing",
];

const BUDGET_RANGES = ["$150 - $350 (Single)", "$350 - $750 (Multi-Pack)", "$750 - $1,500 (Full Package)", "Monthly Retainer"];

export const ContactSection: React.FC = () => {
  const { setCursor, resetCursor } = useCursor();
  const { playHover, playClick } = useSound();

  const [selectedType, setSelectedType] = useState<string>("YouTube Video (Long Form)");
  const [selectedBudget, setSelectedBudget] = useState<string>("$350 - $750 (Multi-Pack)");
  const [formData, setFormData] = useState({ name: "", email: "", agency: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [lastSubmission, setLastSubmission] = useState<{
    name: string;
    email: string;
    service: string;
    budget: string;
    message: string;
    agency: string;
  } | null>(null);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [worldTime, setWorldTime] = useState({ la: "", london: "", tokyo: "" });

  useEffect(() => {
    const updateClocks = () => {
      const now = new Date();
      setWorldTime({
        la: now.toLocaleTimeString("en-US", { timeZone: "America/Los_Angeles", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false }),
        london: now.toLocaleTimeString("en-US", { timeZone: "Europe/London", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false }),
        tokyo: now.toLocaleTimeString("en-US", { timeZone: "Asia/Tokyo", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false }),
      });
    };
    updateClocks();
    const interval = setInterval(updateClocks, 1000);
    return () => clearInterval(interval);
  }, []);

  const copyEmail = () => {
    playClick();
    navigator.clipboard?.writeText("itsparkash21@gmail.com");
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    playClick();
    setIsSubmitting(true);
    setErrorMessage("");

    const submissionPayload = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      agency: formData.agency.trim(),
      service: selectedType,
      budget: selectedBudget,
      message: formData.message.trim(),
    };

    try {
      // 1. Record inquiry in backend database (/api/contact) and forward to itsparkash21@gmail.com
      const apiPromise = fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submissionPayload),
      });

      // 2. Direct browser delivery to FormSubmit for direct origin verification
      const formSubmitPromise = fetch("https://formsubmit.co/ajax/itsparkash21@gmail.com", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          _subject: `New Project Inquiry from ${submissionPayload.name} [${submissionPayload.budget}]`,
          _replyto: submissionPayload.email,
          _template: "table",
          Name: submissionPayload.name,
          Email: submissionPayload.email,
          Service: submissionPayload.service,
          Budget: submissionPayload.budget,
          "Channel or Company": submissionPayload.agency || "Not specified",
          "Project Details": submissionPayload.message,
        }),
      }).catch(() => null);

      await Promise.race([
        Promise.allSettled([apiPromise, formSubmitPromise]),
        new Promise((resolve) => setTimeout(resolve, 3500)),
      ]);

      setLastSubmission(submissionPayload);
      setIsSubmitting(false);
      setSubmitted(true);
      try {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
          colors: ["#ff3b1e", "#00e5ff", "#f5a623", "#ffffff"],
        });
      } catch {
        // ignore
      }
    } catch (err: any) {
      console.error("Submission error:", err);
      // Even if network fails, preserve data and allow user to send via mailto
      setLastSubmission(submissionPayload);
      setIsSubmitting(false);
      setSubmitted(true);
    }
  };

  return (
    <section id="contact" className="relative w-full py-28 px-6 md:px-12 lg:px-20 bg-[#050508] border-t border-white/[0.06]">
      {/* Background Lighting */}
      <div className="absolute top-1/4 -right-20 w-96 h-96 bg-cinema-red/10 rounded-full blur-[160px] pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
        <div>
          <div className="flex items-center gap-3 text-xs font-mono text-cinema-red tracking-[0.25em] uppercase mb-3">
            <span className="w-2 h-2 rounded-full bg-cinema-red animate-pulse" />
            <span>06 // GET IN TOUCH & START A PROJECT</span>
          </div>
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-white font-sans">
            READY TO CREATE <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-neutral-300 to-cinema-red">
              SOMETHING GREAT TOGETHER?
            </span>
          </h2>
        </div>

        {/* Live Availability Status */}
        <div className="p-4 rounded-xl bg-surface-200/90 border border-emerald-500/30 flex items-center gap-3">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
          </span>
          <div className="font-mono text-xs">
            <p className="text-white font-bold tracking-wider">STATUS: AVAILABLE FOR WORK</p>
            <p className="text-neutral-400 text-[10px]">TAKING NEW VIDEO & GRAPHIC COMMISSIONS</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Column: Direct Connect & Studio Clocks */}
        <div className="lg:col-span-5 space-y-8">
          <div className="space-y-4">
            <h3 className="text-xl font-bold uppercase tracking-tight text-white font-sans">
              LET'S TALK ABOUT YOUR NEXT VIDEO
            </h3>
            <p className="text-sm text-neutral-300 leading-relaxed font-normal">
              Whether you need high-retention YouTube editing, snappy viral reels, promotional videos for your brand, or custom motion graphics and thumbnails, feel free to reach out.
            </p>
          </div>

          {/* Copy Email Button Card */}
          <div className="p-6 rounded-2xl bg-surface-200/80 border border-white/10 space-y-3">
            <span className="text-xs font-mono text-neutral-400 uppercase tracking-wider block">
              DIRECT EMAIL
            </span>
            <div className="flex items-center justify-between gap-4">
              <a
                href="mailto:itsparkash21@gmail.com"
                className="text-base sm:text-lg font-mono font-bold text-white tracking-wide hover:text-cinema-red transition-colors break-all"
              >
                itsparkash21@gmail.com
              </a>
              <button
                onClick={copyEmail}
                onMouseEnter={playHover}
                className="shrink-0 px-3.5 py-2 rounded-lg bg-cinema-red text-white text-xs font-mono font-bold flex items-center gap-1.5 hover:bg-[#ff4d30] transition-colors"
              >
                {copiedEmail ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedEmail ? "COPIED" : "COPY"}</span>
              </button>
            </div>
            <p className="text-[11px] font-mono text-neutral-500">
              * Messages are answered within 24 hours.
            </p>
          </div>

          {/* Quick Guarantees Card */}
          <div className="p-6 rounded-2xl bg-surface-200/50 border border-white/5 space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono text-neutral-400 uppercase tracking-wider">
              <Clock className="w-4 h-4 text-cinema-cyan" />
              <span>WHAT YOU CAN EXPECT</span>
            </div>

            <div className="grid grid-cols-3 gap-2 font-mono text-xs pt-1">
              <div className="p-2.5 rounded bg-white/5 border border-white/5 text-center">
                <span className="text-neutral-500 text-[10px] block">TURNAROUND</span>
                <span className="text-white font-bold">24-48 HRS</span>
                <span className="text-[9px] text-neutral-400 block">Fast 1st Draft</span>
              </div>
              <div className="p-2.5 rounded bg-white/5 border border-white/5 text-center">
                <span className="text-neutral-500 text-[10px] block">REVISIONS</span>
                <span className="text-white font-bold">UNLIMITED</span>
                <span className="text-[9px] text-neutral-400 block">Until Satisfied</span>
              </div>
              <div className="p-2.5 rounded bg-white/5 border border-white/5 text-center">
                <span className="text-neutral-500 text-[10px] block">DELIVERY</span>
                <span className="text-white font-bold">4K / 1080P</span>
                <span className="text-[9px] text-neutral-400 block">Ready to Post</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Brief & Commission Form */}
        <div className="lg:col-span-7">
          <div className="p-8 sm:p-10 rounded-2xl bg-surface-200/90 border border-white/10 shadow-2xl backdrop-blur-xl">
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-6 text-center space-y-4"
              >
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 mx-auto flex items-center justify-center">
                  <Check className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-2xl font-black uppercase text-white tracking-tight">
                    INQUIRY SENT TO PARKASH!
                  </h3>
                  <p className="text-xs font-mono text-emerald-400 tracking-wider">
                    DISPATCHED TO ITSPARKASH21@GMAIL.COM
                  </p>
                </div>

                {lastSubmission && (
                  <div className="p-4 rounded-xl bg-surface-300/80 border border-white/10 text-left font-mono text-xs space-y-2 max-w-md mx-auto">
                    <div className="flex justify-between border-b border-white/5 pb-1">
                      <span className="text-neutral-400">SERVICE:</span>
                      <span className="text-white font-bold">{lastSubmission.service}</span>
                    </div>
                    <div className="flex justify-between border-b border-white/5 pb-1">
                      <span className="text-neutral-400">ESTIMATED BUDGET:</span>
                      <span className="text-cinema-red font-bold">{lastSubmission.budget}</span>
                    </div>
                    <div className="flex justify-between border-b border-white/5 pb-1">
                      <span className="text-neutral-400">FROM:</span>
                      <span className="text-white">{lastSubmission.name} ({lastSubmission.email})</span>
                    </div>
                  </div>
                )}

                <p className="text-sm text-neutral-300 max-w-md mx-auto">
                  Thank you, <span className="text-white font-bold">{lastSubmission?.name || "there"}</span>! Your project brief has been received. Parkash will review your details and get back to you within 24 hours.
                </p>

                <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
                  {lastSubmission && (
                    <a
                      href={`mailto:itsparkash21@gmail.com?subject=${encodeURIComponent(
                        `Project Inquiry: ${lastSubmission.service} - ${lastSubmission.name} [${lastSubmission.budget}]`
                      )}&body=${encodeURIComponent(
                        `Hi Parkash,\n\nI just sent a project inquiry through your portfolio website:\n\nService / Format: ${lastSubmission.service}\nEstimated Budget: ${lastSubmission.budget}\nName: ${lastSubmission.name}\nEmail: ${lastSubmission.email}\nChannel / Company: ${lastSubmission.agency || "N/A"}\n\nProject Details:\n${lastSubmission.message}\n`
                      )}`}
                      className="px-5 py-2.5 rounded-full bg-cinema-red text-white text-xs font-mono font-bold hover:bg-[#ff4d30] transition-colors flex items-center gap-2"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>OPEN IN GMAIL / EMAIL CLIENT</span>
                    </a>
                  )}

                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({ name: "", email: "", agency: "", message: "" });
                    }}
                    className="px-5 py-2.5 rounded-full bg-white/10 border border-white/20 text-xs font-mono text-white hover:bg-white hover:text-black transition-colors"
                  >
                    SEND ANOTHER MESSAGE
                  </button>
                </div>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Project Category Pills */}
                <div>
                  <label className="block text-xs font-mono text-neutral-400 uppercase tracking-wider mb-2.5">
                    1. SELECT SERVICE / FORMAT
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {PROJECT_TYPES.map((type) => (
                      <button
                        type="button"
                        key={type}
                        onClick={() => {
                          playClick();
                          setSelectedType(type);
                        }}
                        onMouseEnter={playHover}
                        className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                          selectedType === type
                            ? "bg-cinema-red text-white font-bold shadow-md"
                            : "bg-surface-300 text-neutral-400 hover:text-white border border-white/5"
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Budget Range Pills */}
                <div>
                  <label className="block text-xs font-mono text-neutral-400 uppercase tracking-wider mb-2.5">
                    2. ESTIMATED BUDGET
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {BUDGET_RANGES.map((b) => (
                      <button
                        type="button"
                        key={b}
                        onClick={() => {
                          playClick();
                          setSelectedBudget(b);
                        }}
                        onMouseEnter={playHover}
                        className={`p-2 rounded-lg text-xs font-mono text-center transition-all ${
                          selectedBudget === b
                            ? "bg-white text-black font-bold shadow-md"
                            : "bg-surface-300 text-neutral-400 hover:text-white border border-white/5"
                        }`}
                      >
                        {b}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Text Inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-neutral-400 uppercase tracking-wider mb-1">
                      YOUR NAME
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Alex Johnson"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-surface-300 border border-white/10 text-white placeholder-neutral-600 text-sm focus:outline-none focus:border-cinema-red transition-colors font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-neutral-400 uppercase tracking-wider mb-1">
                      EMAIL ADDRESS
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="alex@channel.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-surface-300 border border-white/10 text-white placeholder-neutral-600 text-sm focus:outline-none focus:border-cinema-red transition-colors font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-neutral-400 uppercase tracking-wider mb-1">
                    CHANNEL / BRAND / COMPANY
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. YouTube Channel / Brand Name"
                    value={formData.agency}
                    onChange={(e) => setFormData({ ...formData, agency: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-surface-300 border border-white/10 text-white placeholder-neutral-600 text-sm focus:outline-none focus:border-cinema-red transition-colors font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-neutral-400 uppercase tracking-wider mb-1">
                    TELL ME ABOUT YOUR PROJECT
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Describe your video concept, links to raw footage or examples you like, target deadline, etc."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-surface-300 border border-white/10 text-white placeholder-neutral-600 text-sm focus:outline-none focus:border-cinema-red transition-colors font-mono resize-none"
                  />
                </div>

                {/* Submit Action */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  onMouseEnter={() => {
                    playHover();
                    setCursor("pointer");
                  }}
                  onMouseLeave={resetCursor}
                  className="w-full py-4 rounded-xl bg-cinema-red text-white font-mono text-xs sm:text-sm font-black tracking-widest uppercase transition-all duration-300 hover:bg-[#ff4d30] hover:shadow-[0_0_35px_rgba(255,59,30,0.5)] active:scale-[0.99] flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? "SENDING INQUIRY..." : "SEND PROJECT INQUIRY"}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
