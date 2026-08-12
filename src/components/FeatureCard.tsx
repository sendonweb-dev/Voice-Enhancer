import React, { ReactNode } from 'react';

interface FeatureCardProps {
  title: string;
  desc: string;
  icon: ReactNode;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({ title, desc, icon }) => {
  return (
    <div className="bg-white border border-neutral-200 rounded-xl p-6 hover:border-black transition-colors duration-200 shadow-2xs">
      <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-black text-white">
        {icon}
      </div>
      <h3 className="mb-2 text-base font-bold uppercase tracking-wide text-neutral-900">
        {title}
      </h3>
      <p className="text-xs text-neutral-600 leading-relaxed">{desc}</p>
    </div>
  );
};

