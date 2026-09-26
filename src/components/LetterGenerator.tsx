import React, { useState, useEffect } from 'react';
import { 
  Employee, 
  DocumentType, 
  CompanySettings, 
  DocumentRecord, 
  OfferLetterData, 
  PromotionLetterData, 
  AppointmentLetterData, 
  RelievingLetterData 
} from '../types';
import { LetterPreviewA4 } from './LetterPreviewA4';
import { exportDocumentToPdf, generateDocumentFileName } from '../utils/pdfExport';
import { 
  FileText, 
  Download, 
  Printer, 
  Mail, 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  Eye, 
  Sparkles, 
  UserCheck, 
  AlertCircle, 
  CheckCircle2, 
  Copy, 
  Building,
  RotateCcw,
  Check,
  ChevronDown,
  ShieldCheck
} from 'lucide-react';
import { formatIndianCurrency } from '../utils/numberToWords';
import { defaultCompanySettings } from '../data/initialData';

interface LetterGeneratorProps {
  initialType?: DocumentType;
  initialEmployee?: Employee | null;
  employees: Employee[];
  companySettings: CompanySettings;
  onUpdateCompanySettings?: (settings: CompanySettings) => void;
  onSaveDocument: (record: DocumentRecord) => void;
  onOpenEmailModal: (doc: DocumentRecord) => void;
}

