import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export interface ExportPdfOptions {
  fileName?: string;
  elementIds?: string[];
}

/**
 * Dedicated off-screen PDF export routine using isolated #pdf-render-target
 */
export const exportDocumentToPdf = async (
  optionsOrFilename: string | ExportPdfOptions = 'document.pdf'
): Promise<boolean> => {
  try {
    const filename = typeof optionsOrFilename === 'string'
      ? optionsOrFilename
      : (optionsOrFilename?.fileName || 'document.pdf');

    const renderContainer = document.getElementById('pdf-render-target');
    if (!renderContainer) {
      console.error('PDF render target not found (#pdf-render-target)');
      return false;
    }

    // Ensure all images are completely loaded inside the offscreen container
    const images = Array.from(renderContainer.querySelectorAll('img'));
    await Promise.all(
      images.map((img) => {
        if (img.complete && img.naturalWidth > 0) return Promise.resolve();
        return new Promise<void>((resolve) => {
          img.onload = () => resolve();
          img.onerror = () => resolve();
          setTimeout(resolve, 2500);
        });
      })
    );

    const pages = Array.from(renderContainer.querySelectorAll('.pdf-page')) as HTMLElement[];
    if (pages.length === 0) {
      console.error('No .pdf-page elements found inside #pdf-render-target');
      return false;
    }

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true,
    });

    for (let i = 0; i < pages.length; i++) {
      const page = pages[i];
      const canvas = await html2canvas(page, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        width: 794,
        height: 1123,
        windowWidth: 794,
        windowHeight: 1123,
        scrollX: 0,
        scrollY: 0,
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.98);
      if (i > 0) pdf.addPage('a4', 'p');
      pdf.addImage(imgData, 'JPEG', 0, 0, 210, 297);
    }

    const cleanFileName = filename.endsWith('.pdf') ? filename : `${filename}.pdf`;
    pdf.save(cleanFileName);
    return true;
  } catch (error) {
    console.error('PDF export error:', error);
    window.print();
    return false;
  }
};

/**
 * Single element direct export fallback
 */
export const exportToPdf = async (elementId: string, filename: string = 'document.pdf'): Promise<boolean> => {
  return exportDocumentToPdf(filename);
};

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
