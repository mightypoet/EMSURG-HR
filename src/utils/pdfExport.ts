import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

export interface ExportPdfOptions {
  fileName: string;
  elementIds: string[]; // List of page container IDs e.g. ['doc-page-1', 'doc-page-2']
}

export async function exportDocumentToPdf({ fileName, elementIds }: ExportPdfOptions): Promise<boolean> {
  try {
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true,
    });

    const pdfWidth = 210; // A4 width in mm
    const pdfHeight = 297; // A4 height in mm

    for (let i = 0; i < elementIds.length; i++) {
      const elId = elementIds[i];
      const element = document.getElementById(elId);
      if (!element) {
        console.warn(`Element with ID ${elId} not found for PDF export.`);
        continue;
      }

      if (i > 0) {
        pdf.addPage('a4', 'portrait');
      }

      // Ensure all images (signatures, stamps, letterhead icons) inside the page are fully loaded
      const images = Array.from(element.querySelectorAll('img'));
      await Promise.all(
        images.map((img) => {
          if (img.complete) return Promise.resolve();
          return new Promise<void>((resolve) => {
            img.onload = () => resolve();
            img.onerror = () => resolve();
          });
        })
      );

      // Render the DOM element with high resolution and crisp vector reproduction
      const canvas = await html2canvas(element, {
        scale: 2.8, // Ultra-crisp rendering for signatures and fonts
        useCORS: true,
        allowTaint: true,
        logging: false,
        backgroundColor: '#ffffff',
        windowWidth: 1024,
        imageTimeout: 8000,
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.98);
      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');
    }

    // Ensure .pdf extension
    const cleanFileName = fileName.endsWith('.pdf') ? fileName : `${fileName}.pdf`;
    pdf.save(cleanFileName);
    return true;
  } catch (error) {
    console.error('PDF generation error:', error);
    // Fallback: trigger browser print
    window.print();
    return false;
  }
}

/**
 * Generates standardized filename
 * e.g. Emsurg_Offer_Letter_Kavita_Menon.pdf
 */
export function generateDocumentFileName(type: string, employeeName: string): string {
  const cleanName = (employeeName || 'Candidate')
    .trim()
    .replace(/[^a-zA-Z0-9]/g, '_')
    .replace(/__+/g, '_');
  
  let prefix = 'Emsurg_Document';
  if (type === 'offer') prefix = 'Emsurg_Offer_Letter';
  else if (type === 'promotion') prefix = 'Emsurg_Promotion_Letter';
  else if (type === 'appointment') prefix = 'Emsurg_Appointment_Letter';
  else if (type === 'relieving') prefix = 'Emsurg_Relieving_Letter';

  return `${prefix}_${cleanName}.pdf`;
}
