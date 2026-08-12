import React from 'react';
import { Volume2 } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-neutral-200 bg-neutral-50/50 pt-12 md:pt-16 pb-8 md:pb-12 mt-auto">
      <div className="container mx-auto px-4 md:px-8 max-w-7xl">
        <div className="grid gap-8 md:gap-12 grid-cols-1 sm:grid-cols-2 md:grid-cols-4">
          {/* Column 1 & 2: Branding */}
          <div className="col-span-1 sm:col-span-2 space-y-3">
            <div className="flex items-center space-x-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-black text-white">
                <Volume2 className="h-3.5 w-3.5" />
              </div>
              <span className="text-base font-black text-neutral-900 uppercase tracking-tight">VoiceEnhancer.io</span>
            </div>
            <p className="text-xs leading-relaxed text-neutral-500 max-w-sm">
              Browser-native audio processing workstation featuring noise gating, 3-band parametric equalization, dynamic range compression, and brickwall limiting. 100% private, client-side Web Audio DSP.
            </p>
            <div className="text-[11px] font-mono text-neutral-400">
              E-A-T Verified Engine Standard • Build 2026.1
            </div>
          </div>

          {/* Column 3: Legal Links (Manual) */}
          <div>
            <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-neutral-400">
              Legal Documents
            </h3>
            <ul className="space-y-2.5 text-xs font-medium">
              <li>
                <a
                  href="/privacy-policy.html"
                  className="text-neutral-600 hover:text-black transition-colors cursor-pointer"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="/terms.html"
                  className="text-neutral-600 hover:text-black transition-colors cursor-pointer"
                >
                  Terms of Use
                </a>
              </li>
              <li>
                <a
                  href="/disclaimer.html"
                  className="text-neutral-600 hover:text-black transition-colors cursor-pointer"
                >
                  Disclaimer
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Pages & Resources (Manual) */}
          <div>
            <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-neutral-400">
              Pages & Info
            </h3>
            <ul className="space-y-2.5 text-xs font-medium">
              <li>
                <a
                  href="/about.html"
                  className="text-neutral-600 hover:text-black transition-colors cursor-pointer"
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="blog.html"
                  className="text-neutral-600 hover:text-black transition-colors cursor-pointer"
                >
                  Blog & Guides
                </a>
              </li>
              <li>
                <a
                  href="faq.html"
                  className="text-neutral-600 hover:text-black transition-colors cursor-pointer"
                >
                  FAQ
                </a>
              </li>
              <li>
                <a
                  href="/contact.html"
                  className="text-neutral-600 hover:text-black transition-colors cursor-pointer"
                >
                  Contact Us
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 md:mt-16 flex flex-col items-center justify-between border-t border-neutral-200 pt-6 md:flex-row gap-4">
          <p className="text-xs text-neutral-400 font-mono">
            © <span id="year">{new Date().getFullYear()}</span> VoiceEnhancer.io. All rights reserved. Content protected by copyright law.
          </p>
          <div className="text-[11px] text-neutral-400 font-mono">
            Client-Side Memory Sandbox • Zero Cloud Tracking
          </div>
        </div>
      </div>
    </footer>
  );
};
