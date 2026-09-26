import React, { useState, useMemo } from 'react';
import { DocumentRecord, DocumentType } from '../types';
import { formatDisplayDate } from '../utils/numberToWords';
import { 
  History, 
  Search, 
  Filter, 
  Eye, 
  Download, 
  Send, 
  Trash2, 
  FileText,
  CheckCircle2,
  Calendar,
  Building
} from 'lucide-react';

interface LetterHistoryProps {
  documents: DocumentRecord[];
  onViewDocument: (doc: DocumentRecord) => void;
  onDownloadPdf: (doc: DocumentRecord) => void;
  onEmailDocument: (doc: DocumentRecord) => void;
  onDeleteDocument: (docId: string) => void;
}

export const LetterHistory: React.FC<LetterHistoryProps> = ({
  documents,
  onViewDocument,
  onDownloadPdf,
  onEmailDocument,
  onDeleteDocument,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  const filteredDocs = useMemo(() => {
    return documents.filter((doc) => {
      const matchSearch =
        doc.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.referenceNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.designation.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.title.toLowerCase().includes(searchTerm.toLowerCase());

      const matchType = typeFilter === 'All' || doc.documentType === typeFilter;
      const matchStatus = statusFilter === 'All' || doc.status === statusFilter;

      return matchSearch && matchType && matchStatus;
    });
  }, [documents, searchTerm, typeFilter, statusFilter]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <History className="w-5 h-5 text-teal-600" />
            <span>Official Letter Archive &amp; History</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Audit trail of all generated Offer Letters, Promotion Letters, Appointment Letters, and Relieving Letters.
          </p>
        </div>

        <div className="text-xs text-slate-500 font-semibold px-3 py-1.5 bg-slate-100 rounded-lg border border-slate-200 self-start sm:self-auto">
          Total Records: <span className="text-slate-900 font-bold">{documents.length}</span>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by candidate name, reference number, designation..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="All">All Letter Types</option>
            <option value="offer">Offer Letters</option>
            <option value="promotion">Promotion Letters</option>
            <option value="appointment">Appointment Letters</option>
            <option value="relieving">Relieving Letters</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="All">All Statuses</option>
            <option value="Generated">Generated</option>
            <option value="Emailed">Emailed</option>
            <option value="Draft">Draft</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4 sm:px-6">Document</th>
                <th className="py-3 px-4">Employee / Candidate</th>
                <th className="py-3 px-4">Ref Number</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 sm:px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredDocs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    No records found matching your filters.
                  </td>
                </tr>
              ) : (
                filteredDocs.map((doc) => {
                  const badgeColor =
                    doc.documentType === 'offer'
                      ? 'bg-blue-50 text-blue-700 border-blue-200'
                      : doc.documentType === 'promotion'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : doc.documentType === 'appointment'
                      ? 'bg-teal-50 text-teal-700 border-teal-200'
                      : 'bg-purple-50 text-purple-700 border-purple-200';

                  const statusColor =
                    doc.status === 'Emailed'
                      ? 'bg-purple-50 text-purple-700 border-purple-200'
                      : doc.status === 'Generated'
                      ? 'bg-teal-50 text-teal-700 border-teal-200'
                      : 'bg-amber-50 text-amber-700 border-amber-200';

                  return (
                    <tr key={doc.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 sm:px-6">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 text-[10px] font-bold rounded border uppercase tracking-wider ${badgeColor}`}>
                            {doc.documentType}
                          </span>
                          <span className="font-semibold text-slate-900">{doc.title}</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-800">{doc.employeeName}</div>
                        <div className="text-[11px] text-slate-500">{doc.designation}</div>
                      </td>

                      <td className="py-3.5 px-4 font-mono text-slate-600 font-medium">
                        {doc.referenceNo}
                      </td>

                      <td className="py-3.5 px-4 text-slate-600">
                        {formatDisplayDate(doc.dateGenerated)}
                      </td>

                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 text-[10px] font-semibold rounded border uppercase tracking-wider ${statusColor}`}>
                          {doc.status}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 sm:px-6 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            title="View Document"
                            onClick={() => onViewDocument(doc)}
                            className="p-1.5 text-slate-600 hover:text-teal-700 hover:bg-teal-50 rounded-lg transition-colors cursor-pointer"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          <button
                            title="Download PDF"
                            onClick={() => onDownloadPdf(doc)}
                            className="p-1.5 text-slate-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                          >
                            <Download className="w-4 h-4" />
                          </button>

                          <button
                            title="Email to Candidate"
                            onClick={() => onEmailDocument(doc)}
                            className="p-1.5 text-slate-600 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition-colors cursor-pointer"
                          >
                            <Send className="w-4 h-4" />
                          </button>

                          <button
                            title="Delete Record"
                            onClick={() => onDeleteDocument(doc.id)}
                            className="p-1.5 text-slate-400 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
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
