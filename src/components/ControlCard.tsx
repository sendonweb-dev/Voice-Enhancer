import React, { ReactNode } from 'react';
import { RotateCcw } from 'lucide-react';

interface ControlCardProps {
  title: string;
  icon: React.ElementType;
  onReset: () => void;
  children: ReactNode;
}

export const ControlCard: React.FC<ControlCardProps> = ({
  title,
  icon: Icon,
  onReset,
  children,
}) => {
  return (
    <div className="bg-white border border-neutral-200 rounded-xl p-5 md:p-6 h-full flex flex-col hover:border-black transition-colors duration-200 shadow-2xs">
      <div className="flex items-center justify-between mb-5 pb-3 border-b border-neutral-100">
        <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-900 flex items-center gap-2">
          <Icon className="w-4 h-4 text-neutral-700" />
          {title}
        </h3>
        <button
          type="button"
          onClick={onReset}
          title={`Reset ${title} settings`}
          className="group/reset flex items-center gap-1 text-[10px] font-bold text-neutral-400 hover:text-black transition-colors uppercase tracking-widest px-2 py-1 rounded hover:bg-neutral-100 cursor-pointer"
        >
          <RotateCcw className="w-3 h-3 group-hover/reset:rotate-180 transition-transform duration-300" />
          Reset
        </button>
      </div>
      <div className="space-y-5">{children}</div>
    </div>
  );
};

