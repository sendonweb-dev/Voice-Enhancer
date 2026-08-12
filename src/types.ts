export interface AudioSettings {
  lowGain: number; // dB (-12 to +12)
  midGain: number; // dB (-12 to +12)
  highGain: number; // dB (-12 to +12)
  threshold: number; // dB (-60 to 0)
  ratio: number; // ratio (1 to 20)
  attack: number; // seconds (0 to 0.1)
  release: number; // seconds (0.01 to 1.0)
  reverbMix: number; // ratio (0 to 0.5)
  noiseGateThreshold: number; // dB (-80 to -20)
  silenceTrimLevel: number; // dB (-80 to -20)
}

export interface Preset {
  id: string;
  name: string;
  settings: AudioSettings;
  iconName?: string;
}
