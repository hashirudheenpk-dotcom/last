import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';
import ringImage from './assets/wedding-ring.png';

const LINKS = {
  nikah: 'https://maps.app.goo.gl/Uz5QdcQzjd6eogCJ9?g_st=ic',
  reception: 'https://maps.app.goo.gl/kaN4Z2K85bda2xiX6?g_st=ic',
  rsvp: 'https://wa.me/919539036944?text=Assalamu%20Alaikum!%20I%20would%20like%20to%20RSVP%20for%20the%20wedding%20of%20Fathima%20%26%20Ashif%20on%2018%20October%202026.',
  whatsapp: 'https://wa.me/919539036944',
  instagram: 'https://www.instagram.com/faathimasiddiq?vrfl=MW5nN2ttOWEyMHBhOQ==',
  invitoraInstagram: 'https://ig.me/m/_.invitora',
  invitoraSite: 'https://invitora-olive.vercel.app/',
  invitoraWhatsapp: 'https://wa.me/918606240792',
};

const sections = [
  ['intro', 'Introduction'],
  ['story', 'Our Story'],
  ['date', 'Wedding Date'],
  ['events', 'Events'],
  ['family', 'Our Families'],
  ['venue', 'Venue'],
  ['rsvp', 'RSVP'],
  ['social', 'Social'],
];

function RingArt() {
  return <img className="ring-art" src={ringImage} alt="Three-dimensional gold wedding ring with a diamond" />;
}

function OpeningGate({ visible, onOpen }) {
  if (!visible) return null;
  return (
    <div className="opening-gate" aria-label="Invitation opening">
      <div className="gate-curtain gate-left" />
      <div className="gate-curtain gate-right" />
      <button className="ring-launch" onClick={onOpen} aria-label="Open the wedding invitation">
        <RingArt />
        <span className="ring-halo" />
      </button>
      <p className="gate-prompt">Click the ring</p>
    </div>
  );
}

function MusicControl() {
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef(null);
  const loopRef = useRef(null);
  const noteRef = useRef(0);
  const notes = [196, 246.94, 293.66, 246.94, 220, 261.63, 329.63, 261.63];

  const stop = () => {
    window.clearInterval(loopRef.current);
    loopRef.current = null;
    if (audioRef.current) {
      audioRef.current.oscillators.forEach((osc) => {
        try { osc.stop(); } catch { /* already stopped */ }
      });
      audioRef.current.context.close().catch(() => {});
      audioRef.current = null;
    }
    setPlaying(false);
  };

  const start = async () => {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    const context = new AudioContextClass();
    await context.resume();
    const master = context.createGain();
    master.gain.value = 0.14;
    master.connect(context.destination);
    const oscillators = [];
    const playNote = () => {
      const oscillator = context.createOscillator();
      const envelope = context.createGain();
      oscillator.type = 'sine';
      oscillator.frequency.value = notes[noteRef.current++ % notes.length];
      envelope.gain.setValueAtTime(0.0001, context.currentTime);
      envelope.gain.exponentialRampToValueAtTime(0.09, context.currentTime + 0.18);
      envelope.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 1.35);
      oscillator.connect(envelope);
      envelope.connect(master);
      oscillator.start();
      oscillator.stop(context.currentTime + 1.4);
      oscillators.push(oscillator);
      if (oscillators.length > 12) oscillators.splice(0, 4);
    };
    audioRef.current = { context, oscillators };
    noteRef.current = 0;
    playNote();
    loopRef.current = window.setInterval(playNote, 850);
    setPlaying(true);
  };

  useEffect(() => () => {
    window.clearInterval(loopRef.current);
    audioRef.current?.context.close().catch(() => {});
  }, []);

  return (
    <button className={`round-control music-control ${playing ? 'is-playing' : ''}`} onClick={playing ? stop : start} aria-label={playing ? 'Pause music' : 'Play music'} aria-pressed={playing} title={playing ? 'Pause music' : 'Play gentle music'}>
      <span className="music-bars" aria-hidden="true"><i /><i /><i /></span>
    </button>
  );
}

