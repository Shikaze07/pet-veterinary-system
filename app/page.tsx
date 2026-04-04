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
  ArrowRight,
  Star,
} from "lucide-react";

const services = [
  { title: "Digital Medical Records", desc: "Complete health history always accessible. View consultations, treatments, and allergy profiles instantly.", icon: ClipboardList },
  { title: "Easy Scheduling", desc: "Book visits online with real-time confirmations and automated reminders sent directly to you.", icon: Calendar },
  { title: "Preventive Care", desc: "Vaccination and deworming tracking with proactive alerts to ensure no dose is ever missed.", icon: ShieldCheck },
  { title: "Pharmacy & Medication", desc: "In-house pharmacy with premium medications. Seamless prescription tracking and refill management.", icon: Pill },
  { title: "Transparent Billing", desc: "Itemized invoices for every service. Clear pricing with multiple digital payment options.", icon: FileText },
  { title: "Health Monitoring", desc: "Real-time status updates and treatment progress during hospital admissions.", icon: Smartphone },
];

export default function Home() {
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

        /* Subtle page-load stagger */
        .reveal { opacity: 0; transform: translateY(16px); animation: revealUp 0.65s ease forwards; }
        .r1 { animation-delay: 0.05s; }
        .r2 { animation-delay: 0.18s; }
        .r3 { animation-delay: 0.30s; }
        .r4 { animation-delay: 0.42s; }
        @keyframes revealUp { to { opacity: 1; transform: translateY(0); } }

        /* Buttons */
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

        .btn-ghost-w {
          display: inline-flex; align-items: center; gap: 0.45rem;
          background: transparent; color: rgba(255,255,255,0.65);
          font-family: 'DM Sans', sans-serif; font-size: 0.78rem;
          font-weight: 500; letter-spacing: 0.09em; text-transform: uppercase;
          padding: 0.72rem 1.6rem; border: 1px solid rgba(255,255,255,0.18); cursor: pointer;
          transition: color 0.2s, border-color 0.2s; text-decoration: none;
        }
        .btn-ghost-w:hover { color: #fff; border-color: rgba(255,255,255,0.45); }

        /* Pill label */
        .tag {
          display: inline-block; border: 1px solid var(--teal);
          color: var(--teal); font-family: 'DM Sans', sans-serif;
          font-size: 0.67rem; letter-spacing: 0.16em; text-transform: uppercase;
          padding: 0.28rem 0.8rem; border-radius: 100px;
        }

        /* Nav */
        .nav-link {
          font-family: 'DM Sans', sans-serif; font-size: 0.8rem;
          letter-spacing: 0.03em; color: var(--mid);
          text-decoration: none; transition: color 0.2s;
        }
        .nav-link:hover { color: var(--charcoal); }

        /* Service cards */
        .svc-row { border-top: 1px solid var(--border); padding: 1.75rem 1.25rem; transition: background 0.22s; }
        .svc-row:last-child { border-bottom: 1px solid var(--border); }
        .svc-row:hover { background: var(--teal-pale); }
        .svc-row:hover .svc-icon { color: var(--teal); }

        /* Contact info rows */
        .info-r {
          display: flex; gap: 1.1rem; align-items: flex-start;
          padding: 1.15rem 0; border-bottom: 1px solid rgba(255,255,255,0.07);
        }

        /* Stats */
        .stat + .stat {
          border-left: 1px solid var(--border);
          padding-left: 2.25rem; margin-left: 2.25rem;
        }

        footer a { color: inherit; text-decoration: none; transition: color 0.2s; }
        footer a:hover { color: var(--teal-light); }

        /* App store badges */
        .store-badge {
          display: inline-flex; align-items: center; gap: 0.7rem;
          background: var(--charcoal); color: #fff;
          font-family: 'DM Sans', sans-serif;
          padding: 0.7rem 1.4rem;
          border: 1px solid rgba(255,255,255,0.1);
          text-decoration: none;
          transition: background 0.2s, border-color 0.2s;
          cursor: pointer;
        }
        .store-badge:hover { background: #2e2e2e; border-color: rgba(255,255,255,0.25); }

        .rating-stars { display: flex; gap: 2px; }
        .app-preview-strip {
          display: flex; gap: 1.5rem; align-items: center;
          padding: 1.25rem 1.5rem;
          background: var(--cream);
          border: 1px solid var(--border);
          margin-top: 2rem;
          max-width: 420px;
        }
      `}</style>

      <div style={{ background: 'var(--warm-white)', minHeight: '100vh' }}>

        {/* ─── HEADER ─── */}
        <header style={{
          position: 'sticky', top: 0, zIndex: 50,
          borderBottom: '1px solid var(--border)',
          background: 'rgba(253,252,250,0.96)',
          backdropFilter: 'blur(8px)',
        }}>
          <div style={{ maxWidth: 1180, margin: '0 auto', padding: '0 2rem', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
              <Stethoscope size={17} style={{ color: 'var(--teal)' }} />
              <span className="ff-d" style={{ fontSize: '1rem', color: 'var(--charcoal)', fontWeight: 400, letterSpacing: '0.01em' }}>
                PetCare <em style={{ color: 'var(--mid)', fontWeight: 400 }}>& Hospital</em>
              </span>
            </div>
            <nav style={{ display: 'flex', gap: '2.5rem' }}>
              <a href="#services" className="nav-link">Services</a>
              <a href="#about" className="nav-link">Our Clinic</a>
              <a href="#contact" className="nav-link">Contact</a>
            </nav>
            <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
              <Link href="/login" className="btn-o" style={{ padding: '0.48rem 1.1rem', fontSize: '0.73rem' }}>Admin Login</Link>
              <a href="#download" className="btn-p" style={{ padding: '0.48rem 1.1rem', fontSize: '0.73rem' }}>
                <Smartphone size={13} /> Download App
              </a>
            </div>
          </div>
        </header>

        <main>

          {/* ─── HERO ─── */}
          <section style={{ borderBottom: '1px solid var(--border)', padding: '5rem 0 6rem' }}>
            <div style={{ maxWidth: 1180, margin: '0 auto', padding: '0 2rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5rem', alignItems: 'center' }}>

              <div>
                <div className="tag reveal r1" style={{ marginBottom: '1.75rem' }}>Now Available on Android</div>

                <h1 className="ff-d reveal r2" style={{ fontSize: 'clamp(2.4rem, 4vw, 3.6rem)', fontWeight: 400, lineHeight: 1.1, color: 'var(--charcoal)', marginBottom: '1.4rem' }}>
                  Your pet's health,<br />
                  always in your<br />
                  <em style={{ color: 'var(--teal)' }}>pocket.</em>
                </h1>

                <p className="ff-b reveal r3" style={{ fontSize: '0.95rem', color: 'var(--mid)', lineHeight: 1.8, maxWidth: 390, fontWeight: 300, marginBottom: '2.25rem' }}>
                  Book appointments, access medical records, track vaccinations, and get real-time updates — all from the PetCare app.
                </p>

                <div className="reveal r4" style={{ display: 'flex', gap: '0.7rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
                  <a href="#download" className="store-badge">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M3.18 23.76c.3.17.64.22.99.14l12.12-6.99-2.54-2.54-10.57 9.39zm-1.7-20.3C1.18 3.77 1 4.15 1 4.68v14.64c0 .53.19.92.49 1.16l.06.05 8.2-8.2v-.19L1.48 3.46zm17.15 8.09-2.75-1.59-2.83 2.83 2.83 2.83 2.77-1.6c.79-.46.79-1.21-.02-1.47zM4.17.24l12.12 6.99-2.54 2.54L3.18.38c.3-.18.66-.23.99-.14z" /></svg>
                    <div>
                      <div style={{ fontSize: '0.58rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', lineHeight: 1 }}>Get it on</div>
                      <div style={{ fontSize: '0.88rem', fontWeight: 500, letterSpacing: '0.01em', lineHeight: 1.3 }}>Google Play</div>
                    </div>
                  </a>
                </div>

                <div className="ff-b reveal r4" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '3rem' }}>
                  <div className="rating-stars">
                    {[...Array(5)].map((_, i) => <Star key={i} size={12} fill="#2A6B6B" color="#2A6B6B" />)}
                  </div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--mid)', fontWeight: 300 }}>4.8 · 2,400+ pet owners</span>
                </div>

                <div className="ff-b reveal r4" style={{ display: 'flex', paddingTop: '2.25rem', borderTop: '1px solid var(--border)' }}>
                  {[['24/7', 'Emergency Care'], ['10+', 'Expert Vets'], ['Live', 'Health Updates']].map(([val, lbl], i) => (
                    <div key={i} className="stat">
                      <div style={{ fontSize: '1.5rem', fontWeight: 400, color: 'var(--charcoal)', lineHeight: 1 }}>{val}</div>
                      <div style={{ fontSize: '0.67rem', color: 'var(--light)', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: '0.3rem' }}>{lbl}</div>
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
                <div className="ff-b" style={{
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
            <div style={{ maxWidth: 1180, margin: '0 auto', padding: '0 2rem' }}>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem', paddingBottom: '2rem', borderBottom: '1px solid var(--border)' }}>
                <div>
                  <div className="tag ff-b" style={{ marginBottom: '1rem' }}>What We Offer</div>
                  <h2 className="ff-d" style={{ fontSize: 'clamp(1.7rem, 2.8vw, 2.5rem)', fontWeight: 400, color: 'var(--charcoal)', lineHeight: 1.15 }}>
                    Comprehensive<br />healthcare services.
                  </h2>
                </div>
                <p className="ff-b" style={{ fontSize: '0.85rem', color: 'var(--mid)', maxWidth: 300, lineHeight: 1.75, fontWeight: 300, textAlign: 'right' }}>
                  From routine check-ups to specialized procedures — every stage of your pet's health journey, covered.
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '0 3.5rem' }}>
                {services.map((s, i) => (
                  <div key={i} className="svc-row ff-b">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.7rem' }}>
                      <s.icon size={17} className="svc-icon" style={{ color: 'var(--mid)', marginTop: 2, transition: 'color 0.22s' }} />
                      <span style={{ fontSize: '0.63rem', color: 'var(--light)', letterSpacing: '0.12em' }}>{String(i + 1).padStart(2, '0')}</span>
                    </div>
                    <h3 style={{ fontSize: '0.93rem', fontWeight: 500, color: 'var(--charcoal)', marginBottom: '0.45rem' }}>{s.title}</h3>
                    <p style={{ fontSize: '0.82rem', color: 'var(--mid)', lineHeight: 1.7, fontWeight: 300 }}>{s.desc}</p>
                  </div>
                ))}
              </div>

            </div>
          </section>

          {/* ─── DOWNLOAD APP ─── */}
          <section id="download" style={{ padding: '5.5rem 0', background: 'var(--warm-white)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
            <div style={{ maxWidth: 1180, margin: '0 auto', padding: '0 2rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5rem', alignItems: 'center' }}>

                {/* Left: copy */}
                <div>
                  <div className="tag ff-b" style={{ marginBottom: '1.5rem' }}>Mobile App</div>
                  <h2 className="ff-d" style={{ fontSize: 'clamp(1.8rem, 3vw, 2.8rem)', fontWeight: 400, color: 'var(--charcoal)', lineHeight: 1.15, marginBottom: '1rem' }}>
                    Everything your<br />pet needs,<br /><em style={{ color: 'var(--teal)' }}>one tap away.</em>
                  </h2>
                  <p className="ff-b" style={{ fontSize: '0.88rem', color: 'var(--mid)', lineHeight: 1.8, fontWeight: 300, maxWidth: 380, marginBottom: '2.5rem' }}>
                    Pet owners use our mobile app to book visits, view health records, receive vaccination reminders, and stay updated on their pet's care — anytime, anywhere.
                  </p>

                  {/* Feature list */}
                  <div className="ff-b" style={{ marginBottom: '2.5rem' }}>
                    {[
                      'Book & manage appointments',
                      'View complete medical history',
                      'Vaccination & deworming reminders',
                      'Real-time hospital status updates',
                      'Digital invoices & payment',
                    ].map((feat, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.6rem 0', borderBottom: '1px solid var(--border)' }}>
                        <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--teal)', flexShrink: 0 }} />
                        <span style={{ fontSize: '0.83rem', color: 'var(--mid)', fontWeight: 300 }}>{feat}</span>
                      </div>
                    ))}
                  </div>

                  {/* Store badge */}
                  <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
                    <a href="#" className="store-badge">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M3.18 23.76c.3.17.64.22.99.14l12.12-6.99-2.54-2.54-10.57 9.39zm-1.7-20.3C1.18 3.77 1 4.15 1 4.68v14.64c0 .53.19.92.49 1.16l.06.05 8.2-8.2v-.19L1.48 3.46zm17.15 8.09-2.75-1.59-2.83 2.83 2.83 2.83 2.77-1.6c.79-.46.79-1.21-.02-1.47zM4.17.24l12.12 6.99-2.54 2.54L3.18.38c.3-.18.66-.23.99-.14z" /></svg>
                      <div>
                        <div style={{ fontSize: '0.57rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', lineHeight: 1 }}>Get it on</div>
                        <div style={{ fontSize: '0.88rem', fontWeight: 500, lineHeight: 1.4 }}>Google Play</div>
                      </div>
                    </a>
                  </div>

                  <div className="ff-b" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div className="rating-stars">
                      {[...Array(5)].map((_, i) => <Star key={i} size={11} fill="var(--teal)" color="var(--teal)" />)}
                    </div>
                    <span style={{ fontSize: '0.73rem', color: 'var(--light)', fontWeight: 300 }}>4.8 rating · 2,400+ downloads</span>
                  </div>
                </div>

                {/* Right: visual mockup placeholder */}
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <div style={{
                    width: 260, background: 'var(--charcoal)',
                    borderRadius: 32, padding: '12px',
                    boxShadow: '0 32px 64px rgba(0,0,0,0.18)',
                    border: '1px solid rgba(255,255,255,0.06)',
                  }}>
                    {/* Phone screen */}
                    <div style={{ background: 'var(--cream)', borderRadius: 22, overflow: 'hidden', minHeight: 480 }}>
                      {/* Status bar */}
                      <div style={{ background: 'var(--teal)', padding: '1rem 1.25rem 0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                        <div>
                          <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.6)', fontFamily: 'DM Sans', marginBottom: 2 }}>Good morning</div>
                          <div style={{ fontSize: '0.88rem', color: '#fff', fontFamily: 'Playfair Display, serif', fontWeight: 400 }}>Maria Santos</div>
                        </div>
                        <Stethoscope size={18} style={{ color: 'rgba(255,255,255,0.5)' }} />
                      </div>
                      {/* Pet card */}
                      <div style={{ margin: '0.85rem', background: '#fff', borderRadius: 12, padding: '0.9rem', border: '1px solid var(--border)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                          <div style={{ fontSize: '0.78rem', fontWeight: 500, color: 'var(--charcoal)', fontFamily: 'DM Sans' }}>Mochi</div>
                          <div style={{ fontSize: '0.6rem', background: 'var(--teal-pale)', color: 'var(--teal)', padding: '0.15rem 0.5rem', borderRadius: 100, fontFamily: 'DM Sans' }}>Healthy</div>
                        </div>
                        <div style={{ fontSize: '0.68rem', color: 'var(--mid)', fontFamily: 'DM Sans', fontWeight: 300 }}>Golden Retriever · 3 yrs</div>
                      </div>
                      {/* Upcoming */}
                      <div style={{ margin: '0 0.85rem', marginBottom: '0.85rem' }}>
                        <div style={{ fontSize: '0.6rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--light)', fontFamily: 'DM Sans', marginBottom: '0.5rem' }}>Next Appointment</div>
                        <div style={{ background: '#fff', borderRadius: 12, padding: '0.85rem', border: '1px solid var(--border)', display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                          <div style={{ background: 'var(--teal)', width: 36, height: 36, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <Calendar size={16} style={{ color: '#fff' }} />
                          </div>
                          <div>
                            <div style={{ fontSize: '0.73rem', fontWeight: 500, color: 'var(--charcoal)', fontFamily: 'DM Sans' }}>Annual Check-up</div>
                            <div style={{ fontSize: '0.63rem', color: 'var(--mid)', fontFamily: 'DM Sans', fontWeight: 300 }}>Apr 10 · 9:00 AM</div>
                          </div>
                        </div>
                      </div>
                      {/* Quick actions */}
                      <div style={{ margin: '0 0.85rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                        {[{ icon: ClipboardList, label: 'Records' }, { icon: Pill, label: 'Pharmacy' }, { icon: ShieldCheck, label: 'Vaccines' }, { icon: FileText, label: 'Billing' }].map(({ icon: Icon, label }) => (
                          <div key={label} style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 10, padding: '0.7rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.3rem' }}>
                            <Icon size={14} style={{ color: 'var(--teal)' }} />
                            <div style={{ fontSize: '0.6rem', color: 'var(--mid)', fontFamily: 'DM Sans', fontWeight: 400 }}>{label}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </section>

          {/* ─── CONTACT ─── */}
          <section id="contact" style={{ padding: '5rem 0', background: 'var(--charcoal)' }}>
            <div style={{ maxWidth: 1180, margin: '0 auto', padding: '0 2rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 3fr', gap: '4rem', alignItems: 'start' }}>

                <div>
                  <div className="tag ff-b" style={{ borderColor: 'rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.45)', marginBottom: '1.5rem' }}>Visit Us</div>
                  <h2 className="ff-d" style={{ fontSize: 'clamp(1.7rem, 2.6vw, 2.3rem)', fontWeight: 400, color: '#fff', lineHeight: 1.2, marginBottom: '0.9rem' }}>
                    Find us in<br />Koronadal City.
                  </h2>
                  <p className="ff-b" style={{ fontSize: '0.83rem', color: 'rgba(255,255,255,0.42)', lineHeight: 1.75, fontWeight: 300, marginBottom: '2.25rem' }}>
                    Conveniently located in South Cotabato, serving pet owners across the region.
                  </p>

                  <div className="ff-b" style={{ marginBottom: '2.25rem' }}>
                    {[
                      { icon: MapPin, label: 'Address', lines: ['General Santos Drive', 'Purok Bayanihan, Koronadal City', 'South Cotabato 9506'] },
                      { icon: Phone, label: 'Phone', lines: ['+63 (083) 228-1234', '+63 917 555 7890'] },
                      { icon: Mail, label: 'Email', lines: ['hello@petcareclinic.com'] },
                      { icon: Clock, label: 'Hours', lines: ['Mon–Fri: 8:00 AM – 6:00 PM', 'Saturday: 9:00 AM – 4:00 PM', 'Sunday: Emergency Only'] },
                    ].map(({ icon: Icon, label, lines }, i) => (
                      <div key={i} className="info-r">
                        <Icon size={14} style={{ color: 'var(--teal-light)', marginTop: 3, flexShrink: 0 }} />
                        <div>
                          <div style={{ fontSize: '0.63rem', letterSpacing: '0.13em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.28)', marginBottom: '0.3rem' }}>{label}</div>
                          {lines.map((line, j) => (
                            <div key={j} style={{
                              fontSize: '0.8rem', fontWeight: 300, lineHeight: 1.65,
                              color: label === 'Hours' && j === lines.length - 1 ? 'var(--teal-light)' : 'rgba(255,255,255,0.58)',
                            }}>{line}</div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  <a href="#" className="btn-p">
                    <NavigationIcon size={13} /> Open in Maps
                  </a>
                </div>

                <div style={{ height: 520, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <iframe
                    width="100%" height="100%"
                    style={{ border: 0, filter: 'grayscale(1) invert(0.87) contrast(0.88) brightness(0.94)' }}
                    loading="lazy" allowFullScreen referrerPolicy="no-referrer-when-downgrade"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15844.786524331405!2d124.8488347!3d6.4947932!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x32f3065a3d463d11%3A0xc3f14068593ccf97!2sKoronadal%20City%2C%20South%20Cotabato!5e0!3m2!1sen!2sph!4v1711900000000!5m2!1sen!2sph"
                  />
                </div>

              </div>
            </div>
          </section>

          {/* ─── CTA ─── */}
          <section style={{ padding: '6rem 0', background: 'var(--teal)' }}>
            <div style={{ maxWidth: 1180, margin: '0 auto', padding: '0 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '3rem' }}>
              <div style={{ maxWidth: 520 }}>
                <div className="tag ff-b" style={{ borderColor: 'rgba(255,255,255,0.3)', color: 'rgba(255,255,255,0.55)', marginBottom: '1.5rem' }}>Get the App</div>
                <h2 className="ff-d" style={{ fontSize: 'clamp(2rem, 3.8vw, 3rem)', fontWeight: 400, color: '#fff', lineHeight: 1.15, marginBottom: '1.1rem' }}>
                  Download PetCare<br />and get started today.
                </h2>
                <p className="ff-b" style={{ fontSize: '0.88rem', color: 'rgba(255,255,255,0.62)', lineHeight: 1.8, fontWeight: 300, maxWidth: 400 }}>
                  Free on Android. Create your account, add your pets, and book your first visit in minutes.
                </p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <a href="#" className="store-badge" style={{ background: 'rgba(255,255,255,0.1)', borderColor: 'rgba(255,255,255,0.2)', minWidth: 200 }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M3.18 23.76c.3.17.64.22.99.14l12.12-6.99-2.54-2.54-10.57 9.39zm-1.7-20.3C1.18 3.77 1 4.15 1 4.68v14.64c0 .53.19.92.49 1.16l.06.05 8.2-8.2v-.19L1.48 3.46zm17.15 8.09-2.75-1.59-2.83 2.83 2.83 2.83 2.77-1.6c.79-.46.79-1.21-.02-1.47zM4.17.24l12.12 6.99-2.54 2.54L3.18.38c.3-.18.66-.23.99-.14z" /></svg>
                  <div>
                    <div style={{ fontSize: '0.58rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', lineHeight: 1 }}>Get it on</div>
                    <div style={{ fontSize: '0.95rem', fontWeight: 500, lineHeight: 1.4 }}>Google Play</div>
                  </div>
                </a>
                <div className="ff-b" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', paddingTop: '0.25rem' }}>
                  <div className="rating-stars">
                    {[...Array(5)].map((_, i) => <Star key={i} size={11} fill="rgba(255,255,255,0.7)" color="rgba(255,255,255,0.7)" />)}
                  </div>
                  <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.5)', fontWeight: 300 }}>4.8 · 2,400+ pet owners</span>
                </div>
              </div>
            </div>
          </section>

        </main>

        {/* ─── FOOTER ─── */}
        <footer style={{ background: 'var(--dark)', padding: '4rem 0', color: 'rgba(255,255,255,0.32)' }}>
          <div style={{ maxWidth: 1180, margin: '0 auto', padding: '0 2rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '3rem', marginBottom: '2.5rem', paddingBottom: '2.5rem', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>

              <div className="ff-b">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.9rem' }}>
                  <Stethoscope size={14} style={{ color: 'var(--teal-light)' }} />
                  <span className="ff-d" style={{ fontSize: '0.92rem', color: 'rgba(255,255,255,0.72)', fontWeight: 400 }}>PetCare Clinic & Hospital</span>
                </div>
                <p style={{ fontSize: '0.78rem', lineHeight: 1.8, fontWeight: 300, maxWidth: 270, marginBottom: '1.1rem' }}>
                  Modern pet healthcare combining digital records with compassionate, expert medicine.
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.73rem' }}>
                  <MapPin size={12} /><span>South Cotabato, Philippines</span>
                </div>
              </div>

              {[
                { heading: 'Navigation', links: [['#services', 'Services'], ['#download', 'Download App'], ['#contact', 'Contact & Map'], ['/login', 'Admin Portal']] },
                { heading: 'Legal', links: [['#', 'Privacy Policy'], ['#', 'Terms of Service'], ['#', 'Patient Privacy']] },
              ].map(({ heading, links }) => (
                <div key={heading} className="ff-b">
                  <div style={{ fontSize: '0.63rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.22)', marginBottom: '1.25rem', fontWeight: 500 }}>{heading}</div>
                  {links.map(([href, label]) => (
                    <div key={label} style={{ marginBottom: '0.7rem' }}>
                      <a href={href} style={{ fontSize: '0.8rem', fontWeight: 300 }}>{label}</a>
                    </div>
                  ))}
                </div>
              ))}
            </div>

            <div className="ff-b" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.72rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <span>© {new Date().getFullYear()} PetCare Clinic & Hospital. All rights reserved.</span>
              <span style={{ color: 'rgba(255,255,255,0.13)' }}>Android · Grooming · Dental · Surgery · Emergency</span>
            </div>
          </div>
        </footer>

      </div>
    </>
  );
}