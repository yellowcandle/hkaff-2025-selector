import React from 'react';

interface SkeletonCardProps {
  className?: string;
}

export const SkeletonCard: React.FC<SkeletonCardProps> = ({ className = '' }) => {
  return (
    <div className={`w-full bg-white rounded-lg shadow-md overflow-hidden animate-pulse ${className}`}>
      {/* Poster Skeleton */}
      <div className="aspect-[2/3] bg-gray-200 relative">
        <div className="w-full h-full bg-gray-300"></div>
      </div>

      {/* Content Skeleton */}
      <div className="p-4">
        {/* Title Skeleton */}
        <div className="space-y-2 mb-2">
          <div className="h-4 bg-gray-300 rounded w-3/4"></div>
          <div className="h-4 bg-gray-300 rounded w-1/2"></div>
        </div>

        {/* Category Skeleton */}
        <div className="h-6 bg-gray-300 rounded w-20"></div>
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
