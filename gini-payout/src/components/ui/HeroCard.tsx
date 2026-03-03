import React from 'react';
import { useNavigate } from 'react-router-dom';

interface HeroCardProps {
  title: string;
  subtitle: string;
  primaryCtaText: string;
  primaryCtaTo: string;
  secondaryCtaText?: string;
  secondaryCtaTo?: string;
}

export const HeroCard: React.FC<HeroCardProps> = ({
  title,
  subtitle,
  primaryCtaText,
  primaryCtaTo,
  secondaryCtaText,
  secondaryCtaTo,
}) => {
  const navigate = useNavigate();

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-primary/80 p-6 text-primary-foreground shadow-lg">
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
      
      <div className="relative z-10">
        <h1 className="text-2xl font-bold mb-2">{title}</h1>
        <p className="text-primary-foreground/80 mb-6">{subtitle}</p>
        
        <div className="flex flex-col gap-3">
          <button
            onClick={() => navigate(primaryCtaTo)}
            className="w-full py-3 px-6 bg-white text-primary font-semibold rounded-xl shadow-md hover:bg-white/90 transition-colors"
          >
            {primaryCtaText}
          </button>
          
          {secondaryCtaText && secondaryCtaTo && (
            <button
              onClick={() => navigate(secondaryCtaTo)}
              className="text-sm text-primary-foreground/80 hover:text-primary-foreground underline underline-offset-2 transition-colors"
            >
              {secondaryCtaText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
