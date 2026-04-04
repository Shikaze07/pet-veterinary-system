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
} from "lucide-react";
import { useState } from "react";

const services = [
  { title: "Digital Medical Records", desc: "Complete health history always accessible. View consultations, treatments, and allergy profiles instantly.", icon: ClipboardList },
  { title: "Easy Scheduling", desc: "Book visits online with real-time confirmations and automated reminders sent directly to you.", icon: Calendar },
  { title: "Preventive Care", desc: "Vaccination and deworming tracking with proactive alerts to ensure no dose is ever missed.", icon: ShieldCheck },
  { title: "Pharmacy & Medication", desc: "In-house pharmacy with premium medications. Seamless prescription tracking and refill management.", icon: Pill },
  { title: "Transparent Billing", desc: "Itemized invoices for every service. Clear pricing with multiple digital payment options.", icon: FileText },
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
                <p className="ff-b reveal r3" style={{ fontSize: '0.95rem', color: 'var(--mid)', lineHeight: 1.75, maxWidth: 420, fontWeight: 300, marginBottom: '2.25rem' }}>
                  Manage consultations, access medical records, track vaccinations, and receive health updates — all from the PetCare app.
                </p>
                <div className="reveal r4" style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1.5rem', justifyContent: 'center' }}>
                  <a href="#download" className="store-badge">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M3.18 23.76c.3.17.64.22.99.14l12.12-6.99-2.54-2.54-10.57 9.39zm-1.7-20.3C1.18 3.77 1 4.15 1 4.68v14.64c0 .53.19.92.49 1.16l.06.05 8.2-8.2v-.19L1.48 3.46zm17.15 8.09-2.75-1.59-2.83 2.83 2.83 2.83 2.77-1.6c.79-.46.79-1.21-.02-1.47zM4.17.24l12.12 6.99-2.54 2.54L3.18.38c.3-.18.66-.23.99-.14z" /></svg>
                    <div style={{ textAlign: 'left' }}>
                      <div style={{ fontSize: '0.58rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', lineHeight: 1 }}>Get it on</div>
                      <div style={{ fontSize: '0.88rem', fontWeight: 500, lineHeight: 1.3 }}>Google Play</div>
                    </div>
                  </a>
                </div>
                <div className="ff-b reveal r4" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '3rem' }}>
                  <div className="rating-stars">
                    {[...Array(5)].map((_, i) => <Star key={i} size={12} fill="#2A6B6B" color="#2A6B6B" />)}
                  </div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--mid)', fontWeight: 300 }}>4.8 Rating · 2,400+ Pet Owners</span>
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

                <div className="ff-b" style={{ width: '100%', maxWidth: 420, marginBottom: '2.5rem' }}>
                  {[
                    'Book & manage appointments',
                    'View complete medical history',
                    'Vaccination & deworming reminders',
                    'Real-time care status updates',
                    'Digital invoices & payment',
                  ].map((feat, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', padding: '0.7rem 0', borderBottom: '1px solid var(--border)' }}>
                      <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--teal)', flexShrink: 0 }} />
                      <span style={{ fontSize: '0.85rem', color: 'var(--mid)', fontWeight: 300 }}>{feat}</span>
                    </div>
                  ))}
                </div>

                <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap', marginBottom: '1.25rem', justifyContent: 'center' }}>
                  <a href="#" className="store-badge">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M3.18 23.76c.3.17.64.22.99.14l12.12-6.99-2.54-2.54-10.57 9.39zm-1.7-20.3C1.18 3.77 1 4.15 1 4.68v14.64c0 .53.19.92.49 1.16l.06.05 8.2-8.2v-.19L1.48 3.46zm17.15 8.09-2.75-1.59-2.83 2.83 2.83 2.83 2.77-1.6c.79-.46.79-1.21-.02-1.47zM4.17.24l12.12 6.99-2.54 2.54L3.18.38c.3-.18.66-.23.99-.14z" /></svg>
                    <div style={{ textAlign: 'left' }}>
                      <div style={{ fontSize: '0.57rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', lineHeight: 1 }}>Get it on</div>
                      <div style={{ fontSize: '0.9rem', fontWeight: 500, lineHeight: 1.4 }}>Google Play</div>
                    </div>
                  </a>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <div style={{
                  width: '100%', maxWidth: 280, background: 'var(--charcoal)',
                  borderRadius: 36, padding: '14px',
                  boxShadow: '0 32px 64px rgba(0,0,0,0.2)',
                  border: '1px solid rgba(255,255,255,0.08)',
                }}>
                  <div style={{ background: 'var(--cream)', borderRadius: 24, overflow: 'hidden', minHeight: 500 }}>
                    <div style={{ background: 'var(--teal)', padding: '1.25rem 1.5rem 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                      <div>
                        <div style={{ fontSize: '0.62rem', color: 'rgba(255,255,255,0.6)', fontFamily: 'DM Sans', marginBottom: 2 }}>Good morning</div>
                        <div style={{ fontSize: '0.9rem', color: '#fff', fontFamily: 'Playfair Display, serif' }}>Maria Santos</div>
                      </div>
                      <Stethoscope size={18} style={{ color: 'rgba(255,255,255,0.5)' }} />
                    </div>
                    <div style={{ margin: '1rem', background: '#fff', borderRadius: 12, padding: '1rem', border: '1px solid var(--border)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
                        <div style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--charcoal)', fontFamily: 'DM Sans' }}>Mochi</div>
                        <div style={{ fontSize: '0.6rem', background: 'var(--teal-pale)', color: 'var(--teal)', padding: '0.15rem 0.5rem', borderRadius: 100 }}>Healthy</div>
                      </div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--mid)', fontFamily: 'DM Sans' }}>Golden Retriever · 3 yrs</div>
                    </div>
                    <div style={{ margin: '0 1rem 1rem' }}>
                      <div style={{ fontSize: '0.6rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--light)', fontFamily: 'DM Sans', marginBottom: '0.6rem' }}>Next Appointment</div>
                      <div style={{ background: '#fff', borderRadius: 12, padding: '1rem', border: '1px solid var(--border)', display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
                        <div style={{ background: 'var(--teal)', width: 40, height: 40, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <Calendar size={18} style={{ color: '#fff' }} />
                        </div>
                        <div>
                          <div style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--charcoal)' }}>Annual Check-up</div>
                          <div style={{ fontSize: '0.65rem', color: 'var(--mid)' }}>Apr 10 · 9:00 AM</div>
                        </div>
                      </div>
                    </div>
                    <div style={{ margin: '0 1rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
                      {[{ icon: ClipboardList, label: 'Records' }, { icon: Pill, label: 'Pharmacy' }, { icon: ShieldCheck, label: 'Vaccines' }, { icon: FileText, label: 'Billing' }].map(({ icon: Icon, label }) => (
                        <div key={label} style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 12, padding: '0.8rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem' }}>
                          <Icon size={15} style={{ color: 'var(--teal)' }} />
                          <div style={{ fontSize: '0.64rem', color: 'var(--mid)', fontFamily: 'DM Sans' }}>{label}</div>
                        </div>
                      ))}
                    </div>
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
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', alignItems: 'center' }}>
                <a href="#" className="store-badge" style={{ background: 'rgba(255,255,255,0.1)', borderColor: 'rgba(255,255,255,0.15)', minWidth: 220 }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M3.18 23.76c.3.17.64.22.99.14l12.12-6.99-2.54-2.54-10.57 9.39zm-1.7-20.3C1.18 3.77 1 4.15 1 4.68v14.64c0 .53.19.92.49 1.16l.06.05 8.2-8.2v-.19L1.48 3.46zm17.15 8.09-2.75-1.59-2.83 2.83 2.83 2.83 2.77-1.6c.79-.46.79-1.21-.02-1.47zM4.17.24l12.12 6.99-2.54 2.54L3.18.38c.3-.18.66-.23.99-.14z" /></svg>
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontSize: '0.6rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', lineHeight: 1 }}>Get it on</div>
                    <div style={{ fontSize: '1rem', fontWeight: 500, lineHeight: 1.4 }}>Google Play</div>
                  </div>
                </a>
                <div className="ff-b" style={{ display: 'flex', alignItems: 'center', gap: '0.7rem', paddingTop: '0.4rem' }}>
                  <div className="rating-stars">
                    {[...Array(5)].map((_, i) => <Star key={i} size={11} fill="rgba(255,255,255,0.7)" color="rgba(255,255,255,0.7)" />)}
                  </div>
                  <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', fontWeight: 300 }}>4.8 Rating · 2,400+ Users</span>
                </div>
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