function Navigation() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const onEscape = (event) => event.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onEscape);
    return () => window.removeEventListener('keydown', onEscape);
  }, []);

  return (
    <>
      <header className="controls" aria-label="Invitation controls">
        <MusicControl />
        <button className="round-control menu-control" onClick={() => setOpen((value) => !value)} aria-label={open ? 'Close invitation menu' : 'Open invitation menu'} aria-expanded={open} aria-controls="invitation-menu">
          <span className="hamburger" aria-hidden="true"><i /><i /><i /></span>
        </button>
      </header>
      <nav id="invitation-menu" className={`invitation-menu ${open ? 'menu-open' : ''}`} aria-label="Invitation sections" aria-hidden={!open}>
        {sections.map(([id, label]) => <a href={`#${id}`} key={id} onClick={() => setOpen(false)} tabIndex={open ? 0 : -1}>{label}</a>)}
      </nav>
      {open && <button className="menu-dismiss" aria-label="Close invitation menu" onClick={() => setOpen(false)} />}
    </>
  );
}

function Eyebrow({ children }) { return <p className="eyebrow">{children}</p>; }

function SectionTitle({ eyebrow, children, light = false }) {
  return <div className={`section-heading ${light ? 'light' : ''}`}><Eyebrow>{eyebrow}</Eyebrow><h2>{children}</h2></div>;
}

function ScratchCard({ value, label }) {
  const canvasRef = useRef(null);
  const drawing = useRef(false);
  const scratched = useRef(0);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const { width, height } = canvas.getBoundingClientRect();
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);
    const base = ctx.createLinearGradient(0, 0, width, height);
    base.addColorStop(0, '#3a101d');
    base.addColorStop(.5, '#65233a');
    base.addColorStop(1, '#431523');
    ctx.fillStyle = base;
    ctx.fillRect(0, 0, width, height);
    ctx.strokeStyle = 'rgba(214,185,132,.42)';
    ctx.lineWidth = 1;
    ctx.strokeRect(7, 7, width - 14, height - 14);
    ctx.fillStyle = '#ead8ae';
    ctx.font = '600 9px Montserrat, sans-serif';
    ctx.letterSpacing = '1.5px';
    ctx.textAlign = 'center';
    ctx.fillText('SCRATCH TO REVEAL', width / 2, height / 2 + 4);
    for (let i = 0; i < 65; i++) {
      const x = (i * 73 + 21) % width;
      const y = (i * 47 + 13) % height;
      ctx.fillStyle = `rgba(255,239,205,${(i % 4 + 1) / 15})`;
      ctx.beginPath();
      ctx.arc(x, y, i % 3 === 0 ? 1 : .6, 0, Math.PI * 2);
      ctx.fill();
    }
  }, []);

  const scratch = (event) => {
    if (!drawing.current || revealed) return;
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(event.clientX - rect.left, event.clientY - rect.top, 24, 0, Math.PI * 2);
    ctx.fill();
    scratched.current += 1;
    if (scratched.current > 8) {
      setRevealed(true);
      canvas.setPointerCapture?.(event.pointerId);
    }
  };

  return (
    <div className="scratch-card" aria-label={`${label}: scratch to reveal ${value}`}>
      <div className="scratch-value"><strong>{value}</strong><span>{label}</span></div>
      {!revealed && <canvas ref={canvasRef} className="scratch-layer" role="button" tabIndex={0} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); setRevealed(true); } }} onPointerDown={(event) => { drawing.current = true; event.currentTarget.setPointerCapture(event.pointerId); scratch(event); }} onPointerMove={scratch} onPointerUp={() => { drawing.current = false; }} onPointerCancel={() => { drawing.current = false; }} aria-label={`Scratch to reveal ${label}`} />}
    </div>
  );
}

