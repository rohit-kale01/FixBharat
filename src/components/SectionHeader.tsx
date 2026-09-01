import { type ReactNode } from 'react';

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  center?: boolean;
  children?: ReactNode;
}

export default function SectionHeader({ eyebrow, title, subtitle, center, children }: SectionHeaderProps) {
  return (
    <div className={`mb-10 ${center ? 'text-center' : ''}`}>
      {eyebrow && (
        <span className="inline-block text-xs font-semibold tracking-wider uppercase text-saffron-600 mb-2">
          {eyebrow}
        </span>
      )}
      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-navy-900 mb-3">{title}</h2>
      {subtitle && (
        <p className={`text-navy-500 text-base sm:text-lg ${center ? 'max-w-2xl mx-auto' : 'max-w-3xl'}`}>
          {subtitle}
        </p>
      )}
      {children}
    </div>
  );
}
