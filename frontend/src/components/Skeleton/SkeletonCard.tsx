import React from 'react';

interface SkeletonCardProps {
  className?: string;
}

export const SkeletonCard: React.FC<SkeletonCardProps> = ({ className = '' }) => {
  return (
    <div className={`w-full bg-card rounded-xl shadow-md overflow-hidden animate-pulse ${className}`}>
      {/* Poster Skeleton */}
      <div className="aspect-[2/3] bg-muted relative">
        <div className="w-full h-full bg-gradient-to-br from-muted to-muted-foreground/10"></div>
      </div>

      {/* Content Skeleton */}
      <div className="p-4 space-y-3">
        {/* Category Badge Skeleton */}
        <div className="h-6 w-20 bg-muted rounded-full"></div>
        
        {/* Title Skeleton - Two lines */}
        <div className="space-y-2">
          <div className="h-5 bg-muted rounded w-3/4"></div>
          <div className="h-5 bg-muted rounded w-1/2"></div>
        </div>

        {/* Metadata Skeletons */}
        <div className="h-4 bg-muted rounded w-2/3"></div>
        <div className="h-4 bg-muted rounded w-1/2"></div>
      </div>
    </div>
  );
};

interface SkeletonGridProps {
  count?: number;
  className?: string;
}

export const SkeletonGrid: React.FC<SkeletonGridProps> = ({ count = 6, className = '' }) => {
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ${className}`}>
      {Array.from({ length: count }, (_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
};

