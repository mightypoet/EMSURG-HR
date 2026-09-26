export type EmploymentStatus = 
  | 'Active' 
  | 'On Probation' 
  | 'Notice Period' 
  | 'Relieved' 
  | 'Offer Extended';

export interface Employee {
  id: string;
  employeeId: string;
  name: string;
  personalEmail: string;
  officialEmail: string;
  phone: string;
  address: string;
  designation: string;
  department: string;
  location: string;
  reportingManager: string;
  dateOfJoining: string;
  currentCtc: number;
  employmentStatus: EmploymentStatus;
  gender?: 'Male' | 'Female' | 'Other';
  relievingDate?: string;
  notes?: string;
  createdAt: string;
}

export type DocumentType = 'offer' | 'promotion' | 'appointment' | 'relieving';

export interface OfferLetterData {
  letterDate: string;
  employeeName: string;
  employeeAddress: string;
  employeeEmail: string;
  designation: string;
  joiningDate: string;
  workLocation: string;
  reportingManager: string;
  ctcAmount: number | string;
  ctcLabel?: string; // e.g. "(CTC)"
  probationPeriod: string; // e.g. "period of 6 months"
  responsibilities: string;
  noticePeriod: string; // e.g. "30 days" or "3 months"
  referenceNo?: string;
}

export interface PromotionLetterData {
  letterDate: string;
  employeeName: string;
  employeeAddress: string;
  employeeEmail: string;
  currentDesignation?: string;
  newDesignation: string;
  effectiveDate: string;
  responsibilities: string;
  newCtc?: number | string;
  reportingManager?: string;
  referenceNo?: string;
}

export interface AppointmentLetterData {
  letterDate: string;
  employeeName: string;
  employeeAddress: string;
  employeeEmail: string;
  designation: string;
  effectiveDate: string; // joining date
  workLocation: string;
  reportingManager: string;
  responsibilities: string;
  ctcAmount: number | string;
  ctcLabel?: string;
  probationPeriod: string; // e.g. "6 months"
  noticePeriod: string; // e.g. "30 days"
  referenceNo?: string;
}

export interface RelievingLetterData {
  letterDate: string;
  employeeName: string;
  employeeAddress?: string;
  employeeEmail: string;
  designation: string;
  fromDate: string;
  toDate: string;
  gender: 'Male' | 'Female' | 'Other';
  referenceNo?: string;
}

export interface DocumentRecord {
  id: string;
  documentType: DocumentType;
  title: string;
  employeeId?: string;
  employeeName: string;
  employeeEmail: string;
  designation: string;
  dateGenerated: string;
  referenceNo: string;
  status: 'Draft' | 'Generated' | 'Emailed';
  fileName: string;
  data: OfferLetterData | PromotionLetterData | AppointmentLetterData | RelievingLetterData;
}

export interface EmailLog {
  id: string;
  documentId?: string;
  documentType: DocumentType;
  recipientEmail: string;
  recipientName: string;
  subject: string;
  sentAt: string;
  status: 'Sent' | 'Delivered' | 'Draft';
  notes?: string;
}

export interface CompanySettings {
  companyName: string;
  shortName: string;
  department: string;
  signatoryName: string;
  signatoryTitle: string;
  addressLine1: string;
  addressLine2: string;
  cityStateZip: string;
  cin: string;
  phone: string;
  email: string;
  website: string;
  letterRefPrefix: string;
  includeWatermark: boolean;
  includeLetterheadHeader: boolean;
  signatureImage?: string;
  showSignature: boolean;
  stampImage?: string;
  showStamp: boolean;
}
