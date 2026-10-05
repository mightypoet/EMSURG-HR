import React from 'react';
import { CompanySettings, DocumentType, OfferLetterData, PromotionLetterData, AppointmentLetterData, RelievingLetterData } from '../types';
import { formatIndianCurrency, formatDisplayDate } from '../utils/numberToWords';
import { Building2, ShieldCheck } from 'lucide-react';

interface LetterPreviewA4Props {
  documentType: DocumentType;
  offerData?: OfferLetterData;
  promotionData?: PromotionLetterData;
  appointmentData?: AppointmentLetterData;
  relievingData?: RelievingLetterData;
  companySettings: CompanySettings;
  showLetterhead?: boolean;
}

export const LetterPreviewA4: React.FC<LetterPreviewA4Props> = ({
  documentType,
  offerData,
  promotionData,
  appointmentData,
  relievingData,
  companySettings,
  showLetterhead = true,
}) => {
  // Common Letterhead Header component
  const LetterheadHeader = () => (
    <div className="border-b-2 border-teal-700/80 pb-3 mb-4 shrink-0" style={{ borderBottomWidth: '2px', borderBottomColor: '#0f766e' }}>
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          {/* Strict Fixed Logo Dimensions */}
          <div style={{ width: '140px', maxWidth: '140px', height: 'auto', maxHeight: '55px', flexShrink: 0, overflow: 'hidden' }}>
            <img
              src="https://0e8dtpaport9ku82.public.blob.vercel-storage.com/emsurg_logo_cropped.png"
              alt="Emsurg Healthcare Official Logo"
              style={{ width: '140px', maxWidth: '140px', height: 'auto', maxHeight: '55px', objectFit: 'contain', display: 'block' }}
              crossOrigin="anonymous"
            />
          </div>
          <div>
            <h1 
              style={{ fontSize: '18px', lineHeight: '22px' }} 
              className="font-bold tracking-tight text-slate-900 font-sans uppercase m-0 p-0"
            >
              {companySettings.companyName}
            </h1>
            <p 
              style={{ fontSize: '11px', lineHeight: '14px' }} 
              className="text-teal-800 font-semibold tracking-wide font-sans mt-0.5 m-0 p-0"
            >
              Medical Devices &amp; Healthcare Solutions
            </p>
          </div>
        </div>

        <div style={{ fontSize: '10px', lineHeight: '13px' }} className="text-right text-slate-600 font-sans shrink-0">
          <p className="font-semibold text-slate-800">Regd. Office: {companySettings.addressLine1}</p>
          <p className="text-slate-700">{companySettings.cityStateZip}</p>
          <p className="text-slate-600 mt-0.5"><span className="font-medium text-slate-700">CIN:</span> {companySettings.cin}</p>
          <p className="text-slate-600">
            <span>Ph: {companySettings.phone}</span>
            {companySettings.website && <span> • Website: {companySettings.website}</span>}
          </p>
        </div>
      </div>
    </div>
  );

  // Common Letterhead Footer component - pinned cleanly to the bottom
  const LetterheadFooter = ({ pageNum, totalPages }: { pageNum: number; totalPages: number }) => (
    <div 
      className="mt-auto pt-3 border-t border-slate-200 flex items-center justify-between text-[10px] text-slate-500 font-sans shrink-0 w-full"
      style={{ marginTop: 'auto' }}
    >
      <div>
        <span className="font-semibold text-slate-700">{companySettings.companyName}</span>
        <span className="mx-1.5 text-slate-300">|</span>
        <span>Corporate HR &amp; Admin Department</span>
      </div>
      <div>
        <span className="font-medium">Page {pageNum} of {totalPages}</span>
      </div>
    </div>
  );

  // Common Official Signatory & Seal Stamp Block (organized non-overlapping row)
  const SignatoryBlock = ({
    companyName = companySettings.companyName,
    signatoryName = companySettings.signatoryName,
    signatoryTitle = companySettings.signatoryTitle,
    includeWarmRegards = true,
    includeForCompany = true,
    customClosing,
  }: {
    companyName?: string;
    signatoryName?: string;
    signatoryTitle?: string;
    includeWarmRegards?: boolean;
    includeForCompany?: boolean;
    customClosing?: string;
  }) => {
    const hasSignature = companySettings.showSignature && Boolean(companySettings.signatureImage);
    const hasStamp = companySettings.showStamp && Boolean(companySettings.stampImage);

    return (
      <div className="relative mt-4 select-none shrink-0">
        {customClosing ? (
          <p className="text-slate-800">{customClosing}</p>
        ) : includeWarmRegards ? (
          <p className="text-slate-800">Warm regards,</p>
        ) : null}

        {includeForCompany && (
          <p className="font-bold mt-1 text-slate-900">For {companyName}</p>
        )}

        {/* Organized Row: Signature & Official Seal aligned side-by-side with 20px gap */}
        <div className="flex items-center gap-5 my-1.5 min-h-[52px]">
          {/* Signature block */}
          <div className="flex flex-col justify-end">
            {hasSignature ? (
              <img
                src={companySettings.signatureImage}
                alt={`Signature of ${signatoryName}`}
                style={{ maxHeight: '48px', width: 'auto', objectFit: 'contain' }}
                className="block drop-shadow-2xs"
                crossOrigin="anonymous"
              />
            ) : (
              <div className="w-36 border-b border-dashed border-slate-300 pt-7" />
            )}
          </div>

          {/* Official Company Seal Stamp */}
          {hasStamp && (
            <div 
              style={{ width: '80px', height: '80px', flexShrink: 0 }}
              className="flex items-center justify-center pointer-events-none"
            >
              <img 
                src={companySettings.stampImage} 
                alt="Official Company Seal" 
                style={{ width: '80px', height: '80px', objectFit: 'contain' }}
                className="w-full h-full object-contain opacity-90 drop-shadow-2xs"
                crossOrigin="anonymous"
              />
            </div>
          )}
        </div>

        {signatoryName && <p className="font-bold text-slate-900 leading-tight">{signatoryName}</p>}
        {signatoryTitle && <p className="text-slate-800 text-[12.5px] leading-tight mt-0.5">{signatoryTitle}</p>}
        {!includeForCompany && companyName && <p className="font-semibold text-slate-900 leading-tight mt-0.5">{companyName}</p>}
      </div>
    );
  };

  const a4PageStyle: React.CSSProperties = {
    width: '794px',
    minWidth: '794px',
    maxWidth: '794px',
    height: '1123px',
    minHeight: '1123px',
    maxHeight: '1123px',
    boxSizing: 'border-box',
    padding: '44px 50px 36px 50px',
    overflow: 'hidden',
    position: 'relative',
    background: '#ffffff',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  };

  /* =========================================================================
     1. OFFER LETTER (2 Pages) - EXACT WORDING FROM UPLOADED TEMPLATE
     ========================================================================= */
  if (documentType === 'offer' && offerData) {
    const ctcFormatted = typeof offerData.ctcAmount === 'number' 
      ? formatIndianCurrency(offerData.ctcAmount) 
      : offerData.ctcAmount;

    return (
      <div id="printable-document" className="flex flex-col gap-8 print:gap-0 font-document text-slate-900 text-[13px] leading-relaxed">
        {/* PAGE 1 */}
        <div 
          id="doc-page-1" 
          className="a4-page print-page bg-white shadow-lg border border-slate-200 mx-auto"
          style={a4PageStyle}
        >
          <div className="flex-1 flex flex-col">
            {showLetterhead && <LetterheadHeader />}

            <div className="mb-3">
              <p className="font-medium text-xs">
                <span className="font-bold">Date:-</span> {formatDisplayDate(offerData.letterDate) || '………………..'}
              </p>
              {offerData.referenceNo && (
                <p className="text-[11px] text-slate-600 font-sans mt-0.5">
                  <span className="font-semibold">Ref:</span> {offerData.referenceNo}
                </p>
              )}
            </div>

            <div className="mb-3.5 leading-snug text-xs">
              <p className="font-bold">To,</p>
              <p className="font-semibold">{offerData.employeeName || '…………………………….'}</p>
              <div className="whitespace-pre-line text-slate-800">
                {offerData.employeeAddress || '…………………………….\n…………………………….'}
              </div>
            </div>

            <div className="text-center my-3">
              <h2 className="text-[14px] font-bold underline tracking-wide">
                Subject: Offer of Employment
              </h2>
            </div>

            <p className="mb-2.5">
              Dear <span className="font-semibold">{offerData.employeeName || '………………………..'}</span>,
            </p>

            <p className="mb-2.5 text-justify">
              We are pleased to offer you the position of <span className="font-bold underline">{offerData.designation || '……………………………………………'}</span> with <span className="font-bold">{companySettings.companyName}</span>. Based on our discussions and evaluation of your qualifications and experience, we believe that your skills will contribute significantly to our organization and its commitment to advancing healthcare and medical device market.
            </p>

            <p className="mb-2.5 text-justify">
              Your employment will commence on <span className="font-bold underline">{formatDisplayDate(offerData.joiningDate) || '………………….'}</span>, and you will be based at <span className="font-bold underline">{offerData.workLocation || '……………..'}</span>. You will report to <span className="font-bold underline">{offerData.reportingManager || '………………………………………..'}</span> or any other person designated by the management from time to time.
            </p>

            <div className="space-y-2.5 mt-2.5 text-justify">
              <div>
                <h3 className="font-bold text-[13.5px]">1. Compensation and Benefits</h3>
                <p className="mt-0.5">
                  Your total Cost to Company {offerData.ctcLabel || '……………….'} will be INR <span className="font-bold underline">{ctcFormatted || '……………………….'}</span> per annum, payable as per the company’s payroll policy. A detailed breakup of the compensation structure will be shared separately once you join us. In addition to your salary, you will be eligible for benefits and reimbursements as per the company’s policies applicable from time to time.
                </p>
                <p className="mt-1">
                  As an employee of Emsurg Healthcare India Pvt Ltd, you will be eligible for PF &amp; medical insurance. You will also be eligible for leave as per the rules &amp; regulations of the company.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-[13.5px]">2. Probation Period</h3>
                <p className="mt-0.5">
                  You will be on a <span className="font-semibold underline">{offerData.probationPeriod || '…………………………………………'}</span> from the date of joining. Upon satisfactory performance during this period, your employment will be confirmed in writing by the company.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-[13.5px]">3. Roles and Responsibilities</h3>
                <p className="mt-0.5">
                  You will be responsible for performing duties related to <span className="underline font-medium">{offerData.responsibilities || '………………………………………'}</span> as assigned to you by the company in connection with its medical device business operations.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-[13.5px]">4. Confidentiality</h3>
                <p className="mt-0.5">
                  During your employment with the company, you will have access to confidential information related to our products, business strategies, clinical data, and partner relationships. You are required to maintain strict confidentiality of all such information during and after your employment with the company.
                </p>
              </div>
            </div>
          </div>

          <LetterheadFooter pageNum={1} totalPages={2} />
        </div>

        {/* PAGE 2 */}
        <div 
          id="doc-page-2" 
          className="a4-page print-page bg-white shadow-lg border border-slate-200 mx-auto"
          style={a4PageStyle}
        >
          <div className="flex-1 flex flex-col">
            {showLetterhead && (
              <div className="border-b border-slate-200 pb-2.5 mb-4 flex justify-between items-center text-[11px] text-slate-500 font-sans shrink-0">
                <span className="font-semibold text-slate-700">{companySettings.companyName} • Offer of Employment</span>
                <span>Candidate: <strong className="text-slate-800">{offerData.employeeName || 'Candidate'}</strong></span>
              </div>
            )}

            <div className="space-y-3 text-justify">
              <div>
                <h3 className="font-bold text-[13.5px]">5. Company Policies</h3>
                <p className="mt-0.5">
                  You shall comply with all company policies, procedures, regulatory requirements, and ethical standards, including compliance with applicable laws and regulations.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-[13.5px]">6. Notice Period</h3>
                <p className="mt-0.5">
                  Either party may terminate this employment by providing <span className="font-semibold underline">{offerData.noticePeriod || '…………'}</span>’ written notice or salary in lieu thereof, subject to company policy.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-[13.5px]">7. Background Verification</h3>
                <p className="mt-0.5">
                  This offer is subject to verification of your educational qualifications, previous employment details, and other relevant credentials. Any discrepancy may lead to withdrawal of this offer or termination of employment.
                </p>
              </div>
            </div>

            <p className="mt-4 text-justify">
              Kindly sign and return a copy of this letter as a token of your acceptance of the above terms and conditions.
            </p>

            <p className="mt-2 text-justify">
              We look forward to welcoming you to {companySettings.companyName} and wish you a successful and rewarding career with us.
            </p>

            {/* SIGNATURE SECTION */}
            <SignatoryBlock />

            {/* ACCEPTANCE SECTION */}
            <div className="mt-5 pt-3.5 border-t border-slate-300">
              <h3 className="font-bold text-[13.5px] mb-1.5 underline">Acceptance of Offer</h3>
              <p className="text-justify mb-2.5 text-xs">
                I, <span className="font-bold underline">{offerData.employeeName || '………………'}</span>, hereby accept the offer of employment with <span className="font-bold">{companySettings.companyName}</span> and agree to abide by the terms and conditions mentioned above.
              </p>

              <div className="mt-3 space-y-1.5 font-mono text-xs">
                <p>Signature:____________________</p>
                <p>Name: <span className="font-serif font-semibold">{offerData.employeeName || '_______________________'}</span></p>
                <p>Date: _______________________</p>
              </div>
            </div>
          </div>

          <LetterheadFooter pageNum={2} totalPages={2} />
        </div>
      </div>
    );
  }

  /* =========================================================================
     2. APPOINTMENT LETTER (2 Pages) - EXACT WORDING FROM UPLOADED TEMPLATE
     ========================================================================= */
  if (documentType === 'appointment' && appointmentData) {
    const ctcFormatted = typeof appointmentData.ctcAmount === 'number' 
      ? formatIndianCurrency(appointmentData.ctcAmount) 
      : appointmentData.ctcAmount;

    return (
      <div id="printable-document" className="flex flex-col gap-8 print:gap-0 font-document text-slate-900 text-[13px] leading-relaxed">
        {/* PAGE 1 */}
        <div 
          id="doc-page-1" 
          className="a4-page print-page bg-white shadow-lg border border-slate-200 mx-auto"
          style={a4PageStyle}
        >
          <div className="flex-1 flex flex-col">
            {showLetterhead && <LetterheadHeader />}

            <div className="mb-3">
              <p className="font-medium text-xs">
                <span className="font-bold">Date:</span> {formatDisplayDate(appointmentData.letterDate) || '………………..'}
              </p>
              {appointmentData.referenceNo && (
                <p className="text-[11px] text-slate-600 font-sans mt-0.5">
                  <span className="font-semibold">Ref:</span> {appointmentData.referenceNo}
                </p>
              )}
            </div>

            <div className="mb-3.5 leading-snug text-xs">
              <p className="font-bold">To,</p>
              <p className="font-semibold">{appointmentData.employeeName || '………………………'}</p>
              <div className="whitespace-pre-line text-slate-800">
                {appointmentData.employeeAddress || '………………………..'}
              </div>
            </div>

            <div className="text-center my-3">
              <h2 className="text-[14px] font-bold underline tracking-wide">
                Subject: Appointment Letter
              </h2>
            </div>

            <p className="mb-2.5">
              Dear <span className="font-semibold">{appointmentData.employeeName || '………………….'}</span>,
            </p>

            <p className="mb-2.5 text-justify">
              We are pleased to appoint you as <span className="font-bold underline">{appointmentData.designation || '……………………………………..'}</span> with <span className="font-bold">{companySettings.companyName}</span> effective from <span className="font-bold underline">{formatDisplayDate(appointmentData.effectiveDate) || '……………………..'}</span>, based on the discussions held with you and your acceptance of the terms and conditions outlined below.
            </p>

            <div className="space-y-2.5 mt-2.5 text-justify">
              <div>
                <h3 className="font-bold text-[13.5px]">1. Designation and Reporting</h3>
                <p className="mt-0.5">
                  You will be designated as <span className="font-bold underline">{appointmentData.designation || '……………………………..'}</span> and will be based at <span className="font-bold underline">{appointmentData.workLocation || '………………..'}</span>. You will report to <span className="font-bold underline">{appointmentData.reportingManager || '…………………………………….'}</span> or any other person as designated by the management from time to time.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-[13.5px]">2. Scope of Work</h3>
                <p className="mt-0.5">
                  Your responsibilities will include, but not be limited to, activities related to <span className="underline font-medium">{appointmentData.responsibilities || '……………………'}</span> associated with the company’s medical device and healthcare product portfolio. The company reserves the right to modify or expand your responsibilities based on business requirements.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-[13.5px]">3. Compensation</h3>
                <p className="mt-0.5">
                  Your Cost to Company {appointmentData.ctcLabel || '……………'} will be INR <span className="font-bold underline">{ctcFormatted || '………………………………..'}</span> per annum, payable as per the company’s payroll policies. A detailed compensation structure will be provided separately. All statutory deductions such as Provident Fund, Professional Tax, Income Tax (TDS), and other applicable deductions will be made as per government regulations.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-[13.5px]">4. Probation Period</h3>
                <p className="mt-0.5">
                  You will be on probation for a period of <span className="font-semibold underline">{appointmentData.probationPeriod || '6 months'}</span> from the date of joining. During this period, your performance and suitability for the role will be evaluated. Upon satisfactory completion of the probation period, your appointment will be confirmed in writing.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-[13.5px]">5. Working Hours and Leave</h3>
                <p className="mt-0.5">
                  Your working hours, weekly offs, and leave entitlement will be governed by the company’s HR policies, which may be amended from time to time.
                </p>
              </div>
            </div>
          </div>

          <LetterheadFooter pageNum={1} totalPages={2} />
        </div>

        {/* PAGE 2 */}
        <div 
          id="doc-page-2" 
          className="a4-page print-page bg-white shadow-lg border border-slate-200 mx-auto"
          style={a4PageStyle}
        >
          <div className="flex-1 flex flex-col">
            {showLetterhead && (
              <div className="border-b border-slate-200 pb-2.5 mb-4 flex justify-between items-center text-[11px] text-slate-500 font-sans shrink-0">
                <span className="font-semibold text-slate-700">{companySettings.companyName} • Appointment Letter</span>
                <span>Employee: <strong className="text-slate-800">{appointmentData.employeeName || 'Employee'}</strong></span>
              </div>
            )}

            <div className="space-y-2.5 text-justify">
              <div>
                <h3 className="font-bold text-[13.5px]">6. Confidentiality and Intellectual Property</h3>
                <p className="mt-0.5">
                  During your employment, you may have access to confidential information relating to the company’s products, technology, clinical data, regulatory documentation, business strategies, customer databases, and partner relationships. You are required to maintain strict confidentiality of such information during and after your employment with the company.
                </p>
                <p className="mt-0.5">
                  Any intellectual property, invention, or development created during the course of your employment will remain the property of the company.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-[13.5px]">7. Compliance with Laws and Policies</h3>
                <p className="mt-0.5">
                  As a medical device company, {companySettings.companyName} operates under strict regulatory and ethical standards. You are required to comply with all company policies, applicable healthcare regulations, and government laws, including guidelines related to medical device marketing, regulatory compliance, and ethical business practices.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-[13.5px]">8. Transfer and Mobility</h3>
                <p className="mt-0.5">
                  Your services may be transferred or assigned to any department, branch, project location, or associated business partner of the company depending on business requirements.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-[13.5px]">9. Termination of Employment</h3>
                <p className="mt-0.5">
                  Either party may terminate the employment by providing <span className="font-semibold underline">{appointmentData.noticePeriod || '………….'}</span>’ written notice or salary in lieu thereof, subject to company policies. The company reserves the right to terminate your employment without notice in cases of misconduct, breach of confidentiality, violation of company policies, or non-compliance with applicable regulations.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-[13.5px]">10. Background Verification</h3>
                <p className="mt-0.5">
                  This appointment is subject to verification of your educational qualifications, previous employment records, and other credentials. If any information provided by you is found to be false or misleading, the company reserves the right to terminate your employment immediately.
                </p>
              </div>
            </div>

            {/* SIGNATURE SECTION */}
            <SignatoryBlock />

            {/* ACCEPTANCE OF APPOINTMENT */}
            <div className="mt-4 pt-3 border-t border-slate-300">
              <h3 className="font-bold text-[13.5px] mb-1.5 underline">Acceptance of Appointment</h3>
              <p className="text-justify mb-1.5 text-xs">
                Please sign and return a copy of this letter as a token of your acceptance of the terms and conditions mentioned above.
              </p>
              <p className="text-justify mb-3 text-xs">
                We welcome you to {companySettings.companyName} and look forward to your valuable contribution towards the growth of the organization and advancement of healthcare solutions.
              </p>

              <div className="mt-3">
                <p className="font-bold text-xs">Signature of candidate: ____________________</p>
                <div className="mt-1.5 text-xs text-slate-600 font-sans">
                  <span>Name: <strong className="text-slate-800">{appointmentData.employeeName}</strong></span>
                  <span className="mx-3">•</span>
                  <span>Date: ____________________</span>
                </div>
              </div>
            </div>
          </div>

          <LetterheadFooter pageNum={2} totalPages={2} />
        </div>
      </div>
    );
  }

  /* =========================================================================
     3. PROMOTION LETTER (1 Page) - EXACT WORDING FROM UPLOADED TEMPLATE
     ========================================================================= */
  if (documentType === 'promotion' && promotionData) {
    return (
      <div id="printable-document" className="font-document text-slate-900 text-[13.5px] leading-relaxed">
        <div 
          id="doc-page-1" 
          className="a4-page print-page bg-white shadow-lg border border-slate-200 mx-auto"
          style={a4PageStyle}
        >
          <div className="flex-1 flex flex-col">
            {showLetterhead && <LetterheadHeader />}

            <div className="mb-3.5">
              <p className="font-medium text-xs">
                <span className="font-bold">Date:-</span> {formatDisplayDate(promotionData.letterDate) || '……………………'}
              </p>
              {promotionData.referenceNo && (
                <p className="text-[11px] text-slate-600 font-sans mt-0.5">
                  <span className="font-semibold">Ref:</span> {promotionData.referenceNo}
                </p>
              )}
            </div>

            <div className="mb-4 leading-snug text-xs">
              <p className="font-bold">To,</p>
              <p className="font-semibold">{promotionData.employeeName || '……………………..'}</p>
              <div className="whitespace-pre-line text-slate-800">
                {promotionData.employeeAddress || '…………………………..'}
              </div>
            </div>

            <div className="text-center my-4">
              <h2 className="text-[14px] font-bold underline tracking-wide">
                Subject: Promotion to {promotionData.newDesignation || '……………………………'}
              </h2>
            </div>

            <p className="mb-3">
              Dear <span className="font-semibold">{promotionData.employeeName || '…………………….'}</span>,
            </p>

            <p className="mb-3 text-justify leading-relaxed">
              We are pleased to inform you of your promotion to the position of <span className="font-bold underline">{promotionData.newDesignation || '…………………………'}</span> with <span className="font-bold">{companySettings.companyName}</span>, effective <span className="font-bold underline">{formatDisplayDate(promotionData.effectiveDate) || '……………………...'}</span>. This decision has been made in recognition of your outstanding performance, dedication, and contribution to our team.
            </p>

            <div className="space-y-3 mt-4 text-justify">
              <div>
                <h3 className="font-bold text-[14px] underline">1. Position and Duties</h3>
                <p className="mt-1.5 leading-relaxed">
                  In your new role as <span className="font-bold underline">{promotionData.newDesignation || '………………………'}</span>, you will be responsible for <span className="underline font-medium">{promotionData.responsibilities || '………………………….'}</span>. We believe in your abilities and trust that you will continue to excel and play a key role in our organization's growth.
                </p>
              </div>
            </div>

            {/* SIGNATURE SECTION */}
            <SignatoryBlock />
          </div>

          <LetterheadFooter pageNum={1} totalPages={1} />
        </div>
      </div>
    );
  }

  /* =========================================================================
     4. RELIEVING LETTER (1 Page) - EXACT WORDING FROM UPLOADED TEMPLATE
     ========================================================================= */
  if (documentType === 'relieving' && relievingData) {
    const isFemale = relievingData.gender === 'Female';
    const pronounPoss = isFemale ? 'her' : 'his';
    const pronounObj = isFemale ? 'her' : 'him';

    return (
      <div id="printable-document" className="font-document text-slate-900 text-[13.5px] leading-relaxed">
        <div 
          id="doc-page-1" 
          className="a4-page print-page bg-white shadow-lg border border-slate-200 mx-auto"
          style={a4PageStyle}
        >
          <div className="flex-1 flex flex-col">
            {showLetterhead && <LetterheadHeader />}

            <div className="flex justify-end mb-4">
              <p className="font-medium text-xs">
                <span className="font-bold">Date: -</span> {formatDisplayDate(relievingData.letterDate) || '………………….'}
              </p>
            </div>

            <div className="text-center my-5">
              <h2 className="text-[14px] font-bold underline tracking-wider uppercase">
                TO WHOM SO EVER IT MAY CONCERN
              </h2>
            </div>

            <div className="space-y-4 text-justify leading-relaxed mt-4">
              <p>
                This is to certify that <span className="font-bold underline">{relievingData.employeeName || '……………………………'}</span> has worked with us from <span className="font-semibold underline">{formatDisplayDate(relievingData.fromDate) || '………………………………..'}</span> to <span className="font-semibold underline">{formatDisplayDate(relievingData.toDate) || '…………………………………'}</span> and was designated as <span className="font-bold underline">{relievingData.designation || '……………………………………..'}</span> at the time of leaving the organization.
              </p>

              <p>
                During {pronounPoss} above tenure we found {pronounObj} time to be regular, honest and diligent in duties and responsibilities.
              </p>

              <p>
                This is to certify that <span className="font-bold underline">{relievingData.employeeName || '…………………………………………….'}</span> holds no liabilities towards the company.
              </p>

              <p>
                We wish {pronounObj} all success in {pronounPoss} future endeavour.
              </p>
            </div>

            {/* EXACT SIGNATURE FROM RELIEVING TEMPLATE */}
            <SignatoryBlock
              customClosing="Yous Sincerely,"
              includeForCompany={false}
              signatoryName=""
              signatoryTitle={companySettings.signatoryTitle}
              companyName="Emsurg Healthcare (India) Pvt Ltd"
            />
          </div>

          <LetterheadFooter pageNum={1} totalPages={1} />
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 text-center text-slate-500 bg-white rounded-lg border border-slate-200">
      Please configure the document details to view preview.
    </div>
  );
};
