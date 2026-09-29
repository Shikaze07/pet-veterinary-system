"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Stethoscope,
  Calendar,
  ClipboardList,
  Pill,
  FileText,
  Smartphone,
  ShieldCheck,
  MapPin,
  Clock,
  Phone,
  Mail,
  Navigation as NavigationIcon,
  Star,
  Menu,
  X,
  Download,
  CheckCircle2,
} from "lucide-react";
import { useState } from "react";

const services = [
  { title: "Digital Medical Records", desc: "Complete health history always accessible. View consultations, treatments, and allergy profiles instantly.", icon: ClipboardList },
  { title: "Easy Scheduling", desc: "Book visits online with real-time confirmations and automated reminders sent directly to you.", icon: Calendar },
  { title: "Preventive Care", desc: "Vaccination and deworming tracking with proactive alerts to ensure no dose is ever missed.", icon: ShieldCheck },
  { title: "Pharmacy & Medication", desc: "In-house pharmacy with premium medications. Seamless prescription tracking and refill management.", icon: Pill },
  { title: "Clinical Documentation", desc: "Detailed treatment logs, diagnostic summaries, and medical history always accessible.", icon: FileText },
  { title: "Health Monitoring", desc: "Real-time status updates and treatment progress tracking throughout your pet's care.", icon: Smartphone },
];

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <style>{`
        :root {
          --cream: #F7F5F0;
          --warm-white: #FDFCFA;
          --charcoal: #1C1C1C;
          --mid: #6B6560;
          --light: #B8B0A6;
          --teal: #2A6B6B;
          --teal-light: #3D8585;
          --teal-pale: #EAF2F2;
          --border: #E8E4DE;
          --dark: #111111;
        }

        .ff-d { font-family: 'Playfair Display', Georgia, serif; }
        .ff-b { font-family: 'DM Sans', system-ui, sans-serif; }

        .reveal { opacity: 0; transform: translateY(16px); animation: revealUp 0.65s ease forwards; }
        .r1 { animation-delay: 0.05s; }
        .r2 { animation-delay: 0.18s; }
        .r3 { animation-delay: 0.30s; }
        .r4 { animation-delay: 0.42s; }
        @keyframes revealUp { to { opacity: 1; transform: translateY(0); } }

        .btn-p {
          display: inline-flex; align-items: center; gap: 0.45rem;
          background: var(--teal); color: #fff;
          font-family: 'DM Sans', sans-serif; font-size: 0.78rem;
          font-weight: 500; letter-spacing: 0.09em; text-transform: uppercase;
          padding: 0.72rem 1.6rem; border: none; cursor: pointer;
          transition: background 0.2s; text-decoration: none;
        }
        .btn-p:hover { background: var(--teal-light); }

        .btn-o {
          display: inline-flex; align-items: center; gap: 0.45rem;
          background: transparent; color: var(--charcoal);
          font-family: 'DM Sans', sans-serif; font-size: 0.78rem;
          font-weight: 500; letter-spacing: 0.09em; text-transform: uppercase;
          padding: 0.72rem 1.6rem; border: 1px solid var(--border); cursor: pointer;
          transition: border-color 0.2s, color 0.2s; text-decoration: none;
        }
        .btn-o:hover { border-color: var(--charcoal); }

        .tag {
          display: inline-block; border: 1px solid var(--teal);
          color: var(--teal); font-family: 'DM Sans', sans-serif;
          font-size: 0.67rem; letter-spacing: 0.16em; text-transform: uppercase;
          padding: 0.28rem 0.8rem; border-radius: 100px;
        }

        .nav-link {
          font-family: 'DM Sans', sans-serif; font-size: 0.8rem;
          letter-spacing: 0.03em; color: var(--mid);
          text-decoration: none; transition: color 0.2s;
        }
        .nav-link:hover { color: var(--charcoal); }

        .container {
          max-width: 1180px; margin: 0 auto; padding: 0 1.5rem;
        }

        .responsive-grid {
          display: grid; grid-template-columns: 1fr; gap: 3rem; align-items: center;
        }
        @media (min-width: 992px) {
          .responsive-grid { grid-template-columns: 1fr 1fr; gap: 5rem; }
          .container { padding: 0 2rem; }
        }

        .svc-row { border-top: 1px solid var(--border); padding: 1.75rem 1.25rem; transition: background 0.22s; }
        .svc-row:last-child { border-bottom: 1px solid var(--border); }
        .svc-row:hover { background: var(--teal-pale); }
        .svc-row:hover .svc-icon { color: var(--teal); }

        .info-r {
          display: flex; gap: 1.1rem; align-items: flex-start;
          padding: 1.15rem 0; border-bottom: 1px solid rgba(255,255,255,0.07);
        }

        .stat { 
          display: flex; 
          flex-direction: column; 
          align-items: center; 
          text-align: center;
          min-width: 80px;
        }
        @media (min-width: 640px) {
          .stat { min-width: 100px; }
          .stat + .stat {
            border-left: 1px solid var(--border);
          }
        }
        @media (max-width: 640px) {
          .hero-stats { gap: 1.5rem !important; }
        }

        footer a { color: inherit; text-decoration: none; transition: color 0.2s; }
        footer a:hover { color: var(--teal-light); }

        .store-badge {
          display: inline-flex; align-items: center; gap: 0.7rem;
          background: var(--charcoal); color: #fff;
          font-family: 'DM Sans', sans-serif; padding: 0.7rem 1.4rem;
          border: 1px solid rgba(255,255,255,0.1); text-decoration: none;
          transition: background 0.2s, border-color 0.2s; cursor: pointer;
        }
        .store-badge:hover { background: #2e2e2e; border-color: rgba(255,255,255,0.25); }

        .rating-stars { display: flex; gap: 2px; }

        .mobile-nav-overlay {
          position: fixed; top: 0; left: 0; width: 100%; height: 100%;
          background: rgba(0,0,0,0.5); z-index: 100;
          opacity: 0; pointer-events: none; transition: opacity 0.3s;
        }
        .mobile-nav-overlay.open { opacity: 1; pointer-events: auto; }

        .mobile-menu {
          position: fixed; top: 0; right: 0; width: 80%; max-width: 320px; height: 100%;
          background: var(--warm-white); z-index: 101;
          transform: translateX(100%); transition: transform 0.3s ease;
          padding: 2rem; display: flex; flex-direction: column; gap: 1.5rem;
          box-shadow: -4px 0 16px rgba(0,0,0,0.1);
        }
        .mobile-menu.open { transform: translateX(0); }

        .hidden-mobile { display: none; }
        @media (min-width: 992px) {
          .hidden-mobile { display: flex; }
          .visible-mobile { display: none; }
        }

        @media (max-width: 992px) {
           .hero-content { text-align: center; margin: 0 auto; align-items: center; display: flex; flex-direction: column; }
           .hero-title { font-size: 2.6rem !important; }
           .hero-stats { justify-content: center; }
        }

        @keyframes phoneFloat {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-8px);
          }
        }

        .phone-stage {
          position: relative;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 1.5rem 0.5rem;
          width: 100%;
        }

        .phone-glow {
          position: absolute;
          width: 280px;
          height: 480px;
          background: radial-gradient(circle, rgba(42, 107, 107, 0.22) 0%, rgba(42, 107, 107, 0.05) 55%, transparent 75%);
          filter: blur(45px);
          pointer-events: none;
          z-index: 0;
        }

        .phone-wrapper {
          position: relative;
          z-index: 1;
          animation: phoneFloat 6s ease-in-out infinite;
          transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .phone-wrapper:hover {
          transform: translateY(-6px) scale(1.02);
        }

        .phone-mockup-img {
          display: block;
          width: 100%;
          max-width: 300px;
          height: auto;
          filter: drop-shadow(0 24px 44px rgba(28, 28, 28, 0.22)) drop-shadow(0 8px 16px rgba(42, 107, 107, 0.12));
        }

        .floating-badge {
          position: absolute;
          background: rgba(255, 255, 255, 0.96);
          backdrop-filter: blur(12px);
          border: 1px solid var(--border);
          box-shadow: 0 12px 28px rgba(0, 0, 0, 0.08);
          border-radius: 14px;
          padding: 0.65rem 0.95rem;
          display: flex;
          align-items: center;
          gap: 0.7rem;
          z-index: 2;
          pointer-events: none;
        }

        .badge-top {
          top: 12%;
          right: -1rem;
          animation: phoneFloat 6s ease-in-out infinite 1.5s;
        }

        .badge-bottom {
          bottom: 12%;
          left: -1rem;
          animation: phoneFloat 6s ease-in-out infinite 3s;
        }

        @media (max-width: 1100px) {
          .badge-top { right: -0.5rem; }
          .badge-bottom { left: -0.5rem; }
        }

        @media (max-width: 992px) {
          .phone-stage {
            margin-top: 1.5rem;
          }
        }

        @media (max-width: 640px) {
          .floating-badge {
            display: none !important;
          }
          .phone-mockup-img {
            max-width: 260px;
          }
        }
      `}</style>

      <div style={{ background: 'var(--warm-white)', minHeight: '100vh' }}>

        {/* ─── MOBILE NAV OVERLAY ─── */}
        <div
          className={`mobile-nav-overlay ${mobileMenuOpen ? 'open' : ''}`}
          onClick={() => setMobileMenuOpen(false)}
        />

        {/* ─── MOBILE MENU ─── */}
        <div className={`mobile-menu ${mobileMenuOpen ? 'open' : ''}`}>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
            <button
              onClick={() => setMobileMenuOpen(false)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--mid)' }}
            >
              <X size={24} />
            </button>
          </div>
          <a href="#services" className="nav-link" style={{ fontSize: '1.1rem' }} onClick={() => setMobileMenuOpen(false)}>Services</a>
          <a href="#about" className="nav-link" style={{ fontSize: '1.1rem' }} onClick={() => setMobileMenuOpen(false)}>Our Clinic</a>
          <a href="#contact" className="nav-link" style={{ fontSize: '1.1rem' }} onClick={() => setMobileMenuOpen(false)}>Contact</a>
          <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '1rem 0' }} />
          <Link href="/login" className="btn-o" style={{ justifyContent: 'center' }} onClick={() => setMobileMenuOpen(false)}>Admin Login</Link>
          <a href="#download" className="btn-p" style={{ justifyContent: 'center' }} onClick={() => setMobileMenuOpen(false)}>
            <Smartphone size={16} /> Download App
          </a>
        </div>

        {/* ─── HEADER ─── */}
        <header style={{
          position: 'sticky', top: 0, zIndex: 50,
          borderBottom: '1px solid var(--border)',
          background: 'rgba(253,252,250,0.96)',
          backdropFilter: 'blur(8px)',
        }}>
          <div className="container" style={{ height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
              <Stethoscope size={17} style={{ color: 'var(--teal)' }} />
              <span className="ff-d" style={{ fontSize: '1rem', color: 'var(--charcoal)', fontWeight: 400, letterSpacing: '0.01em' }}>
                PetCare <em style={{ color: 'var(--mid)', fontWeight: 400 }}>Clinic</em>
              </span>
            </div>

            <nav className="hidden-mobile" style={{ gap: '2.5rem' }}>
              <a href="#services" className="nav-link">Services</a>
              <a href="#about" className="nav-link">Our Clinic</a>
              <a href="#contact" className="nav-link">Contact</a>
            </nav>

            <div className="hidden-mobile" style={{ gap: '0.6rem', alignItems: 'center' }}>
              <Link href="/login" className="btn-o" style={{ padding: '0.48rem 1.1rem', fontSize: '0.73rem' }}>Admin Login</Link>
              <a href="#download" className="btn-p" style={{ padding: '0.48rem 1.1rem', fontSize: '0.73rem' }}>
                <Smartphone size={13} /> Download App
              </a>
            </div>

            <button
              className="visible-mobile"
              onClick={() => setMobileMenuOpen(true)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--charcoal)' }}
            >
              <Menu size={24} />
            </button>
          </div>
        </header>

        <main>

          {/* ─── HERO ─── */}
          <section style={{ borderBottom: '1px solid var(--border)', padding: '4rem 0 5rem' }}>
            <div className="container responsive-grid">
              <div className="hero-content">
                <div className="tag reveal r1" style={{ marginBottom: '1.75rem' }}>Now Available on Android</div>
                <h1 className="ff-d reveal r2 hero-title" style={{ fontSize: 'clamp(2.4rem, 5vw, 3.8rem)', fontWeight: 400, lineHeight: 1.1, color: 'var(--charcoal)', marginBottom: '1.4rem' }}>
                  Your pet's health,<br />
                  always in your<br />
                  <em style={{ color: 'var(--teal)' }}>pocket.</em>
                </h1>
                <p className="ff-b reveal r3" style={{ fontSize: '0.95rem', color: 'var(--mid)', lineHeight: 1.75, maxWidth: 420, fontWeight: 300, marginBottom: '1.8rem' }}>
                  Manage consultations, access medical records, track vaccinations, and receive health updates — all from the PetCare app.
                </p>

                <div className="reveal r3" style={{ display: 'flex', gap: '0.75rem', marginBottom: '2.5rem', flexWrap: 'wrap' }}>
                  <a href="#download" className="btn-p">
                    <Smartphone size={14} /> View Mobile App
                  </a>
                  <a href="#services" className="btn-o">
                    Explore Services
                  </a>
                </div>
               
                <div className="ff-b reveal r4 hero-stats" style={{ display: 'flex', paddingTop: '2.5rem', borderTop: '1px solid var(--border)', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center' }}>
                  {[['24/7', 'Care'], ['10+', 'Vets'], ['Live', 'Updates']].map(([val, lbl], i) => (
                    <div key={i} className="stat" style={{ padding: '0 1rem' }}>
                      <div style={{ fontSize: '1.5rem', fontWeight: 400, color: 'var(--charcoal)', lineHeight: 1 }}>{val}</div>
                      <div style={{ fontSize: '0.67rem', color: 'var(--light)', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: '0.4rem' }}>{lbl}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ position: 'relative' }}>
                <div style={{ overflow: 'hidden', border: '1px solid var(--border)' }}>
                  <Image
                    src="/landing-hero.png"
                    alt="Veterinary professional with pet"
                    width={800} height={580}
                    style={{ width: '100%', height: 'auto', display: 'block', objectFit: 'cover' }}
                    priority
                  />
                </div>
                <div className="ff-b hidden-mobile" style={{
                  position: 'absolute', bottom: '1.4rem', left: '1.4rem',
                  background: 'rgba(253,252,250,0.95)', backdropFilter: 'blur(6px)',
                  border: '1px solid var(--border)', padding: '0.85rem 1.1rem',
                  display: 'flex', alignItems: 'center', gap: '0.7rem',
                }}>
                  <MapPin size={14} style={{ color: 'var(--teal)', flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: '0.76rem', fontWeight: 500, color: 'var(--charcoal)' }}>Koronadal City, South Cotabato</div>
                    <div style={{ fontSize: '0.66rem', color: 'var(--light)', letterSpacing: '0.09em', textTransform: 'uppercase', marginTop: 2 }}>General Santos Drive</div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ─── SERVICES ─── */}
          <section id="services" style={{ padding: '5rem 0', background: 'var(--cream)' }}>
            <div className="container">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3.5rem', paddingBottom: '2.5rem', borderBottom: '1px solid var(--border)', flexWrap: 'wrap', gap: '2rem' }}>
                <div>
                  <div className="tag ff-b" style={{ marginBottom: '1.2rem' }}>What We Offer</div>
                  <h2 className="ff-d" style={{ fontSize: 'clamp(1.8rem, 3.2vw, 2.6rem)', fontWeight: 400, color: 'var(--charcoal)', lineHeight: 1.15 }}>
                    Comprehensive<br />Pet Healthcare.
                  </h2>
                </div>
                <p className="ff-b" style={{ fontSize: '0.85rem', color: 'var(--mid)', maxWidth: 320, lineHeight: 1.75, fontWeight: 300 }}>
                  From routine check-ups to specialized care — we manage every stage of your pet's wellness journey.
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0 2.5rem' }}>
                {services.map((s, i) => (
                  <div key={i} className="svc-row ff-b">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.8rem' }}>
                      <s.icon size={18} className="svc-icon" style={{ color: 'var(--mid)', transition: 'color 0.22s' }} />
                      <span style={{ fontSize: '0.64rem', color: 'var(--light)', letterSpacing: '0.12em' }}>{String(i + 1).padStart(2, '0')}</span>
                    </div>
                    <h3 style={{ fontSize: '0.95rem', fontWeight: 500, color: 'var(--charcoal)', marginBottom: '0.5rem' }}>{s.title}</h3>
                    <p style={{ fontSize: '0.83rem', color: 'var(--mid)', lineHeight: 1.7, fontWeight: 300 }}>{s.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ─── DOWNLOAD APP ─── */}
          <section id="download" style={{ padding: '6rem 0', background: 'var(--warm-white)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
            <div className="container responsive-grid">
              <div className="hero-content">
                <div className="tag ff-b" style={{ marginBottom: '1.5rem' }}>Mobile App</div>
                <h2 className="ff-d" style={{ fontSize: 'clamp(2rem, 3.5vw, 3rem)', fontWeight: 400, color: 'var(--charcoal)', lineHeight: 1.15, marginBottom: '1.2rem' }}>
                  Everything your<br />pet needs,<br /><em style={{ color: 'var(--teal)' }}>one tap away.</em>
                </h2>
                <p className="ff-b" style={{ fontSize: '0.9rem', color: 'var(--mid)', lineHeight: 1.8, fontWeight: 300, maxWidth: 420, marginBottom: '2.5rem' }}>
                  Book visits, view records, receive vaccination reminders, and stay updated on your pet's care — anytime, anywhere.
                </p>

                <div className="ff-b" style={{ width: '100%', maxWidth: 440, marginBottom: '2rem' }}>
                  {[
                    'Book & manage clinic visits with instant status tracking',
                    'Access complete medical history and treatment logs',
                    'Automated vaccination & deworming push reminders',
                    'Direct contact with clinic emergency hotlines and hours',
                    'Offline access with seamless cloud synchronization',
                  ].map((feat, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', padding: '0.7rem 0', borderBottom: '1px solid var(--border)' }}>
                      <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--teal)', flexShrink: 0 }} />
                      <span style={{ fontSize: '0.85rem', color: 'var(--mid)', fontWeight: 300 }}>{feat}</span>
                    </div>
                  ))}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem', width: '100%', maxWidth: 440 }}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
                    <a
                      href="/PetCareClinic.apk"
                      download="PetCareClinic.apk"
                      className="btn-p"
                      style={{
                        padding: '0.85rem 1.8rem',
                        fontSize: '0.82rem',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.65rem',
                        boxShadow: '0 8px 22px rgba(42, 107, 107, 0.25)',
                      }}
                    >
                      <Download size={16} /> Download APK (v1.0)
                    </a>
                    <span style={{ fontSize: '0.78rem', color: 'var(--mid)', fontWeight: 400 }}>
                      Android 7.0+ • ~6.3 MB • Free
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--teal)', fontSize: '0.76rem', fontWeight: 500, marginTop: '0.2rem' }}>
                    <CheckCircle2 size={15} />
                    <span>Connected with live clinic database & instant sync</span>
                  </div>
                </div>
              </div>

              <div className="phone-stage">
                <div className="phone-glow" />

                {/* Floating badge 1: Live Cloud Sync */}
                <div className="floating-badge badge-top ff-b">
                  <div style={{
                    width: 34, height: 34, borderRadius: '50%',
                    background: 'var(--teal-pale)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'var(--teal)', flexShrink: 0,
                  }}>
                    <CheckCircle2 size={17} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.76rem', fontWeight: 600, color: 'var(--charcoal)' }}>Live Database Sync</div>
                    <div style={{ fontSize: '0.66rem', color: 'var(--mid)' }}>Cloud & Mobile Connected</div>
                  </div>
                </div>

                {/* Main Phone Image */}
                <div className="phone-wrapper">
                  <Image
                    src="/app.png"
                    alt="PetCare Android Mobile App Interface"
                    width={350}
                    height={748}
                    className="phone-mockup-img"
                    priority
                  />
                </div>

                {/* Floating badge 2: Pet Owner Dashboard */}
                <div className="floating-badge badge-bottom ff-b">
                  <div style={{
                    width: 34, height: 34, borderRadius: '50%',
                    background: '#FEF3C7',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#D97706', flexShrink: 0,
                  }}>
                    <Star size={16} fill="#D97706" />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.76rem', fontWeight: 600, color: 'var(--charcoal)' }}>Pet Owner Dashboard</div>
                    <div style={{ fontSize: '0.66rem', color: 'var(--mid)' }}>Instant Booking & Records</div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ─── CONTACT ─── */}
          <section id="contact" style={{ padding: '6rem 0', background: 'var(--charcoal)' }}>
            <div className="container responsive-grid">
              <div>
                <div className="tag ff-b" style={{ borderColor: 'rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.45)', marginBottom: '1.5rem' }}>Visit Us</div>
                <h2 className="ff-d" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)', fontWeight: 400, color: '#fff', lineHeight: 1.2, marginBottom: '1.1rem' }}>
                  Find us in<br />Koronadal City.
                </h2>
                <p className="ff-b" style={{ fontSize: '0.88rem', color: 'rgba(255,255,255,0.45)', lineHeight: 1.75, maxWidth: 400, marginBottom: '2.5rem' }}>
                  Serving pet owners across South Cotabato with excellence.
                </p>

                <div className="ff-b" style={{ marginBottom: '2.5rem' }}>
                  {[
                    { icon: MapPin, label: 'Address', lines: ['General Santos Drive, Koronadal City', 'South Cotabato 9506'] },
                    { icon: Phone, label: 'Phone', lines: ['+63 (083) 228-1234', '+63 917 555 7890'] },
                    { icon: Mail, label: 'Email', lines: ['hello@petcareclinic.com'] },
                    { icon: Clock, label: 'Hours', lines: ['Mon–Fri: 8:00 AM – 6:00 PM', 'Saturday: 9:00 AM – 4:00 PM'] },
                  ].map(({ icon: Icon, label, lines }, i) => (
                    <div key={i} className="info-r">
                      <Icon size={14} style={{ color: 'var(--teal-light)', marginTop: 4, flexShrink: 0 }} />
                      <div>
                        <div style={{ fontSize: '0.65rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: '0.4rem' }}>{label}</div>
                        {lines.map((line, j) => (
                          <div key={j} style={{ fontSize: '0.85rem', fontWeight: 300, lineHeight: 1.6, color: 'rgba(255,255,255,0.6)' }}>{line}</div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <a href="#" className="btn-p">
                  <NavigationIcon size={13} /> Open in Maps
                </a>
              </div>

              <div style={{ width: '100%', height: 450, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
                <iframe
                  width="100%" height="100%"
                  style={{ border: 0, filter: 'grayscale(1) invert(0.9) contrast(0.9) brightness(0.9)' }}
                  loading="lazy" allowFullScreen referrerPolicy="no-referrer-when-downgrade"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15844.786524331405!2d124.8488347!3d6.4947932!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x32f3065a3d463d11%3A0xc3f14068593ccf97!2sKoronadal%20City%2C%20South%20Cotabato!5e0!3m2!1sen!2sph!4v1711900000000!5m2!1sen!2sph"
                />
              </div>
            </div>
          </section>

          {/* ─── CTA ─── */}
          <section style={{ padding: '7rem 0', background: 'var(--teal)' }}>
            <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '3.5rem' }}>
              <div style={{ maxWidth: 540 }}>
                <div className="tag ff-b" style={{ borderColor: 'rgba(255,255,255,0.25)', color: 'rgba(255,255,255,0.5)', marginBottom: '1.5rem' }}>Download Now</div>
                <h2 className="ff-d" style={{ fontSize: 'clamp(2.2rem, 4vw, 3.2rem)', fontWeight: 400, color: '#fff', lineHeight: 1.15, marginBottom: '1.2rem' }}>
                  Ready to provide the<br />best care for your pet?
                </h2>
                <p className="ff-b" style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.65)', lineHeight: 1.8, maxWidth: 440 }}>
                  Free on Android. Join thousands of pet owners who manage their pet's health with PetCare Clinic.
                </p>
              </div>
              <div>
                <a
                  href="/PetCareClinic.apk"
                  download="PetCareClinic.apk"
                  className="btn-p"
                  style={{
                    background: '#fff',
                    color: 'var(--teal)',
                    padding: '0.9rem 1.8rem',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    letterSpacing: '0.05em',
                    boxShadow: '0 12px 28px rgba(0,0,0,0.2)',
                    transition: 'all 0.2s',
                  }}
                >
                  <Download size={16} /> Download Android App (.apk)
                </a>
              </div>
            </div>
          </section>

        </main>

        {/* ─── FOOTER ─── */}
        <footer style={{ background: 'var(--dark)', padding: '5rem 0', color: 'rgba(255,255,255,0.35)' }}>
          <div className="container">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '3.5rem', marginBottom: '3rem', paddingBottom: '3rem', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
              <div className="ff-b">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.2rem' }}>
                  <Stethoscope size={15} style={{ color: 'var(--teal-light)' }} />
                  <span className="ff-d" style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.8)', fontWeight: 400 }}>PetCare Clinic</span>
                </div>
                <p style={{ fontSize: '0.8rem', lineHeight: 1.85, fontWeight: 300, maxWidth: 300, marginBottom: '1.2rem' }}>
                  Advanced pet healthcare combining digital intelligence with expert medicine.
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.78rem' }}>
                  <MapPin size={13} /><span>South Cotabato, Philippines</span>
                </div>
              </div>

              {[
                { heading: 'Navigation', links: [['#services', 'Services'], ['#download', 'Mobile App'], ['#contact', 'Contact'], ['/login', 'Admin Login']] },
                { heading: 'Legal', links: [['#', 'Privacy Policy'], ['#', 'Terms of Use'], ['#', 'Accessibility']] },
              ].map(({ heading, links }) => (
                <div key={heading} className="ff-b">
                  <div style={{ fontSize: '0.68rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)', marginBottom: '1.5rem', fontWeight: 500 }}>{heading}</div>
                  {links.map(([href, label]) => (
                    <div key={label} style={{ marginBottom: '0.8rem' }}>
                      <a href={href} style={{ fontSize: '0.84rem', fontWeight: 300 }}>{label}</a>
                    </div>
                  ))}
                </div>
              ))}
            </div>

            <div className="ff-b" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', flexWrap: 'wrap', gap: '1rem' }}>
              <span>© {new Date().getFullYear()} PetCare Clinic. All rights reserved.</span>
              <span style={{ color: 'rgba(255,255,255,0.15)' }}>Wellness · Surgery · Pharmacy · Diagnostics</span>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}