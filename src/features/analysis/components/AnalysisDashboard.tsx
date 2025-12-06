import React, { useRef, useState } from 'react';
import { AssessmentResult, Severity, Currency } from '../../../types';
import DamageVisualizer from './DamageVisualizer';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { Printer, Download, FileText, ArrowLeft, Loader2 } from 'lucide-react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { formatCurrency } from '../../../utils/currencyUtils';

interface AnalysisDashboardProps {
  result: AssessmentResult;
  imageUrl: string;
  currency: Currency;
  onReset: () => void;
}

const COLORS = {
  [Severity.LOW]: '#facc15',    // Yellow-400
  [Severity.MEDIUM]: '#f97316', // Orange-500
  [Severity.HIGH]: '#ef4444',   // Red-500
  [Severity.CRITICAL]: '#b91c1c' // Red-700
};

const AnalysisDashboard: React.FC<AnalysisDashboardProps> = ({ result, imageUrl, currency, onReset }) => {
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const visualizerRef = useRef<HTMLDivElement>(null);
  
  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = async () => {
    setIsGeneratingPdf(true);
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 20;
      const contentWidth = pageWidth - (margin * 2);
      let yPos = 20;

      const checkPageBreak = (heightNeeded: number) => {
        if (yPos + heightNeeded > pageHeight - margin) {
          doc.addPage();
          yPos = 20;
          return true;
        }
        return false;
      };

      // Title Section
      doc.setFontSize(22);
      doc.setTextColor(15, 23, 42); // slate-900
      doc.text("AutoClaim AI", margin, yPos);
      yPos += 8;
      doc.setFontSize(12);
      doc.setTextColor(100, 116, 139); // slate-500
      doc.text("Damage Assessment Report", margin, yPos);
      yPos += 15;

      // Header Line
      doc.setDrawColor(226, 232, 240); 
      doc.line(margin, yPos, pageWidth - margin, yPos);
      yPos += 10;

      // Meta Data
      doc.setFontSize(10);
      doc.setTextColor(71, 85, 105); 
      doc.text(`Date: ${new Date(result.timestamp).toLocaleDateString()}`, margin, yPos);
      doc.text(`Vehicle Type: ${result.vehicleType}`, margin + 80, yPos);
      doc.text(`Currency: ${currency}`, margin + 140, yPos);
      yPos += 15;

      // Summary
      doc.setFontSize(14);
      doc.setTextColor(15, 23, 42);
      doc.text("Assessment Summary", margin, yPos);
      yPos += 8;

      doc.setFontSize(10);
      doc.setTextColor(51, 65, 85);
      const splitSummary = doc.splitTextToSize(result.summary, contentWidth);
      doc.text(splitSummary, margin, yPos);
      yPos += (splitSummary.length * 5) + 15;

      // Visualized Damage Image
      if (visualizerRef.current) {
         // Snapshot the element
        const canvas = await html2canvas(visualizerRef.current, { 
          useCORS: true,
          scale: 2, // Better resolution
          logging: false
        });
        
        const imgData = canvas.toDataURL('image/png');
        const imgProps = doc.getImageProperties(imgData);
        const pdfImgHeight = (imgProps.height * contentWidth) / imgProps.width;

        checkPageBreak(pdfImgHeight + 20);

        doc.setFontSize(14);
        doc.setTextColor(15, 23, 42);
        doc.text("Damage Localization", margin, yPos);
        yPos += 8;
        
        doc.addImage(imgData, 'PNG', margin, yPos, contentWidth, pdfImgHeight);
        yPos += pdfImgHeight + 15;
      }

      // Details Table
      checkPageBreak(40);
      doc.setFontSize(14);
      doc.setTextColor(15, 23, 42);
      doc.text("Detailed Damage Analysis", margin, yPos);
      yPos += 10;

      // Table Header
      doc.setFillColor(241, 245, 249);
      doc.rect(margin, yPos, contentWidth, 8, 'F');
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.text("Type / Severity", margin + 2, yPos + 5.5);
      doc.text("Cost Est.", pageWidth - margin - 35, yPos + 5.5);
      yPos += 12;

      // Rows
      doc.setFont("helvetica", "normal");
      
      for (const damage of result.damages) {
        doc.setFontSize(11);
        doc.setTextColor(15, 23, 42); // Reset color
        
        // Calculate height needed for description
        doc.setFontSize(9);
        const splitDesc = doc.splitTextToSize(damage.description, contentWidth - 40);
        const descHeight = (splitDesc.length * 4);
        const rowHeight = 10 + descHeight + 4; // Title + Desc + Padding

        checkPageBreak(rowHeight);

        // Render Title
        doc.setFontSize(11);
        doc.setTextColor(15, 23, 42);
        doc.text(`${damage.type} (${damage.severity})`, margin + 2, yPos);
        
        // Render Cost
        doc.setFontSize(11);
        doc.setTextColor(22, 163, 74); 
        doc.text(formatCurrency(damage.estimatedCost), pageWidth - margin - 35, yPos);
        
        yPos += 5;
        
        // Render Description
        doc.setFontSize(9);
        doc.setTextColor(100, 116, 139);
        doc.text(splitDesc, margin + 2, yPos);
        
        yPos += descHeight + 4;
        
        // Separator
        doc.setDrawColor(241, 245, 249);
        doc.line(margin, yPos - 2, pageWidth - margin, yPos - 2);
      }

      // Total
      checkPageBreak(30);
      yPos += 5;
      doc.setFillColor(248, 250, 252);
      doc.roundedRect(margin, yPos, contentWidth, 20, 2, 2, 'F');
      doc.setDrawColor(226, 232, 240);
      doc.roundedRect(margin, yPos, contentWidth, 20, 2, 2, 'S');
      
      doc.setFontSize(12);
      doc.setTextColor(15, 23, 42);
      doc.setFont("helvetica", "bold");
      doc.text("Total Estimated Repair Cost", margin + 5, yPos + 13);
      
      doc.setFontSize(16);
      doc.setTextColor(37, 99, 235);
      const totalStr = formatCurrency(result.totalEstimatedCost);
      const totalWidth = doc.getTextWidth(totalStr);
      doc.text(totalStr, pageWidth - margin - totalWidth - 5, yPos + 13);

      doc.save(`AutoClaim_Report_${new Date().getTime()}.pdf`);

    } catch (error) {
      console.error("PDF Generation Error:", error);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const chartData = result.damages.map(d => ({
    name: d.type,
    cost: d.estimatedCost,
    severity: d.severity
  }));

  const severityCount = result.damages.reduce((acc, curr) => {
    acc[curr.severity] = (acc[curr.severity] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const pieData = Object.keys(severityCount).map(key => ({
    name: key,
    value: severityCount[key]
  }));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Navigation & Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 no-print">
        <button 
          onClick={onReset}
          className="flex items-center text-surface-500 hover:text-surface-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Upload
        </button>
        <div className="flex space-x-3">
          <button 
            onClick={handlePrint}
            className="flex items-center justify-center px-4 py-2 border border-surface-300 shadow-sm text-sm font-medium rounded-md text-surface-700 bg-white hover:bg-surface-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500"
          >
            <Printer className="w-4 h-4 mr-2" />
            Print Report
          </button>
          <button 
            onClick={handleDownloadPDF}
            disabled={isGeneratingPdf}
            className={`flex items-center justify-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 ${isGeneratingPdf ? 'opacity-75 cursor-not-allowed' : ''}`}
          >
            {isGeneratingPdf ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Download className="w-4 h-4 mr-2" />
                Export PDF
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Visuals */}
        <div className="lg:col-span-7 space-y-6 print-break-inside">
          <div className="bg-white rounded-xl shadow-sm border border-surface-200 p-1">
            <div className="p-4 border-b border-slate-100">
              <h2 className="text-lg font-semibold text-surface-800">Damage Localization</h2>
            </div>
            {/* Added ref to wrapper for HTML2Canvas capture */}
            <div className="p-4" ref={visualizerRef}>
              <DamageVisualizer imageUrl={imageUrl} damages={result.damages} />
            </div>
          </div>

          {/* AI Summary Card */}
          <div className="bg-white rounded-xl shadow-sm border border-surface-200 p-6">
            <div className="flex items-center gap-2 mb-4">
               <div className="p-2 bg-brand-100 rounded-lg">
                 <FileText className="w-5 h-5 text-brand-600" />
               </div>
               <h3 className="text-lg font-semibold text-surface-800">AI Assessment Summary</h3>
            </div>
            <p className="text-surface-600 leading-relaxed text-sm">
              {result.summary}
            </p>
            <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-sm">
              <span className="text-surface-500">AI Confidence Score:</span>
              <div className="flex items-center gap-2">
                 <div className="w-32 h-2 bg-slate-100 rounded-full overflow-hidden">
                   <div 
                    className="h-full bg-emerald-500" 
                    style={{ width: `${result.confidenceScore * 100}%` }}
                   />
                 </div>
                 <span className="font-semibold text-emerald-600">{(result.confidenceScore * 100).toFixed(0)}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Data & Costs */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Cost Overview Card */}
          <div className="bg-white rounded-xl shadow-sm border border-surface-200 overflow-hidden">
            <div className="bg-surface-50 p-6 border-b border-surface-200">
              <span className="text-surface-500 text-sm font-medium uppercase tracking-wider">Total Estimated Repair Cost</span>
              <div className="flex items-baseline mt-1 gap-2">
                <span className="text-4xl font-bold text-surface-900">
                  {formatCurrency(result.totalEstimatedCost)}
                </span>
                <span className="text-sm text-surface-500">{currency}</span>
              </div>
            </div>
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                 <h3 className="font-semibold text-surface-800">Identified Damages ({result.damages.length})</h3>
                 <span className="text-xs bg-slate-100 text-surface-600 px-2 py-1 rounded border border-surface-200">{result.vehicleType}</span>
              </div>
              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {result.damages.map((damage) => (
                  <div key={damage.id} className="flex justify-between items-start p-3 rounded-lg bg-surface-50 hover:bg-slate-100 transition-colors border border-transparent hover:border-surface-200">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-surface-900 text-sm">{damage.type}</span>
                        <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded border ${
                          damage.severity === Severity.LOW ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                          damage.severity === Severity.MEDIUM ? 'bg-orange-50 text-orange-700 border-orange-200' :
                          'bg-red-50 text-red-700 border-red-200'
                        }`}>
                          {damage.severity}
                        </span>
                      </div>
                      <p className="text-xs text-surface-500 mt-1 line-clamp-1">{damage.description}</p>
                    </div>
                    <span className="font-semibold text-surface-700 text-sm">{formatCurrency(damage.estimatedCost)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Charts */}
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

        </div>
      </div>
      
      {/* Footer for Print */}
      <div className="hidden print:block mt-8 pt-8 border-t border-surface-200 text-center text-slate-400 text-sm">
        <p>Generated by AutoClaim AI on {new Date(result.timestamp).toLocaleDateString()}</p>
        <p>This report is an AI-generated estimate in {currency} and requires final validation by a certified adjuster.</p>
      </div>
    </div>
  );
};

export default AnalysisDashboard;
