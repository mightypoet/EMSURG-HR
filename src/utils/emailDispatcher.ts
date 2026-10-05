import { DocumentType, CompanySettings, DocumentRecord, EmailLog } from '../types';
import { exportDocumentToPdf } from './pdfExport';

export interface EmailDraft {
  to: string;
  cc: string;
  subject: string;
  body: string;
  fileName: string;
}

export interface DispatchEmailOptions {
  docRecord: DocumentRecord;
  companySettings: CompanySettings;
  elementIds: string[];
  recipientEmail?: string;
  preferredClient?: 'gmail' | 'mailto';
}

/**
 * Builds formal, polished corporate email draft according to document type and details.
 */
export function buildCorporateEmailDraft(
  docType: DocumentType,
  data: any,
  companySettings: CompanySettings
): EmailDraft {
  const empName = data?.employeeName?.trim() || 'Valued Colleague';
  const to = data?.employeeEmail?.trim() || '';
  const cc = companySettings.email || 'hr@emsurg.com';
  const designation = data?.designation || data?.newDesignation || 'Designated Role';
  const signatoryName = companySettings.signatoryName || 'Swarnali Dey';
  const signatoryTitle = companySettings.signatoryTitle || 'General Manager Admin & HR';
  const companyName = companySettings.companyName || 'Emsurg Healthcare India Pvt. Ltd.';
  const address = `${companySettings.addressLine1 || '30, Joy Gopal Das Road, Sodepur'}, ${companySettings.cityStateZip || 'Kolkata - 700110, West Bengal'}`;
  const phone = companySettings.phone || '033-2560 0045, 7439757452';
  const website = companySettings.website || 'www.emsurg.com';

  const signoff = `Warm regards,\n\n${signatoryName}\n${signatoryTitle}\n${companyName}\n${address}\nPh: ${phone} • Website: ${website}`;

  let subject = '';
  let body = '';

  if (docType === 'appointment') {
    const effectiveDate = data?.effectiveDate || data?.joiningDate || 'the agreed commencement date';
    subject = `Appointment Letter - ${empName} | ${companyName}`;
    body = `Dear ${empName},

Greetings from ${companyName}.

We are pleased to share your official Appointment Letter for the position of ${designation}, effective from ${effectiveDate}. Please find the complete high-resolution document attached for your records.

Kindly review the terms and conditions outlined in the letter, sign the duplicate/acceptance copy, and return a scanned copy to the HR Department (${cc}) at your earliest convenience.

Should you have any questions or require any assistance, please feel free to reach out to us.

We wish you a rewarding and successful tenure with Emsurg Healthcare.

${signoff}`;
  } else if (docType === 'offer') {
    const joiningDate = data?.joiningDate || 'the agreed joining date';
    subject = `Offer Letter - ${empName} | ${companyName}`;
    body = `Dear ${empName},

Greetings from ${companyName}.

Following our recent discussions and interview process, we are delighted to extend this formal Offer of Employment for the position of ${designation} at ${companyName}, with an intended date of joining on ${joiningDate}.

Please find your detailed Offer Letter attached herewith. Kindly review the offer terms, compensation breakdown, and sign & return the acceptance copy to confirm your acceptance of the offer.

We look forward to welcoming you to the Emsurg Healthcare family.

${signoff}`;
  } else if (docType === 'promotion') {
    const effectiveDate = data?.effectiveDate || 'the effective promotion date';
    const newDesignation = data?.newDesignation || designation;
    subject = `Promotion Letter - ${empName} | ${companyName}`;
    body = `Dear ${empName},

Heartiest congratulations on your well-deserved promotion!

In recognition of your outstanding performance, dedication, and valuable contributions to ${companyName}, management is pleased to promote you to the role of ${newDesignation}, effective from ${effectiveDate}.

Please find your official Promotion & Compensation Letter attached herewith. Kindly sign and return a copy of the acknowledgment for HR records.

We appreciate your continued commitment and look forward to your leadership in this new capacity.

${signoff}`;
  } else {
    // Relieving Letter
    const toDate = data?.toDate || 'the date of relieving';
    subject = `Relieving Letter - ${empName} | ${companyName}`;
    body = `Dear ${empName},

Please find attached your official Relieving & Experience Letter from ${companyName}, confirming your successful completion of service as ${designation} through ${toDate}.

We confirm that all company assets, clearances, and handover procedures have been duly completed.

We thank you for your contributions during your tenure with us and wish you the very best in all your future professional endeavors.

${signoff}`;
  }

  return {
    to,
    cc,
    subject,
    body,
    fileName: data?.fileName || `${docType}_letter_${empName.replace(/\s+/g, '_')}.pdf`,
  };
}

