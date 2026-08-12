import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  UploadCloud,
  Play,
  Pause,
  Square,
  Volume2,
  VolumeX,
  Sliders,
  Scissors,
  Download,
  RotateCcw,
  Check,
  ChevronDown,
  Sparkles,
  Zap,
  Activity,
  Mic,
  Headphones,
  Radio,
} from 'lucide-react';
import { AudioSettings, Preset } from '../types';
import { DEFAULT_SETTINGS, PRESETS } from '../data/presetsData';
import { audioEngine } from '../lib/audioEngine';
import { ControlCard } from './ControlCard';
import { CustomSlider } from './CustomSlider';

export const AudioWorkstation: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [settings, setSettings] = useState<AudioSettings>(DEFAULT_SETTINGS);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [selectedPresetId, setSelectedPresetId] = useState<string>('custom');
  const [isExportSuccess, setIsExportSuccess] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [presetDropdownOpen, setPresetDropdownOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [masterVolume, setMasterVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number | null>(null);
  const playStartTimeRef = useRef<number>(0);
  const playOffsetRef = useRef<number>(0);
  const dragCounterRef = useRef<number>(0);

  useEffect(() => {
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      audioEngine.stop();
    };
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setPresetDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainderSecs = Math.floor(secs % 60);
    return `${mins.toString().padStart(2, '0')}:${remainderSecs.toString().padStart(2, '0')}`;
  };

  const drawWaveform = useCallback((seekPosSec = 0) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const peaks = audioEngine.getPeaks();
    if (!peaks) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerY = height / 2;

    ctx.clearRect(0, 0, width, height);

    // Center baseline
    ctx.beginPath();
    ctx.strokeStyle = '#E5E7EB';
    ctx.lineWidth = 1;
    ctx.moveTo(0, centerY);
    ctx.lineTo(width, centerY);
    ctx.stroke();

    const numPeaks = peaks.length / 2;
    const stepX = width / numPeaks;

    const path = new Path2D();
    for (let i = 0; i < numPeaks; i++) {
      const min = peaks[i * 2];
      const max = peaks[i * 2 + 1];
      const x = i * stepX;
      const yMin = ((1 - min) * centerY);
      const yMax = ((1 - max) * centerY);
      path.moveTo(x, yMin);
      path.lineTo(x, yMax);
    }

    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#9CA3AF';
    ctx.lineWidth = 1.5;
    ctx.stroke(path);

    if (seekPosSec > 0 && duration > 0) {
      const currentX = (seekPosSec / duration) * width;

      ctx.save();
      ctx.beginPath();
      ctx.rect(0, 0, currentX, height);
      ctx.clip();
      ctx.strokeStyle = '#111827';
      ctx.lineWidth = 1.5;
      ctx.stroke(path);
      ctx.restore();

      // Playhead line
      ctx.beginPath();
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 2;
      ctx.moveTo(currentX, 0);
      ctx.lineTo(currentX, height);
      ctx.stroke();
    }
  }, [duration]);

  useEffect(() => {
    if (file && !audioEngine.getPeaks()) {
      const interval = setInterval(() => {
        if (audioEngine.getPeaks()) {
          drawWaveform(0);
          clearInterval(interval);
        }
      }, 100);
      return () => clearInterval(interval);
    } else if (file) {
      const currentPos = duration > 0 ? currentTime / duration : 0;
      drawWaveform(currentPos * duration);
    }
  }, [file, currentTime, duration, drawWaveform]);

  const updateProgressLoop = useCallback(() => {
    if (!isPlaying) return;
    const ctx = audioEngine.context;
    if (!ctx) return;

    const playedSecs = ctx.currentTime - playStartTimeRef.current + playOffsetRef.current;
    if (playedSecs >= duration) {
      handleStop();
      return;
    }

    setCurrentTime(playedSecs);
    drawWaveform(playedSecs);
    animFrameRef.current = requestAnimationFrame(updateProgressLoop);
  }, [isPlaying, duration, drawWaveform]);

  useEffect(() => {
    if (isPlaying) {
      updateProgressLoop();
    } else if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
    }
  }, [isPlaying, updateProgressLoop]);

  const loadAudioFile = async (uploadedFile: File) => {
    setFile(uploadedFile);
    setIsProcessing(true);
    setStatusMessage('Loading & Analyzing...');
    setErrorMessage(null);
    setCurrentTime(0);
    playOffsetRef.current = 0;

    try {
      const buffer = await audioEngine.loadFile(uploadedFile);
      setDuration(buffer.duration);
      setProgress(100);
      setStatusMessage('Ready');
      setTimeout(() => {
        drawWaveform(0);
        setStatusMessage(null);
        setProgress(0);
      }, 500);
    } catch (err) {
      setProgress(0);
      setErrorMessage('Failed to load audio file. Please check file format.');
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) loadAudioFile(selected);
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!file) {
      dragCounterRef.current += 1;
      if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
        setIsDragOver(true);
      }
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!file) {
      dragCounterRef.current -= 1;
      if (dragCounterRef.current === 0) {
        setIsDragOver(false);
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    dragCounterRef.current = 0;

    if (!file && e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type.startsWith('audio/') || droppedFile.name.endsWith('.wav') || droppedFile.name.endsWith('.mp3')) {
        loadAudioFile(droppedFile);
      }
    }
  };

  const handleResetAll = () => {
    handleStop();
    setFile(null);
    setDuration(0);
    setCurrentTime(0);
    setSettings(DEFAULT_SETTINGS);
    setSelectedPresetId('custom');
    const inputs = document.querySelectorAll('input[type="file"]') as NodeListOf<HTMLInputElement>;
    inputs.forEach((input) => { input.value = ''; });
  };

  const handlePlayPause = () => {
    if (isPlaying) {
      const ctx = audioEngine.context;
      if (ctx) {
        playOffsetRef.current += ctx.currentTime - playStartTimeRef.current;
      }
      audioEngine.stop();
      setIsPlaying(false);
    } else {
      if (currentTime >= duration) {
        playOffsetRef.current = 0;
        setCurrentTime(0);
      }
      const ctx = audioEngine.context;
      if (ctx) {
        playStartTimeRef.current = ctx.currentTime;
        audioEngine.play(settings, () => {
          setIsPlaying(false);
          setCurrentTime(duration);
        }, playOffsetRef.current);
        setIsPlaying(true);
      }
    }
  };

  const handleStop = () => {
    audioEngine.stop();
    setIsPlaying(false);
    playOffsetRef.current = 0;
    setCurrentTime(0);
    drawWaveform(0);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    playOffsetRef.current = newTime;

    if (isPlaying) {
      audioEngine.stop();
      const ctx = audioEngine.context;
      if (ctx) {
        playStartTimeRef.current = ctx.currentTime;
        audioEngine.play(settings, () => {
          setIsPlaying(false);
          setCurrentTime(duration);
        }, newTime);
      }
    } else {
      drawWaveform(newTime);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setMasterVolume(val);
    if (!isMuted) {
      audioEngine.setMasterVolume(val);
    }
  };

  const toggleMute = () => {
    if (isMuted) {
      setIsMuted(false);
      audioEngine.setMasterVolume(masterVolume);
    } else {
      setIsMuted(true);
      audioEngine.setMasterVolume(0);
    }
  };

  const updateSingleSetting = (key: keyof AudioSettings, val: number) => {
    setSelectedPresetId('custom');
    const newSettings = { ...settings, [key]: val };
    setSettings(newSettings);
    if (isPlaying) {
      audioEngine.updateSettings(newSettings);
    }
  };

  const handleSelectPreset = (presetId: string) => {
    setSelectedPresetId(presetId);
    if (presetId === 'custom') return;

    const matched = PRESETS.find((p) => p.id === presetId);
    if (matched) {
      setSettings(matched.settings);
      if (isPlaying) {
        audioEngine.updateSettings(matched.settings);
      }
      setStatusMessage(`Applied ${matched.name}`);
      setTimeout(() => setStatusMessage(null), 1500);
    }
  };

  const handleResetSection = (section: 'eq' | 'dynamics' | 'tools') => {
    const newSettings = { ...settings };
    setSelectedPresetId('custom');

    if (section === 'eq') {
      newSettings.lowGain = DEFAULT_SETTINGS.lowGain;
      newSettings.midGain = DEFAULT_SETTINGS.midGain;
      newSettings.highGain = DEFAULT_SETTINGS.highGain;
    } else if (section === 'dynamics') {
      newSettings.threshold = DEFAULT_SETTINGS.threshold;
      newSettings.ratio = DEFAULT_SETTINGS.ratio;
      newSettings.attack = DEFAULT_SETTINGS.attack;
      newSettings.release = DEFAULT_SETTINGS.release;
    } else if (section === 'tools') {
      newSettings.reverbMix = DEFAULT_SETTINGS.reverbMix;
      newSettings.silenceTrimLevel = DEFAULT_SETTINGS.silenceTrimLevel;
    }

    setSettings(newSettings);
    if (isPlaying) {
      audioEngine.updateSettings(newSettings);
    }
  };

  const handleExport = async () => {
    if (!file) return;
    setIsProcessing(true);
    setProgress(0);
    if (isPlaying) handleStop();

    try {
      const blob = await audioEngine.renderAndExport(settings, (pct) => {
        setProgress(Math.round(pct));
        setStatusMessage(`Encoding 24-bit WAV... ${Math.round(pct)}%`);
      });

      setStatusMessage('Done!');
      setProgress(100);
      setIsExportSuccess(true);

      const url = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.style.display = 'none';
      anchor.href = url;

      const baseName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
      anchor.download = `${baseName}_VoiceEnhancer_io.wav`;
      document.body.appendChild(anchor);
      anchor.click();

      setTimeout(() => {
        document.body.removeChild(anchor);
        URL.revokeObjectURL(url);
      }, 2000);

      setTimeout(() => {
        setStatusMessage(null);
        setProgress(0);
        setIsExportSuccess(false);
      }, 3000);
    } catch (err) {
      console.error(err);
      setErrorMessage('Export failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleTrimSilence = async () => {
    if (!file) return;
    if (isPlaying) handleStop();
    setIsProcessing(true);
    setStatusMessage('Analyzing Silence...');

    try {
      const trimmedBuffer = await audioEngine.removeSilence(settings.silenceTrimLevel);
      if (trimmedBuffer) {
        setDuration(trimmedBuffer.duration);
        drawWaveform(0);
        setStatusMessage('Silence trimmed successfully.');
      } else {
        setStatusMessage('No silence sections found.');
      }
      setTimeout(() => setStatusMessage(null), 1800);
    } catch (err) {
      console.error(err);
      setStatusMessage('Silence detection error.');
    } finally {
      setIsProcessing(false);
    }
  };

  const getPresetIcon = (id: string) => {
    switch (id) {
      case 'youtube-standard':
      case 'youtube-creator':
        return Activity;
      case 'podcast-pro':
        return Mic;
      case 'voice-enhancer':
        return Headphones;
      case 'audio-studio-pro':
        return Radio;
      default:
        return Sliders;
    }
  };

  const currentPresetName =
    selectedPresetId === 'custom'
      ? 'Custom Setting'
      : PRESETS.find((p) => p.id === selectedPresetId)?.name || 'Custom Setting';

  const PresetIconComponent = getPresetIcon(selectedPresetId);
  const seekPercent = duration > 0 ? (currentTime / duration) * 100 : 0;
  const volumePercent = isMuted ? 0 : masterVolume * 100;

  return (
    <div className="w-full max-w-[1400px] mx-auto space-y-6 md:space-y-8 pb-0 mb-0">
      {/* Canvas / File Drop Zone */}
      <div
        className={`bg-white border border-neutral-200 rounded-xl p-2 relative overflow-hidden h-[260px] md:h-[320px] flex flex-col items-center justify-center transition-all duration-200 ${
          isDragOver ? '!border-black bg-neutral-50 ring-2 ring-black/5 scale-[1.005]' : 'hover:border-neutral-400'
        }`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {/* Loading Overlay */}
        {isProcessing && (
          <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-white/90 backdrop-blur-xs transition-all duration-200 rounded-xl">
            <div className="relative mb-4">
              <div className="h-10 w-10 animate-spin rounded-full border-2 border-neutral-200 border-t-black" />
            </div>
            <p className="text-xs font-bold uppercase tracking-widest text-neutral-900 animate-pulse">
              {statusMessage || 'Processing...'}
            </p>
          </div>
        )}

        {/* Upload Banner */}
        {!file && (
          <div
            className={`text-center space-y-4 ${
              isProcessing ? 'opacity-0' : 'animate-fade-in-up'
            } z-10 p-4 md:p-8 pointer-events-none`}
          >
            <div
              className={`mx-auto flex h-16 w-16 items-center justify-center rounded-xl bg-black text-white mb-2 transition-transform duration-200 ${
                isDragOver ? 'scale-110' : ''
              }`}
            >
              <UploadCloud className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-lg md:text-xl font-extrabold uppercase tracking-tight text-neutral-900 mb-1">
                Audio Workstation
              </h3>
              <p className="text-neutral-500 text-xs font-medium">
                {isDragOver ? (
                  <span className="text-black font-bold">Drop audio file here to start</span>
                ) : (
                  'Drag & drop or select WAV, MP3, M4A, AAC'
                )}
              </p>
            </div>

            <label className="inline-block cursor-pointer rounded-lg bg-black px-6 py-3 font-bold uppercase tracking-widest text-xs text-white transition-all hover:bg-neutral-800 pointer-events-auto">
              <span>Select Audio File</span>
              <input
                type="file"
                className="hidden"
                accept="audio/*"
                onChange={handleFileChange}
              />
            </label>

            {errorMessage && (
              <p className="text-red-600 font-bold bg-red-50 border border-red-200 px-3 py-1.5 rounded-md inline-block text-xs uppercase tracking-wider">
                {errorMessage}
              </p>
            )}
          </div>
        )}

        {/* Waveform Canvas */}
        <div className="w-full h-full bg-neutral-50 rounded-lg overflow-hidden relative pointer-events-none">
          <canvas
            ref={canvasRef}
            width={1024}
            height={300}
            className={`absolute inset-0 h-full w-full object-cover ${
              file ? 'opacity-100' : 'opacity-0'
            } transition-opacity duration-300`}
          />
        </div>
      </div>

      {/* Control Bar & Workstation Panels */}
      {file && (
        <div className="animate-fade-in-up space-y-6 md:space-y-8 relative z-20">
          {/* Floating Action / Seek Control Panel */}
          <div className="floating-panel sticky top-16 md:top-20 z-50 p-4 md:px-6 md:py-4 mb-6 mx-auto max-w-5xl w-full border border-neutral-200 bg-white/95 rounded-xl shadow-2xs">
            {/* Seek Bar */}
            <div className="mb-4 px-1 group">
              <style>{`
                #main-seek::-webkit-slider-runnable-track { background: linear-gradient(to right, #111827 0%, #111827 ${seekPercent}%, #E5E7EB ${seekPercent}%, #E5E7EB 100%); height: 6px; }
                #main-seek::-moz-range-track { background: linear-gradient(to right, #111827 0%, #111827 ${seekPercent}%, #E5E7EB ${seekPercent}%, #E5E7EB 100%); height: 6px; }
              `}</style>
              <input
                id="main-seek"
                type="range"
                min="0"
                max={duration || 100}
                value={currentTime}
                onChange={handleSeek}
                disabled={isProcessing}
                className="w-full h-4 cursor-pointer touch-none"
              />
              <div className="flex justify-between mt-1 text-[11px] font-mono font-bold text-neutral-400 group-hover:text-neutral-700 transition-colors">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Playback & Tools Bar */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center justify-between md:justify-start w-full md:w-auto gap-3">
                {/* Play/Pause Button */}
                <button
                  type="button"
                  onClick={handlePlayPause}
                  disabled={isProcessing}
                  className="flex items-center justify-center w-11 h-11 rounded-full bg-black text-white hover:bg-neutral-800 transition-all active:scale-95 disabled:opacity-50 flex-shrink-0 cursor-pointer shadow-2xs"
                >
                  {isPlaying ? (
                    <Pause className="w-5 h-5" />
                  ) : (
                    <Play className="w-5 h-5 ml-0.5" />
                  )}
                </button>

                <div className="flex items-center gap-2 flex-grow md:flex-grow-0 justify-end md:justify-start">
                  {/* Stop Button */}
                  <button
                    type="button"
                    onClick={handleStop}
                    disabled={isProcessing}
                    className="p-2.5 rounded-lg hover:bg-neutral-100 text-neutral-600 hover:text-black transition-colors cursor-pointer"
                    title="Stop"
                  >
                    <Square className="w-4 h-4 fill-current" />
                  </button>

                  {/* Master Volume */}
                  <div className="flex items-center gap-1.5 group bg-neutral-100 p-1 pr-3 rounded-lg border border-neutral-200">
                    <button
                      type="button"
                      onClick={toggleMute}
                      className="text-neutral-500 group-hover:text-black p-1 rounded hover:bg-white transition-all cursor-pointer"
                    >
                      {isMuted || masterVolume === 0 ? (
                        <VolumeX className="w-3.5 h-3.5" />
                      ) : (
                        <Volume2 className="w-3.5 h-3.5" />
                      )}
                    </button>
                    <div className="w-16 md:w-20">
                      <style>{`
                        #vol-seek::-webkit-slider-runnable-track { background: linear-gradient(to right, #111827 0%, #111827 ${volumePercent}%, #E5E7EB ${volumePercent}%, #E5E7EB 100%); }
                        #vol-seek::-moz-range-track { background: linear-gradient(to right, #111827 0%, #111827 ${volumePercent}%, #E5E7EB ${volumePercent}%, #E5E7EB 100%); }
                      `}</style>
                      <input
                        id="vol-seek"
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={isMuted ? 0 : masterVolume}
                        onChange={handleVolumeChange}
                        className="h-1.5 cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-2.5 w-full md:w-auto items-center">
                {/* Preset Dropdown */}
                <div className="relative w-full md:w-56 z-[60]" ref={dropdownRef}>
                  <button
                    type="button"
                    onClick={() => setPresetDropdownOpen(!presetDropdownOpen)}
                    className={`group relative flex items-center justify-between w-full bg-white border ${
                      presetDropdownOpen
                        ? 'border-black ring-2 ring-black/5'
                        : 'border-neutral-200'
                    } rounded-lg h-10 px-3 transition-all duration-150 shadow-2xs hover:border-black focus:outline-none cursor-pointer`}
                  >
                    <div className="flex items-center gap-2 overflow-hidden">
                      <PresetIconComponent
                        className={`flex-shrink-0 text-xs transition-colors duration-200 ${
                          presetDropdownOpen ? 'text-black' : 'text-neutral-500 group-hover:text-black'
                        }`}
                      />
                      <span
                        className={`text-xs font-bold uppercase tracking-wider truncate ${
                          presetDropdownOpen ? 'text-black' : 'text-neutral-700 group-hover:text-black'
                        }`}
                      >
                        {currentPresetName}
                      </span>
                    </div>
                    <ChevronDown
                      className={`flex-shrink-0 w-3.5 h-3.5 text-neutral-400 transition-transform duration-200 ${
                        presetDropdownOpen ? 'rotate-180 text-black' : 'group-hover:text-black'
                      }`}
                    />
                  </button>

                  {presetDropdownOpen && (
                    <div className="absolute top-full left-0 right-0 mt-1 min-w-[220px] origin-top rounded-lg bg-white p-1 shadow-lg border border-neutral-200 focus:outline-none">
                      <div
                        type="button"
                        onClick={() => {
                          handleSelectPreset('custom');
                          setPresetDropdownOpen(false);
                        }}
                        className={`flex items-center justify-between px-3 py-2 rounded-md text-xs font-bold uppercase tracking-wider cursor-pointer transition-colors ${
                          selectedPresetId === 'custom'
                            ? 'bg-neutral-100 text-black'
                            : 'text-neutral-600 hover:bg-neutral-50 hover:text-black'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <Sliders className={`w-3.5 h-3.5 ${selectedPresetId === 'custom' ? 'text-black' : 'text-neutral-400'}`} />
                          <span>Custom Setting</span>
                        </div>
                        {selectedPresetId === 'custom' && <Check className="text-black w-3.5 h-3.5" />}
                      </div>

                      <div className="h-px bg-neutral-100 my-1" />

                      {PRESETS.map((p) => {
                        const IconComp = getPresetIcon(p.id);
                        const isSelected = selectedPresetId === p.id;
                        return (
                          <div
                            key={p.id}
                            onClick={() => {
                              handleSelectPreset(p.id);
                              setPresetDropdownOpen(false);
                            }}
                            className={`flex items-center justify-between px-3 py-2 rounded-md text-xs font-bold uppercase tracking-wider cursor-pointer transition-colors ${
                              isSelected
                                ? 'bg-neutral-100 text-black'
                                : 'text-neutral-600 hover:bg-neutral-50 hover:text-black'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <IconComp className={`w-3.5 h-3.5 ${isSelected ? 'text-black' : 'text-neutral-400'}`} />
                              <span>{p.name}</span>
                            </div>
                            {isSelected && <Check className="text-black w-3.5 h-3.5" />}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Auto Trim Silence */}
                <button
                  type="button"
                  onClick={handleTrimSilence}
                  disabled={isProcessing}
                  className="group flex items-center justify-center gap-2 h-10 px-4 rounded-lg border border-neutral-200 bg-white text-neutral-800 font-bold uppercase tracking-wider text-xs hover:border-black hover:bg-neutral-50 transition-all disabled:opacity-50 w-full md:w-auto cursor-pointer"
                  title="Auto Trim Silence"
                >
                  <Scissors className="w-3.5 h-3.5 text-neutral-500 group-hover:text-black transition-colors" />
                  <span>Trim Silence</span>
                </button>

                {/* Export & Reset */}
                <div className="flex gap-2 w-full md:w-auto">
                  <button
                    type="button"
                    onClick={handleExport}
                    disabled={isProcessing}
                    className={`relative overflow-hidden w-full md:w-auto rounded-lg px-6 py-2.5 text-xs font-bold uppercase tracking-widest text-white transition-all shadow-2xs hover:bg-neutral-800 active:scale-95 disabled:opacity-70 flex-grow cursor-pointer ${
                      isExportSuccess ? 'bg-emerald-700' : 'bg-black'
                    }`}
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      {isExportSuccess ? (
                        <>
                          <span>Saved!</span>
                          <Check className="w-3.5 h-3.5" />
                        </>
                      ) : (
                        <>
                          <Download className="w-3.5 h-3.5 text-white" />
                          <span>Export WAV</span>
                        </>
                      )}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={handleResetAll}
                    className="p-2.5 rounded-lg border border-neutral-200 text-neutral-500 hover:text-black hover:bg-neutral-100 transition-colors group flex-shrink-0 cursor-pointer"
                    title="Start Over"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-neutral-400 group-hover:text-black group-hover:rotate-180 transition-transform duration-300" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Controls Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 pb-12">
            {/* Equalizer */}
            <ControlCard
              title="Equalizer"
              icon={Sliders}
              onReset={() => handleResetSection('eq')}
            >
              <CustomSlider
                label="Lows (Bass)"
                value={settings.lowGain}
                onChange={(e) => updateSingleSetting('lowGain', parseFloat(e.target.value))}
                min={-12}
                max={12}
                step={0.1}
                unit="dB"
              />
              <CustomSlider
                label="Mids"
                value={settings.midGain}
                onChange={(e) => updateSingleSetting('midGain', parseFloat(e.target.value))}
                min={-12}
                max={12}
                step={0.1}
                unit="dB"
              />
              <CustomSlider
                label="Highs (Treble)"
                value={settings.highGain}
                onChange={(e) => updateSingleSetting('highGain', parseFloat(e.target.value))}
                min={-12}
                max={12}
                step={0.1}
                unit="dB"
              />
            </ControlCard>

            {/* Compressor */}
            <ControlCard
              title="Compressor"
              icon={Activity}
              onReset={() => handleResetSection('dynamics')}
            >
              <CustomSlider
                label="Threshold"
                value={settings.threshold}
                onChange={(e) => updateSingleSetting('threshold', parseFloat(e.target.value))}
                min={-60}
                max={0}
                step={1}
                unit="dB"
              />
              <CustomSlider
                label="Ratio"
                value={settings.ratio}
                onChange={(e) => updateSingleSetting('ratio', parseFloat(e.target.value))}
                min={1}
                max={20}
                step={0.5}
                unit=":1"
              />
              <div className="grid grid-cols-2 gap-4 md:gap-6">
                <CustomSlider
                  label="Attack"
                  value={settings.attack * 1000}
                  onChange={(e) => updateSingleSetting('attack', parseFloat(e.target.value) / 1000)}
                  min={0}
                  max={100}
                  step={1}
                  unit="ms"
                />
                <CustomSlider
                  label="Release"
                  value={settings.release * 1000}
                  onChange={(e) => updateSingleSetting('release', parseFloat(e.target.value) / 1000)}
                  min={10}
                  max={1000}
                  step={10}
                  unit="ms"
                />
              </div>
            </ControlCard>

            {/* Tools & Effects */}
            <div className="md:col-span-2 lg:col-span-1">
              <ControlCard
                title="Tools & Effects"
                icon={Sparkles}
                onReset={() => handleResetSection('tools')}
              >
                <div className="space-y-6">
                  <CustomSlider
                    label="Reverb"
                    value={settings.reverbMix * 100}
                    onChange={(e) => updateSingleSetting('reverbMix', parseFloat(e.target.value) / 100)}
                    min={0}
                    max={50}
                    step={1}
                    unit="%"
                  />
                  <div className="pt-6 border-t border-slate-100">
                    <CustomSlider
                      label="Gate Threshold"
                      value={settings.silenceTrimLevel}
                      onChange={(e) => updateSingleSetting('silenceTrimLevel', parseFloat(e.target.value))}
                      min={-80}
                      max={-20}
                      step={1}
                      unit="dB"
                    />
                  </div>
                </div>
              </ControlCard>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
