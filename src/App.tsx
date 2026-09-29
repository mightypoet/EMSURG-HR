import React, { useState, useEffect } from 'react';
import { 
  Employee, 
  DocumentRecord, 
  DocumentType, 
  CompanySettings, 
  EmailLog 
} from './types';
import { 
  initialEmployees, 
  initialDocumentHistory, 
  initialEmailLogs, 
  defaultCompanySettings 
} from './data/initialData';
import { Header, ActiveTab } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { EmployeeDirectory } from './components/EmployeeDirectory';
import { LetterGenerator } from './components/LetterGenerator';
import { LetterHistory } from './components/LetterHistory';
import { EmailCenter, SendEmailModal } from './components/EmailCenter';
import { SettingsView } from './components/SettingsView';
import { DocumentViewModal } from './components/DocumentViewModal';
import { exportDocumentToPdf } from './utils/pdfExport';
import { Building2, ShieldCheck, HeartPulse } from 'lucide-react';

export default function App() {
  // Persistent state in LocalStorage
  const [employees, setEmployees] = useState<Employee[]>(() => {
    try {
      const saved = localStorage.getItem('emsurg_employees');
      return saved ? JSON.parse(saved) : initialEmployees;
    } catch {
      return initialEmployees;
    }
  });

  const [documents, setDocuments] = useState<DocumentRecord[]>(() => {
    try {
      const saved = localStorage.getItem('emsurg_documents');
      return saved ? JSON.parse(saved) : initialDocumentHistory;
    } catch {
      return initialDocumentHistory;
    }
  });

  const [emailLogs, setEmailLogs] = useState<EmailLog[]>(() => {
    try {
      const saved = localStorage.getItem('emsurg_email_logs');
      return saved ? JSON.parse(saved) : initialEmailLogs;
    } catch {
      return initialEmailLogs;
    }
  });

  const [companySettings, setCompanySettings] = useState<CompanySettings>(() => {
    try {
      const saved = localStorage.getItem('emsurg_settings');
      if (!saved) return defaultCompanySettings;
      const parsed = JSON.parse(saved);
      // If user had previous placeholder CIN or address from earlier version, update to new preset
      if (parsed.cin === 'U33110HR2018PTC075421' || !parsed.website) {
        return {
          ...defaultCompanySettings,
          ...parsed,
          addressLine1: parsed.addressLine1?.includes('Sector 18') ? defaultCompanySettings.addressLine1 : parsed.addressLine1,
          cityStateZip: parsed.cityStateZip?.includes('Gurugram') ? defaultCompanySettings.cityStateZip : parsed.cityStateZip,
          cin: parsed.cin === 'U33110HR2018PTC075421' ? defaultCompanySettings.cin : parsed.cin,
          phone: parsed.phone?.includes('0124') ? defaultCompanySettings.phone : parsed.phone,
          website: parsed.website || defaultCompanySettings.website,
        };
      }
      return { ...defaultCompanySettings, ...parsed };
    } catch {
      return defaultCompanySettings;
    }
  });

  // Navigation State
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [generatorType, setGeneratorType] = useState<DocumentType>('offer');
  const [employeeForLetter, setEmployeeForLetter] = useState<Employee | null>(null);

  // Modals
  const [viewingDoc, setViewingDoc] = useState<DocumentRecord | null>(null);
  const [emailingDoc, setEmailingDoc] = useState<DocumentRecord | null>(null);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('emsurg_employees', JSON.stringify(employees));
  }, [employees]);

  useEffect(() => {
    localStorage.setItem('emsurg_documents', JSON.stringify(documents));
  }, [documents]);

  useEffect(() => {
    localStorage.setItem('emsurg_email_logs', JSON.stringify(emailLogs));
  }, [emailLogs]);

  useEffect(() => {
    localStorage.setItem('emsurg_settings', JSON.stringify(companySettings));
  }, [companySettings]);

  // Employee Handlers
  const handleAddEmployee = (emp: Employee) => {
    setEmployees((prev) => [emp, ...prev]);
  };

  const handleUpdateEmployee = (updated: Employee) => {
    setEmployees((prev) => prev.map((e) => (e.id === updated.id ? updated : e)));
  };

  const handleDeleteEmployee = (empId: string) => {
    setEmployees((prev) => prev.filter((e) => e.id !== empId));
  };

  // Document Handlers
  const handleSaveDocument = (newDoc: DocumentRecord) => {
    setDocuments((prev) => {
      const existingIdx = prev.findIndex((d) => d.id === newDoc.id);
      if (existingIdx >= 0) {
        const copy = [...prev];
        copy[existingIdx] = newDoc;
        return copy;
      }
      return [newDoc, ...prev];
    });
  };

  const handleDeleteDocument = (docId: string) => {
    setDocuments((prev) => prev.filter((d) => d.id !== docId));
  };

  // Launch letter generator for an employee
  const handleGenerateForEmployee = (emp: Employee, docType: DocumentType) => {
    setGeneratorType(docType);
    setEmployeeForLetter(emp);
    setActiveTab('generator');
  };

  // Direct download PDF from list/dashboard
  const handleDownloadDocPdf = async (doc: DocumentRecord) => {
    // If modal is viewing it or not, open viewer or download
    setViewingDoc(doc);
  };

  // Email Document
  const handleTriggerEmailDoc = (doc: DocumentRecord) => {
    setEmailingDoc(doc);
    setIsEmailModalOpen(true);
  };

  // Email Success Callback
  const handleEmailSuccess = (log: EmailLog, docId?: string) => {
    setEmailLogs((prev) => [log, ...prev]);
    if (docId) {
      setDocuments((prev) =>
        prev.map((d) => (d.id === docId ? { ...d, status: 'Emailed' } : d))
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#F0F7FA]/70 flex flex-col text-slate-800 font-sans">
      {/* Official Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onNewLetterClick={() => {
          setGeneratorType('offer');
          setEmployeeForLetter(null);
          setActiveTab('generator');
        }}
      />

      {/* Main Body View */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' && (
          <Dashboard
            employees={employees}
            documents={documents}
            onNavigate={(tab, docType) => {
              if (docType) setGeneratorType(docType);
              setActiveTab(tab);
            }}
            onViewDocument={(doc) => setViewingDoc(doc)}
            onEmailDocument={handleTriggerEmailDoc}
            onDownloadPdf={handleDownloadDocPdf}
          />
        )}

        {activeTab === 'employees' && (
          <EmployeeDirectory
            employees={employees}
            documents={documents}
            onAddEmployee={handleAddEmployee}
            onUpdateEmployee={handleUpdateEmployee}
            onDeleteEmployee={handleDeleteEmployee}
            onGenerateDocumentForEmployee={handleGenerateForEmployee}
          />
        )}

        {activeTab === 'generator' && (
          <LetterGenerator
            initialType={generatorType}
            initialEmployee={employeeForLetter}
            employees={employees}
            companySettings={companySettings}
            onUpdateCompanySettings={setCompanySettings}
            onSaveDocument={handleSaveDocument}
            onOpenEmailModal={handleTriggerEmailDoc}
          />
        )}

        {activeTab === 'history' && (
          <LetterHistory
            documents={documents}
            onViewDocument={(doc) => setViewingDoc(doc)}
            onDownloadPdf={handleDownloadDocPdf}
            onEmailDocument={handleTriggerEmailDoc}
            onDeleteDocument={handleDeleteDocument}
          />
        )}

        {activeTab === 'email' && (
          <EmailCenter
            emailLogs={emailLogs}
            documents={documents}
            companySettings={companySettings}
            onSendEmail={handleEmailSuccess}
            onOpenSendModal={() => {
              setEmailingDoc(documents[0] || null);
              setIsEmailModalOpen(true);
            }}
          />
        )}

        {activeTab === 'settings' && (
          <SettingsView
            settings={companySettings}
            onUpdateSettings={setCompanySettings}
          />
        )}
      </main>

      {/* Corporate HR Footer */}
      <footer className="bg-white border-t border-slate-200/80 text-slate-500 text-xs py-5 mt-auto no-print shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-600">
              <Building2 className="w-3.5 h-3.5" />
            </div>
            <span className="font-semibold text-slate-800">
              Emsurg Healthcare India Pvt. Ltd.
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-slate-600">Admin &amp; HR Department</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-slate-500">
            <span>CIN: <span className="font-mono text-slate-700">{companySettings.cin}</span></span>
            <span>Authorized Signatory: <strong className="text-slate-700">{companySettings.signatoryName}</strong></span>
          </div>
        </div>
      </footer>

      {/* Document Full View Modal */}
      <DocumentViewModal
        documentRecord={viewingDoc}
        onClose={() => setViewingDoc(null)}
        companySettings={companySettings}
        onEmailDocument={handleTriggerEmailDoc}
      />

      {/* Email Dispatch Modal */}
      <SendEmailModal
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
        documentRecord={emailingDoc}
        documents={documents}
        companySettings={companySettings}
        onSendSuccess={handleEmailSuccess}
      />
    </div>
  );
}
