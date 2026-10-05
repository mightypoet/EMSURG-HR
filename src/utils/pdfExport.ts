import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

export interface ExportPdfOptions {
  fileName: string;
  elementIds: string[]; // List of page container IDs e.g. ['doc-page-1', 'doc-page-2']
}

/**
 * Converts modern CSS colors (like oklch, oklab, color(srgb...)) into standard browser rgb/rgba/hex
 */
function normalizeColorString(rawColor: string, ctx: CanvasRenderingContext2D | null): string {
  if (!rawColor || typeof rawColor !== 'string') return rawColor;
  if (!rawColor.includes('oklch') && !rawColor.includes('oklab') && !rawColor.includes('color(')) {
    return rawColor;
  }

  if (!ctx) {
    if (rawColor.includes('teal')) return '#0f766e';
    if (rawColor.includes('slate')) return '#334155';
    return '#0f172a';
  }

  try {
    ctx.fillStyle = '#ffffff';
    ctx.fillStyle = rawColor;
    const normalized = ctx.fillStyle;
    return normalized && normalized !== '#ffffff' ? normalized : rawColor;
  } catch {
    return '#0f172a';
  }
}

/**
 * Sanitizes all styles and elements inside the cloned document before rendering canvas
 */
function sanitizeClonedDocument(clonedDoc: Document) {
  try {
    const canvas = clonedDoc.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    const ctx = canvas.getContext('2d');

    const styleTags = Array.from(clonedDoc.querySelectorAll('style'));
    styleTags.forEach((styleTag) => {
      if (styleTag.textContent && (styleTag.textContent.includes('oklch') || styleTag.textContent.includes('oklab'))) {
        styleTag.textContent = styleTag.textContent.replace(/oklch\([^)]+\)/gi, (match) => {
          return normalizeColorString(match, ctx);
        });
      }
    });

    const allElements = Array.from(clonedDoc.querySelectorAll('*')) as HTMLElement[];
    const colorProps = [
      'color',
      'backgroundColor',
      'borderColor',
      'borderTopColor',
      'borderRightColor',
      'borderBottomColor',
      'borderLeftColor',
      'outlineColor',
      'textDecorationColor',
      'fill',
      'stroke',
    ];

    allElements.forEach((el) => {
      if (!el.style) return;
      for (const prop of colorProps) {
        const val = (el.style as any)[prop];
        if (val && typeof val === 'string' && (val.includes('oklch') || val.includes('oklab'))) {
          (el.style as any)[prop] = normalizeColorString(val, ctx);
        }
      }
      if (el.hasAttribute('fill')) {
        const fill = el.getAttribute('fill');
        if (fill && (fill.includes('oklch') || fill.includes('oklab'))) {
          el.setAttribute('fill', normalizeColorString(fill, ctx));
        }
      }
      if (el.hasAttribute('stroke')) {
        const stroke = el.getAttribute('stroke');
        if (stroke && (stroke.includes('oklch') || stroke.includes('oklab'))) {
          el.setAttribute('stroke', normalizeColorString(stroke, ctx));
        }
      }
    });
  } catch (err) {
    console.warn('Style sanitization warning during PDF preparation:', err);
  }
}

/**
 * Single-element direct capture to PDF
 */
export const exportToPdf = async (elementId: string, filename: string): Promise<boolean> => {
  try {
    const element = document.getElementById(elementId) || (document.querySelector('.a4-page') as HTMLElement);
    if (!element) {
      console.warn(`Element with ID ${elementId} not found for exportToPdf.`);
      return false;
    }

    // Wait for all images inside to load
    const images = Array.from(element.querySelectorAll('img'));
    await Promise.all(
      images.map((img) => {
        if (img.complete && img.naturalWidth > 0) return Promise.resolve();
        return new Promise<void>((resolve) => {
          img.onload = () => resolve();
          img.onerror = () => resolve();
          setTimeout(resolve, 2000);
        });
      })
    );

    const canvas = await html2canvas(element, {
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
      onclone: (clonedDoc) => {
        const clonedPage = (clonedDoc.getElementById(elementId) || clonedDoc.querySelector('.a4-page')) as HTMLElement;
        if (clonedPage) {
          clonedPage.style.transform = 'none';
          clonedPage.style.margin = '0 auto';
          clonedPage.style.width = '794px';
          clonedPage.style.minWidth = '794px';
          clonedPage.style.maxWidth = '794px';
          clonedPage.style.height = '1123px';
          clonedPage.style.minHeight = '1123px';
          clonedPage.style.maxHeight = '1123px';
          clonedPage.style.boxSizing = 'border-box';
        }
        sanitizeClonedDocument(clonedDoc);
      },
    });

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true,
    });

    const imgData = canvas.toDataURL('image/jpeg', 0.98);
    pdf.addImage(imgData, 'JPEG', 0, 0, 210, 297);
    const cleanFileName = filename.endsWith('.pdf') ? filename : `${filename}.pdf`;
    pdf.save(cleanFileName);
    return true;
  } catch (error) {
    console.error('exportToPdf error:', error);
    window.print();
    return false;
  }
};

/**
 * Multi-page document export to PDF
 */
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

    let pagesRendered = 0;

    for (let i = 0; i < elementIds.length; i++) {
      const elId = elementIds[i];
      const element = document.getElementById(elId);
      if (!element) {
        console.warn(`Element with ID ${elId} not found for PDF export.`);
        continue;
      }

      if (pagesRendered > 0) {
        pdf.addPage('a4', 'portrait');
      }

      // Ensure all images (logos, signatures, stamps) are loaded with crossOrigin support
      const images = Array.from(element.querySelectorAll('img'));
      await Promise.all(
        images.map((img) => {
          if (img.complete && img.naturalWidth > 0) return Promise.resolve();
          return new Promise<void>((resolve) => {
            img.onload = () => resolve();
            img.onerror = () => resolve();
            setTimeout(resolve, 2000);
          });
        })
      );

      // Render the DOM element with 1:1 fixed 794x1123 standard A4 without zoom/transform distortion
      const canvas = await html2canvas(element, {
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
        onclone: (clonedDoc) => {
          // Reset any zoom or responsive transform applied to preview wrapper
          const allTargets = Array.from(clonedDoc.querySelectorAll('.a4-page')) as HTMLElement[];
          allTargets.forEach((target) => {
            target.style.transform = 'none';
            target.style.margin = '0 auto';
            target.style.width = '794px';
            target.style.minWidth = '794px';
            target.style.maxWidth = '794px';
            target.style.height = '1123px';
            target.style.minHeight = '1123px';
            target.style.maxHeight = '1123px';
            target.style.boxSizing = 'border-box';
          });

          const parentWrappers = Array.from(clonedDoc.querySelectorAll('[style*="transform"]')) as HTMLElement[];
          parentWrappers.forEach((el) => {
            if (el.style.transform && el.style.transform.includes('scale')) {
              el.style.transform = 'none';
            }
          });

          sanitizeClonedDocument(clonedDoc);
        },
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.98);
      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
      pagesRendered++;
    }

    if (pagesRendered === 0) {
      throw new Error('No valid pages found to export.');
    }

    // Ensure .pdf extension
    const cleanFileName = fileName.endsWith('.pdf') ? fileName : `${fileName}.pdf`;
    pdf.save(cleanFileName);
    return true;
  } catch (error) {
    console.error('PDF generation error:', error);
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
