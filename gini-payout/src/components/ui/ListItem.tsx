import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

interface ListItemProps {
  title: string;
  subtitle?: string;
  to?: string;
  onClick?: () => void;
  rightElement?: React.ReactNode;
  icon?: React.ReactNode;
  disabled?: boolean;
  badge?: string;
}

export const ListItem: React.FC<ListItemProps> = ({
  title,
  subtitle,
  to,
  onClick,
  rightElement,
  icon,
  disabled = false,
  badge,
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (disabled) return;
    if (onClick) {
      onClick();
    } else if (to) {
      navigate(to);
    }
  };

  const isClickable = (!!to || !!onClick) && !disabled;

  return (
    <button
      onClick={handleClick}
      disabled={disabled || !isClickable}
      className={`list-item w-full text-left ${!isClickable ? 'cursor-default' : ''} ${disabled ? 'opacity-50' : ''}`}
    >
      <div className="flex items-center gap-3 flex-1 min-w-0">
        {icon && (
          <div className={`flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center ${disabled ? 'text-muted-foreground' : 'text-primary'}`}>
            {icon}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className={`font-medium truncate ${disabled ? 'text-muted-foreground' : 'text-foreground'}`}>{title}</p>
            {badge && (
              <span className="text-xs font-semibold bg-accent text-accent-foreground px-2 py-0.5 rounded-full whitespace-nowrap">
                {badge}
              </span>
            )}
          </div>
          {subtitle && (
            <p className="text-sm text-muted-foreground truncate">{subtitle}</p>
          )}
        </div>
      </div>
      {rightElement || (isClickable && (
        <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />
      ))}
    </button>
  );
};
