import React, { useState } from 'react';
import { DocumentRecord, CompanySettings } from '../types';
import { LetterPreviewA4 } from './LetterPreviewA4';
import { exportDocumentToPdf } from '../utils/pdfExport';
import { 
  X, 
  Download, 
  Printer, 
  Mail, 
  ZoomIn, 
  ZoomOut, 
  Building,
  CheckCircle2
} from 'lucide-react';

interface DocumentViewModalProps {
  documentRecord: DocumentRecord | null;
  onClose: () => void;
  companySettings: CompanySettings;
  onEmailDocument: (doc: DocumentRecord) => void;
}

export const DocumentViewModal: React.FC<DocumentViewModalProps> = ({
  documentRecord,
  onClose,
  companySettings,
  onEmailDocument,
}) => {
  if (!documentRecord) return null;

  const [zoomLevel, setZoomLevel] = useState(90);
  const [showLetterhead, setShowLetterhead] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    setIsDownloading(true);
    const elementIds = 
      documentRecord.documentType === 'offer' || documentRecord.documentType === 'appointment'
        ? ['doc-page-1', 'doc-page-2']
        : ['doc-page-1'];

    await exportDocumentToPdf({
      fileName: documentRecord.fileName,
      elementIds,
    });
    setIsDownloading(false);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-slate-100 rounded-2xl w-full max-w-5xl shadow-2xl border border-slate-300 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header Toolbar */}
        <div className="px-6 py-3.5 bg-white border-b border-slate-200 text-slate-900 flex items-center justify-between shrink-0 no-print">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-slate-900">{documentRecord.title}</span>
              <span className="text-xs font-mono text-teal-700 font-semibold">({documentRecord.referenceNo})</span>
            </div>
            <p className="text-[11px] text-slate-500">
              Emsurg Healthcare India Pvt. Ltd. Official Record
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Zoom Controls */}
            <div className="hidden sm:flex items-center gap-1 bg-slate-100 px-2 py-1 rounded-lg border border-slate-200">
              <button
                onClick={() => setZoomLevel((z) => Math.max(60, z - 10))}
                className="text-slate-600 hover:text-slate-900 cursor-pointer"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="text-xs text-slate-700 font-mono px-1 font-semibold">{zoomLevel}%</span>
              <button
                onClick={() => setZoomLevel((z) => Math.min(130, z + 10))}
                className="text-slate-600 hover:text-slate-900 cursor-pointer"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Letterhead toggle */}
            <button
              onClick={() => setShowLetterhead(!showLetterhead)}
              className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 cursor-pointer hidden md:inline-flex items-center gap-1 font-medium"
            >
              <Building className="w-3 h-3 text-teal-600" />
              <span>Header: {showLetterhead ? 'ON' : 'OFF'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg cursor-pointer"
              title="Print Document"
            >
              <Printer className="w-4 h-4" />
            </button>

            <button
              onClick={() => onEmailDocument(documentRecord)}
              className="p-1.5 text-slate-600 hover:text-sky-700 hover:bg-sky-50 rounded-lg cursor-pointer"
              title="Send via Email"
            >
              <Mail className="w-4 h-4" />
            </button>

            <button
              disabled={isDownloading}
              onClick={handleDownload}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-teal-600 hover:bg-teal-700 text-white shadow-xs cursor-pointer disabled:opacity-50"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isDownloading ? 'Downloading...' : 'PDF'}</span>
            </button>

            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-700 p-1 rounded-lg ml-2 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Document Scroll View */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 flex justify-center bg-slate-100/90">
          <div
            style={{
              transform: `scale(${zoomLevel / 100})`,
              transformOrigin: 'top center',
              transition: 'transform 0.15s ease-out',
            }}
          >
            <LetterPreviewA4
              documentType={documentRecord.documentType}
              offerData={documentRecord.documentType === 'offer' ? (documentRecord.data as any) : undefined}
              promotionData={documentRecord.documentType === 'promotion' ? (documentRecord.data as any) : undefined}
              appointmentData={documentRecord.documentType === 'appointment' ? (documentRecord.data as any) : undefined}
              relievingData={documentRecord.documentType === 'relieving' ? (documentRecord.data as any) : undefined}
              companySettings={companySettings}
              showLetterhead={showLetterhead}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