/**
 * Builds full Gmail Compose web URL with all parameters safely encoded.
 */
export function buildGmailComposeUrl(draft: EmailDraft): string {
  const baseUrl = 'https://mail.google.com/mail/?view=cm&fs=1';
  const params = [
    `to=${encodeURIComponent(draft.to)}`,
    draft.cc ? `cc=${encodeURIComponent(draft.cc)}` : '',
    `su=${encodeURIComponent(draft.subject)}`,
    `body=${encodeURIComponent(draft.body)}`,
  ]
    .filter(Boolean)
    .join('&');

  return `${baseUrl}&${params}`;
}

/**
 * Builds native mailto: scheme URL as fallback with all parameters safely encoded.
 */
export function buildMailtoUrl(draft: EmailDraft): string {
  const query = [
    draft.cc ? `cc=${encodeURIComponent(draft.cc)}` : '',
    `subject=${encodeURIComponent(draft.subject)}`,
    `body=${encodeURIComponent(draft.body)}`,
  ]
    .filter(Boolean)
    .join('&');

  return `mailto:${encodeURIComponent(draft.to)}${query ? `?${query}` : ''}`;
}

/**
 * High-level orchestration function:
 * 1. Validates recipient email.
 * 2. Downloads the official high-resolution PDF document automatically.
 * 3. Opens Gmail Web Compose (or mailto client) in a new tab with pre-filled formal subject & body.
 * 4. Returns an EmailLog object.
 */
export async function executeSendViaEmailWorkflow({
  docRecord,
  companySettings,
  elementIds,
  recipientEmail,
  preferredClient = 'gmail',
}: DispatchEmailOptions): Promise<{
  success: boolean;
  emailLog?: EmailLog;
  error?: string;
}> {
  const to = (recipientEmail || docRecord.employeeEmail || '').trim();
  if (!to) {
    return {
      success: false,
      error: 'Please enter the recipient email address before sending.',
    };
  }

  // Generate Draft
  const draft = buildCorporateEmailDraft(
    docRecord.documentType,
    { ...docRecord.data, employeeEmail: to, employeeName: docRecord.employeeName, fileName: docRecord.fileName },
    companySettings
  );

  // 1. Trigger PDF Download
  try {
    await exportDocumentToPdf({
      fileName: docRecord.fileName,
      elementIds,
    });
  } catch (pdfErr) {
    console.warn('PDF auto-download warning:', pdfErr);
  }

  // 2. Open Email Composer
  const targetUrl =
    preferredClient === 'gmail'
      ? buildGmailComposeUrl(draft)
      : buildMailtoUrl(draft);

  if (preferredClient === 'gmail') {
    const newTab = window.open(targetUrl, '_blank', 'noopener,noreferrer');
    if (!newTab || newTab.closed || typeof newTab.closed === 'undefined') {
      // Popup blocked or fallback to window.location
      window.location.href = buildMailtoUrl(draft);
    }
  } else {
    window.location.href = targetUrl;
  }

  const log: EmailLog = {
    id: `email-${Date.now()}`,
    documentId: docRecord.id,
    documentType: docRecord.documentType,
    recipientEmail: to,
    recipientName: docRecord.employeeName || 'Candidate',
    subject: draft.subject,
    sentAt: new Date().toISOString(),
    status: 'Sent',
    notes: `Dispatched with attachment: ${docRecord.fileName} | CC: ${draft.cc}`,
  };

  return {
    success: true,
    emailLog: log,
  };
}
