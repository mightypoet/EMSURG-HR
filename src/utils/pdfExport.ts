import html2canvas from 'html2canvas-pro';
import { jsPDF } from 'jspdf';

export interface ExportPdfOptions {
  fileName: string;
  elementIds: string[]; // List of page container IDs e.g. ['doc-page-1', 'doc-page-2']
}

/**
 * Converts modern CSS colors (like oklch, oklab, color(srgb...)) into standard browser rgb/rgba/hex
 * using a fast 2D canvas color serializer.
 */
function normalizeColorString(rawColor: string, ctx: CanvasRenderingContext2D | null): string {
  if (!rawColor || typeof rawColor !== 'string') return rawColor;
  if (!rawColor.includes('oklch') && !rawColor.includes('oklab') && !rawColor.includes('color(')) {
    return rawColor;
  }

  if (!ctx) {
    // Fallback: strip oklch or convert to a safe neutral/teal fallback if canvas context is unavailable
    if (rawColor.includes('teal')) return '#0f766e';
    if (rawColor.includes('slate')) return '#334155';
    return '#0f172a';
  }

  try {
    ctx.fillStyle = '#ffffff'; // reset
    ctx.fillStyle = rawColor;
    const normalized = ctx.fillStyle;
    return normalized && normalized !== '#ffffff' ? normalized : rawColor;
  } catch {
    return '#0f172a';
  }
}

/**
 * Sanitizes all styles and elements inside the cloned document before rendering canvas,
 * replacing any modern CSS functions like oklch with standard sRGB hex/rgba.
 */
function sanitizeClonedDocument(clonedDoc: Document) {
  try {
    const canvas = clonedDoc.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    const ctx = canvas.getContext('2d');

    // 1. Sanitize all <style> elements in cloned document
    const styleTags = Array.from(clonedDoc.querySelectorAll('style'));
    styleTags.forEach((styleTag) => {
      if (styleTag.textContent && (styleTag.textContent.includes('oklch') || styleTag.textContent.includes('oklab'))) {
        styleTag.textContent = styleTag.textContent.replace(/oklch\([^)]+\)/gi, (match) => {
          return normalizeColorString(match, ctx);
        });
      }
    });

    // 2. Traverse all elements and normalize computed/inline color styles
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
      
      // Inline styles
      for (const prop of colorProps) {
        const val = (el.style as any)[prop];
        if (val && typeof val === 'string' && (val.includes('oklch') || val.includes('oklab'))) {
          (el.style as any)[prop] = normalizeColorString(val, ctx);
        }
      }

      // Check SVG fill / stroke attributes
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

export async function exportDocumentToPdf({ fileName, elementIds }: ExportPdfOptions): Promise<boolean> {
  try {
    const pdf = new jsPDF('p', 'mm', 'a4');
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
            // Timeout safety in case an external image fails
            setTimeout(resolve, 2500);
          });
        })
      );

      // Render the DOM element with 1:1 fixed 794px width without zoom/transform distortion
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        logging: false,
        backgroundColor: '#ffffff',
        windowWidth: 794,
        imageTimeout: 10000,
        onclone: (clonedDoc) => {
          // Reset any zoom or responsive transform applied to preview wrapper
          const allTargets = Array.from(clonedDoc.querySelectorAll('.a4-page')) as HTMLElement[];
          allTargets.forEach((target) => {
            target.style.transform = 'none';
            target.style.margin = '0 auto';
            target.style.width = '794px';
            target.style.height = '1123px';
            target.style.minHeight = '1123px';
            target.style.maxHeight = '1123px';
            target.style.boxSizing = 'border-box';
          });

          // Also check parent wrapper transforms
          const parentWrappers = Array.from(clonedDoc.querySelectorAll('[style*="transform"]')) as HTMLElement[];
          parentWrappers.forEach((el) => {
            if (el.style.transform && el.style.transform.includes('scale')) {
              el.style.transform = 'none';
            }
          });

          sanitizeClonedDocument(clonedDoc);
        },
      });

      const imgData = canvas.toDataURL('image/png');
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');
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
    // Fallback: trigger standard browser print dialog
    window.print();
    return false;
  }
}

/**
 * Generates standardized filename
 * e.g. Emsurg_Offer_Letter_Swarnali_Dey.pdf
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
