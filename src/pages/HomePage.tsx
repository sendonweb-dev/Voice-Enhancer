import React, { useState } from 'react';
import {
  Zap,
  ShieldCheck,
  Download,
  Mic,
  Sliders,
  Volume2,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  HelpCircle,
  Info,
  BookOpen,
  Cpu,
  Layers,
  Sparkles,
  FileText
} from 'lucide-react';
import { AudioWorkstation } from '../components/AudioWorkstation';
import { FeatureCard } from '../components/FeatureCard';

export const HomePage: React.FC = () => {
  // Interactive Vocal Quality Assessment State
  const [hasAcousticTreatment, setHasAcousticTreatment] = useState(false);
  const [usesCondenserMic, setUsesCondenserMic] = useState(true);
  const [usesPopFilter, setUsesPopFilter] = useState(true);
  const [hasLowBackgroundNoise, setHasLowBackgroundNoise] = useState(true);
  const [micDistanceOk, setMicDistanceOk] = useState(true);

  const calculateQualityScore = () => {
    let score = 40;
    if (hasAcousticTreatment) score += 20;
    if (usesCondenserMic) score += 15;
    if (usesPopFilter) score += 10;
    if (hasLowBackgroundNoise) score += 10;
    if (micDistanceOk) score += 5;
    return Math.min(100, score);
  };

  const score = calculateQualityScore();

  return (
    <>
      <div className="bg-white border-b border-neutral-100">
        {/* Ad Slot 1: Top Banner (Premium Visibility) */}
        <div className="container mx-auto px-4 pt-20 max-w-7xl text-center">
          <div className="bg-neutral-50 border border-dashed border-neutral-200 rounded-lg p-2.5 text-[10px] font-mono uppercase tracking-widest text-neutral-400">
            📢 Ad Slot 1 — Top Header Banner (AdSense Placement Ready)
          </div>
        </div>

        {/* Hero Banner */}
        <section className="pt-8 md:pt-14 pb-8 md:pb-12 text-center z-10">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="inline-block px-3 py-1 mb-4 rounded-full bg-neutral-100 border border-neutral-200 text-[11px] font-bold uppercase tracking-widest text-neutral-600">
              Clean & Private Browser Workstation
            </div>
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight text-neutral-900 mb-5 leading-[1.1]">
              Professional Voice Processing
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-neutral-500 max-w-2xl mx-auto leading-relaxed">
              Browser-native audio equalization, dynamic range compression, noise gating, and silence removal. Zero latency, 100% private, client-side Web Audio DSP.
            </p>
          </div>
        </section>

        {/* Studio Workstation Tool Section */}
        <section id="workstation" className="pb-8 md:pb-16 px-3 sm:px-6 md:px-8 max-w-7xl mx-auto">
          <AudioWorkstation />
        </section>

        {/* Ad Slot 2: After Calculator (Highest CTR Position) */}
        <div className="container mx-auto px-4 pb-12 max-w-7xl text-center">
          <div className="bg-neutral-50 border border-dashed border-neutral-200 rounded-lg p-3 text-[10px] font-mono uppercase tracking-widest text-neutral-400">
            📢 Ad Slot 2 — Post-Workstation High CTR Display Ad
          </div>
        </div>
      </div>

      {/* Features Showcase Grid */}
      <section className="bg-neutral-50/50 py-12 md:py-20 border-b border-neutral-200">
        <div className="container mx-auto px-4 md:px-8 max-w-6xl">
          <div className="mb-10 text-center max-w-2xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-neutral-900 mb-2">
              Built For Precision & Speed
            </h2>
            <p className="text-xs md:text-sm text-neutral-500 leading-relaxed uppercase tracking-wider">
              Essential signal processing modules operating without cloud latency or subscription fees.
            </p>
          </div>

          <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
            <FeatureCard
              title="Zero Latency"
              desc="Instant DSP processing directly in browser memory using standard Web Audio API nodes and WebAssembly algorithms."
              icon={<Zap className="h-5 w-5 text-white" />}
            />
            <FeatureCard
              title="100% Client-Side Privacy"
              desc="Your voice recordings never touch an external cloud server. Complete data isolation inside your browser sandbox."
              icon={<ShieldCheck className="h-5 w-5 text-white" />}
            />
            <FeatureCard
              title="24-Bit Master Export"
              desc="Export uncompressed broadcast-quality 24-bit PCM WAV audio files ready for Spotify, Apple Podcasts, YouTube, and ACX."
              icon={<Download className="h-5 w-5 text-white" />}
            />
          </div>
        </div>
      </section>

      {/* Section 1: What is Voice Enhancement & Audio Processing? */}
      <section className="py-16 md:py-24 bg-white border-b border-neutral-200">
        <div className="container mx-auto px-4 md:px-8 max-w-4xl space-y-8">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 bg-neutral-100 px-3 py-1 rounded-full border border-neutral-200">
              Fundamental Principles
            </span>
            <h2 className="text-2xl md:text-4xl font-black uppercase tracking-tight text-neutral-900 mt-3 mb-4">
              What is Voice Enhancement?
            </h2>
            <p className="text-xs md:text-sm text-neutral-600 leading-relaxed">
              Voice enhancement is the specialized discipline of digital signal processing (DSP) dedicated to improving vocal speech intelligibility, removing ambient room reflections, balancing tonal frequency dynamics, and constraining peak amplitudes.
            </p>
          </div>

          <div className="prose prose-neutral max-w-none text-xs md:text-sm text-neutral-700 leading-relaxed space-y-4">
            <p>
              When raw spoken audio is captured by a studio microphone, it rarely possesses the polished warmth, clarity, and presence required for commercial distribution. Unconditioned acoustic environments naturally introduce room reverberation, air conditioner HVAC hum, power line electrical noise, and low-frequency mechanical rumble from desk vibrations. Furthermore, human vocal dynamics fluctuate naturally between whisper-quiet consonant syllables and high-energy vowel transients.
            </p>
            <p>
              VoiceEnhancer.io applies a precise cascade of audio DSP modules to resolve these mechanical audio defects. By systematically stripping unwanted background noise through threshold noise gating, sculpting vocal fundamentals with 3-band parametric equalization, conditioning dynamic range with peak-detecting compression, trimming low-energy pauses, and guarding against digital clipping with a brickwall peak limiter, raw voice recordings are instantly elevated to professional broadcast standards.
            </p>
            <p>
              Whether you are recording podcast episodes, narration tracks, audiobooks, YouTube voiceovers, remote interviews, or acoustic commentary, our browser workstation gives you total manual control over every audio variable without complex DAW installations or recurring monthly software fees.
            </p>
          </div>
        </div>
      </section>

      {/* Section 2: How Our Web Audio DSP Engine Works */}
      <section className="py-16 md:py-24 bg-neutral-50/50 border-b border-neutral-200">
        <div className="container mx-auto px-4 md:px-8 max-w-4xl space-y-8">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 bg-neutral-100 px-3 py-1 rounded-full border border-neutral-200">
              Technical Architecture
            </span>
            <h2 className="text-2xl md:text-4xl font-black uppercase tracking-tight text-neutral-900 mt-3 mb-4">
              How Our Engine Works
            </h2>
            <p className="text-xs md:text-sm text-neutral-600 leading-relaxed">
              Real-time client-side signal routing executed inside local browser RAM without server latency or data leaks.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white border border-neutral-200 rounded-xl p-5 text-center shadow-2xs">
              <div className="w-8 h-8 rounded-full bg-black text-white text-xs font-bold flex items-center justify-center mx-auto mb-3">1</div>
              <h3 className="text-xs font-bold uppercase tracking-wide text-neutral-900 mb-1">PCM Decoding</h3>
              <p className="text-[11px] text-neutral-500 leading-normal">
                Converts imported WAV, MP3, or M4A files into 32-bit floating point PCM audio buffers in browser RAM memory.
              </p>
            </div>
            <div className="bg-white border border-neutral-200 rounded-xl p-5 text-center shadow-2xs">
              <div className="w-8 h-8 rounded-full bg-black text-white text-xs font-bold flex items-center justify-center mx-auto mb-3">2</div>
              <h3 className="text-xs font-bold uppercase tracking-wide text-neutral-900 mb-1">DSP Routing</h3>
              <p className="text-[11px] text-neutral-500 leading-normal">
                Streams audio data sequentially through Noise Gate, High-Pass Filter, Parametric EQ, Dynamics Compressor, and Limiter.
              </p>
            </div>
            <div className="bg-white border border-neutral-200 rounded-xl p-5 text-center shadow-2xs">
              <div className="w-8 h-8 rounded-full bg-black text-white text-xs font-bold flex items-center justify-center mx-auto mb-3">3</div>
              <h3 className="text-xs font-bold uppercase tracking-wide text-neutral-900 mb-1">Real-time Canvas</h3>
              <p className="text-[11px] text-neutral-500 leading-normal">
                Renders high-resolution waveform visualizers and playhead tracking at 60 FPS using HTML5 Canvas API.
              </p>
            </div>
            <div className="bg-white border border-neutral-200 rounded-xl p-5 text-center shadow-2xs">
              <div className="w-8 h-8 rounded-full bg-black text-white text-xs font-bold flex items-center justify-center mx-auto mb-3">4</div>
              <h3 className="text-xs font-bold uppercase tracking-wide text-neutral-900 mb-1">24-Bit Encoding</h3>
              <p className="text-[11px] text-neutral-500 leading-normal">
                Renders the processed audio buffer into an uncompressed 24-bit PCM WAV file and triggers instant file download.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Ad Slot 3: Mid-Content Banner */}
      <div className="container mx-auto px-4 py-8 max-w-7xl text-center">
        <div className="bg-neutral-50 border border-dashed border-neutral-200 rounded-lg p-3 text-[10px] font-mono uppercase tracking-widest text-neutral-400">
          📢 Ad Slot 3 — In-Article Mid Content Ad Placement
        </div>
      </div>

      {/* Section 3: Understanding Voice DSP Parameters */}
      <section className="py-16 md:py-24 bg-white border-b border-neutral-200">
        <div className="container mx-auto px-4 md:px-8 max-w-6xl">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl md:text-4xl font-black uppercase tracking-tight text-neutral-900 mb-3">
              Mastering The Audio Controls
            </h2>
            <p className="text-xs md:text-sm text-neutral-500 leading-relaxed uppercase tracking-wider">
              Detailed breakdown of the acoustic mechanics behind each workstation parameter slider.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white border border-neutral-200 rounded-xl p-6 shadow-2xs">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-black text-white"><Mic className="w-4 h-4" /></div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-900">1. Noise Gate & High-Pass Filter</h3>
              </div>
              <p className="text-xs text-neutral-600 leading-relaxed mb-3">
                The Noise Gate sets an amplitude threshold floor below which all incoming audio signals are attenuated or muted. This eliminates low-level electrical noise floor, fan noise, and background room hum during speech pauses. The built-in 80Hz High-Pass Filter cuts non-vocal sub-bass frequencies to prevent desk thumps from polluting the signal.
              </p>
              <div className="text-[11px] font-mono text-neutral-500 bg-neutral-50 p-2.5 rounded-lg border border-neutral-200">
                Optimal Setting: -45 dB to -35 dB threshold for typical room noise floors.
              </div>
            </div>

            <div className="bg-white border border-neutral-200 rounded-xl p-6 shadow-2xs">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-black text-white"><Sliders className="w-4 h-4" /></div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-900">2. 3-Band Parametric Equalizer</h3>
              </div>
              <p className="text-xs text-neutral-600 leading-relaxed mb-3">
                Parametric Equalization modifies specific frequency bands to balance vocal timbre. The Low band controls chest warmth (200Hz), the Mid band controls speech intelligibility and presence (2.5kHz), and the High band adds air and brilliance (10kHz). Equalization compensates for microphone proximity effect and dull acoustics.
              </p>
              <div className="text-[11px] font-mono text-neutral-500 bg-neutral-50 p-2.5 rounded-lg border border-neutral-200">
                Pro Tip: Boost 2.5kHz by +2dB for speech clarity; boost 10kHz by +3dB for modern sheen.
              </div>
            </div>

            <div className="bg-white border border-neutral-200 rounded-xl p-6 shadow-2xs">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-black text-white"><Activity className="w-4 h-4" /></div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-900">3. Dynamic Range Compressor</h3>
              </div>
              <p className="text-xs text-neutral-600 leading-relaxed mb-3">
                Compression narrows the volume dynamic range by automatically dampening signals that exceed a set threshold. When combined with makeup gain, quiet words become audible while loud vocal spikes are controlled. This yields a dense, professional, cohesive voice sound that sits consistently above background noise.
              </p>
              <div className="text-[11px] font-mono text-neutral-500 bg-neutral-50 p-2.5 rounded-lg border border-neutral-200">
                Recommended Ratio: 3:1 ratio with -18 dB threshold for natural speech dynamics.
              </div>
            </div>

            <div className="bg-white border border-neutral-200 rounded-xl p-6 shadow-2xs">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-black text-white"><Volume2 className="w-4 h-4" /></div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-900">4. Brickwall Peak Limiter</h3>
              </div>
              <p className="text-xs text-neutral-600 leading-relaxed mb-3">
                The Limiter acts as a safety ceiling, guaranteeing that output peaks never exceed -1.0 dBFS. Digital clipping occurs when audio signals exceed 0 dBFS, causing harsh inter-sample distortion. Our brickwall limiter caps maximum amplitude, ensuring clean reproduction across all consumer audio devices and playback systems.
              </p>
              <div className="text-[11px] font-mono text-neutral-500 bg-neutral-50 p-2.5 rounded-lg border border-neutral-200">
                Ceiling Locked at -1.0 dBFS to meet Spotify and Apple Podcasts playback specs.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Acoustic Assessment Checklist Calculator */}
      <section className="py-16 md:py-24 bg-neutral-50/50 border-b border-neutral-200">
        <div className="container mx-auto px-4 md:px-8 max-w-4xl">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 bg-neutral-100 px-3 py-1 rounded-full border border-neutral-200">
              Interactive Diagnostic
            </span>
            <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-neutral-900 mt-3 mb-2">
              Vocal Recording Setup Assessment
            </h2>
            <p className="text-xs text-neutral-500 uppercase tracking-wider">
              Evaluate your acoustic environment and gear readiness before processing.
            </p>
          </div>

          <div className="bg-white border border-neutral-200 rounded-xl p-6 md:p-8 shadow-2xs grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-3.5">
              <label className="flex items-center justify-between p-3 rounded-lg border border-neutral-200 hover:bg-neutral-50 cursor-pointer">
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-800">Acoustic Foam / Curtains Installed</span>
                <input
                  type="checkbox"
                  checked={hasAcousticTreatment}
                  onChange={(e) => setHasAcousticTreatment(e.target.checked)}
                  className="w-4 h-4 accent-black rounded cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-lg border border-neutral-200 hover:bg-neutral-50 cursor-pointer">
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-800">Condenser / Dynamic XLR Mic</span>
                <input
                  type="checkbox"
                  checked={usesCondenserMic}
                  onChange={(e) => setUsesCondenserMic(e.target.checked)}
                  className="w-4 h-4 accent-black rounded cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-lg border border-neutral-200 hover:bg-neutral-50 cursor-pointer">
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-800">Mesh Pop Filter Attached</span>
                <input
                  type="checkbox"
                  checked={usesPopFilter}
                  onChange={(e) => setUsesPopFilter(e.target.checked)}
                  className="w-4 h-4 accent-black rounded cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-lg border border-neutral-200 hover:bg-neutral-50 cursor-pointer">
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-800">HVAC / Fans Turned Off</span>
                <input
                  type="checkbox"
                  checked={hasLowBackgroundNoise}
                  onChange={(e) => setHasLowBackgroundNoise(e.target.checked)}
                  className="w-4 h-4 accent-black rounded cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-lg border border-neutral-200 hover:bg-neutral-50 cursor-pointer">
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-800">Proper Mic Distance (6-8 in)</span>
                <input
                  type="checkbox"
                  checked={micDistanceOk}
                  onChange={(e) => setMicDistanceOk(e.target.checked)}
                  className="w-4 h-4 accent-black rounded cursor-pointer"
                />
              </label>
            </div>

            <div className="text-center p-6 bg-neutral-50 border border-neutral-200 rounded-xl">
              <div className="text-xs font-bold uppercase tracking-widest text-neutral-400 mb-2">Calculated Setup Readiness</div>
              <div className="text-5xl font-black text-neutral-900 mb-2 font-mono">{score} / 100</div>
              <div className="text-xs font-bold uppercase tracking-wider text-neutral-700 mb-4">
                {score >= 85 ? '🌟 Studio Grade Environment' : score >= 65 ? '👍 Good Home Recording' : '⚠️ High DSP Enhancement Needed'}
              </div>
              <p className="text-[11px] text-neutral-500 leading-relaxed">
                {score >= 85
                  ? 'Your raw audio capture is clean. Minimal EQ adjustments and light compression will yield broadcast-ready master files.'
                  : score >= 65
                  ? 'Your setup is solid. Use the Noise Gate (-40dB) and High-Pass filter to eliminate mild room reflections.'
                  : 'Your environment has room reverb or noise. Increase Noise Gate threshold and apply Mid EQ attenuation.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 5: Voice Processing Presets & Use Cases */}
      <section className="py-16 md:py-24 bg-white border-b border-neutral-200">
        <div className="container mx-auto px-4 md:px-8 max-w-6xl">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-neutral-900 mb-2">
              Preset Acoustic Profiles Guide
            </h2>
            <p className="text-xs text-neutral-500 uppercase tracking-wider">
              Tailored signal processing configurations for different vocal genres and recording media.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border border-neutral-200 rounded-xl p-6 bg-neutral-50/50 space-y-3">
              <div className="text-xs font-black uppercase tracking-widest text-black bg-white px-3 py-1 rounded-full border border-neutral-200 inline-block">
                Podcast & Voiceover
              </div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-900">Broadcast Voice Master</h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Optimized for spoken word clarity, narrative storytelling, and radio commercials. Applies moderate low-end warmth, a 2.5kHz presence bump, and 3:1 dynamic compression for authoritative vocal weight.
              </p>
              <div className="text-[11px] font-mono text-neutral-500">
                Target LUFS: -16 LUFS Integrated • Peak Ceiling: -1.0 dB
              </div>
            </div>

            <div className="border border-neutral-200 rounded-xl p-6 bg-neutral-50/50 space-y-3">
              <div className="text-xs font-black uppercase tracking-widest text-black bg-white px-3 py-1 rounded-full border border-neutral-200 inline-block">
                YouTube & Gaming
              </div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-900">Crisp Presence & Sheen</h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Designed to cut through background game music and video sound effects. Features an aggressive High Air boost (+3.5dB at 10kHz) and fast compression release to maintain energy across noisy dialogue.
              </p>
              <div className="text-[11px] font-mono text-neutral-500">
                Target LUFS: -14 LUFS Integrated • High Air Boost: +3.5 dB
              </div>
            </div>

            <div className="border border-neutral-200 rounded-xl p-6 bg-neutral-50/50 space-y-3">
              <div className="text-xs font-black uppercase tracking-widest text-black bg-white px-3 py-1 rounded-full border border-neutral-200 inline-block">
                Audiobook & ACX
              </div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-900">Natural Warmth & Intimacy</h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Engineered to meet ACX and Audible technical requirements. Uses a subtle 2:1 ratio compression curve with gentle noise gating to preserve narrator breathing while maintaining consistent RMS levels.
              </p>
              <div className="text-[11px] font-mono text-neutral-500">
                ACX Compliant • Noise Floor: &lt;-60 dB • RMS Target: -20 dB
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 6: Common Audio Editing Mistakes */}
      <section className="py-16 md:py-24 bg-neutral-50/50 border-b border-neutral-200">
        <div className="container mx-auto px-4 md:px-8 max-w-4xl space-y-8">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-neutral-900 mb-2">
              Common Audio Editing Mistakes
            </h2>
            <p className="text-xs text-neutral-500 uppercase tracking-wider">
              Avoid these frequent engineering pitfalls when mastering vocal tracks.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 border border-red-200 bg-red-50/30 rounded-xl space-y-2">
              <div className="flex items-center gap-2 text-red-700 font-bold text-xs uppercase tracking-wider">
                <AlertTriangle className="w-4 h-4" /> Over-Gating (Choppy Syllables)
              </div>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Setting the Noise Gate threshold too high cuts off word endings and natural breathing transitions, making spoken words sound artificial and choppy.
              </p>
            </div>

            <div className="p-5 border border-red-200 bg-red-50/30 rounded-xl space-y-2">
              <div className="flex items-center gap-2 text-red-700 font-bold text-xs uppercase tracking-wider">
                <AlertTriangle className="w-4 h-4" /> Excessive Compression Ratios
              </div>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Ratios exceeding 6:1 squash speech dynamics, causing audible noise pumping between phrases and inducing listener fatigue.
              </p>
            </div>

            <div className="p-5 border border-red-200 bg-red-50/30 rounded-xl space-y-2">
              <div className="flex items-center gap-2 text-red-700 font-bold text-xs uppercase tracking-wider">
                <AlertTriangle className="w-4 h-4" /> Over-Boosting High Frequencies
              </div>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Over-boosting frequencies between 5kHz and 8kHz amplifies unpleasant sibilant "S" and "T" sounds, producing harsh, piercing audio.
              </p>
            </div>

            <div className="p-5 border border-red-200 bg-red-50/30 rounded-xl space-y-2">
              <div className="flex items-center gap-2 text-red-700 font-bold text-xs uppercase tracking-wider">
                <AlertTriangle className="w-4 h-4" /> Neglecting Sub-Bass Low Cut
              </div>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Failing to filter out frequencies below 80Hz wastes compressor headroom on inaudible desk vibrations and air conditioner hum.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 7: 8 Expert Tips for Vocal Enhancement */}
      <section className="py-16 md:py-24 bg-white border-b border-neutral-200">
        <div className="container mx-auto px-4 md:px-8 max-w-5xl">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-neutral-900 mb-2">
              8 Expert Tips for Vocal Perfection
            </h2>
            <p className="text-xs text-neutral-500 uppercase tracking-wider">
              Professional engineering guidelines for broadcast sound quality.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-xl text-left shadow-2xs">
              <div className="text-xs font-black font-mono text-neutral-400 mb-1">TIP 01</div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900 mb-1">Maintain Distance</h3>
              <p className="text-[11px] text-neutral-500 leading-relaxed">Keep 6 to 8 inches of distance between your mouth and mic capsule to avoid proximity bass boom.</p>
            </div>

            <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-xl text-left shadow-2xs">
              <div className="text-xs font-black font-mono text-neutral-400 mb-1">TIP 02</div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900 mb-1">Off-Axis Angle</h3>
              <p className="text-[11px] text-neutral-500 leading-relaxed">Angle the mic 15 degrees off-axis so explosive air bursts bypass the diaphragm without popping.</p>
            </div>

            <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-xl text-left shadow-2xs">
              <div className="text-xs font-black font-mono text-neutral-400 mb-1">TIP 03</div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900 mb-1">Sub-Rumble Cut</h3>
              <p className="text-[11px] text-neutral-500 leading-relaxed">Always activate the 80Hz Low-Cut Filter to clean room HVAC rumble before compressing.</p>
            </div>

            <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-xl text-left shadow-2xs">
              <div className="text-xs font-black font-mono text-neutral-400 mb-1">TIP 04</div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900 mb-1">Boxiness Cut</h3>
              <p className="text-[11px] text-neutral-500 leading-relaxed">Narrowly cut boxy room frequencies between 400Hz and 600Hz by -2dB to improve voice clarity.</p>
            </div>

            <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-xl text-left shadow-2xs">
              <div className="text-xs font-black font-mono text-neutral-400 mb-1">TIP 05</div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900 mb-1">Gentle Compression</h3>
              <p className="text-[11px] text-neutral-500 leading-relaxed">Use a gentle 2:1 or 3:1 ratio for spoken voice to maintain natural conversational dynamics.</p>
            </div>

            <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-xl text-left shadow-2xs">
              <div className="text-xs font-black font-mono text-neutral-400 mb-1">TIP 06</div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900 mb-1">Air Shelf Sheen</h3>
              <p className="text-[11px] text-neutral-500 leading-relaxed">Apply a subtle high shelf boost at 12 kHz (+2.5dB) to introduce expensive condenser sheen.</p>
            </div>

            <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-xl text-left shadow-2xs">
              <div className="text-xs font-black font-mono text-neutral-400 mb-1">TIP 07</div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900 mb-1">Peak Limiting</h3>
              <p className="text-[11px] text-neutral-500 leading-relaxed">Set the final output limiter ceiling to -1.0 dBFS to prevent inter-sample clipping on MP3 conversion.</p>
            </div>

            <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-xl text-left shadow-2xs">
              <div className="text-xs font-black font-mono text-neutral-400 mb-1">TIP 08</div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900 mb-1">Moderate Monitoring</h3>
              <p className="text-[11px] text-neutral-500 leading-relaxed">Listen to audio edits at moderate 70dB sound levels to prevent Fletcher-Munson ear fatigue.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 8: Best Practices for Audio Export & Streaming Standards */}
      <section className="py-16 md:py-24 bg-neutral-50/50 border-b border-neutral-200">
        <div className="container mx-auto px-4 md:px-8 max-w-4xl space-y-6">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-neutral-900 mb-2">
              Best Practices for Audio Export
            </h2>
            <p className="text-xs text-neutral-500 uppercase tracking-wider">
              Publishing guidelines for Spotify, Apple Podcasts, YouTube, and ACX.
            </p>
          </div>

          <div className="bg-white border border-neutral-200 rounded-xl p-6 md:p-8 space-y-4 text-xs text-neutral-700 leading-relaxed">
            <p>
              When finalizing audio masters for digital distribution, format selection and peak ceiling compliance are critical. MP3, AAC, and OGG formats utilize perceptual encoding algorithms that eliminate audio data masked from human hearing. If an audio file is exported with peak levels at exactly 0.0 dBFS, the lossy encoding process frequently introduces inter-sample peak overshoots that cause severe digital clipping during playback.
            </p>
            <p>
              To eliminate this risk, VoiceEnhancer.io exports all master files in uncompressed 24-bit PCM WAV format with a hard peak limiter locked at -1.0 dBFS. Uncompressed 24-bit WAV preserves 144 dB of dynamic range, providing ample headroom for downstream compression and streaming platform normalization.
            </p>
            <ul className="list-disc pl-5 space-y-2 text-neutral-600">
              <li><strong>Spotify Podcasts:</strong> Target -14 LUFS Integrated loudness with -1.0 dBFS true peak ceiling.</li>
              <li><strong>Apple Podcasts:</strong> Target -16 LUFS Integrated loudness with -1.0 dBFS true peak ceiling.</li>
              <li><strong>YouTube Videos:</strong> Target -14 LUFS Integrated loudness (-2.0 dBFS true peak max).</li>
              <li><strong>ACX Audiobooks:</strong> Target -23 dB to -18 dB RMS with -3.0 dB peak ceiling and &lt;-60 dB noise floor.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Ad Slot 4: Before FAQ (High Engagement Multiplex) */}
      <div className="container mx-auto px-4 py-8 max-w-7xl text-center">
        <div className="bg-neutral-50 border border-dashed border-neutral-200 rounded-lg p-3 text-[10px] font-mono uppercase tracking-widest text-neutral-400">
          📢 Ad Slot 4 — Pre-FAQ High Engagement Multiplex Ad Slot
        </div>
      </div>

      {/* Section 10: Comprehensive Frequently Asked Questions */}
      <section className="py-16 md:py-24 bg-white border-b border-neutral-200">
        <div className="container mx-auto px-4 md:px-8 max-w-3xl">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-neutral-900 mb-2">
              Frequently Asked Questions
            </h2>
            <p className="text-xs text-neutral-500 uppercase tracking-wider">
              Detailed answers to technical questions about VoiceEnhancer.io.
            </p>
          </div>

          <div className="space-y-4">
            <div className="p-5 border border-neutral-200 rounded-xl bg-white shadow-2xs">
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900 mb-2">How does client-side browser DSP protect my privacy?</h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                VoiceEnhancer.io processes all binary audio signals locally within your web browser's dedicated WebAssembly memory space. No audio bytes, microphone transcripts, or personal media files are ever uploaded to cloud servers or used to train machine learning models.
              </p>
            </div>

            <div className="p-5 border border-neutral-200 rounded-xl bg-white shadow-2xs">
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900 mb-2">Why is 24-Bit WAV preferred over MP3 export?</h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                24-bit uncompressed WAV files maintain a 144 dB dynamic range and preserve all micro-tonal details without lossy perceptual compression artifacts. This makes your exported master ready for Spotify, Apple Podcasts, YouTube, or ACX Audiobook submission without quality degradation.
              </p>
            </div>

            <div className="p-5 border border-neutral-200 rounded-xl bg-white shadow-2xs">
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900 mb-2">Can I use VoiceEnhancer.io on mobile devices?</h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Yes. VoiceEnhancer.io is fully responsive and supports mobile Safari and Chrome on iOS and Android devices with touch-optimized controls and native mobile file selection.
              </p>
            </div>

            <div className="p-5 border border-neutral-200 rounded-xl bg-white shadow-2xs">
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900 mb-2">What input audio formats are supported?</h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                VoiceEnhancer.io supports WAV, MP3, M4A, AAC, FLAC, and OGG audio input formats up to standard browser memory limits.
              </p>
            </div>

            <div className="p-5 border border-neutral-200 rounded-xl bg-white shadow-2xs">
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900 mb-2">Is there any limit on file duration or usage?</h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                There are no artificial usage limits or watermark insertions. You can process unlimited voice files of any length directly on your device CPU.
              </p>
            </div>

            <div className="p-5 border border-neutral-200 rounded-xl bg-white shadow-2xs">
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900 mb-2">Can I use exported WAV files for commercial projects?</h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Yes. You retain 100% full copyright ownership over all processed audio tracks created with VoiceEnhancer.io for personal and commercial distribution.
              </p>
            </div>

            <div className="p-5 border border-neutral-200 rounded-xl bg-white shadow-2xs">
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900 mb-2">How does auto silence trimming work?</h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                The Trim Silence module analyzes audio buffer amplitudes from both head and tail ends, trimming leading and trailing silent regions below -50 dBFS to ensure clean, tight audio start and end boundaries.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 11: Related Topics & Audio Processing Glossary */}
      <section className="py-16 md:py-24 bg-neutral-50/50 border-b border-neutral-200">
        <div className="container mx-auto px-4 md:px-8 max-w-4xl space-y-6">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-neutral-900 mb-2">
              Audio Glossary & Technical Reference
            </h2>
            <p className="text-xs text-neutral-500 uppercase tracking-wider">
              Key signal processing terminology explained.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
            <div className="bg-white border border-neutral-200 p-4 rounded-xl">
              <h3 className="font-bold text-neutral-900 uppercase mb-1">dBFS (Decibels Full Scale)</h3>
              <p className="text-neutral-600 text-[11px] leading-relaxed">Digital amplitude scale where 0 dBFS represents maximum unclipped digital level.</p>
            </div>
            <div className="bg-white border border-neutral-200 p-4 rounded-xl">
              <h3 className="font-bold text-neutral-900 uppercase mb-1">LUFS / LKFS</h3>
              <p className="text-neutral-600 text-[11px] leading-relaxed">Loudness Units relative to Full Scale, measuring perceived human loudness over time.</p>
            </div>
            <div className="bg-white border border-neutral-200 p-4 rounded-xl">
              <h3 className="font-bold text-neutral-900 uppercase mb-1">Proximity Effect</h3>
              <p className="text-neutral-600 text-[11px] leading-relaxed">An increase in bass response when a directional mic is placed close to a sound source.</p>
            </div>
            <div className="bg-white border border-neutral-200 p-4 rounded-xl">
              <h3 className="font-bold text-neutral-900 uppercase mb-1">True Peak</h3>
              <p className="text-neutral-600 text-[11px] leading-relaxed">Peak signal level reconstructed between digital samples to prevent inter-sample clipping.</p>
            </div>
            <div className="bg-white border border-neutral-200 p-4 rounded-xl">
              <h3 className="font-bold text-neutral-900 uppercase mb-1">Noise Floor</h3>
              <p className="text-neutral-600 text-[11px] leading-relaxed">The sum of all unwanted background noise sources in a recording chain.</p>
            </div>
            <div className="bg-white border border-neutral-200 p-4 rounded-xl">
              <h3 className="font-bold text-neutral-900 uppercase mb-1">PCM Encoding</h3>
              <p className="text-neutral-600 text-[11px] leading-relaxed">Pulse Code Modulation, the standard uncompressed representation of digital audio.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 12: About This Engine & E-A-T Methodology */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4 max-w-4xl text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-neutral-500">
            <Info className="w-3.5 h-3.5 text-black" />
            E-A-T Verified Engine Standard • Last Updated 2026
          </div>
          <p className="text-xs text-neutral-500 max-w-2xl mx-auto leading-relaxed">
            VoiceEnhancer.io is developed by web audio engineers and acoustic signal specialists. Designed in accordance with ITU-R BS.1770-4 loudness standards, EBU R128 guidelines, and Web Audio W3C recommendations.
          </p>
        </div>
      </section>
    </>
  );
};
