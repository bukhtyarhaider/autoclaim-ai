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
      <div className="bg-white rounded-2xl shadow-sm border border-surface-200 p-6 print-break-inside">
         <h3 className="text-sm font-bold text-surface-900 mb-6 uppercase tracking-wider flex items-center gap-2">
            Cost Distribution
            <span className="text-xs font-normal normal-case text-surface-500 bg-surface-100 px-2 py-0.5 rounded-full">{currency}</span>
         </h3>
         <div className="h-64 w-full">
           <ResponsiveContainer width="100%" height="100%" minWidth={0}>
             <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 30, left: -20, bottom: 5 }}>
               <XAxis type="number" hide />
               <YAxis type="category" dataKey="name" width={100} tick={{fontSize: 10, fill: '#64748b'}} interval={0} tickLine={false} axisLine={false}/>
               <Tooltip 
                  cursor={{fill: 'transparent'}}
                  formatter={(value: number) => [`${currency} ${value.toLocaleString()}`, 'Cost']}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', padding: '12px' }}
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

      <div className="bg-white rounded-2xl shadow-sm border border-surface-200 p-6 print-break-inside mt-6">
        <h3 className="text-sm font-bold text-surface-900 mb-6 uppercase tracking-wider">Severity Breakdown</h3>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:h-48 w-full">
          <div className="h-48 w-full sm:w-1/2">
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={70}
                  paddingAngle={4}
                  dataKey="value"
                  stroke="none"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[entry.name as Severity] || '#cbd5e1'} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', padding: '8px 12px' }} itemStyle={{ fontSize: '12px', fontWeight: 600 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-1 gap-3 text-xs w-full sm:w-auto">
              {Object.entries(COLORS).map(([severity, color]) => (
                 <div key={severity} className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: color }}></div>
                    <span className="text-surface-600 font-medium capitalize truncate">{severity.toLowerCase()}</span>
                 </div>
              ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default AnalysisCharts;
