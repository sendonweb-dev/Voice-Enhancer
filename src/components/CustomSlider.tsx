import React from 'react';

interface CustomSliderProps {
  label: string;
  value: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  min: number;
  max: number;
  step: number;
  unit: string;
}

export const CustomSlider: React.FC<CustomSliderProps> = ({
  label,
  value,
  onChange,
  min,
  max,
  step,
  unit,
}) => {
  const percent = ((value - min) / (max - min)) * 100;
  const formattedValue =
    label === 'Attack' || label === 'Release' ? value.toFixed(0) : value.toFixed(1);

  const sliderId = `slider-${label.replace(/\s+/g, '')}`;

  return (
    <div className="group">
      <div className="flex justify-between items-center mb-2">
        <label
          htmlFor={sliderId}
          className="text-xs font-semibold uppercase tracking-wider text-neutral-600 group-hover:text-black transition-colors"
        >
          {label}
        </label>
        <span className="text-xs font-mono font-bold text-neutral-900 bg-neutral-100 px-2 py-0.5 rounded border border-neutral-200 min-w-[3.25rem] text-center">
          {formattedValue}
          <span className="text-neutral-500 ml-0.5 text-[10px] font-sans">{unit}</span>
        </span>
      </div>

      <div className="relative h-5 flex items-center">
        <style>{`
          #${sliderId}::-webkit-slider-runnable-track {
            background: linear-gradient(to right, #111827 0%, #111827 ${percent}%, #E5E7EB ${percent}%, #E5E7EB 100%);
          }
          #${sliderId}::-moz-range-track {
            background: linear-gradient(to right, #111827 0%, #111827 ${percent}%, #E5E7EB ${percent}%, #E5E7EB 100%);
          }
        `}</style>
        <input
          id={sliderId}
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={onChange}
          className="w-full cursor-pointer"
        />
      </div>
    </div>
  );
};

