import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { AssessmentResult, Severity, Currency } from '../../../types';

interface AnalysisChartsProps {
  result: AssessmentResult;
  currency: Currency;
}

const COLORS = {
  [Severity.LOW]: '#facc15',    // Yellow-400
  [Severity.MEDIUM]: '#f97316', // Orange-500
  [Severity.HIGH]: '#ef4444',   // Red-500
  [Severity.CRITICAL]: '#b91c1c' // Red-700
};

const AnalysisCharts: React.FC<AnalysisChartsProps> = ({ result, currency }) => {
  const chartData = useMemo(() => result.damages.map(d => ({
    name: d.type,
    cost: d.estimatedCost,
    severity: d.severity
  })), [result.damages]);

  const pieData = useMemo(() => {
    const severityCount = result.damages.reduce((acc, curr) => {
      acc[curr.severity] = (acc[curr.severity] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.keys(severityCount).map(key => ({
      name: key,
      value: severityCount[key]
    }));
  }, [result.damages]);

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-surface-200 p-6 print-break-inside">
         <h3 className="text-sm font-semibold text-surface-900 mb-4 uppercase tracking-wide">Cost Distribution ({currency})</h3>
         <div className="h-64 w-full">
           <ResponsiveContainer width="100%" height="100%">
             <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
               <XAxis type="number" hide />
               <YAxis type="category" dataKey="name" width={80} tick={{fontSize: 12}} interval={0}/>
               <Tooltip 
                  cursor={{fill: 'transparent'}}
                  formatter={(value: number) => [`${currency} ${value.toLocaleString()}`, 'Cost']}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
               />
               <Bar dataKey="cost" radius={[0, 4, 4, 0]} barSize={20}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[entry.severity as Severity] || '#94a3b8'} />
                ))}
               </Bar>
             </BarChart>
           </ResponsiveContainer>
         </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-surface-200 p-6 print-break-inside">
        <h3 className="text-sm font-semibold text-surface-900 mb-4 uppercase tracking-wide">Damage Severity Breakdown</h3>
        <div className="h-48 w-full flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={70}
                paddingAngle={5}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[entry.name as Severity] || '#cbd5e1'} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 text-xs ml-4">
              {Object.entries(COLORS).map(([severity, color]) => (
                 <div key={severity} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: color }}></div>
                    <span className="text-surface-600 capitalize">{severity.toLowerCase()}</span>
                 </div>
              ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default AnalysisCharts;