function CalendarLink() {
  const downloadCalendar = () => {
    const stamp = new Date().toISOString().replaceAll('-', '').replaceAll(':', '').replace(/\.\d{3}/, '');
    const ics = [
      'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Fathima and Ashif//Wedding Invitation//EN',
      'CALSCALE:GREGORIAN', 'BEGIN:VEVENT', 'UID:fathima-ashif-wedding-20261018@invitation.local',
      `DTSTAMP:${stamp}`, 'DTSTART:20261018T100000', 'DTEND:20261018T120000',
      'SUMMARY:Nikah — Fathima Siddiq & Muhammed Ashif', 'LOCATION:Badar Juma Masjid',
      'DESCRIPTION:Wedding celebration of Fathima Siddiq and Muhammed Ashif.', 'END:VEVENT', 'END:VCALENDAR', ''
    ].join('\r\n');
    const file = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(file);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'fathima-and-ashif-wedding.ics';
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  return <button type="button" className="text-link calendar-button" onClick={downloadCalendar}>+ Add to Calendar</button>;
}

function Countdown() {
  const [parts, setParts] = useState([0, 0, 0, 0]);
  useEffect(() => {
    const update = () => {
      const remaining = new Date(2026, 9, 18, 10, 0, 0).getTime() - Date.now();
      if (remaining <= 0) return setParts([0, 0, 0, 0]);
      const days = Math.floor(remaining / 86400000);
      const hours = Math.floor((remaining % 86400000) / 3600000);
      const minutes = Math.floor((remaining % 3600000) / 60000);
      const seconds = Math.floor((remaining % 60000) / 1000);
      setParts([days, hours, minutes, seconds]);
    };
    update();
    const timer = window.setInterval(update, 1000);
    return () => window.clearInterval(timer);
  }, []);
  return <div className="countdown-grid">{['Days', 'Hours', 'Minutes', 'Seconds'].map((label, index) => <div className="countdown-cell" key={label}><strong>{String(parts[index]).padStart(2, '0')}</strong><span>{label}</span></div>)}</div>;
}

function WeddingPage() {
  const [gateVisible, setGateVisible] = useState(true);
  const [opened, setOpened] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    document.body.classList.toggle('gate-locked', gateVisible);
    return () => document.body.classList.remove('gate-locked');
  }, [gateVisible]);

  const openInvitation = () => {
    setOpened(true);
    window.setTimeout(() => setGateVisible(false), 1250);
  };

  const copyHashtag = async () => {
    try {
      await navigator.clipboard.writeText('#FathimaWedsAshif');
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  return (
    <>
      <OpeningGate visible={gateVisible} onOpen={openInvitation} />
      {opened && <Navigation />}
      <main className={opened ? 'page page-open' : 'page'}>
        <section className="hero drape" id="hero" aria-label="Wedding invitation cover">
          <div className="hero-copy hero-cover">
            <h1 className="visually-hidden">Wedding invitation for Fathima Siddiq and Muhammed Ashif</h1>
            <div className="hero-jewel"><RingArt /></div>
            <a className="hero-scroll" href="#intro" aria-label="Scroll to the invitation"><span>Scroll to discover</span>↓</a>
          </div>
          <span className="corner-ornament" aria-hidden="true">✦</span>
        </section>

        <section className="section intro cream" id="intro">
          <div className="intro-mark" aria-hidden="true">✦</div>
          <Eyebrow>With joyful hearts</Eyebrow>
          <h2>Fathima Siddiq<br /><span>&amp;</span> Muhammed Ashif</h2>
          <p>Invite you to celebrate the beginning of a beautiful new chapter as they join their lives in marriage, surrounded by the love, prayers and blessings of their families.</p>
        </section>

        <section className="section story drape" id="story">
          <SectionTitle eyebrow="Our story" light>Two hearts,<br className="mobile-break" /> one beautiful journey.</SectionTitle>
          <div className="story-copy">
            <p>Some stories begin quietly, with a meeting that feels ordinary at first, and slowly become something extraordinary.</p>
            <p>For Fathima and Ashif, this journey is a beautiful reminder that when two lives are brought together with love, faith and trust, every moment becomes part of something greater.</p>
            <p>With gratitude for the past and excitement for everything ahead, they begin this new chapter together — surrounded by the people who mean the most to them.</p>
          </div>
        </section>

        <section className="section date-section cream" id="date">
          <SectionTitle eyebrow="A date to remember">Reveal the day.</SectionTitle>
          <p className="section-lead">Scratch and reveal their special day.</p>
          <div className="scratch-grid"><ScratchCard value="18" label="Day" /><ScratchCard value="Oct" label="Month" /><ScratchCard value="2026" label="Year" /></div>
          <div className="date-flourish" aria-hidden="true">✦</div>
        </section>

        <section className="section countdown-section sand">
          <SectionTitle eyebrow="Counting every moment">Until we say,<br />“I do.”</SectionTitle>
          <Countdown />
        </section>

        <section className="section events drape" id="events">
          <SectionTitle eyebrow="The celebration" light>Wedding Events</SectionTitle>
          <div className="event-list">
            <article className="event-item event-one"><span className="event-flower">✦</span><h3>Nikah</h3><p className="event-time">10:00 AM</p><p>Badar Juma Masjid</p></article>
            <article className="event-item event-two"><span className="event-flower">✧</span><h3>Reception</h3><p className="event-time">To Follow</p><p>Bride&apos;s Residence</p></article>
          </div>
        </section>

        <section className="section family cream" id="family">
          <SectionTitle eyebrow="With the blessings of">Our Families</SectionTitle>
          <div className="family-grid">
            <article className="family-card"><span className="card-star">✦</span><h3>Bride&apos;s Family</h3><p>Siddiq P</p><p>Hafsath MT</p><span className="card-star lower">✦</span></article>
            <article className="family-card"><span className="card-star">✦</span><h3>Groom&apos;s Family</h3><p>Moideen K</p><p>Beefathima KN</p><span className="card-star lower">✦</span></article>
          </div>
        </section>

        <section className="section venue sand" id="venue">
          <SectionTitle eyebrow="Join us">Find Your Way</SectionTitle>
          <p className="section-lead">We would be delighted to have you with us as we celebrate this beautiful beginning.</p>
          <div className="venue-grid">
            <article className="venue-card"><h3>Nikah</h3><p className="venue-time">10:00 AM</p><p>Badar Juma Masjid</p><a className="outline-button" href={LINKS.nikah} target="_blank" rel="noreferrer">Open in Maps</a></article>
            <article className="venue-card"><h3>Reception</h3><p className="venue-time">To Follow</p><p>Bride&apos;s Residence</p><a className="outline-button" href={LINKS.reception} target="_blank" rel="noreferrer">Open in Maps</a></article>
          </div>
        </section>

        <section className="section rsvp drape" id="rsvp">
          <SectionTitle eyebrow="We hope you can join us" light>Save your seat</SectionTitle>
          <p className="section-lead">Your presence would make our celebration even more meaningful. Kindly let us know if you&apos;ll be joining us.</p>
          <div className="rsvp-actions"><a className="outline-button light-button" href={LINKS.rsvp} target="_blank" rel="noreferrer">RSVP via WhatsApp</a><CalendarLink /></div>
        </section>

        <section className="section hashtag cream">
          <SectionTitle eyebrow="Share the joy">Our Wedding Hashtag</SectionTitle>
          <button className="hashtag-button" onClick={copyHashtag} aria-label="Copy wedding hashtag">#FathimaWedsAshif</button>
          <p className={`copy-note ${copied ? 'show-note' : ''}`} aria-live="polite">{copied ? 'Copied to clipboard' : 'Tap the hashtag to copy'}</p>
        </section>

        <section className="section social cream" id="social">
          <SectionTitle eyebrow="Stay connected">Follow Along</SectionTitle>
          <p className="section-lead">Follow our journey and share in the memories of this special chapter.</p>
          <div className="social-actions"><a className="outline-button" href={LINKS.instagram} target="_blank" rel="noreferrer">Instagram</a><a className="outline-button" href={LINKS.whatsapp} target="_blank" rel="noreferrer">WhatsApp</a></div>
        </section>

        <section className="section closing drape">
          <SectionTitle eyebrow="With love &amp; gratitude" light>Thank You</SectionTitle>
          <p className="closing-copy">Thank you for being a part of our lives and for sharing in the joy of this beautiful occasion. Your presence, prayers and blessings mean more than words can express.</p>
          <p className="closing-date">18 <span>·</span> OCTOBER <span>·</span> 2026</p>
        </section>
      </main>

      <footer className="invitora-footer">
        <a className="invitora-wordmark" href={LINKS.invitoraSite} target="_blank" rel="noreferrer" aria-label="Invitora website">Invitora</a>
        <p>Beautiful digital invitations designed for life&apos;s most unforgettable moments.</p>
        <div className="footer-callout"><span>Love this invite?</span><a href={LINKS.invitoraSite} target="_blank" rel="noreferrer">Get yours made easily with Invitora.</a></div>
        <div className="footer-socials">
          <a href={LINKS.invitoraInstagram} target="_blank" rel="noreferrer" aria-label="Invitora Instagram">ig</a>
          <a href={LINKS.invitoraSite} target="_blank" rel="noreferrer" aria-label="Invitora website">↗</a>
          <a href={LINKS.invitoraWhatsapp} target="_blank" rel="noreferrer" aria-label="Invitora WhatsApp">wa</a>
        </div>
        <small>Designed with love by Invitora</small>
      </footer>
    </>
  );
}

createRoot(document.getElementById('root')).render(<React.StrictMode><WeddingPage /></React.StrictMode>);
