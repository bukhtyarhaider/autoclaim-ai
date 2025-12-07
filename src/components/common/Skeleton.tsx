import React from 'react';

interface SkeletonProps {
  className?: string;
}

const Skeleton: React.FC<SkeletonProps> = ({ className }) => {
  return (
    <div 
      className={`animate-pulse bg-zinc-200/80 rounded-lg ${className}`} 
    />
  );
};

export default Skeleton;
