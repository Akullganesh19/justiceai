import React from 'react';
import { Link } from 'react-router-dom';
import { Scale, Heart, ExternalLink, ShieldCheck } from 'lucide-react';

export default function Footer() {
  const navSections = [
    {
      title: 'Tools',
      links: [
        { label: 'Dashboard', to: '/dashboard' },
        { label: 'AI Legal Chat', to: '/chat' },
        { label: 'Document Generator', to: '/documents' },
        { label: 'Cost Estimator', to: '/estimator' },
        { label: 'Case Tracker', to: '/tracker' },
      ],
    },
    {
      title: 'Explore',
      links: [
        { label: 'Know Your Rights', to: '/rights' },
        { label: 'LOCATE_ADVOCATE', to: '/lawyers' },
        { label: 'Legal Glossary', to: '/glossary' },
        { label: 'Legal Quiz', to: '/quiz' },
        { label: 'Deadline Calculator', to: '/limitation' },
        { label: 'Legal Aid Checker', to: '/legal-aid' },
      ],
    },
    {
      title: 'Company',
      links: [
        { label: 'About', to: '/about' },
        { label: 'FAQ', to: '/faq' },
      ],
    },
    {
      title: 'Resources',
      links: [
        { label: 'e-Courts India', href: 'https://ecourts.gov.in' },
        { label: 'National Legal Services', href: 'https://nalsa.gov.in' },
        { label: 'Consumer Helpline', href: 'https://consumerhelpline.gov.in' },
        { label: 'Cyber Crime Portal', href: 'https://cybercrime.gov.in' },
      ],
    },
  ];

  return (
    <footer className="border-t-2 border-gold/20 bg-void mt-16 px-6 py-20 relative overflow-hidden font-mono">
      {/* Industrial Hairline */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gold/40" />
      
      <div className="max-w-7xl mx-auto">
        {/* Main Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-12 mb-20">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-1 space-y-6">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-12 h-12 rounded bg-void flex items-center justify-center border-2 border-gold/20 group-hover:border-gold transition-all shadow-hard active:translate-y-[1px]">
                <Scale className="w-6 h-6 text-gold" />
              </div>
              <span className="font-display text-2xl text-white font-bold tracking-tighter uppercase italic">
                JUSTICE<span className="text-gold">AI</span>
              </span>
            </Link>
            <div className="border-l-4 border-gold/20 pl-6 py-1 space-y-2">
              <p className="text-[10px] text-text-tertiary leading-relaxed uppercase tracking-widest font-extrabold italic opacity-60">
                AUTHORITY_CORE_OS_V4.2
              </p>
              <p className="text-[9px] text-text-tertiary leading-relaxed uppercase tracking-[0.2em] italic max-w-[180px]">
                EMPOWERING CITIZEN_SOVEREIGNTY VIA HIGH_PRECISION LEGAL STREAMS.
              </p>
            </div>
          </div>

          {/* Nav Columns */}
          {navSections.map((section) => (
            <div key={section.title} className="space-y-6">
              <h4 className="text-[11px] uppercase font-extrabold tracking-[0.4em] text-gold italic">
                // {section.title.toUpperCase()}
              </h4>
              <ul className="space-y-3.5">
                {section.links.map((link) => (
                  <li key={link.label}>
                    {link.to ? (
                      <Link
                        to={link.to}
                        className="text-[10px] text-text-tertiary hover:text-white transition-all uppercase tracking-widest font-bold italic flex items-center gap-3 group"
                      >
                        <span className="w-2 h-2 rounded-sm border border-white/10 bg-void group-hover:bg-gold group-hover:border-gold transition-all" />
                        {link.label}
                      </Link>
                    ) : (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] text-text-tertiary hover:text-white transition-all uppercase tracking-widest font-bold italic flex items-center gap-3 group"
                      >
                        <span className="w-2 h-2 rounded-sm border border-white/10 bg-void group-hover:bg-blue group-hover:border-blue transition-all" />
                        {link.label}
                        <ExternalLink className="w-3 h-3 opacity-20 group-hover:opacity-100 transition-opacity" />
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Global Legal Disclaimer */}
        <div className="py-10 mb-12 border-2 border-gold/[0.15] bg-gold/[0.02] rounded shadow-hard group hover:border-gold/30 transition-all active:translate-y-[2px]">
          <div className="flex flex-col md:flex-row items-center gap-8 px-10">
             <div className="flex-shrink-0 w-12 h-12 rounded bg-gold text-white flex items-center justify-center shadow-hard-red">
                <ShieldCheck className="w-6 h-6" />
             </div>
             <p className="text-[10px] text-text-tertiary max-w-5xl text-center md:text-left font-body leading-relaxed uppercase tracking-widest italic">
                <span className="font-extrabold text-gold mr-3 bg-gold/10 px-2 py-1 rounded-sm border border-gold/20 shadow-hard-red/5">
                  MANDATORY_DISCLAIMER:
                </span>
                JUSTICEAI OPERATES AS AN ANALYTICAL INFORMATION VECTOR AND{' '}
                <strong className="text-white font-bold opacity-100">
                  DOES NOT CONSTITUTE BINDING LEGAL COUNSEL
                </strong>
                . GENERATED DATASETS ARE FOR EDUCATIONAL_STRATEGIC REFERENCE ONLY. CONSULT FORMALLY LICENSED ADVOCATES FOR JURIDICAL FINALITY.
             </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-10 border-t-2 border-white/5 flex flex-col md:flex-row items-center justify-between gap-8 opacity-60 hover:opacity-100 transition-opacity">
          <p className="text-[9px] text-text-tertiary uppercase tracking-[0.4em] font-extrabold flex items-center gap-3 italic">
            © 2026 AUTHORITY_NET <span className="w-1.5 h-1.5 rounded-full bg-gold/40" /> DIGITAL_INDIA_INITIATIVE
          </p>
          <div className="flex gap-10">
            {[
              { label: 'PRIVACY_PROTOCOL', to: '/privacy' },
              { label: 'DISCLAIMER_INDEX', to: '/disclaimer' },
              { label: 'TERMS_OF_ENGAGEMENT', to: '#' }
            ].map((link, idx) => (
              <Link
                key={idx}
                to={link.to}
                className="text-[9px] text-text-tertiary hover:text-gold transition-all uppercase font-extrabold tracking-[0.4em] italic relative group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-gold transition-all group-hover:w-full" />
              </Link>
            ))}
          </div>
          <p className="text-[9px] text-text-tertiary flex items-center gap-2 uppercase font-bold tracking-[0.4em] italic">
            BUILT WITH PRECISION FOR CITIZENS <Heart className="w-3 h-3 text-gold fill-red animate-pulse" />
          </p>
        </div>
      </div>
    </footer>
  );
}