export const LetterGenerator: React.FC<LetterGeneratorProps> = ({
  initialType = 'offer',
  initialEmployee = null,
  employees,
  companySettings,
  onUpdateCompanySettings,
  onSaveDocument,
  onOpenEmailModal,
}) => {
  const [docType, setDocType] = useState<DocumentType>(initialType);
  const [selectedEmpId, setSelectedEmpId] = useState<string>(initialEmployee?.id || '');
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [showLetterhead, setShowLetterhead] = useState<boolean>(true);
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState<boolean>(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const todayStr = new Date().toISOString().split('T')[0];

  // Form states for each document type
  const [offerForm, setOfferForm] = useState<OfferLetterData>({
    letterDate: todayStr,
    employeeName: '',
    employeeAddress: '',
    employeeEmail: '',
    designation: '',
    joiningDate: todayStr,
    workLocation: 'Gurugram Corporate Office',
    reportingManager: 'Swarnali Dey, General Manager Admin & HR',
    ctcAmount: 850000,
    ctcLabel: '(CTC)',
    probationPeriod: 'period of 6 months',
    responsibilities: 'medical device quality compliance, technical sales coordination, clinical protocol verification, and hospital client liaison operations',
    noticePeriod: '30 days',
    referenceNo: `${companySettings.letterRefPrefix}/${new Date().getFullYear()}/OL-${Math.floor(100 + Math.random() * 900)}`,
  });

  const [promotionForm, setPromotionForm] = useState<PromotionLetterData>({
    letterDate: todayStr,
    employeeName: '',
    employeeAddress: '',
    employeeEmail: '',
    currentDesignation: '',
    newDesignation: '',
    effectiveDate: todayStr,
    responsibilities: 'leading departmental clinical affairs, managing medical device client protocols, supervising regional team members, and ensuring compliance with healthcare statutory regulations',
    newCtc: 1200000,
    reportingManager: companySettings.signatoryName,
    referenceNo: `${companySettings.letterRefPrefix}/${new Date().getFullYear()}/PL-${Math.floor(100 + Math.random() * 900)}`,
  });

  const [appointmentForm, setAppointmentForm] = useState<AppointmentLetterData>({
    letterDate: todayStr,
    employeeName: '',
    employeeAddress: '',
    employeeEmail: '',
    designation: '',
    effectiveDate: todayStr,
    workLocation: 'Gurugram Corporate Office',
    reportingManager: 'Swarnali Dey, General Manager Admin & HR',
    responsibilities: 'technical support for hospital biomedical equipment, field servicing, customer training, and regulatory documentation',
    ctcAmount: 900000,
    ctcLabel: '(CTC)',
    probationPeriod: '6 months',
    noticePeriod: '30 days',
    referenceNo: `${companySettings.letterRefPrefix}/${new Date().getFullYear()}/AL-${Math.floor(100 + Math.random() * 900)}`,
  });

  const [relievingForm, setRelievingForm] = useState<RelievingLetterData>({
    letterDate: todayStr,
    employeeName: '',
    employeeAddress: '',
    employeeEmail: '',
    designation: '',
    fromDate: '2023-01-01',
    toDate: todayStr,
    gender: 'Male',
    referenceNo: `${companySettings.letterRefPrefix}/${new Date().getFullYear()}/RL-${Math.floor(100 + Math.random() * 900)}`,
  });

  // Prepopulate if initialEmployee or docType changes
  useEffect(() => {
    if (initialType) {
      setDocType(initialType);
    }
  }, [initialType]);

  useEffect(() => {
    if (initialEmployee) {
      populateWithEmployee(initialEmployee);
      setSelectedEmpId(initialEmployee.id);
    }
  }, [initialEmployee]);

  const populateWithEmployee = (emp: Employee) => {
    // Populate Offer Form
    setOfferForm((prev) => ({
      ...prev,
      employeeName: emp.name,
      employeeAddress: emp.address,
      employeeEmail: emp.officialEmail || emp.personalEmail,
      designation: emp.designation,
      joiningDate: emp.dateOfJoining || prev.joiningDate,
      workLocation: emp.location || prev.workLocation,
      reportingManager: emp.reportingManager || prev.reportingManager,
      ctcAmount: emp.currentCtc || prev.ctcAmount,
    }));

    // Populate Promotion Form
    setPromotionForm((prev) => ({
      ...prev,
      employeeName: emp.name,
      employeeAddress: emp.address,
      employeeEmail: emp.officialEmail || emp.personalEmail,
      currentDesignation: emp.designation,
      newDesignation: `Senior ${emp.designation.replace(/^Senior\s+/i, '')}`,
      reportingManager: emp.reportingManager || prev.reportingManager,
      newCtc: emp.currentCtc ? Math.round(emp.currentCtc * 1.2) : prev.newCtc,
    }));

    // Populate Appointment Form
    setAppointmentForm((prev) => ({
      ...prev,
      employeeName: emp.name,
      employeeAddress: emp.address,
      employeeEmail: emp.officialEmail || emp.personalEmail,
      designation: emp.designation,
      effectiveDate: emp.dateOfJoining || prev.effectiveDate,
      workLocation: emp.location || prev.workLocation,
      reportingManager: emp.reportingManager || prev.reportingManager,
      ctcAmount: emp.currentCtc || prev.ctcAmount,
    }));

    // Populate Relieving Form
    setRelievingForm((prev) => ({
      ...prev,
      employeeName: emp.name,
      employeeAddress: emp.address,
      employeeEmail: emp.officialEmail || emp.personalEmail,
      designation: emp.designation,
      fromDate: emp.dateOfJoining || prev.fromDate,
      toDate: emp.relievingDate || todayStr,
      gender: emp.gender || 'Male',
    }));

    showToast(`Loaded details for ${emp.name}`);
  };

  const handleEmployeeSelect = (empId: string) => {
    setSelectedEmpId(empId);
    const emp = employees.find((e) => e.id === empId);
    if (emp) {
      populateWithEmployee(emp);
    }
  };

  const showToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(null), 3500);
  };

  // Section 10: Validation logic
  const validateCurrentDocument = (): boolean => {
    const errs: { [key: string]: string } = {};

    if (docType === 'offer') {
      if (!offerForm.letterDate) errs.letterDate = 'Please select letter date.';
      if (!offerForm.employeeName?.trim()) errs.employeeName = "Please enter the employee's name.";
      if (!offerForm.employeeAddress?.trim()) errs.employeeAddress = "Please enter the employee's residential address.";
      if (!offerForm.designation?.trim()) errs.designation = 'Please enter position / designation.';
      if (!offerForm.joiningDate) errs.joiningDate = "Please enter the employee's joining date.";
      if (!offerForm.workLocation?.trim()) errs.workLocation = 'Please specify work location.';
      if (!offerForm.reportingManager?.trim()) errs.reportingManager = 'Please enter reporting manager name.';
      if (!offerForm.ctcAmount || Number(offerForm.ctcAmount) <= 0) errs.ctcAmount = 'Please enter valid CTC amount in INR.';
      if (!offerForm.probationPeriod?.trim()) errs.probationPeriod = 'Please specify probation period.';
      if (!offerForm.responsibilities?.trim()) errs.responsibilities = 'Please enter roles & responsibilities.';
      if (!offerForm.noticePeriod?.trim()) errs.noticePeriod = 'Please specify notice period.';
    } else if (docType === 'promotion') {
      if (!promotionForm.letterDate) errs.letterDate = 'Please select letter date.';
      if (!promotionForm.employeeName?.trim()) errs.employeeName = "Please enter the employee's name.";
      if (!promotionForm.employeeAddress?.trim()) errs.employeeAddress = "Please enter the employee's address.";
      if (!promotionForm.newDesignation?.trim()) errs.newDesignation = 'Please enter new designation.';
      if (!promotionForm.effectiveDate) errs.effectiveDate = 'Please select promotion effective date.';
      if (!promotionForm.responsibilities?.trim()) errs.responsibilities = 'Please enter new roles & responsibilities.';
    } else if (docType === 'appointment') {
      if (!appointmentForm.letterDate) errs.letterDate = 'Please select letter date.';
      if (!appointmentForm.employeeName?.trim()) errs.employeeName = "Please enter the employee's name.";
      if (!appointmentForm.employeeAddress?.trim()) errs.employeeAddress = "Please enter the employee's address.";
      if (!appointmentForm.designation?.trim()) errs.designation = 'Please enter designation.';
      if (!appointmentForm.effectiveDate) errs.effectiveDate = 'Please enter effective joining date.';
      if (!appointmentForm.workLocation?.trim()) errs.workLocation = 'Please enter work location.';
      if (!appointmentForm.reportingManager?.trim()) errs.reportingManager = 'Please enter reporting manager.';
      if (!appointmentForm.ctcAmount) errs.ctcAmount = 'Please enter annual CTC amount.';
      if (!appointmentForm.probationPeriod?.trim()) errs.probationPeriod = 'Please enter probation period.';
      if (!appointmentForm.responsibilities?.trim()) errs.responsibilities = 'Please enter scope of work / duties.';
      if (!appointmentForm.noticePeriod?.trim()) errs.noticePeriod = 'Please enter notice period.';
    } else if (docType === 'relieving') {
      if (!relievingForm.letterDate) errs.letterDate = 'Please select letter date.';
      if (!relievingForm.employeeName?.trim()) errs.employeeName = "Please enter the employee's name.";
      if (!relievingForm.designation?.trim()) errs.designation = 'Please enter designation.';
      if (!relievingForm.fromDate) errs.fromDate = 'Please enter employment start date.';
      if (!relievingForm.toDate) errs.toDate = 'Please enter relieving date.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Compile current DocumentRecord
  const createDocumentRecord = (status: 'Draft' | 'Generated' | 'Emailed' = 'Generated'): DocumentRecord => {
    let empName = '';
    let empEmail = '';
    let desig = '';
    let ref = '';
    let payload: any = null;

    if (docType === 'offer') {
      empName = offerForm.employeeName;
      empEmail = offerForm.employeeEmail;
      desig = offerForm.designation;
      ref = offerForm.referenceNo || 'OL-001';
      payload = offerForm;
    } else if (docType === 'promotion') {
      empName = promotionForm.employeeName;
      empEmail = promotionForm.employeeEmail;
      desig = promotionForm.newDesignation;
      ref = promotionForm.referenceNo || 'PL-001';
      payload = promotionForm;
    } else if (docType === 'appointment') {
      empName = appointmentForm.employeeName;
      empEmail = appointmentForm.employeeEmail;
      desig = appointmentForm.designation;
      ref = appointmentForm.referenceNo || 'AL-001';
      payload = appointmentForm;
    } else {
      empName = relievingForm.employeeName;
      empEmail = relievingForm.employeeEmail;
      desig = relievingForm.designation;
      ref = relievingForm.referenceNo || 'RL-001';
      payload = relievingForm;
    }

    const fileName = generateDocumentFileName(docType, empName);

    return {
      id: `doc-${Date.now()}`,
      documentType: docType,
      title: `${docType.toUpperCase()} Letter - ${empName}`,
      employeeId: selectedEmpId,
      employeeName: empName,
      employeeEmail: empEmail,
      designation: desig,
      dateGenerated: todayStr,
      referenceNo: ref,
      status,
      fileName,
      data: payload,
    };
  };

  // Section 11: Generate & Download PDF
  const handleDownloadPdf = async () => {
    if (!validateCurrentDocument()) {
      showToast('Please fill in all mandatory fields before downloading.');
      return;
    }

    setIsGeneratingPdf(true);
    const docRecord = createDocumentRecord('Generated');
    onSaveDocument(docRecord);

    // Identify page container IDs
    const elementIds = docType === 'offer' || docType === 'appointment' 
      ? ['doc-page-1', 'doc-page-2'] 
      : ['doc-page-1'];

    try {
      const success = await exportDocumentToPdf({
        fileName: docRecord.fileName,
        elementIds,
      });

      if (success) {
        showToast(`Downloaded: ${docRecord.fileName}`);
      }
    } catch (e) {
      console.error(e);
      window.print();
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  // Section 11: Print Action
  const handlePrint = () => {
    if (!validateCurrentDocument()) {
      showToast('Please fill in all mandatory fields before printing.');
      return;
    }
    const docRecord = createDocumentRecord('Generated');
    onSaveDocument(docRecord);
    window.print();
  };

  // Section 12: Email Action
  const handleEmailDirectly = () => {
    if (!validateCurrentDocument()) {
      showToast('Please complete required fields before emailing.');
      return;
    }
    const docRecord = createDocumentRecord('Draft');
    onSaveDocument(docRecord);
    onOpenEmailModal(docRecord);
  };

  // Copy text to clipboard
  const handleCopyText = () => {
    const el = document.getElementById('printable-document');
    if (el) {
      navigator.clipboard.writeText(el.innerText);
      showToast('Document text copied to clipboard!');
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {successToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-white text-slate-800 border border-teal-200 px-4 py-3 rounded-xl shadow-xl flex items-center gap-2.5 text-xs font-semibold animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Top Controls: Document Type Selector & Employee Auto-Populate Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Document Type Switcher Tabs */}
        <div className="flex flex-wrap gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200">
          <button
            onClick={() => setDocType('offer')}
            className={`px-3.5 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
              docType === 'offer'
                ? 'bg-teal-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            1. Offer Letter
          </button>
          <button
            onClick={() => setDocType('promotion')}
            className={`px-3.5 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
              docType === 'promotion'
                ? 'bg-teal-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            2. Promotion Letter
          </button>
          <button
            onClick={() => setDocType('appointment')}
            className={`px-3.5 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
              docType === 'appointment'
                ? 'bg-teal-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            3. Appointment Letter
          </button>
          <button
            onClick={() => setDocType('relieving')}
            className={`px-3.5 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
              docType === 'relieving'
                ? 'bg-teal-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            4. Relieving Letter
          </button>
        </div>

        {/* Smart Auto-populate Employee Dropdown */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 whitespace-nowrap">
            <UserCheck className="w-4 h-4 text-teal-600" />
            <span>Auto-populate from Employee:</span>
          </div>
          <div className="relative min-w-[200px]">
            <select
              value={selectedEmpId}
              onChange={(e) => handleEmployeeSelect(e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-teal-500 cursor-pointer"
            >
              <option value="">-- Choose Employee --</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.name} ({emp.employeeId})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Split Layout: LEFT = Form, RIGHT = Live A4 Document Preview */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* =========================================================================
            LEFT COLUMN (Form Controls): 5 cols on XL
            ========================================================================= */}
        <div className="xl:col-span-5 space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="px-5 py-3.5 bg-gradient-to-r from-sky-50 to-white border-b border-sky-100 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm tracking-tight capitalize text-slate-900">
                  {docType} Letter Parameters
                </h3>
                <p className="text-[11px] text-slate-500">
                  Fill fields below to instantly update the live A4 preview
                </p>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-teal-50 text-teal-700 border border-teal-200 font-semibold">
                Official Verbatim
              </span>
            </div>

            <div className="p-5 space-y-5 max-h-[calc(100vh-220px)] overflow-y-auto">
              {/* Reference Number */}
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between gap-3 text-xs">
                <span className="font-semibold text-slate-600">Letter Reference:</span>
                <input
                  type="text"
                  value={
                    docType === 'offer'
                      ? offerForm.referenceNo
                      : docType === 'promotion'
                      ? promotionForm.referenceNo
                      : docType === 'appointment'
                      ? appointmentForm.referenceNo
                      : relievingForm.referenceNo
                  }
                  onChange={(e) => {
                    const val = e.target.value;
                    if (docType === 'offer') setOfferForm({ ...offerForm, referenceNo: val });
                    else if (docType === 'promotion') setPromotionForm({ ...promotionForm, referenceNo: val });
                    else if (docType === 'appointment') setAppointmentForm({ ...appointmentForm, referenceNo: val });
                    else setRelievingForm({ ...relievingForm, referenceNo: val });
                  }}
                  className="font-mono text-xs bg-white border border-slate-200 rounded px-2 py-1 text-slate-800 w-48 text-right font-medium"
                />
              </div>

              {/* -------------------------------------------------------------------
                  FORM FOR OFFER LETTER
                  ------------------------------------------------------------------- */}
              {docType === 'offer' && (
                <div className="space-y-5">
                  {/* Section A: Employee Details */}
                  <div className="border border-slate-200 rounded-lg p-4 bg-white space-y-3">
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5 pb-2 border-b border-slate-100">
                      <span>A. Employee Details</span>
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Date of Letter *
                        </label>
                        <input
                          type="date"
                          value={offerForm.letterDate}
                          onChange={(e) => setOfferForm({ ...offerForm, letterDate: e.target.value })}
                          className="w-full text-xs px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500"
                        />
                        {errors.letterDate && <p className="text-[11px] text-red-600 mt-1">{errors.letterDate}</p>}
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Employee Name *
                        </label>
                        <input
                          type="text"
                          value={offerForm.employeeName}
                          onChange={(e) => setOfferForm({ ...offerForm, employeeName: e.target.value })}
                          className="w-full text-xs px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500"
                          placeholder="e.g. Kavita Menon"
                        />
                        {errors.employeeName && <p className="text-[11px] text-red-600 mt-1">{errors.employeeName}</p>}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Employee Email (for direct dispatch)
                      </label>
                      <input
                        type="email"
                        value={offerForm.employeeEmail}
                        onChange={(e) => setOfferForm({ ...offerForm, employeeEmail: e.target.value })}
                        className="w-full text-xs px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500"
                        placeholder="e.g. kavita.menon.hr@gmail.com"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Employee Address *
                      </label>
                      <textarea
                        rows={2}
                        value={offerForm.employeeAddress}
                        onChange={(e) => setOfferForm({ ...offerForm, employeeAddress: e.target.value })}
                        className="w-full text-xs px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500"
                        placeholder="e.g. 701, Sapphire Heights, Powai, Mumbai, Maharashtra 400076"
                      />
                      {errors.employeeAddress && <p className="text-[11px] text-red-600 mt-1">{errors.employeeAddress}</p>}
                    </div>
                  </div>

                  {/* Section B: Employment Details */}
                  <div className="border border-slate-200 rounded-lg p-4 bg-white space-y-3">
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5 pb-2 border-b border-slate-100">
                      <span>B. Employment Details</span>
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Position / Designation *
                        </label>
                        <input
                          type="text"
                          value={offerForm.designation}
                          onChange={(e) => setOfferForm({ ...offerForm, designation: e.target.value })}
                          className="w-full text-xs px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500"
                          placeholder="e.g. Biomedical Engineer"
                        />
                        {errors.designation && <p className="text-[11px] text-red-600 mt-1">{errors.designation}</p>}
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Date of Joining *
                        </label>
                        <input
                          type="date"
                          value={offerForm.joiningDate}
                          onChange={(e) => setOfferForm({ ...offerForm, joiningDate: e.target.value })}
                          className="w-full text-xs px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500"
                        />
                        {errors.joiningDate && <p className="text-[11px] text-red-600 mt-1">{errors.joiningDate}</p>}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Work Location *
                        </label>
                        <input
                          type="text"
                          value={offerForm.workLocation}
                          onChange={(e) => setOfferForm({ ...offerForm, workLocation: e.target.value })}
                          className="w-full text-xs px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500"
                          placeholder="e.g. Gurugram Corporate Office"
                        />
                        {errors.workLocation && <p className="text-[11px] text-red-600 mt-1">{errors.workLocation}</p>}
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Reporting Manager *
                        </label>
                        <input
                          type="text"
                          value={offerForm.reportingManager}
                          onChange={(e) => setOfferForm({ ...offerForm, reportingManager: e.target.value })}
                          className="w-full text-xs px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500"
                          placeholder="e.g. Dr. Vivek Malhotra, Director"
                        />
                        {errors.reportingManager && <p className="text-[11px] text-red-600 mt-1">{errors.reportingManager}</p>}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Roles &amp; Responsibilities *
                      </label>
                      <textarea
                        rows={2}
                        value={offerForm.responsibilities}
                        onChange={(e) => setOfferForm({ ...offerForm, responsibilities: e.target.value })}
                        className="w-full text-xs px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500"
                        placeholder="e.g. activities related to medical device marketing, client hospital demos..."
                      />
                      {errors.responsibilities && <p className="text-[11px] text-red-600 mt-1">{errors.responsibilities}</p>}
                    </div>
                  </div>

                  {/* Section C: Compensation */}
                  <div className="border border-slate-200 rounded-lg p-4 bg-white space-y-3">
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5 pb-2 border-b border-slate-100">
                      <span>C. Compensation</span>
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Total CTC (INR) *
                        </label>
                        <input
                          type="number"
                          value={offerForm.ctcAmount}
                          onChange={(e) => setOfferForm({ ...offerForm, ctcAmount: parseFloat(e.target.value) || 0 })}
                          className="w-full text-xs px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 font-semibold"
                          placeholder="e.g. 850000"
                        />
                        <p className="text-[11px] text-teal-700 font-semibold mt-1">
                          Formatted: ₹{formatIndianCurrency(offerForm.ctcAmount)} per annum
                        </p>
                        {errors.ctcAmount && <p className="text-[11px] text-red-600 mt-1">{errors.ctcAmount}</p>}
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          CTC Notation
                        </label>
                        <input
                          type="text"
                          value={offerForm.ctcLabel}
                          onChange={(e) => setOfferForm({ ...offerForm, ctcLabel: e.target.value })}
                          className="w-full text-xs px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500"
                          placeholder="e.g. (CTC)"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Section D: Employment Terms */}
                  <div className="border border-slate-200 rounded-lg p-4 bg-white space-y-3">
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5 pb-2 border-b border-slate-100">
                      <span>D. Employment Terms</span>
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Probation Period *
                        </label>
                        <input
                          type="text"
                          value={offerForm.probationPeriod}
                          onChange={(e) => setOfferForm({ ...offerForm, probationPeriod: e.target.value })}
                          className="w-full text-xs px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500"
                          placeholder="e.g. period of 6 months"
                        />
                        {errors.probationPeriod && <p className="text-[11px] text-red-600 mt-1">{errors.probationPeriod}</p>}
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Notice Period *
                        </label>
                        <input
                          type="text"
                          value={offerForm.noticePeriod}
                          onChange={(e) => setOfferForm({ ...offerForm, noticePeriod: e.target.value })}
                          className="w-full text-xs px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500"
                          placeholder="e.g. 30 days"
                        />
                        {errors.noticePeriod && <p className="text-[11px] text-red-600 mt-1">{errors.noticePeriod}</p>}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* -------------------------------------------------------------------
                  FORM FOR PROMOTION LETTER
                  ------------------------------------------------------------------- */}
              {docType === 'promotion' && (
                <div className="space-y-4">
                  <div className="border border-slate-200 rounded-lg p-4 bg-white space-y-3">
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider pb-2 border-b border-slate-100">
                      Employee Details
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Date of Letter *
                        </label>
                        <input
                          type="date"
                          value={promotionForm.letterDate}
                          onChange={(e) => setPromotionForm({ ...promotionForm, letterDate: e.target.value })}
                          className="w-full text-xs px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500"
                        />
                        {errors.letterDate && <p className="text-[11px] text-red-600 mt-1">{errors.letterDate}</p>}
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Employee Name *
                        </label>
                        <input
                          type="text"
                          value={promotionForm.employeeName}
                          onChange={(e) => setPromotionForm({ ...promotionForm, employeeName: e.target.value })}
                          className="w-full text-xs px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500"
                          placeholder="e.g. Dr. Rajesh Sharma"
                        />
                        {errors.employeeName && <p className="text-[11px] text-red-600 mt-1">{errors.employeeName}</p>}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Employee Email
                      </label>
                      <input
                        type="email"
                        value={promotionForm.employeeEmail}
                        onChange={(e) => setPromotionForm({ ...promotionForm, employeeEmail: e.target.value })}
                        className="w-full text-xs px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Employee Address *
                      </label>
                      <textarea
                        rows={2}
                        value={promotionForm.employeeAddress}
                        onChange={(e) => setPromotionForm({ ...promotionForm, employeeAddress: e.target.value })}
                        className="w-full text-xs px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500"
                      />
                      {errors.employeeAddress && <p className="text-[11px] text-red-600 mt-1">{errors.employeeAddress}</p>}
                    </div>
                  </div>

                  <div className="border border-slate-200 rounded-lg p-4 bg-white space-y-3">
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider pb-2 border-b border-slate-100">
                      Promotion Details
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          New Designation / Title *
                        </label>
                        <input
                          type="text"
                          value={promotionForm.newDesignation}
                          onChange={(e) => setPromotionForm({ ...promotionForm, newDesignation: e.target.value })}
                          className="w-full text-xs px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 font-semibold"
                          placeholder="e.g. Principal Clinical Specialist"
                        />
                        {errors.newDesignation && <p className="text-[11px] text-red-600 mt-1">{errors.newDesignation}</p>}
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Effective Date *
                        </label>
                        <input
                          type="date"
                          value={promotionForm.effectiveDate}
                          onChange={(e) => setPromotionForm({ ...promotionForm, effectiveDate: e.target.value })}
                          className="w-full text-xs px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500"
                        />
                        {errors.effectiveDate && <p className="text-[11px] text-red-600 mt-1">{errors.effectiveDate}</p>}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        New Role / Responsibilities (1. Position and Duties) *
                      </label>
                      <textarea
                        rows={3}
                        value={promotionForm.responsibilities}
                        onChange={(e) => setPromotionForm({ ...promotionForm, responsibilities: e.target.value })}
                        className="w-full text-xs px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500"
                        placeholder="e.g. leading clinical trials, managing medical training programs..."
                      />
                      {errors.responsibilities && <p className="text-[11px] text-red-600 mt-1">{errors.responsibilities}</p>}
                    </div>
                  </div>
                </div>
              )}

              {/* -------------------------------------------------------------------
                  FORM FOR APPOINTMENT LETTER
                  ------------------------------------------------------------------- */}
              {docType === 'appointment' && (
                <div className="space-y-4">
                  <div className="border border-slate-200 rounded-lg p-4 bg-white space-y-3">
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider pb-2 border-b border-slate-100">
                      Appointee Details
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Date of Letter *
                        </label>
                        <input
                          type="date"
                          value={appointmentForm.letterDate}
                          onChange={(e) => setAppointmentForm({ ...appointmentForm, letterDate: e.target.value })}
                          className="w-full text-xs px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500"
                        />
                        {errors.letterDate && <p className="text-[11px] text-red-600 mt-1">{errors.letterDate}</p>}
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Appointee Name *
                        </label>
                        <input
                          type="text"
                          value={appointmentForm.employeeName}
                          onChange={(e) => setAppointmentForm({ ...appointmentForm, employeeName: e.target.value })}
                          className="w-full text-xs px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500"
                        />
                        {errors.employeeName && <p className="text-[11px] text-red-600 mt-1">{errors.employeeName}</p>}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Residential Address *
                      </label>
                      <textarea
                        rows={2}
                        value={appointmentForm.employeeAddress}
                        onChange={(e) => setAppointmentForm({ ...appointmentForm, employeeAddress: e.target.value })}
                        className="w-full text-xs px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500"
                      />
                      {errors.employeeAddress && <p className="text-[11px] text-red-600 mt-1">{errors.employeeAddress}</p>}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Designation *
                        </label>
                        <input
                          type="text"
                          value={appointmentForm.designation}
                          onChange={(e) => setAppointmentForm({ ...appointmentForm, designation: e.target.value })}
                          className="w-full text-xs px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500"
                        />
                        {errors.designation && <p className="text-[11px] text-red-600 mt-1">{errors.designation}</p>}
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Effective Joining Date *
                        </label>
                        <input
                          type="date"
                          value={appointmentForm.effectiveDate}
                          onChange={(e) => setAppointmentForm({ ...appointmentForm, effectiveDate: e.target.value })}
                          className="w-full text-xs px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500"
                        />
                        {errors.effectiveDate && <p className="text-[11px] text-red-600 mt-1">{errors.effectiveDate}</p>}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Work Location *
                        </label>
                        <input
                          type="text"
                          value={appointmentForm.workLocation}
                          onChange={(e) => setAppointmentForm({ ...appointmentForm, workLocation: e.target.value })}
                          className="w-full text-xs px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500"
                        />
                        {errors.workLocation && <p className="text-[11px] text-red-600 mt-1">{errors.workLocation}</p>}
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Reporting Manager *
                        </label>
                        <input
                          type="text"
                          value={appointmentForm.reportingManager}
                          onChange={(e) => setAppointmentForm({ ...appointmentForm, reportingManager: e.target.value })}
                          className="w-full text-xs px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500"
                        />
                        {errors.reportingManager && <p className="text-[11px] text-red-600 mt-1">{errors.reportingManager}</p>}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Annual CTC (INR) *
                        </label>
                        <input
                          type="number"
                          value={appointmentForm.ctcAmount}
                          onChange={(e) => setAppointmentForm({ ...appointmentForm, ctcAmount: parseFloat(e.target.value) || 0 })}
                          className="w-full text-xs px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 font-semibold"
                        />
                        {errors.ctcAmount && <p className="text-[11px] text-red-600 mt-1">{errors.ctcAmount}</p>}
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Probation Period *
                        </label>
                        <input
                          type="text"
                          value={appointmentForm.probationPeriod}
                          onChange={(e) => setAppointmentForm({ ...appointmentForm, probationPeriod: e.target.value })}
                          className="w-full text-xs px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500"
                          placeholder="e.g. 6 months"
                        />
                        {errors.probationPeriod && <p className="text-[11px] text-red-600 mt-1">{errors.probationPeriod}</p>}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Scope of Work Activities *
                      </label>
                      <textarea
                        rows={2}
                        value={appointmentForm.responsibilities}
                        onChange={(e) => setAppointmentForm({ ...appointmentForm, responsibilities: e.target.value })}
                        className="w-full text-xs px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500"
                      />
                      {errors.responsibilities && <p className="text-[11px] text-red-600 mt-1">{errors.responsibilities}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Notice Period *
                      </label>
                      <input
                        type="text"
                        value={appointmentForm.noticePeriod}
                        onChange={(e) => setAppointmentForm({ ...appointmentForm, noticePeriod: e.target.value })}
                        className="w-full text-xs px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500"
                        placeholder="e.g. 30 days"
                      />
                      {errors.noticePeriod && <p className="text-[11px] text-red-600 mt-1">{errors.noticePeriod}</p>}
                    </div>
                  </div>
                </div>
              )}

              {/* -------------------------------------------------------------------
                  FORM FOR RELIEVING LETTER
                  ------------------------------------------------------------------- */}
              {docType === 'relieving' && (
                <div className="space-y-4">
                  <div className="border border-slate-200 rounded-lg p-4 bg-white space-y-3">
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider pb-2 border-b border-slate-100">
                      Relieving / Experience Certificate
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Date of Certificate *
                        </label>
                        <input
                          type="date"
                          value={relievingForm.letterDate}
                          onChange={(e) => setRelievingForm({ ...relievingForm, letterDate: e.target.value })}
                          className="w-full text-xs px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500"
                        />
                        {errors.letterDate && <p className="text-[11px] text-red-600 mt-1">{errors.letterDate}</p>}
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Employee Name *
                        </label>
                        <input
                          type="text"
                          value={relievingForm.employeeName}
                          onChange={(e) => setRelievingForm({ ...relievingForm, employeeName: e.target.value })}
                          className="w-full text-xs px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500"
                        />
                        {errors.employeeName && <p className="text-[11px] text-red-600 mt-1">{errors.employeeName}</p>}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Designation at Leaving *
                        </label>
                        <input
                          type="text"
                          value={relievingForm.designation}
                          onChange={(e) => setRelievingForm({ ...relievingForm, designation: e.target.value })}
                          className="w-full text-xs px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500"
                        />
                        {errors.designation && <p className="text-[11px] text-red-600 mt-1">{errors.designation}</p>}
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Gender (for grammar clauses)
                        </label>
                        <select
                          value={relievingForm.gender}
                          onChange={(e) => setRelievingForm({ ...relievingForm, gender: e.target.value as any })}
                          className="w-full text-xs px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500"
                        >
                          <option value="Male">Male (his / him)</option>
                          <option value="Female">Female (her / her)</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          From Date (Start of Tenure) *
                        </label>
                        <input
                          type="date"
                          value={relievingForm.fromDate}
                          onChange={(e) => setRelievingForm({ ...relievingForm, fromDate: e.target.value })}
                          className="w-full text-xs px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500"
                        />
                        {errors.fromDate && <p className="text-[11px] text-red-600 mt-1">{errors.fromDate}</p>}
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          To Date (Last Working Day) *
                        </label>
                        <input
                          type="date"
                          value={relievingForm.toDate}
                          onChange={(e) => setRelievingForm({ ...relievingForm, toDate: e.target.value })}
                          className="w-full text-xs px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500"
                        />
                        {errors.toDate && <p className="text-[11px] text-red-600 mt-1">{errors.toDate}</p>}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Authorized Signatory & Seal Stamp Controls */}
              <div className="border border-slate-200 rounded-lg p-4 bg-white space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
                    <span>Authorized Signatory &amp; Seal</span>
                  </h4>
                  <span className="text-[10px] text-teal-700 font-semibold bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                    {companySettings.signatoryName}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {/* Toggle Digital Signature */}
                  <div className="p-2.5 rounded-lg border border-slate-200 bg-slate-50/70 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold text-slate-800">Affix Signature</p>
                      <p className="text-[10px] text-slate-500">Signatory: {companySettings.signatoryName.split(' ')[0]}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={companySettings.showSignature}
                        onChange={(e) => {
                          onUpdateCompanySettings?.({
                            ...companySettings,
                            showSignature: e.target.checked,
                          });
                          showToast(e.target.checked ? 'Digital signature affixed' : 'Signature disabled');
                        }}
                        className="sr-only peer"
                      />
                      <div className="w-8 h-4 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-teal-600"></div>
                    </label>
                  </div>

                  {/* Toggle Seal Stamp */}
                  <div className="p-2.5 rounded-lg border border-slate-200 bg-slate-50/70 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold text-slate-800">Affix Seal Stamp</p>
                      <p className="text-[10px] text-slate-500">Official Company Seal</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={companySettings.showStamp}
                        onChange={(e) => {
                          onUpdateCompanySettings?.({
                            ...companySettings,
                            showStamp: e.target.checked,
                          });
                          showToast(e.target.checked ? 'Company seal affixed' : 'Seal stamp disabled');
                        }}
                        className="sr-only peer"
                      />
                      <div className="w-8 h-4 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-teal-600"></div>
                    </label>
                  </div>
                </div>

                {/* Active Signature & Stamp Quick Upload / Preview */}
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-10 bg-white rounded border border-slate-200 flex items-center justify-center p-1 overflow-hidden">
                      {companySettings.signatureImage ? (
                        <img src={companySettings.signatureImage} alt="Sig" className="max-h-full max-w-full object-contain" />
                      ) : (
                        <span className="text-[9px] text-slate-400">No Sig</span>
                      )}
                    </div>
                    <div className="text-[11px] leading-tight">
                      <span className="font-semibold text-slate-700 block">Digital Signature</span>
                      <span className="text-slate-400 text-[10px]">
                        {companySettings.showSignature ? 'Active on document' : 'Disabled'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <label className="cursor-pointer">
                      <span className="px-2.5 py-1 text-[11px] font-semibold bg-white border border-slate-200 hover:border-teal-400 hover:text-teal-700 rounded-md text-slate-700 transition-colors shadow-2xs block">
                        Upload
                      </span>
                      <input
                        type="file"
                        accept="image/png,image/svg+xml,image/jpeg,image/webp"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = () => {
                              if (typeof reader.result === 'string') {
                                onUpdateCompanySettings?.({
                                  ...companySettings,
                                  signatureImage: reader.result,
                                  showSignature: true,
                                });
                                showToast('Updated digital signature');
                              }
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>

                    <button
                      type="button"
                      onClick={() => {
                        onUpdateCompanySettings?.({
                          ...companySettings,
                          signatureImage: defaultCompanySettings.signatureImage,
                          showSignature: true,
                        });
                        showToast('Restored default Swarnali Dey signature');
                      }}
                      className="px-2 py-1 text-[10px] font-semibold text-slate-500 hover:text-slate-800 bg-white border border-slate-200 rounded-md cursor-pointer"
                      title="Reset default signature"
                    >
                      Default
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================================
            RIGHT COLUMN (Live A4 Document Preview): 7 cols on XL
            ========================================================================= */}
        <div className="xl:col-span-7 space-y-4">
          {/* Action Header & Preview Controls */}
          <div className="bg-white rounded-xl border border-slate-200 p-3 sm:px-5 shadow-xs flex flex-wrap items-center justify-between gap-3 sticky top-20 z-30">
            {/* Left: View Controls */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-700 hidden sm:inline">Live A4 Preview</span>
              
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200">
                <button
                  title="Zoom Out"
                  onClick={() => setZoomLevel((z) => Math.max(60, z - 10))}
                  className="p-1 text-slate-600 hover:text-slate-900 rounded cursor-pointer"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <span className="text-[11px] font-mono text-slate-600 px-1 font-semibold">
                  {zoomLevel}%
                </span>
                <button
                  title="Zoom In"
                  onClick={() => setZoomLevel((z) => Math.min(130, z + 10))}
                  className="p-1 text-slate-600 hover:text-slate-900 rounded cursor-pointer"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Toggle Letterhead Header */}
              <button
                onClick={() => setShowLetterhead(!showLetterhead)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-colors cursor-pointer flex items-center gap-1.5 ${
                  showLetterhead
                    ? 'bg-teal-50 border-teal-300 text-teal-800'
                    : 'bg-slate-50 border-slate-200 text-slate-600'
                }`}
              >
                <Building className="w-3 h-3 text-teal-600" />
                <span>Letterhead: {showLetterhead ? 'ON' : 'OFF'}</span>
              </button>
            </div>

            {/* Right: Primary Document Action Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyText}
                title="Copy letter text"
                className="p-2 rounded-lg text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={handlePrint}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Print</span>
              </button>

              <button
                onClick={handleEmailDirectly}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 shadow-xs transition-colors cursor-pointer"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Send via Email</span>
              </button>

              <button
                disabled={isGeneratingPdf}
                onClick={handleDownloadPdf}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 shadow-xs transition-colors cursor-pointer disabled:opacity-50"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{isGeneratingPdf ? 'Generating...' : 'Download PDF'}</span>
              </button>
            </div>
          </div>

          {/* Document Preview Canvas Area */}
          <div className="bg-slate-100/90 p-4 sm:p-8 rounded-xl border border-slate-200/80 shadow-xs overflow-x-auto min-h-[600px] flex justify-center">
            <div 
              style={{ 
                transform: `scale(${zoomLevel / 100})`, 
                transformOrigin: 'top center',
                transition: 'transform 0.15s ease-out'
              }}
            >
              <LetterPreviewA4
                documentType={docType}
                offerData={offerForm}
                promotionData={promotionForm}
                appointmentData={appointmentForm}
                relievingData={relievingForm}
                companySettings={companySettings}
                showLetterhead={showLetterhead}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
