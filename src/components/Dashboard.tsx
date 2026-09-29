import React from 'react';
import { 
  Users, 
  FileCheck2, 
  TrendingUp, 
  Clock, 
  Mail, 
  PlusCircle, 
  ArrowRight, 
  FileText, 
  Download, 
  Send,
  Eye,
  Shield,
  Calendar,
  Building
} from 'lucide-react';
import { Employee, DocumentRecord, DocumentType } from '../types';
import { formatDisplayDate } from '../utils/numberToWords';

interface DashboardProps {
  employees: Employee[];
  documents: DocumentRecord[];
  onNavigate: (tab: 'dashboard' | 'employees' | 'generator' | 'history' | 'email' | 'settings', docType?: DocumentType) => void;
  onViewDocument: (doc: DocumentRecord) => void;
  onEmailDocument: (doc: DocumentRecord) => void;
  onDownloadPdf: (doc: DocumentRecord) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  employees,
  documents,
  onNavigate,
  onViewDocument,
  onEmailDocument,
  onDownloadPdf,
}) => {
  // Compute metrics
  const totalEmployees = employees.length;
  const offerLettersCount = documents.filter((d) => d.documentType === 'offer').length;
  const promotionLettersCount = documents.filter((d) => d.documentType === 'promotion').length;
  const pendingDocsCount = employees.filter((e) => e.employmentStatus === 'On Probation' || e.employmentStatus === 'Offer Extended').length;
  const emailsSentCount = documents.filter((d) => d.status === 'Emailed').length;

  const recentDocuments = [...documents].reverse().slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-sky-50 via-teal-50/40 to-white rounded-2xl p-6 sm:p-7 text-slate-800 shadow-xs border border-sky-100 relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white text-teal-700 border border-teal-200/80 shadow-xs mb-3">
            <Building className="w-3.5 h-3.5 text-teal-600" />
            <span>Admin &amp; HR Department • Kolkata Regd. Office</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Emsurg Healthcare Document Center
          </h1>
          <p className="mt-2 text-sm text-slate-600 leading-relaxed">
            Welcome to the official HR document generation system. Standardized templates with verbatim legal clauses, instant A4 preview, compliant PDF exports, and direct email delivery for all employees and joinees.
          </p>
        </div>
      </div>

      {/* 5 Key Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Card 1: Total Employees */}
        <div 
          onClick={() => onNavigate('employees')}
          className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:border-teal-400 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Employees</span>
            <div className="w-9 h-9 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center group-hover:bg-teal-600 group-hover:text-white transition-colors">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-slate-900">{totalEmployees}</span>
            <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
              <span>Healthcare &amp; BME staff</span>
            </p>
          </div>
        </div>

        {/* Card 2: Offer Letters */}
        <div 
          onClick={() => onNavigate('history')}
          className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:border-teal-400 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Offer Letters</span>
            <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <FileCheck2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-slate-900">{offerLettersCount}</span>
            <p className="text-xs text-slate-500 mt-1">Generated &amp; Logged</p>
          </div>
        </div>

        {/* Card 3: Promotion Letters */}
        <div 
          onClick={() => onNavigate('history')}
          className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:border-teal-400 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Promotion Letters</span>
            <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-slate-900">{promotionLettersCount}</span>
            <p className="text-xs text-slate-500 mt-1">Career advancements</p>
          </div>
        </div>

        {/* Card 4: Pending Documents */}
        <div 
          onClick={() => onNavigate('employees')}
          className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:border-amber-400 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Pending Documents</span>
            <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition-colors">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-slate-900">{pendingDocsCount}</span>
            <p className="text-xs text-amber-600 mt-1 font-medium">Probation / New Joinees</p>
          </div>
        </div>

        {/* Card 5: Emails Sent */}
        <div 
          onClick={() => onNavigate('email')}
          className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:border-teal-400 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Emails Sent</span>
            <div className="w-9 h-9 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-colors">
              <Mail className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-slate-900">{emailsSentCount}</span>
            <p className="text-xs text-slate-500 mt-1">Direct employee dispatch</p>
          </div>
        </div>
      </div>

      {/* Large Quick Actions */}
      <div>
        <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-3">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Action 1: Generate Offer Letter */}
          <button
            onClick={() => onNavigate('generator', 'offer')}
            className="flex items-start gap-4 p-5 rounded-xl bg-white border-2 border-teal-600/30 hover:border-teal-600 hover:shadow-md transition-all text-left group cursor-pointer"
          >
            <div className="w-12 h-12 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700 group-hover:bg-teal-600 group-hover:text-white transition-colors shrink-0">
              <PlusCircle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base group-hover:text-teal-700 transition-colors">
                + Generate Offer Letter
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-snug">
                Official 7-clause letter with compensation, notice period &amp; acceptance.
              </p>
            </div>
          </button>

          {/* Action 2: Generate Promotion Letter */}
          <button
            onClick={() => onNavigate('generator', 'promotion')}
            className="flex items-start gap-4 p-5 rounded-xl bg-white border-2 border-blue-600/30 hover:border-blue-600 hover:shadow-md transition-all text-left group cursor-pointer"
          >
            <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700 group-hover:bg-blue-600 group-hover:text-white transition-colors shrink-0">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base group-hover:text-blue-700 transition-colors">
                + Generate Promotion Letter
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-snug">
                Formal recognition letter with new designation, effective date &amp; duties.
              </p>
            </div>
          </button>

          {/* Action 3: View Letter History */}
          <button
            onClick={() => onNavigate('history')}
            className="flex items-start gap-4 p-5 rounded-xl bg-white border border-slate-200 hover:border-slate-400 hover:shadow-md transition-all text-left group cursor-pointer"
          >
            <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 group-hover:bg-slate-800 group-hover:text-white transition-colors shrink-0">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base group-hover:text-slate-800 transition-colors">
                View Letter History
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-snug">
                Archive of all generated letters, download PDFs, and re-send via email.
              </p>
            </div>
          </button>

          {/* Action 4: Employee Directory */}
          <button
            onClick={() => onNavigate('employees')}
            className="flex items-start gap-4 p-5 rounded-xl bg-white border border-slate-200 hover:border-slate-400 hover:shadow-md transition-all text-left group cursor-pointer"
          >
            <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 group-hover:bg-slate-800 group-hover:text-white transition-colors shrink-0">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base group-hover:text-slate-800 transition-colors">
                Employee Directory
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-snug">
                Manage employee profiles, CTC details, and generate documents per staff.
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* Main Content Split: Recent Letters & Fast Document Shortcuts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Recent Generated Letters Table (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Recent Letter Activity</h3>
              <p className="text-xs text-slate-500">Official documents generated for Emsurg Healthcare personnel</p>
            </div>
            <button
              onClick={() => onNavigate('history')}
              className="text-xs font-semibold text-teal-700 hover:text-teal-800 inline-flex items-center gap-1 cursor-pointer"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-slate-100 overflow-x-auto">
            {recentDocuments.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-sm">
                No documents generated yet. Use the actions above to generate your first letter.
              </div>
            ) : (
              recentDocuments.map((doc) => {
                const badgeColor =
                  doc.documentType === 'offer'
                    ? 'bg-blue-50 text-blue-700 border-blue-200'
                    : doc.documentType === 'promotion'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : doc.documentType === 'appointment'
                    ? 'bg-teal-50 text-teal-700 border-teal-200'
                    : 'bg-purple-50 text-purple-700 border-purple-200';

                return (
                  <div key={doc.id} className="p-4 sm:px-6 hover:bg-slate-50/80 transition-colors flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 text-[11px] font-semibold rounded border uppercase tracking-wider ${badgeColor}`}>
                          {doc.documentType}
                        </span>
                        <span className="text-xs font-mono text-slate-500">
                          {doc.referenceNo}
                        </span>
                        <span className="text-xs text-slate-400">• {formatDisplayDate(doc.dateGenerated)}</span>
                      </div>
                      <h4 className="font-bold text-slate-900 text-sm mt-1 truncate">
                        {doc.employeeName}
                      </h4>
                      <p className="text-xs text-slate-500 truncate">
                        {doc.designation}
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        title="View Document"
                        onClick={() => onViewDocument(doc)}
                        className="p-1.5 rounded-lg text-slate-600 hover:text-teal-700 hover:bg-teal-50 transition-colors cursor-pointer"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        title="Download PDF"
                        onClick={() => onDownloadPdf(doc)}
                        className="p-1.5 rounded-lg text-slate-600 hover:text-blue-700 hover:bg-blue-50 transition-colors cursor-pointer"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      <button
                        title="Send via Email"
                        onClick={() => onEmailDocument(doc)}
                        className="p-1.5 rounded-lg text-slate-600 hover:text-purple-700 hover:bg-purple-50 transition-colors cursor-pointer"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right: Template Center & Compliance Info */}
        <div className="space-y-4">
          {/* Official Document Templates */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
            <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider mb-3">
              Official Templates
            </h3>
            <div className="space-y-2.5">
              <button
                onClick={() => onNavigate('generator', 'offer')}
                className="w-full text-left p-3 rounded-lg border border-slate-200 hover:border-teal-500 hover:bg-teal-50/40 transition-colors flex items-center justify-between group cursor-pointer"
              >
                <div>
                  <h4 className="text-xs font-bold text-slate-800 group-hover:text-teal-700">1. Offer Letter</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">7 core clauses + Acceptance section</p>
                </div>
                <span className="text-xs font-semibold text-teal-700 group-hover:translate-x-0.5 transition-transform">→</span>
              </button>

              <button
                onClick={() => onNavigate('generator', 'promotion')}
                className="w-full text-left p-3 rounded-lg border border-slate-200 hover:border-teal-500 hover:bg-teal-50/40 transition-colors flex items-center justify-between group cursor-pointer"
              >
                <div>
                  <h4 className="text-xs font-bold text-slate-800 group-hover:text-teal-700">2. Promotion Letter</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">New role, duties, effective date</p>
                </div>
                <span className="text-xs font-semibold text-teal-700 group-hover:translate-x-0.5 transition-transform">→</span>
              </button>

              <button
                onClick={() => onNavigate('generator', 'appointment')}
                className="w-full text-left p-3 rounded-lg border border-slate-200 hover:border-teal-500 hover:bg-teal-50/40 transition-colors flex items-center justify-between group cursor-pointer"
              >
                <div>
                  <h4 className="text-xs font-bold text-slate-800 group-hover:text-teal-700">3. Appointment Letter</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">10 comprehensive statutory clauses</p>
                </div>
                <span className="text-xs font-semibold text-teal-700 group-hover:translate-x-0.5 transition-transform">→</span>
              </button>

              <button
                onClick={() => onNavigate('generator', 'relieving')}
                className="w-full text-left p-3 rounded-lg border border-slate-200 hover:border-teal-500 hover:bg-teal-50/40 transition-colors flex items-center justify-between group cursor-pointer"
              >
                <div>
                  <h4 className="text-xs font-bold text-slate-800 group-hover:text-teal-700">4. Relieving Letter</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">Experience &amp; No Liabilities clearance</p>
                </div>
                <span className="text-xs font-semibold text-teal-700 group-hover:translate-x-0.5 transition-transform">→</span>
              </button>
            </div>
          </div>

          {/* Legal Compliance Notice */}
          <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 text-xs text-slate-600 space-y-2">
            <div className="flex items-center gap-1.5 font-bold text-slate-800">
              <Shield className="w-4 h-4 text-teal-600" />
              <span>Verbatim Template Lock Active</span>
            </div>
            <p className="leading-relaxed">
              All employee documents retain the verbatim legal wording and statutory provisions as approved by Emsurg Healthcare India Pvt. Ltd. Legal &amp; Compliance.
            </p>
            <div className="pt-2 border-t border-slate-200 text-[11px] text-slate-500">
              Authorized Signatory: <strong>Swarnali Dey</strong> (GM Admin &amp; HR)
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
