import { useState } from 'react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { AssessmentResult, Currency, PartOption } from '../../../types';
import { formatCurrency } from '../../../utils/currencyUtils';

export const usePdfGenerator = () => {
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const generatePdf = async (
    result: AssessmentResult,
    currency: Currency,
    elementToCapture: HTMLElement | null
  ) => {
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
      if (elementToCapture) {
         // Snapshot the element
        const canvas = await html2canvas(elementToCapture, { 
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
        
        // Check if we have detailed repair costs
        if (damage.repairCosts) {
           const { labor, parts } = damage.repairCosts;
           
           // Labor Line
           yPos += 5;
           doc.setFontSize(9);
           doc.setTextColor(51, 65, 85);
           doc.text(`Labor: ${formatCurrency(labor)}`, margin + 10, yPos);
           
           // Parts Options
           yPos += 5;
           doc.text(`Parts Options:`, margin + 10, yPos);
           parts.forEach((opt: PartOption) => {
             yPos += 5;
             doc.setTextColor(71, 85, 105);
             if (opt.type === 'Used') doc.text(`- Used/Kabli: ${formatCurrency(opt.price)}`, margin + 15, yPos);
             else doc.text(`- ${opt.type}: ${formatCurrency(opt.price)}`, margin + 15, yPos);
           });
           yPos += 5;
        }

        // Description
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

  return {
    isGeneratingPdf,
    generatePdf
  };
};
