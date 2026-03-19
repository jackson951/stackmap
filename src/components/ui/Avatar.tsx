'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  fallback?: string;
}

const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, src, alt, fallback, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'relative inline-flex h-10 w-10 shrink-0 overflow-hidden rounded-full bg-gray-700',
          className
        )}
        {...props}
      >
        {src ? (
          <img
            className="h-full w-full object-cover"
            src={src}
            alt={alt}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm font-medium text-gray-400">
            {fallback || (alt ? alt.charAt(0).toUpperCase() : '?')}
          </div>
        )}
      </div>
    );
  }
);

Avatar.displayName = 'Avatar';

export { Avatar };