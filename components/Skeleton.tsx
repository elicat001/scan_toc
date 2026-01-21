
import React from 'react';

interface SkeletonProps {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '' }) => {
  return (
    <div className={`animate-pulse bg-gray-200 rounded ${className}`}></div>
  );
};

export const HomeSkeleton: React.FC = () => (
  <div className="p-4 space-y-6">
    <div className="flex justify-between">
      <div className="space-y-2">
        <Skeleton className="w-32 h-8" />
        <Skeleton className="w-48 h-4" />
      </div>
      <Skeleton className="w-20 h-8 rounded-full" />
    </div>
    <Skeleton className="w-full h-32 rounded-2xl" />
    <div className="grid grid-cols-2 gap-4">
      <Skeleton className="w-full h-24 rounded-2xl col-span-2" />
      <Skeleton className="w-full h-20 rounded-2xl" />
      <Skeleton className="w-full h-20 rounded-2xl" />
    </div>
  </div>
);

export const ProductSkeleton: React.FC = () => (
  <div className="flex gap-3 mb-6">
    <Skeleton className="w-24 h-24 rounded-lg" />
    <div className="flex-1 space-y-3 py-1">
      <Skeleton className="w-3/4 h-5" />
      <Skeleton className="w-1/2 h-3" />
      <div className="flex justify-between mt-4">
        <Skeleton className="w-16 h-6" />
        <Skeleton className="w-8 h-8 rounded-full" />
      </div>
    </div>
  </div>
);
