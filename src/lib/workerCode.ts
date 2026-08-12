export const WORKER_CODE = `
  let pcmData = [];
  let totalSamplesProcessed = 0;
  let expectedTotalSamples = 0;
  let wavSampleRate = 48000;

  self.onmessage = function(e) {
    const { command, data, config } = e.data;

    switch (command) {
      case 'init_encode':
        initEncode(config);
        break;
      case 'encode_chunk':
        encodeChunk(data);
        break;
      case 'finish_encode':
        finishEncode();
        break;
      case 'analyze_peaks':
        analyzePeaks(data, config);
        break;
      case 'detect_silence':
        detectSilence(data, config);
        break;
    }
  };

  function initEncode(config) {
    expectedTotalSamples = config.totalSamples;
    wavSampleRate = config.sampleRate;
    pcmData = [];
    totalSamplesProcessed = 0;

    const numChannels = 1;
    const bitsPerSample = 24;
    const blockAlign = numChannels * (bitsPerSample / 8);
    const dataSize = expectedTotalSamples * blockAlign;

    const header = new ArrayBuffer(44);
    const view = new DataView(header);

    view.setUint32(0, 0x52494646, false); // "RIFF"
    view.setUint32(4, 0, true);           // Placeholder for size
    view.setUint32(8, 0x57415645, false); // "WAVE"
    view.setUint32(12, 0x666d7420, false); // "fmt "
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true); // PCM
    view.setUint16(22, numChannels, true); // Mono
    view.setUint32(24, wavSampleRate, true);
    view.setUint32(28, wavSampleRate * blockAlign, true);
    view.setUint16(32, blockAlign, true);
    view.setUint16(34, bitsPerSample, true);
    view.setUint32(36, 0x64617461, false); // "data"
    view.setUint32(40, dataSize, true);

    pcmData.push(new Uint8Array(header));
  }

  function encodeChunk({ samples }) {
    const len = samples.length;
    const output = new Uint8Array(len * 3); // 24-bit = 3 bytes

    for (let i = 0; i < len; i++) {
      let s = samples[i];
      if (s < -1) s = -1;
      else if (s > 1) s = 1;

      s = s < 0 ? s * 0x800000 : s * 0x7FFFFF;
      const pcm = (s < 0 ? s - 0.5 : s + 0.5) | 0;

      const idx = i * 3;
      output[idx] = pcm & 0xFF;
      output[idx + 1] = (pcm >> 8) & 0xFF;
      output[idx + 2] = (pcm >> 16) & 0xFF;
    }

    pcmData.push(output);
    totalSamplesProcessed += len;
  }

  function finishEncode() {
    const finalDataSize = totalSamplesProcessed * 3;
    const headerView = new DataView(pcmData[0].buffer);
    headerView.setUint32(4, 36 + finalDataSize, true);
    headerView.setUint32(40, finalDataSize, true);

    const blob = new Blob(pcmData, { type: 'audio/wav' });
    self.postMessage({ type: 'encode_complete', blob });
    pcmData = [];
  }

  function analyzePeaks({ channelData }, { samplesPerPixel }) {
    const len = channelData.length;
    const numPeaks = Math.ceil(len / samplesPerPixel);
    const peaks = new Float32Array(numPeaks * 2); // Min, Max pairs

    for (let i = 0; i < numPeaks; i++) {
      const start = i * samplesPerPixel;
      const end = Math.min(start + samplesPerPixel, len);
      let min = 1.0;
      let max = -1.0;

      const step = Math.max(1, Math.ceil((end - start) / 10));

      for (let j = start; j < end; j += step) {
        const val = channelData[j];
        if (val < min) min = val;
        if (val > max) max = val;
      }
      if (min > max) { min = 0; max = 0; }

      peaks[i * 2] = min;
      peaks[i * 2 + 1] = max;
    }

    self.postMessage({ type: 'peaks_complete', peaks }, [peaks.buffer]);
  }

  function detectSilence({ channelData }, { threshold, minSilenceSamples, paddingSamples }) {
    const len = channelData.length;
    const silenceRanges = [];
    let start = -1;

    for (let i = 0; i < len; i++) {
      const val = Math.abs(channelData[i]);

      if (val < threshold) {
        if (start === -1) start = i;
      } else {
        if (start !== -1) {
          if (i - start >= minSilenceSamples) {
            silenceRanges.push([start, i]);
          }
          start = -1;
        }
      }
    }

    if (start !== -1 && (len - start >= minSilenceSamples)) {
      silenceRanges.push([start, len]);
    }

    const cuts = [];
    for (const range of silenceRanges) {
      const s = range[0] + paddingSamples;
      const e = range[1] - paddingSamples;
      if (e > s) cuts.push({ start: s, end: e });
    }

    self.postMessage({ type: 'silence_detected', cuts });
  }
`;
