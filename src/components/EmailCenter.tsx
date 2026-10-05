import React, { useState, useEffect } from 'react';
import { EmailLog, DocumentRecord, CompanySettings } from '../types';
import { formatDisplayDate } from '../utils/numberToWords';
import { 
  buildCorporateEmailDraft, 
  buildGmailComposeUrl, 
  buildMailtoUrl 
} from '../utils/emailDispatcher';
import { exportDocumentToPdf } from '../utils/pdfExport';
import { 
  Mail, 
  Send, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  FileText, 
  ExternalLink, 
  User, 
  X,
  Paperclip,
  Building,
  Download,
  Loader2
} from 'lucide-react';

interface EmailCenterProps {
  emailLogs: EmailLog[];
  documents: DocumentRecord[];
  companySettings: CompanySettings;
  onSendEmail: (emailLog: EmailLog) => void;
  onOpenSendModal: (doc?: DocumentRecord) => void;
}

export const EmailCenter: React.FC<EmailCenterProps> = ({
  emailLogs,
  documents,
  companySettings,
  onSendEmail,
  onOpenSendModal,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredLogs = emailLogs.filter((log) => {
    return (
      log.recipientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.recipientEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.subject.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Mail className="w-5 h-5 text-teal-600" />
            <span>Employee Email Dispatch Center</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Send formal Offer Letters, Promotion Letters, and Appointment Letters directly to candidates and employees.
          </p>
        </div>

        <button
          onClick={() => onOpenSendModal()}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold bg-teal-600 hover:bg-teal-500 text-white shadow-sm transition-all cursor-pointer self-start sm:self-auto"
        >
          <Send className="w-4 h-4" />
          <span>+ Dispatch New Letter</span>
        </button>
      </div>

      {/* Dispatched Emails Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <input
            type="text"
            placeholder="Search email logs by recipient, email, or subject..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-80 text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
          <div className="text-xs text-slate-500">
            Total Dispatches: <strong className="text-slate-800">{emailLogs.length}</strong>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-6">Recipient</th>
                <th className="py-3 px-4">Subject</th>
                <th className="py-3 px-4">Document</th>
                <th className="py-3 px-4">Dispatched Date</th>
                <th className="py-3 px-4">Delivery Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400">
                    No emails logged yet. Click "+ Dispatch New Letter" to send official documents.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => {
                  const statusColor =
                    log.status === 'Sent' || log.status === 'Delivered'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-amber-50 text-amber-700 border-amber-200';

                  return (
                    <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-6">
                        <div className="font-semibold text-slate-900">{log.recipientName}</div>
                        <div className="text-[11px] text-slate-500 font-mono">{log.recipientEmail}</div>
                      </td>

                      <td className="py-3.5 px-4 font-medium text-slate-800 max-w-xs truncate">
                        {log.subject}
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="capitalize px-2 py-0.5 text-[10px] font-bold rounded bg-slate-100 text-slate-700 border border-slate-200">
                          {log.documentType} Letter
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-slate-600">
                        {new Date(log.sentAt).toLocaleString('en-IN', {
                          dateStyle: 'medium',
                          timeStyle: 'short',
                        })}
                      </td>

                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 text-[10px] font-semibold rounded border uppercase tracking-wider ${statusColor}`}>
                          {log.status}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

/* =========================================================================
   SEND EMAIL MODAL DIALOG
   ========================================================================= */
interface SendEmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentRecord?: DocumentRecord | null;
  documents: DocumentRecord[];
  companySettings: CompanySettings;
  onSendSuccess: (emailLog: EmailLog, docId?: string) => void;
}

export const SendEmailModal: React.FC<SendEmailModalProps> = ({
  isOpen,
  onClose,
  documentRecord,
  documents,
  companySettings,
  onSendSuccess,
}) => {
  if (!isOpen) return null;

  const [selectedDocId, setSelectedDocId] = useState<string>(documentRecord?.id || (documents[0]?.id ?? ''));
  const currentDoc = documents.find((d) => d.id === selectedDocId) || documentRecord;

  // Initialize draft
  const initialDraft = currentDoc
    ? buildCorporateEmailDraft(currentDoc.documentType, { ...currentDoc.data, employeeName: currentDoc.employeeName, employeeEmail: currentDoc.employeeEmail, fileName: currentDoc.fileName }, companySettings)
    : null;

  const [toEmail, setToEmail] = useState<string>(
    initialDraft?.to || currentDoc?.employeeEmail || ''
  );
  const [ccEmail, setCcEmail] = useState<string>(
    initialDraft?.cc || companySettings.email || 'hr@emsurg.com'
  );
  const [subject, setSubject] = useState<string>(
    initialDraft?.subject || `Official HR Letter - Emsurg Healthcare India Pvt. Ltd.`
  );
  const [emailBody, setEmailBody] = useState<string>(
    initialDraft?.body || ''
  );
  const [isSending, setIsSending] = useState(false);
  const [dispatchFeedback, setDispatchFeedback] = useState<string | null>(null);

  const handleDocChange = (docId: string) => {
    setSelectedDocId(docId);
    const doc = documents.find((d) => d.id === docId);
    if (doc) {
      const draft = buildCorporateEmailDraft(
        doc.documentType,
        { ...doc.data, employeeName: doc.employeeName, employeeEmail: doc.employeeEmail, fileName: doc.fileName },
        companySettings
      );
      setToEmail(draft.to);
      setCcEmail(draft.cc);
      setSubject(draft.subject);
      setEmailBody(draft.body);
    }
  };

  const handleDispatch = async (clientType: 'gmail' | 'mailto') => {
    if (!toEmail.trim()) {
      alert("Please enter recipient's email address.");
      return;
    }

    setIsSending(true);

    const draft = {
      to: toEmail.trim(),
      cc: ccEmail.trim(),
      subject,
      body: emailBody,
      fileName: currentDoc?.fileName || 'document.pdf',
    };

    // Auto-trigger PDF download if preview elements exist on page
    if (currentDoc) {
      const elementIds = currentDoc.documentType === 'offer' || currentDoc.documentType === 'appointment'
        ? ['doc-page-1', 'doc-page-2']
        : ['doc-page-1'];

      try {
        await exportDocumentToPdf({
          fileName: currentDoc.fileName,
          elementIds,
        });
      } catch (err) {
        console.warn('PDF download warning:', err);
      }
    }

    // Open target composer
    if (clientType === 'gmail') {
      const gmailUrl = buildGmailComposeUrl(draft);
      const win = window.open(gmailUrl, '_blank', 'noopener,noreferrer');
      if (!win) {
        window.location.href = buildMailtoUrl(draft);
      }
    } else {
      window.location.href = buildMailtoUrl(draft);
    }

    const log: EmailLog = {
      id: `email-${Date.now()}`,
      documentId: currentDoc?.id,
      documentType: currentDoc?.documentType || 'offer',
      recipientEmail: toEmail,
      recipientName: currentDoc?.employeeName || 'Candidate',
      subject,
      sentAt: new Date().toISOString(),
      status: 'Sent',
      notes: `Dispatched with attachment ${currentDoc?.fileName || 'document.pdf'} | CC: ${ccEmail}`,
    };

    setDispatchFeedback('PDF downloaded! Attach file in the opened composer and click Send.');

    setTimeout(() => {
      onSendSuccess(log, currentDoc?.id);
      setIsSending(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden my-8">
        <div className="px-6 py-4 bg-gradient-to-r from-sky-50 to-white border-b border-sky-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-teal-600" />
            <div>
              <h3 className="font-bold text-base text-slate-900">Send Document via Email</h3>
              <p className="text-xs text-slate-500">
                Official Emsurg Healthcare India Pvt. Ltd. HR correspondence
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {dispatchFeedback && (
          <div className="mx-6 mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{dispatchFeedback}</span>
          </div>
        )}

        <form onSubmit={(e) => { e.preventDefault(); handleDispatch('gmail'); }} className="p-6 space-y-4">
          {/* Document Attachment Picker if not passed */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Select Document to Attach *
            </label>
            <select
              value={selectedDocId}
              onChange={(e) => handleDocChange(e.target.value)}
              className="w-full text-xs px-3 py-2 border rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium"
            >
              {documents.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.title} ({d.referenceNo}) - {d.employeeName}
                </option>
              ))}
            </select>
          </div>

          {/* Attachment chip */}
          {currentDoc && (
            <div className="p-2.5 rounded-lg bg-teal-50 border border-teal-200 flex items-center justify-between text-xs text-teal-900">
              <div className="flex items-center gap-2">
                <Paperclip className="w-4 h-4 text-teal-600" />
                <span className="font-semibold">{currentDoc.fileName}</span>
              </div>
              <span className="text-[10px] text-teal-700 font-medium bg-teal-100 px-2 py-0.5 rounded">
                Auto-downloads on Send
              </span>
            </div>
          )}

          {/* Recipient Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Recipient Email *
              </label>
              <input
                type="email"
                required
                value={toEmail}
                onChange={(e) => setToEmail(e.target.value)}
                className="w-full text-xs px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="candidate@example.com"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                CC (HR Dept)
              </label>
              <input
                type="email"
                value={ccEmail}
                onChange={(e) => setCcEmail(e.target.value)}
                className="w-full text-xs px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="hr@emsurg.com"
              />
            </div>
          </div>

          {/* Subject */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Email Subject *
            </label>
            <input
              type="text"
              required
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full text-xs px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 font-semibold"
            />
          </div>

          {/* Message Body */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Email Body (Formal Corporate Copy)
            </label>
            <textarea
              rows={7}
              value={emailBody}
              onChange={(e) => setEmailBody(e.target.value)}
              className="w-full text-xs px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 font-mono text-slate-700"
            />
          </div>

          <div className="pt-3 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-[11px] text-slate-500">
              Downloads high-res PDF and opens pre-filled composer.
            </p>
            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-2 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDispatch('mailto')}
                disabled={isSending}
                className="px-3 py-2 rounded-lg text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 cursor-pointer disabled:opacity-50"
                title="Open in native desktop mail client"
              >
                Default Mail
              </button>
              <button
                type="button"
                onClick={() => handleDispatch('gmail')}
                disabled={isSending}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold bg-sky-600 hover:bg-sky-700 text-white shadow-xs cursor-pointer disabled:opacity-50"
              >
                {isSending ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Send className="w-3.5 h-3.5" />
                )}
                <span>{isSending ? 'Preparing...' : 'Send via Gmail'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
