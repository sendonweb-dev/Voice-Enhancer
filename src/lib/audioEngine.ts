import { AudioSettings } from '../types';
import { WORKER_CODE } from './workerCode';

export class AudioEngine {
  private audioContext: AudioContext | null = null;
  private playSourceNode: AudioBufferSourceNode | null = null;
  private audioBuffer: AudioBuffer | null = null;
  private worker: Worker | null = null;
  private cachedPeaks: Float32Array | null = null;

  private gainNode: GainNode | null = null;
  private lowShelf: BiquadFilterNode | null = null;
  private midPeaking: BiquadFilterNode | null = null;
  private highShelf: BiquadFilterNode | null = null;
  private compressor: DynamicsCompressorNode | null = null;
  private reverbNode: ConvolverNode | null = null;
  private dryGain: GainNode | null = null;
  private wetGain: GainNode | null = null;
  private analyser: AnalyserNode | null = null;
  private masterGainNode: GainNode | null = null;
  private masterVolume: number = 1;

  public init() {
    if (!this.audioContext) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.audioContext = new AudioCtx({ latencyHint: 'interactive' });
      this.initWorker();
    }
  }

  private initWorker() {
    if (this.worker) return;
    const blob = new Blob([WORKER_CODE], { type: 'application/javascript' });
    this.worker = new Worker(URL.createObjectURL(blob));
  }

  public get context(): AudioContext | null {
    return this.audioContext;
  }

  public async loadFile(file: File): Promise<AudioBuffer> {
    this.init();
    if (!this.audioContext) throw new Error('AudioContext not initialized');

    const arrayBuffer = await file.arrayBuffer();
    const decodedBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
    this.audioBuffer = decodedBuffer;
    this.generatePeaks(decodedBuffer);
    return decodedBuffer;
  }

  private generatePeaks(buffer: AudioBuffer) {
    if (!this.worker) this.initWorker();
    if (!this.worker) return;

    const channelData = buffer.getChannelData(0);
    const samplesPerPixel = Math.ceil(buffer.length / 2000);

    this.worker.onmessage = (e) => {
      if (e.data.type === 'peaks_complete') {
        this.cachedPeaks = e.data.peaks;
      }
    };

    this.worker.postMessage({
      command: 'analyze_peaks',
      data: { channelData },
      config: { samplesPerPixel },
    });
  }

  public getBuffer(): AudioBuffer | null {
    return this.audioBuffer;
  }

  public getPeaks(): Float32Array | null {
    return this.cachedPeaks;
  }

  public getDuration(): number {
    return this.audioBuffer ? this.audioBuffer.duration : 0;
  }

  private createImpulseResponse(ctx: BaseAudioContext, duration: number, decay: number): AudioBuffer {
    const sampleRate = ctx.sampleRate;
    const length = sampleRate * duration;
    const impulse = ctx.createBuffer(2, length, sampleRate);
    const left = impulse.getChannelData(0);
    const right = impulse.getChannelData(1);

    for (let i = 0; i < length; i++) {
      const n = i;
      const factor = Math.pow(1 - n / length, decay);
      left[i] = (Math.random() * 2 - 1) * factor;
      right[i] = (Math.random() * 2 - 1) * factor;
    }
    return impulse;
  }

  public play(settings: AudioSettings, onEnded?: () => void, offset: number = 0) {
    if (!this.audioContext || !this.audioBuffer) return;

    this.stop();

    this.playSourceNode = this.audioContext.createBufferSource();
    this.playSourceNode.buffer = this.audioBuffer;

    this.gainNode = this.audioContext.createGain();
    this.lowShelf = this.audioContext.createBiquadFilter();
    this.midPeaking = this.audioContext.createBiquadFilter();
    this.highShelf = this.audioContext.createBiquadFilter();
    this.compressor = this.audioContext.createDynamicsCompressor();
    this.analyser = this.audioContext.createAnalyser();
    this.analyser.fftSize = 256;

    this.reverbNode = this.audioContext.createConvolver();
    this.reverbNode.buffer = this.createImpulseResponse(this.audioContext, 2, 2);
    this.dryGain = this.audioContext.createGain();
    this.wetGain = this.audioContext.createGain();

    this.masterGainNode = this.audioContext.createGain();
    this.masterGainNode.gain.value = this.masterVolume;

    // Filter specs
    this.lowShelf.type = 'lowshelf';
    this.lowShelf.frequency.value = 320;

    this.midPeaking.type = 'peaking';
    this.midPeaking.frequency.value = 1000;
    this.midPeaking.Q.value = 0.5;

    this.highShelf.type = 'highshelf';
    this.highShelf.frequency.value = 3200;

    // Connect graph
    this.playSourceNode.connect(this.lowShelf);
    this.lowShelf.connect(this.midPeaking);
    this.midPeaking.connect(this.highShelf);
    this.highShelf.connect(this.compressor);

    this.compressor.connect(this.dryGain);
    this.compressor.connect(this.reverbNode);
    this.reverbNode.connect(this.wetGain);

    this.dryGain.connect(this.gainNode);
    this.wetGain.connect(this.gainNode);

    this.gainNode.connect(this.analyser);
    this.analyser.connect(this.masterGainNode);
    this.masterGainNode.connect(this.audioContext.destination);

    this.updateSettings(settings);

    if (onEnded) {
      this.playSourceNode.onended = onEnded;
    }

    this.playSourceNode.start(0, offset);
  }

  public setMasterVolume(val: number) {
    this.masterVolume = val;
    if (this.masterGainNode && this.audioContext) {
      this.masterGainNode.gain.setTargetAtTime(val, this.audioContext.currentTime, 0.05);
    }
  }

  public updateSettings(settings: AudioSettings) {
    if (!this.audioContext) return;
    const now = this.audioContext.currentTime;

    if (this.lowShelf) this.lowShelf.gain.setTargetAtTime(settings.lowGain, now, 0.1);
    if (this.midPeaking) this.midPeaking.gain.setTargetAtTime(settings.midGain, now, 0.1);
    if (this.highShelf) this.highShelf.gain.setTargetAtTime(settings.highGain, now, 0.1);

    if (this.compressor) {
      this.compressor.threshold.setTargetAtTime(settings.threshold, now, 0.1);
      this.compressor.ratio.setTargetAtTime(settings.ratio, now, 0.1);
      this.compressor.attack.setTargetAtTime(settings.attack, now, 0.1);
      this.compressor.release.setTargetAtTime(settings.release, now, 0.1);
    }

    if (this.dryGain && this.wetGain) {
      const mix = settings.reverbMix;
      this.dryGain.gain.setTargetAtTime(1 - mix, now, 0.1);
      this.wetGain.gain.setTargetAtTime(mix, now, 0.1);
    }
  }

  public stop() {
    if (this.playSourceNode) {
      try {
        this.playSourceNode.stop();
        this.playSourceNode.disconnect();
      } catch {
        // ignore
      }
      this.playSourceNode = null;
    }
  }

  public async renderAndExport(settings: AudioSettings, onProgress: (percent: number) => void): Promise<Blob> {
    if (!this.audioBuffer || !this.worker) throw new Error('Not ready for export');

    this.initWorker();
    const duration = this.audioBuffer.duration;
    const sampleRate = this.audioBuffer.sampleRate;
    const totalSamples = Math.ceil(duration * sampleRate);

    return new Promise((resolve, reject) => {
      const handleMessage = (e: MessageEvent) => {
        if (e.data.type === 'encode_complete') {
          if (this.worker) this.worker.removeEventListener('message', handleMessage);
          resolve(e.data.blob);
        }
      };

      if (!this.worker) return reject(new Error('No worker'));
      this.worker.addEventListener('message', handleMessage);
      this.worker.postMessage({
        command: 'init_encode',
        config: { totalSamples, sampleRate },
      });

      const chunkSizeSeconds = 5;
      const overlapSeconds = 0.1;
      let currentTime = 0;

      const processChunk = async () => {
        if (currentTime >= duration) {
          if (this.worker) this.worker.postMessage({ command: 'finish_encode' });
          return;
        }

        const isFirst = currentTime === 0;
        const startTime = isFirst ? 0 : currentTime - overlapSeconds;
        const lengthSeconds = Math.min(duration, currentTime + chunkSizeSeconds) - startTime;

        const offlineCtx = new OfflineAudioContext(1, Math.ceil(lengthSeconds * sampleRate), sampleRate);
        const source = offlineCtx.createBufferSource();
        source.buffer = this.audioBuffer;

        const low = offlineCtx.createBiquadFilter();
        low.type = 'lowshelf';
        low.frequency.value = 320;
        low.gain.value = settings.lowGain;

        const mid = offlineCtx.createBiquadFilter();
        mid.type = 'peaking';
        mid.frequency.value = 1000;
        mid.Q.value = 0.5;
        mid.gain.value = settings.midGain;

        const high = offlineCtx.createBiquadFilter();
        high.type = 'highshelf';
        high.frequency.value = 3200;
        high.gain.value = settings.highGain;

        const comp = offlineCtx.createDynamicsCompressor();
        comp.threshold.value = settings.threshold;
        comp.ratio.value = settings.ratio;
        comp.attack.value = settings.attack;
        comp.release.value = settings.release;

        const master = offlineCtx.createGain();

        source.connect(low);
        low.connect(mid);
        mid.connect(high);
        high.connect(comp);

        if (settings.reverbMix > 0) {
          const verb = offlineCtx.createConvolver();
          verb.buffer = this.createImpulseResponse(offlineCtx, 2, 2);

          const dry = offlineCtx.createGain();
          dry.gain.value = 1 - settings.reverbMix;

          const wet = offlineCtx.createGain();
          wet.gain.value = settings.reverbMix;

          comp.connect(dry);
          comp.connect(verb);
          verb.connect(wet);

          dry.connect(master);
          wet.connect(master);
        } else {
          comp.connect(master);
        }

        master.connect(offlineCtx.destination);
        source.start(0, startTime, lengthSeconds);

        const renderedBuffer = await offlineCtx.startRendering();
        const rawSamples = renderedBuffer.getChannelData(0);

        const trimStartSamples = isFirst ? 0 : Math.floor(overlapSeconds * sampleRate);
        const chunkSamples = rawSamples.slice(trimStartSamples);

        if (this.worker) {
          this.worker.postMessage({
            command: 'encode_chunk',
            data: { samples: chunkSamples },
          }, [chunkSamples.buffer]);
        }

        currentTime += chunkSizeSeconds;
        onProgress(Math.min(99, (currentTime / duration) * 100));

        setTimeout(processChunk, 5);
      };

      processChunk().catch(reject);
    });
  }

  public async removeSilence(thresholdDb: number): Promise<AudioBuffer | null> {
    if (!this.audioBuffer || !this.worker) return null;

    const sampleRate = this.audioBuffer.sampleRate;
    const channels = this.audioBuffer.numberOfChannels;
    const thresholdAmp = Math.pow(10, thresholdDb / 20);
    const buffer = this.audioBuffer;

    return new Promise((resolve) => {
      const handleMessage = (e: MessageEvent) => {
        if (e.data.type === 'silence_detected') {
          if (this.worker) this.worker.removeEventListener('message', handleMessage);
          const cuts: { start: number; end: number }[] = e.data.cuts;

          if (cuts.length === 0) {
            resolve(buffer);
            return;
          }

          let totalCutSamples = 0;
          cuts.forEach(c => totalCutSamples += (c.end - c.start));

          const newLength = buffer.length - totalCutSamples;
          if (newLength >= buffer.length || newLength <= 0 || !this.audioContext) {
            resolve(buffer);
            return;
          }

          const newBuffer = this.audioContext.createBuffer(channels, newLength, sampleRate);

          for (let ch = 0; ch < channels; ch++) {
            const oldData = buffer.getChannelData(ch);
            const newData = newBuffer.getChannelData(ch);

            let oldPos = 0;
            let newPos = 0;
            let cutIdx = 0;

            while (oldPos < buffer.length) {
              if (cutIdx < cuts.length && oldPos === cuts[cutIdx].start) {
                oldPos = cuts[cutIdx].end;
                cutIdx++;
              } else {
                const nextCutStart = cutIdx < cuts.length ? cuts[cutIdx].start : buffer.length;
                const chunkSize = nextCutStart - oldPos;
                if (chunkSize > 0) {
                  newData.set(oldData.subarray(oldPos, oldPos + chunkSize), newPos);
                  newPos += chunkSize;
                  oldPos += chunkSize;
                }
              }
            }
          }

          this.audioBuffer = newBuffer;
          this.generatePeaks(newBuffer);
          resolve(newBuffer);
        }
      };

      if (this.worker) {
        this.worker.addEventListener('message', handleMessage);
        const channelData = buffer.getChannelData(0);
        this.worker.postMessage({
          command: 'detect_silence',
          data: { channelData },
          config: {
            threshold: thresholdAmp,
            minSilenceSamples: Math.floor(0.5 * sampleRate),
            paddingSamples: Math.floor(0.1 * sampleRate),
          },
        });
      } else {
        resolve(buffer);
      }
    });
  }
}

export const audioEngine = new AudioEngine();
