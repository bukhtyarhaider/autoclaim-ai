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

      // --- Load Logo ---
      const logoUrl = '/logo.png';
      const logoDataUrl = await new Promise<string>((resolve, reject) => {
        const img = new Image();
        img.src = logoUrl;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0);
            resolve(canvas.toDataURL('image/png'));
          } else {
            reject(new Error('Could not get canvas context'));
          }
        };
        img.onerror = reject;
      }).catch(() => null); // Fail silently if logo missing
      
      // --- Header Section ---
      // --- Header Section ---
      
      // Top Bar Background
      doc.setFillColor(15, 23, 42); // slate-900 (Dark Brand Blue)
      doc.rect(0, 0, pageWidth, 40, 'F');
      
      if (logoDataUrl) {
        doc.addImage(logoDataUrl, 'PNG', margin, 10, 15, 15);
        doc.setFontSize(24);
        doc.setTextColor(255, 255, 255); 
        doc.setFont("helvetica", "bold");
        doc.text("Carscube", margin + 20, 21);
      } else {
        doc.setFontSize(24);
        doc.setTextColor(255, 255, 255); 
         doc.setFont("helvetica", "bold");
        doc.text("Carscube", margin, 21);
      }
      
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(148, 163, 184); // slate-400
      doc.text("Damage Analysis Report", margin, 29);

      yPos = 45;

      // Meta Data (Grid Layout)
      doc.setFontSize(8);
      doc.setTextColor(100, 116, 139); // Label color
      doc.text("REPORT DATE", margin, yPos);
      doc.text("REPORT ID", margin + 50, yPos);
      doc.text("VEHICLE", margin + 100, yPos);
      
      yPos += 4;
      doc.setFontSize(10);
      doc.setTextColor(15, 23, 42); // Value color
      doc.setFont("helvetica", "bold");
      doc.text(new Date(result.timestamp).toLocaleDateString(), margin, yPos);
      doc.text(result.id, margin + 50, yPos);
      doc.text(result.vehicleType, margin + 100, yPos);
      doc.setFont("helvetica", "normal");
      
      yPos += 6;
      doc.setDrawColor(226, 232, 240); 
      doc.line(margin, yPos, pageWidth - margin, yPos);
      yPos += 10;

      // Summary
      doc.setFontSize(12);
      doc.setTextColor(15, 23, 42);
      doc.setFont("helvetica", "bold");
      doc.text("Assessment Summary", margin, yPos);
      doc.setFont("helvetica", "normal");
      yPos += 6;

      doc.setFontSize(9);
      doc.setTextColor(51, 65, 85);
      const splitSummary = doc.splitTextToSize(result.summary, contentWidth);
      doc.text(splitSummary, margin, yPos);
      yPos += (splitSummary.length * 4) + 10;

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
        // Constrain image height to available space if possible, else minimal break
        const pdfImgHeight = (imgProps.height * contentWidth) / imgProps.width;
        
        // Only page break if it REALLY doesn't fit (aggressive keeping)
        checkPageBreak(pdfImgHeight + 10);

        doc.setFontSize(12);
        doc.setTextColor(15, 23, 42);
        doc.setFont("helvetica", "bold");
        doc.text("Damage Localization", margin, yPos);
        doc.setFont("helvetica", "normal");
        yPos += 6;
        
        doc.addImage(imgData, 'PNG', margin, yPos, contentWidth, pdfImgHeight);
        yPos += pdfImgHeight + 15;
      }

      // Details Table
      checkPageBreak(30);
      doc.setFontSize(13);
      doc.setTextColor(15, 23, 42);
      doc.setFont("helvetica", "bold");
      doc.text("Detailed Damage Analysis", margin, yPos);
      doc.setFont("helvetica", "normal");
      yPos += 8;

      // Table Header
      doc.setFillColor(15, 23, 42); // slate-900
      doc.rect(margin, yPos, contentWidth, 8, 'F');
      
      doc.setFontSize(8);
      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.text("ITEM & DESCRIPTION", margin + 4, yPos + 5);
      doc.text("REPAIR DETAILS", margin + 100, yPos + 5);
      doc.text("COST", pageWidth - margin - 25, yPos + 5);
      yPos += 8;

      // Rows
      doc.setFont("helvetica", "normal");
      
      for (const damage of result.damages) {
        doc.setFontSize(11);
        doc.setTextColor(15, 23, 42); 
        
        // Calculate height (Description logic)
        doc.setFontSize(8);
        const splitDesc = doc.splitTextToSize(damage.description, 85); // Left col width ~ 90
        const rowHeight = Math.max(15, (splitDesc.length * 3.5) + 10); 

        checkPageBreak(rowHeight);

        // -- Row Background (Alternating could be nice, but clean white is fine) --
        
        // Col 1: Item
        doc.setFontSize(10);
        doc.setTextColor(15, 23, 42);
        doc.setFont("helvetica", "bold");
        const title = damage.requiredPart || damage.type;
        doc.text(title, margin + 2, yPos + 5);
        
        // Severity Badge (Text)
        doc.setFontSize(7);
        doc.setTextColor(100, 116, 139);
        doc.setFont("helvetica", "normal");
        doc.text(`Severity: ${damage.severity}`, margin + 2, yPos + 9);

        // Description
        doc.setTextColor(71, 85, 105);
        doc.text(splitDesc, margin + 2, yPos + 13);

        // Col 2: Breakdown
        let detailsY = yPos + 5;
        if (damage.repairCosts) {
             const { labor, parts } = damage.repairCosts;
             doc.setFontSize(8);
             doc.setTextColor(51, 65, 85);
             doc.text(`Labor: ${formatCurrency(labor)}`, margin + 100, detailsY);
             detailsY += 4;
             
             parts.forEach((opt: PartOption) => {
                 const label = opt.type === 'Used' ? 'Used/Kabli' : opt.type;
                 doc.text(`${label}: ${formatCurrency(opt.price)}`, margin + 100, detailsY);
                 detailsY += 4;
             });
        }

        // Col 3: Total Cost
        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(22, 163, 74); 
        doc.text(formatCurrency(damage.estimatedCost), pageWidth - margin - 25, yPos + 5);

        // Separator Line
        yPos += rowHeight;
        doc.setDrawColor(241, 245, 249);
        doc.line(margin, yPos, pageWidth - margin, yPos);
      }

      // --- PARTS CHECKLIST SECTION ---
      checkPageBreak(80);
      yPos += 15;
      
      doc.setFillColor(15, 23, 42); // slate-900
      doc.rect(margin, yPos, contentWidth, 10, 'F');
      
      doc.setFontSize(11);
      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.text("PARTS & REPLACEMENT CHECKLIST", margin + 4, yPos + 6.5);
      yPos += 15;

      doc.setFontSize(11);
      doc.setFont("helvetica", "normal");
      
      const partsToBuy = result.damages.filter(d => d.repairCosts && d.repairCosts.parts && d.repairCosts.parts.length > 0);
      
      if (partsToBuy.length > 0) {
        partsToBuy.forEach(damage => {
           checkPageBreak(15);
           // Checkbox square
           doc.setDrawColor(15, 23, 42);
           doc.rect(margin + 2, yPos - 3, 4, 4);
           
           // Text
           doc.setTextColor(15, 23, 42);
           // Use requiredPart if available, else type
           const partLabel = damage.requiredPart || `${damage.type} (Generic)`;
           doc.text(`${partLabel}`, margin + 10, yPos);
           
           // Secondary description
           doc.setFontSize(9);
           doc.setTextColor(100, 116, 139);
           doc.text(`- Reason: ${damage.description}`, margin + 10, yPos + 4);
           
           doc.setFontSize(11); // Reset
           yPos += 10;
        });
      } else {
        doc.setFontSize(10);
        doc.setTextColor(100, 116, 139);
        doc.text("No specific replacement parts identified by AI. (Labor only)", margin + 2, yPos);
        yPos += 10;
      }

      // --- MANUAL ENTRY SECTION ---
      checkPageBreak(60);
      yPos += 10;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.setTextColor(15, 23, 42);
      doc.text("Additional / Missed Items", margin, yPos);
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(100, 116, 139);
      doc.text("(Manual Inspection Notes)", margin + 70, yPos);
      yPos += 10;

      // Render blank lines
      doc.setFont("helvetica", "normal");
      for(let i=0; i<5; i++) {
        checkPageBreak(12);
        doc.setDrawColor(148, 163, 184);
        doc.rect(margin + 2, yPos - 3, 4, 4); // Checkbox
        
        doc.setDrawColor(203, 213, 225); // Line color
        doc.line(margin + 10, yPos, pageWidth - margin, yPos); // Writing line
        
        yPos += 10;
      }

      // Total
      checkPageBreak(30);
      yPos += 5;
      doc.setFillColor(15, 23, 42); // slate-900
      doc.roundedRect(margin, yPos, contentWidth, 20, 2, 2, 'F');
      
      doc.setFontSize(12);
      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.text("Total Estimated Repair Cost", margin + 10, yPos + 13);
      
      doc.setFontSize(16);
      doc.setTextColor(255, 255, 255); // White
      const totalStr = formatCurrency(result.totalEstimatedCost);
      const totalWidth = doc.getTextWidth(totalStr);
      doc.text(totalStr, pageWidth - margin - totalWidth - 10, yPos + 13);

      doc.save(`Carcubes_Report_${result.id}.pdf`);

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
