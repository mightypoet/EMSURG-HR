export interface ExportPdfOptions {
  fileName?: string;
  elementIds?: string[];
}

/**
 * Direct, instant, 100% accurate print & PDF export via isolated iframe.
 * Eliminates html2canvas hangs and scaling distortions.
 */
export const exportDocumentToPdf = async (
  optionsOrFilename: string | ExportPdfOptions = 'Emsurg_Letter.pdf'
): Promise<boolean> => {
  return new Promise((resolve) => {
    try {
      const rawName = typeof optionsOrFilename === 'string'
        ? optionsOrFilename
        : (optionsOrFilename?.fileName || 'Emsurg_Letter.pdf');
      const filename = rawName.endsWith('.pdf') ? rawName : `${rawName}.pdf`;
      const docTitle = filename.replace('.pdf', '');

      // Target printable document container or pages
      const printableContainer = document.getElementById('printable-document');
      const pages = Array.from(document.querySelectorAll('.a4-page'));

      let contentHtml = '';
      if (printableContainer) {
        contentHtml = printableContainer.outerHTML;
      } else if (pages.length > 0) {
        contentHtml = pages.map((p) => p.outerHTML).join('\n');
      } else {
        const fallback = document.querySelector('.a4-page') as HTMLElement;
        if (!fallback) {
          window.print();
          resolve(true);
          return;
        }
        contentHtml = fallback.outerHTML;
      }

      // Collect all stylesheets and font styles from host page
      const styleSheets = Array.from(document.querySelectorAll('link[rel="stylesheet"], style'))
        .map((el) => el.outerHTML)
        .join('\n');

      // Create isolated hidden iframe
      const iframe = document.createElement('iframe');
      iframe.style.position = 'fixed';
      iframe.style.right = '0';
      iframe.style.bottom = '0';
      iframe.style.width = '0';
      iframe.style.height = '0';
      iframe.style.border = '0';
      iframe.style.opacity = '0';
      iframe.style.pointerEvents = 'none';
      document.body.appendChild(iframe);

      const doc = iframe.contentWindow?.document;
      if (!doc) {
        window.print();
        document.body.removeChild(iframe);
        resolve(false);
        return;
      }

      doc.open();
      doc.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8" />
            <title>${docTitle}</title>
            ${styleSheets}
            <style>
              @page {
                size: A4 portrait;
                margin: 0;
              }
              *, *::before, *::after {
                box-sizing: border-box;
              }
              html, body {
                margin: 0 !important;
                padding: 0 !important;
                background: #ffffff !important;
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif !important;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
                color-adjust: exact !important;
              }
              #printable-document {
                display: block !important;
                gap: 0 !important;
                margin: 0 !important;
                padding: 0 !important;
              }
              .a4-page, .pdf-page {
                width: 210mm !important;
                min-height: 297mm !important;
                height: 297mm !important;
                max-height: 297mm !important;
                box-sizing: border-box !important;
                padding: 16mm 18mm 14mm 18mm !important;
                display: flex !important;
                flex-direction: column !important;
                justify-content: space-between !important;
                page-break-after: always !important;
                break-after: page !important;
                position: relative !important;
                overflow: hidden !important;
                background: #ffffff !important;
                border: none !important;
                box-shadow: none !important;
                margin: 0 auto !important;
                transform: none !important;
              }
              .a4-page:last-child, .pdf-page:last-child {
                page-break-after: avoid !important;
                break-after: avoid !important;
              }
              img {
                max-width: 100% !important;
                object-fit: contain !important;
              }
              @media print {
                body {
                  margin: 0 !important;
                }
              }
            </style>
          </head>
          <body>
            ${contentHtml}
          </body>
        </html>
      `);
      doc.close();

      // Ensure iframe is loaded and images render before opening print dialog
      setTimeout(() => {
        try {
          iframe.contentWindow?.focus();
          iframe.contentWindow?.print();
        } catch (printErr) {
          console.error('Iframe print error:', printErr);
          window.print();
        } finally {
          setTimeout(() => {
            if (document.body.contains(iframe)) {
              document.body.removeChild(iframe);
            }
            resolve(true);
          }, 800);
        }
      }, 350);
    } catch (err) {
      console.error('PDF export routine error:', err);
      window.print();
      resolve(false);
    }
  });
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
