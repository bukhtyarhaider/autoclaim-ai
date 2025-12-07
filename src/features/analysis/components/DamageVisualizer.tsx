import React, { useState } from 'react';
import { DamageItem, Severity } from '../../../types';

interface DamageVisualizerProps {
  imageUrl: string;
  damages: DamageItem[];
}

const getSeverityStyles = (severity: Severity) => {
  switch (severity) {
    case Severity.LOW: return { borderColor: '#FACC15', backgroundColor: 'rgba(250, 204, 21, 0.2)' }; // yellow-400
    case Severity.MEDIUM: return { borderColor: '#F97316', backgroundColor: 'rgba(249, 115, 22, 0.2)' }; // orange-500
    case Severity.HIGH: return { borderColor: '#EF4444', backgroundColor: 'rgba(239, 68, 68, 0.2)' }; // red-500
    case Severity.CRITICAL: return { borderColor: '#B91C1C', backgroundColor: 'rgba(185, 28, 28, 0.3)' }; // red-700
    default: return { borderColor: '#60A5FA', backgroundColor: 'rgba(96, 165, 250, 0.2)' }; // blue-400
  }
};

const DamageVisualizer: React.FC<DamageVisualizerProps> = ({ imageUrl, damages }) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <div 
      className="relative w-full overflow-hidden rounded-lg group"
      style={{ 
        borderColor: '#E2E8F0', 
        backgroundColor: '#F1F5F9', 
        borderWidth: '1px', 
        borderStyle: 'solid',
        boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' 
      }} 
    >
      <img 
        src={imageUrl} 
        alt="Analyzed Vehicle" 
        className="w-full h-auto object-contain max-h-[600px] mx-auto"
      />
      
      {damages.map((damage) => {
        // Normalize 0-1000 coordinates to percentages
        const top = (damage.box_2d[0] / 1000) * 100;
        const left = (damage.box_2d[1] / 1000) * 100;
        const height = ((damage.box_2d[2] - damage.box_2d[0]) / 1000) * 100;
        const width = ((damage.box_2d[3] - damage.box_2d[1]) / 1000) * 100;
        
        const severityStyles = getSeverityStyles(damage.severity);

        return (
          <div
            key={damage.id}
            className={`absolute transition-all duration-300 cursor-pointer 
              ${hoveredId === damage.id ? 'z-10 opacity-100' : 'opacity-70 hover:opacity-100'}
            `}
            style={{
              top: `${top}%`,
              left: `${left}%`,
              height: `${height}%`,
              width: `${width}%`,
              borderWidth: '2px',
              borderStyle: 'solid',
              ...severityStyles,
              // Add white ring effect manually if hovered
              boxShadow: hoveredId === damage.id ? '0 0 0 2px #ffffff, 0 10px 15px -3px rgba(0, 0, 0, 0.1)' : 'none'
            }}
            onMouseEnter={() => setHoveredId(damage.id)}
            onMouseLeave={() => setHoveredId(null)}
          >
            {/* Tooltip on Hover */}
<div 
  className={`
    absolute -top-2 left-1/2 transform -translate-x-1/2 -translate-y-full
    text-xs px-3 py-2 rounded z-20 pointer-events-none
    transition-all duration-200 ease-out min-w-70
    max-w-100 break-words
    ${hoveredId === damage.id 
      ? 'opacity-100 scale-100 translate-y-0' 
      : 'opacity-0 scale-95 translate-y-1'}
  `}
  style={{ 
    backgroundColor: '#0F172A', // slate-900
    color: '#FFFFFF'
  }} 
>
  <span className="font-semibold block mb-1">
    {damage.type}
  </span>

  <div className="text-xs leading-snug">
    {damage.description}
  </div>

  
</div>

          </div>
        );
      })}
    </div>
  );
};

export default DamageVisualizer;