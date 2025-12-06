import React, { useState } from 'react';
import { DamageItem, Severity } from '../types';

interface DamageVisualizerProps {
  imageUrl: string;
  damages: DamageItem[];
}

const getSeverityColor = (severity: Severity) => {
  switch (severity) {
    case Severity.LOW: return 'border-yellow-400 bg-yellow-400/20';
    case Severity.MEDIUM: return 'border-orange-500 bg-orange-500/20';
    case Severity.HIGH: return 'border-red-500 bg-red-500/20';
    case Severity.CRITICAL: return 'border-red-700 bg-red-700/30';
    default: return 'border-blue-400 bg-blue-400/20';
  }
};

const DamageVisualizer: React.FC<DamageVisualizerProps> = ({ imageUrl, damages }) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <div className="relative w-full overflow-hidden rounded-lg shadow-sm border border-slate-200 bg-slate-100 group">
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

        return (
          <div
            key={damage.id}
            className={`absolute border-2 transition-all duration-300 cursor-pointer ${getSeverityColor(damage.severity)}
              ${hoveredId === damage.id ? 'z-10 ring-2 ring-white shadow-lg opacity-100' : 'opacity-70 hover:opacity-100'}
            `}
            style={{
              top: `${top}%`,
              left: `${left}%`,
              height: `${height}%`,
              width: `${width}%`,
            }}
            onMouseEnter={() => setHoveredId(damage.id)}
            onMouseLeave={() => setHoveredId(null)}
          >
            {/* Tooltip on Hover */}
            <div className={`
              absolute -top-10 left-1/2 transform -translate-x-1/2 
              bg-slate-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-20 pointer-events-none
              transition-opacity duration-200
              ${hoveredId === damage.id ? 'opacity-100' : 'opacity-0'}
            `}>
              <span className="font-semibold">{damage.type}</span> (${damage.estimatedCost})
              <div className="absolute top-full left-1/2 -ml-1 border-4 border-transparent border-t-slate-900"></div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DamageVisualizer;