import { AudioSettings, Preset } from '../types';

export const DEFAULT_SETTINGS: AudioSettings = {
  lowGain: 0,
  midGain: 0,
  highGain: 0,
  threshold: -24,
  ratio: 4,
  attack: 0.003,
  release: 0.25,
  reverbMix: 0,
  noiseGateThreshold: -60,
  silenceTrimLevel: -50,
};

export const PRESETS: Preset[] = [
  {
    id: 'youtube-standard',
    name: 'YouTube Standard Mix',
    settings: {
      ...DEFAULT_SETTINGS,
      lowGain: 6.5,
      midGain: 2,
      highGain: 1,
      threshold: -18,
      ratio: 2.5,
      attack: 0.005,
      release: 0.2,
    },
  },
  {
    id: 'youtube-creator',
    name: 'YouTube Creator Pro',
    settings: {
      ...DEFAULT_SETTINGS,
      lowGain: 4,
      midGain: -4,
      highGain: 3,
      threshold: -20,
      ratio: 4,
      attack: 0.002,
      release: 0.15,
    },
  },
  {
    id: 'podcast-pro',
    name: 'Podcast Pro',
    settings: {
      ...DEFAULT_SETTINGS,
      lowGain: 4,
      midGain: 1.5,
      highGain: 2,
      threshold: -24,
      ratio: 4,
      attack: 0.005,
      release: 0.3,
    },
  },
  {
    id: 'voice-enhancer',
    name: 'Voice Enhancer',
    settings: {
      ...DEFAULT_SETTINGS,
      lowGain: 3,
      midGain: -3,
      highGain: -3,
      threshold: -18,
      ratio: 10,
      attack: 0.001,
      release: 0.1,
    },
  },
  {
    id: 'audio-studio-pro',
    name: 'Audio Studio Pro',
    settings: {
      ...DEFAULT_SETTINGS,
      lowGain: 1,
      midGain: 0.5,
      highGain: 1,
      threshold: -15,
      ratio: 2,
      attack: 0.01,
      release: 0.25,
    },
  },
];
