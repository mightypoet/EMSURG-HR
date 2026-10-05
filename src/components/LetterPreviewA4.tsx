import React from 'react';
import { CompanySettings, DocumentType, OfferLetterData, PromotionLetterData, AppointmentLetterData, RelievingLetterData } from '../types';
import { formatIndianCurrency, formatDisplayDate } from '../utils/numberToWords';

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
  // Shared Header Component
  const LetterheadHeader: React.FC<{ isPrint?: boolean }> = ({ isPrint }) => (
    <div 
      style={{
        borderBottom: '2px solid #0f766e',
        paddingBottom: '12px',
        marginBottom: '16px',
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px',
        width: '100%',
        boxSizing: 'border-box',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <div style={{ width: '140px', height: '50px', flexShrink: 0, overflow: 'hidden' }}>
          <img
            src="https://0e8dtpaport9ku82.public.blob.vercel-storage.com/emsurg_logo_cropped.png"
            alt="Emsurg Healthcare Official Logo"
            style={{ width: '140px', height: '50px', objectFit: 'contain', display: 'block' }}
            crossOrigin="anonymous"
          />
        </div>
        <div>
          <h1 
            style={{
              fontSize: '17px',
              lineHeight: '21px',
              fontWeight: 800,
              color: '#0f172a',
              textTransform: 'uppercase',
              margin: 0,
              padding: 0,
              letterSpacing: '-0.02em',
            }}
          >
            {companySettings.companyName}
          </h1>
          <p 
            style={{
              fontSize: '11px',
              lineHeight: '14px',
              fontWeight: 600,
              color: '#0f766e',
              margin: '3px 0 0 0',
              padding: 0,
            }}
          >
            Medical Devices &amp; Healthcare Solutions
          </p>
        </div>
      </div>

      <div style={{ fontSize: '11px', lineHeight: '15px', textAlign: 'right', color: '#475569', flexShrink: 0 }}>
        <p style={{ margin: 0, fontWeight: 700, color: '#1e293b' }}>Regd. Office: {companySettings.addressLine1}</p>
        <p style={{ margin: '1px 0 0 0', color: '#334155' }}>{companySettings.cityStateZip}</p>
        <p style={{ margin: '1px 0 0 0', color: '#475569' }}>
          <span style={{ fontWeight: 600, color: '#334155' }}>CIN:</span> {companySettings.cin}
        </p>
        <p style={{ margin: '1px 0 0 0', color: '#475569' }}>
          <span>Ph: {companySettings.phone}</span>
          {companySettings.website && <span> • Website: {companySettings.website}</span>}
        </p>
      </div>
    </div>
  );

  // Shared Footer Component
  const LetterheadFooter: React.FC<{ pageNum: number; totalPages: number }> = ({ pageNum, totalPages }) => (
    <div 
      style={{
        marginTop: 'auto',
        paddingTop: '12px',
        borderTop: '1px solid #cbd5e1',
        fontSize: '10px',
        lineHeight: '14px',
        color: '#64748b',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexShrink: 0,
        width: '100%',
        boxSizing: 'border-box',
      }}
    >
      <div>
        <span style={{ fontWeight: 700, color: '#334155' }}>{companySettings.companyName}</span>
        <span style={{ margin: '0 6px', color: '#cbd5e1' }}>|</span>
        <span>Corporate HR &amp; Admin Department</span>
      </div>
      <div>
        <span style={{ fontWeight: 600 }}>Page {pageNum} of {totalPages}</span>
      </div>
    </div>
  );

  // Shared Signatory Block
  const SignatoryBlock: React.FC<{
    companyName?: string;
    signatoryName?: string;
    signatoryTitle?: string;
    includeWarmRegards?: boolean;
    includeForCompany?: boolean;
    customClosing?: string;
  }> = ({
    companyName = companySettings.companyName,
    signatoryName = companySettings.signatoryName,
    signatoryTitle = companySettings.signatoryTitle,
    includeWarmRegards = true,
    includeForCompany = true,
    customClosing,
  }) => {
    const hasSignature = companySettings.showSignature && Boolean(companySettings.signatureImage);
    const hasStamp = companySettings.showStamp && Boolean(companySettings.stampImage);

    return (
      <div style={{ position: 'relative', marginTop: '16px', userSelect: 'none', flexShrink: 0 }}>
        {customClosing ? (
          <p style={{ margin: '0 0 4px 0', color: '#1e293b', fontSize: '13px' }}>{customClosing}</p>
        ) : includeWarmRegards ? (
          <p style={{ margin: '0 0 4px 0', color: '#1e293b', fontSize: '13px' }}>Warm regards,</p>
        ) : null}

        {includeForCompany && (
          <p style={{ margin: '4px 0', fontWeight: 700, color: '#0f172a', fontSize: '13px' }}>For {companyName}</p>
        )}

        {/* Organized Row: Signature & Official Seal aligned side-by-side with 20px gap */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', margin: '6px 0', minHeight: '52px' }}>
          {/* Signature */}
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
            {hasSignature ? (
              <img
                src={companySettings.signatureImage}
                alt={`Signature of ${signatoryName}`}
                style={{ maxHeight: '48px', maxWidth: '130px', objectFit: 'contain', display: 'block' }}
                crossOrigin="anonymous"
              />
            ) : (
              <div style={{ width: '130px', borderBottom: '1px dashed #cbd5e1', paddingTop: '28px' }} />
            )}
          </div>

          {/* Official Company Seal Stamp */}
          {hasStamp && (
            <div style={{ width: '75px', height: '75px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img 
                src={companySettings.stampImage} 
                alt="Official Company Seal" 
                style={{ width: '75px', height: '75px', objectFit: 'contain', display: 'block', opacity: 0.92 }}
                crossOrigin="anonymous"
              />
            </div>
          )}
        </div>

        {signatoryName && (
          <p style={{ margin: '2px 0 0 0', fontWeight: 700, color: '#0f172a', fontSize: '13px', lineHeight: '17px' }}>
            {signatoryName}
          </p>
        )}
        {signatoryTitle && (
          <p style={{ margin: '2px 0 0 0', color: '#334155', fontSize: '12.5px', lineHeight: '16px' }}>
            {signatoryTitle}
          </p>
        )}
        {!includeForCompany && companyName && (
          <p style={{ margin: '2px 0 0 0', fontWeight: 600, color: '#0f172a', fontSize: '12.5px', lineHeight: '16px' }}>
            {companyName}
          </p>
        )}
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
    padding: '48px 56px 40px 56px',
    overflow: 'hidden',
    position: 'relative',
    background: '#ffffff',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
  };

  /* =========================================================================
     1. OFFER LETTER CONTENT (2 Pages)
     ========================================================================= */
  const renderOfferLetter = (isOffScreenPrint = false) => {
    if (!offerData) return null;
    const ctcFormatted = typeof offerData.ctcAmount === 'number' 
      ? formatIndianCurrency(offerData.ctcAmount) 
      : offerData.ctcAmount;

    return (
      <div 
        id={isOffScreenPrint ? undefined : 'printable-document'} 
        className={isOffScreenPrint ? undefined : 'flex flex-col gap-8 print:gap-0 font-document text-slate-900'}
      >
        {/* PAGE 1 */}
        <div 
          id={isOffScreenPrint ? undefined : 'doc-page-1'} 
          className={isOffScreenPrint ? 'pdf-page' : 'a4-page print-page bg-white shadow-lg border border-slate-200 mx-auto'}
          style={a4PageStyle}
        >
          <div style={{ flex: '1 1 0%', display: 'flex', flexDirection: 'column' }}>
            {showLetterhead && <LetterheadHeader isPrint={isOffScreenPrint} />}

            <div style={{ marginBottom: '12px' }}>
              <p style={{ margin: 0, fontSize: '12px', fontWeight: 500 }}>
                <span style={{ fontWeight: 700 }}>Date:-</span> {formatDisplayDate(offerData.letterDate) || '………………..'}
              </p>
              {offerData.referenceNo && (
                <p style={{ margin: '2px 0 0 0', fontSize: '11px', color: '#475569' }}>
                  <span style={{ fontWeight: 600 }}>Ref:</span> {offerData.referenceNo}
                </p>
              )}
            </div>

            <div style={{ marginBottom: '14px', fontSize: '12px', lineHeight: '16px' }}>
              <p style={{ margin: 0, fontWeight: 700 }}>To,</p>
              <p style={{ margin: 0, fontWeight: 600 }}>{offerData.employeeName || '…………………………….'}</p>
              <div style={{ whiteSpace: 'pre-line', color: '#1e293b' }}>
                {offerData.employeeAddress || '…………………………….\n…………………………….'}
              </div>
            </div>

            <div style={{ textAlign: 'center', margin: '12px 0' }}>
              <h2 style={{ fontSize: '14px', fontWeight: 700, textDecoration: 'underline', letterSpacing: '0.02em', margin: 0 }}>
                Subject: Offer of Employment
              </h2>
            </div>

            <p style={{ margin: '0 0 10px 0', fontSize: '13px', lineHeight: '20px' }}>
              Dear <span style={{ fontWeight: 600 }}>{offerData.employeeName || '………………………..'}</span>,
            </p>

            <p style={{ margin: '0 0 10px 0', fontSize: '13px', lineHeight: '20px', textAlign: 'justify' }}>
              We are pleased to offer you the position of <span style={{ fontWeight: 700, textDecoration: 'underline' }}>{offerData.designation || '……………………………………………'}</span> with <span style={{ fontWeight: 700 }}>{companySettings.companyName}</span>. Based on our discussions and evaluation of your qualifications and experience, we believe that your skills will contribute significantly to our organization and its commitment to advancing healthcare and medical device market.
            </p>

            <p style={{ margin: '0 0 10px 0', fontSize: '13px', lineHeight: '20px', textAlign: 'justify' }}>
              Your employment will commence on <span style={{ fontWeight: 700, textDecoration: 'underline' }}>{formatDisplayDate(offerData.joiningDate) || '………………….'}</span>, and you will be based at <span style={{ fontWeight: 700, textDecoration: 'underline' }}>{offerData.workLocation || '……………..'}</span>. You will report to <span style={{ fontWeight: 700, textDecoration: 'underline' }}>{offerData.reportingManager || '………………………………………..'}</span> or any other person designated by the management from time to time.
            </p>

            <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '10px', textAlign: 'justify' }}>
              <div>
                <h3 style={{ fontSize: '13.5px', fontWeight: 700, margin: 0 }}>1. Compensation and Benefits</h3>
                <p style={{ margin: '2px 0 0 0', fontSize: '13px', lineHeight: '19px' }}>
                  Your total Cost to Company {offerData.ctcLabel || '……………….'} will be INR <span style={{ fontWeight: 700, textDecoration: 'underline' }}>{ctcFormatted || '……………………….'}</span> per annum, payable as per the company’s payroll policy. A detailed breakup of the compensation structure will be shared separately once you join us. In addition to your salary, you will be eligible for benefits and reimbursements as per the company’s policies applicable from time to time.
                </p>
                <p style={{ margin: '4px 0 0 0', fontSize: '13px', lineHeight: '19px' }}>
                  As an employee of Emsurg Healthcare India Pvt Ltd, you will be eligible for PF &amp; medical insurance. You will also be eligible for leave as per the rules &amp; regulations of the company.
                </p>
              </div>

              <div>
                <h3 style={{ fontSize: '13.5px', fontWeight: 700, margin: 0 }}>2. Probation Period</h3>
                <p style={{ margin: '2px 0 0 0', fontSize: '13px', lineHeight: '19px' }}>
                  You will be on a <span style={{ fontWeight: 600, textDecoration: 'underline' }}>{offerData.probationPeriod || '…………………………………………'}</span> from the date of joining. Upon satisfactory performance during this period, your employment will be confirmed in writing by the company.
                </p>
              </div>

              <div>
                <h3 style={{ fontSize: '13.5px', fontWeight: 700, margin: 0 }}>3. Roles and Responsibilities</h3>
                <p style={{ margin: '2px 0 0 0', fontSize: '13px', lineHeight: '19px' }}>
                  You will be responsible for performing duties related to <span style={{ fontWeight: 500, textDecoration: 'underline' }}>{offerData.responsibilities || '………………………………………'}</span> as assigned to you by the company in connection with its medical device business operations.
                </p>
              </div>

              <div>
                <h3 style={{ fontSize: '13.5px', fontWeight: 700, margin: 0 }}>4. Confidentiality</h3>
                <p style={{ margin: '2px 0 0 0', fontSize: '13px', lineHeight: '19px' }}>
                  During your employment with the company, you will have access to confidential information related to our products, business strategies, clinical data, and partner relationships. You are required to maintain strict confidentiality of all such information during and after your employment with the company.
                </p>
              </div>
            </div>
          </div>

          <LetterheadFooter pageNum={1} totalPages={2} />
        </div>

        {/* PAGE 2 */}
        <div 
          id={isOffScreenPrint ? undefined : 'doc-page-2'} 
          className={isOffScreenPrint ? 'pdf-page' : 'a4-page print-page bg-white shadow-lg border border-slate-200 mx-auto'}
          style={a4PageStyle}
        >
          <div style={{ flex: '1 1 0%', display: 'flex', flexDirection: 'column' }}>
            {showLetterhead && (
              <div 
                style={{
                  borderBottom: '1px solid #e2e8f0',
                  paddingBottom: '10px',
                  marginBottom: '16px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '11px',
                  color: '#64748b',
                  flexShrink: 0,
                }}
              >
                <span style={{ fontWeight: 600, color: '#334155' }}>{companySettings.companyName} • Offer of Employment</span>
                <span>Candidate: <strong style={{ color: '#0f172a' }}>{offerData.employeeName || 'Candidate'}</strong></span>
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', textAlign: 'justify' }}>
              <div>
                <h3 style={{ fontSize: '13.5px', fontWeight: 700, margin: 0 }}>5. Company Policies</h3>
                <p style={{ margin: '2px 0 0 0', fontSize: '13px', lineHeight: '19px' }}>
                  You shall comply with all company policies, procedures, regulatory requirements, and ethical standards, including compliance with applicable laws and regulations.
                </p>
              </div>

              <div>
                <h3 style={{ fontSize: '13.5px', fontWeight: 700, margin: 0 }}>6. Notice Period</h3>
                <p style={{ margin: '2px 0 0 0', fontSize: '13px', lineHeight: '19px' }}>
                  Either party may terminate this employment by providing <span style={{ fontWeight: 600, textDecoration: 'underline' }}>{offerData.noticePeriod || '…………'}</span>’ written notice or salary in lieu thereof, subject to company policy.
                </p>
              </div>

              <div>
                <h3 style={{ fontSize: '13.5px', fontWeight: 700, margin: 0 }}>7. Background Verification</h3>
                <p style={{ margin: '2px 0 0 0', fontSize: '13px', lineHeight: '19px' }}>
                  This offer is subject to verification of your educational qualifications, previous employment details, and other relevant credentials. Any discrepancy may lead to withdrawal of this offer or termination of employment.
                </p>
              </div>
            </div>

            <p style={{ margin: '14px 0 0 0', fontSize: '13px', lineHeight: '20px', textAlign: 'justify' }}>
              Kindly sign and return a copy of this letter as a token of your acceptance of the above terms and conditions.
            </p>

            <p style={{ margin: '8px 0 0 0', fontSize: '13px', lineHeight: '20px', textAlign: 'justify' }}>
              We look forward to welcoming you to {companySettings.companyName} and wish you a successful and rewarding career with us.
            </p>

            {/* SIGNATURE SECTION */}
            <SignatoryBlock />

            {/* ACCEPTANCE SECTION */}
            <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid #cbd5e1' }}>
              <h3 style={{ fontSize: '13.5px', fontWeight: 700, margin: '0 0 6px 0', textDecoration: 'underline' }}>Acceptance of Offer</h3>
              <p style={{ margin: '0 0 10px 0', fontSize: '12px', lineHeight: '17px', textAlign: 'justify' }}>
                I, <span style={{ fontWeight: 700, textDecoration: 'underline' }}>{offerData.employeeName || '………………'}</span>, hereby accept the offer of employment with <span style={{ fontWeight: 700 }}>{companySettings.companyName}</span> and agree to abide by the terms and conditions mentioned above.
              </p>

              <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '5px', fontFamily: 'monospace', fontSize: '12px' }}>
                <p style={{ margin: 0 }}>Signature:____________________</p>
                <p style={{ margin: 0 }}>Name: <span style={{ fontWeight: 600 }}>{offerData.employeeName || '_______________________'}</span></p>
                <p style={{ margin: 0 }}>Date: _______________________</p>
              </div>
            </div>
          </div>

          <LetterheadFooter pageNum={2} totalPages={2} />
        </div>
      </div>
    );
  };

  /* =========================================================================
     2. APPOINTMENT LETTER CONTENT (2 Pages)
     ========================================================================= */
  const renderAppointmentLetter = (isOffScreenPrint = false) => {
    if (!appointmentData) return null;
    const ctcFormatted = typeof appointmentData.ctcAmount === 'number' 
      ? formatIndianCurrency(appointmentData.ctcAmount) 
      : appointmentData.ctcAmount;

    return (
      <div 
        id={isOffScreenPrint ? undefined : 'printable-document'} 
        className={isOffScreenPrint ? undefined : 'flex flex-col gap-8 print:gap-0 font-document text-slate-900'}
      >
        {/* PAGE 1 */}
        <div 
          id={isOffScreenPrint ? undefined : 'doc-page-1'} 
          className={isOffScreenPrint ? 'pdf-page' : 'a4-page print-page bg-white shadow-lg border border-slate-200 mx-auto'}
          style={a4PageStyle}
        >
          <div style={{ flex: '1 1 0%', display: 'flex', flexDirection: 'column' }}>
            {showLetterhead && <LetterheadHeader isPrint={isOffScreenPrint} />}

            <div style={{ marginBottom: '12px' }}>
              <p style={{ margin: 0, fontSize: '12px', fontWeight: 500 }}>
                <span style={{ fontWeight: 700 }}>Date:</span> {formatDisplayDate(appointmentData.letterDate) || '………………..'}
              </p>
              {appointmentData.referenceNo && (
                <p style={{ margin: '2px 0 0 0', fontSize: '11px', color: '#475569' }}>
                  <span style={{ fontWeight: 600 }}>Ref:</span> {appointmentData.referenceNo}
                </p>
              )}
            </div>

            <div style={{ marginBottom: '14px', fontSize: '12px', lineHeight: '16px' }}>
              <p style={{ margin: 0, fontWeight: 700 }}>To,</p>
              <p style={{ margin: 0, fontWeight: 600 }}>{appointmentData.employeeName || '………………………'}</p>
              <div style={{ whiteSpace: 'pre-line', color: '#1e293b' }}>
                {appointmentData.employeeAddress || '………………………..'}
              </div>
            </div>

            <div style={{ textAlign: 'center', margin: '12px 0' }}>
              <h2 style={{ fontSize: '14px', fontWeight: 700, textDecoration: 'underline', letterSpacing: '0.02em', margin: 0 }}>
                Subject: Appointment Letter
              </h2>
            </div>

            <p style={{ margin: '0 0 10px 0', fontSize: '13px', lineHeight: '20px' }}>
              Dear <span style={{ fontWeight: 600 }}>{appointmentData.employeeName || '………………….'}</span>,
            </p>

            <p style={{ margin: '0 0 10px 0', fontSize: '13px', lineHeight: '20px', textAlign: 'justify' }}>
              We are pleased to appoint you as <span style={{ fontWeight: 700, textDecoration: 'underline' }}>{appointmentData.designation || '……………………………………..'}</span> with <span style={{ fontWeight: 700 }}>{companySettings.companyName}</span> effective from <span style={{ fontWeight: 700, textDecoration: 'underline' }}>{formatDisplayDate(appointmentData.effectiveDate) || '……………………..'}</span>, based on the discussions held with you and your acceptance of the terms and conditions outlined below.
            </p>

            <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '10px', textAlign: 'justify' }}>
              <div>
                <h3 style={{ fontSize: '13.5px', fontWeight: 700, margin: 0 }}>1. Designation and Reporting</h3>
                <p style={{ margin: '2px 0 0 0', fontSize: '13px', lineHeight: '19px' }}>
                  You will be designated as <span style={{ fontWeight: 700, textDecoration: 'underline' }}>{appointmentData.designation || '……………………………..'}</span> and will be based at <span style={{ fontWeight: 700, textDecoration: 'underline' }}>{appointmentData.workLocation || '………………..'}</span>. You will report to <span style={{ fontWeight: 700, textDecoration: 'underline' }}>{appointmentData.reportingManager || '…………………………………….'}</span> or any other person as designated by the management from time to time.
                </p>
              </div>

              <div>
                <h3 style={{ fontSize: '13.5px', fontWeight: 700, margin: 0 }}>2. Scope of Work</h3>
                <p style={{ margin: '2px 0 0 0', fontSize: '13px', lineHeight: '19px' }}>
                  Your responsibilities will include, but not be limited to, activities related to <span style={{ fontWeight: 500, textDecoration: 'underline' }}>{appointmentData.responsibilities || '……………………'}</span> associated with the company’s medical device and healthcare product portfolio. The company reserves the right to modify or expand your responsibilities based on business requirements.
                </p>
              </div>

              <div>
                <h3 style={{ fontSize: '13.5px', fontWeight: 700, margin: 0 }}>3. Compensation</h3>
                <p style={{ margin: '2px 0 0 0', fontSize: '13px', lineHeight: '19px' }}>
                  Your Cost to Company {appointmentData.ctcLabel || '……………'} will be INR <span style={{ fontWeight: 700, textDecoration: 'underline' }}>{ctcFormatted || '………………………………..'}</span> per annum, payable as per the company’s payroll policies. A detailed compensation structure will be provided separately. All statutory deductions such as Provident Fund, Professional Tax, Income Tax (TDS), and other applicable deductions will be made as per government regulations.
                </p>
              </div>

              <div>
                <h3 style={{ fontSize: '13.5px', fontWeight: 700, margin: 0 }}>4. Probation Period</h3>
                <p style={{ margin: '2px 0 0 0', fontSize: '13px', lineHeight: '19px' }}>
                  You will be on probation for a period of <span style={{ fontWeight: 600, textDecoration: 'underline' }}>{appointmentData.probationPeriod || '6 months'}</span> from the date of joining. During this period, your performance and suitability for the role will be evaluated. Upon satisfactory completion of the probation period, your appointment will be confirmed in writing.
                </p>
              </div>

              <div>
                <h3 style={{ fontSize: '13.5px', fontWeight: 700, margin: 0 }}>5. Working Hours and Leave</h3>
                <p style={{ margin: '2px 0 0 0', fontSize: '13px', lineHeight: '19px' }}>
                  Your working hours, weekly offs, and leave entitlement will be governed by the company’s HR policies, which may be amended from time to time.
                </p>
              </div>
            </div>
          </div>

          <LetterheadFooter pageNum={1} totalPages={2} />
        </div>

        {/* PAGE 2 */}
        <div 
          id={isOffScreenPrint ? undefined : 'doc-page-2'} 
          className={isOffScreenPrint ? 'pdf-page' : 'a4-page print-page bg-white shadow-lg border border-slate-200 mx-auto'}
          style={a4PageStyle}
        >
          <div style={{ flex: '1 1 0%', display: 'flex', flexDirection: 'column' }}>
            {showLetterhead && (
              <div 
                style={{
                  borderBottom: '1px solid #e2e8f0',
                  paddingBottom: '10px',
                  marginBottom: '16px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '11px',
                  color: '#64748b',
                  flexShrink: 0,
                }}
              >
                <span style={{ fontWeight: 600, color: '#334155' }}>{companySettings.companyName} • Appointment Letter</span>
                <span>Employee: <strong style={{ color: '#0f172a' }}>{appointmentData.employeeName || 'Employee'}</strong></span>
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', textAlign: 'justify' }}>
              <div>
                <h3 style={{ fontSize: '13.5px', fontWeight: 700, margin: 0 }}>6. Confidentiality and Intellectual Property</h3>
                <p style={{ margin: '2px 0 0 0', fontSize: '13px', lineHeight: '19px' }}>
                  During your employment, you may have access to confidential information relating to the company’s products, technology, clinical data, regulatory documentation, business strategies, customer databases, and partner relationships. You are required to maintain strict confidentiality of such information during and after your employment with the company.
                </p>
                <p style={{ margin: '2px 0 0 0', fontSize: '13px', lineHeight: '19px' }}>
                  Any intellectual property, invention, or development created during the course of your employment will remain the property of the company.
                </p>
              </div>

              <div>
                <h3 style={{ fontSize: '13.5px', fontWeight: 700, margin: 0 }}>7. Compliance with Laws and Policies</h3>
                <p style={{ margin: '2px 0 0 0', fontSize: '13px', lineHeight: '19px' }}>
                  As a medical device company, {companySettings.companyName} operates under strict regulatory and ethical standards. You are required to comply with all company policies, applicable healthcare regulations, and government laws, including guidelines related to medical device marketing, regulatory compliance, and ethical business practices.
                </p>
              </div>

              <div>
                <h3 style={{ fontSize: '13.5px', fontWeight: 700, margin: 0 }}>8. Transfer and Mobility</h3>
                <p style={{ margin: '2px 0 0 0', fontSize: '13px', lineHeight: '19px' }}>
                  Your services may be transferred or assigned to any department, branch, project location, or associated business partner of the company depending on business requirements.
                </p>
              </div>

              <div>
                <h3 style={{ fontSize: '13.5px', fontWeight: 700, margin: 0 }}>9. Termination of Employment</h3>
                <p style={{ margin: '2px 0 0 0', fontSize: '13px', lineHeight: '19px' }}>
                  Either party may terminate the employment by providing <span style={{ fontWeight: 600, textDecoration: 'underline' }}>{appointmentData.noticePeriod || '………….'}</span>’ written notice or salary in lieu thereof, subject to company policies. The company reserves the right to terminate your employment without notice in cases of misconduct, breach of confidentiality, violation of company policies, or non-compliance with applicable regulations.
                </p>
              </div>

              <div>
                <h3 style={{ fontSize: '13.5px', fontWeight: 700, margin: 0 }}>10. Background Verification</h3>
                <p style={{ margin: '2px 0 0 0', fontSize: '13px', lineHeight: '19px' }}>
                  This appointment is subject to verification of your educational qualifications, previous employment records, and other credentials. If any information provided by you is found to be false or misleading, the company reserves the right to terminate your employment immediately.
                </p>
              </div>
            </div>

            {/* SIGNATURE SECTION */}
            <SignatoryBlock />

            {/* ACCEPTANCE OF APPOINTMENT */}
            <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid #cbd5e1' }}>
              <h3 style={{ fontSize: '13.5px', fontWeight: 700, margin: '0 0 6px 0', textDecoration: 'underline' }}>Acceptance of Appointment</h3>
              <p style={{ margin: '0 0 6px 0', fontSize: '12px', lineHeight: '17px', textAlign: 'justify' }}>
                Please sign and return a copy of this letter as a token of your acceptance of the terms and conditions mentioned above.
              </p>
              <p style={{ margin: '0 0 10px 0', fontSize: '12px', lineHeight: '17px', textAlign: 'justify' }}>
                We welcome you to {companySettings.companyName} and look forward to your valuable contribution towards the growth of the organization and advancement of healthcare solutions.
              </p>

              <div style={{ marginTop: '10px' }}>
                <p style={{ margin: 0, fontWeight: 700, fontSize: '12px' }}>Signature of candidate: ____________________</p>
                <div style={{ marginTop: '4px', fontSize: '12px', color: '#475569' }}>
                  <span>Name: <strong style={{ color: '#0f172a' }}>{appointmentData.employeeName}</strong></span>
                  <span style={{ margin: '0 8px' }}>•</span>
                  <span>Date: ____________________</span>
                </div>
              </div>
            </div>
          </div>

          <LetterheadFooter pageNum={2} totalPages={2} />
        </div>
      </div>
    );
  };

  /* =========================================================================
     3. PROMOTION LETTER CONTENT (1 Page)
     ========================================================================= */
  const renderPromotionLetter = (isOffScreenPrint = false) => {
    if (!promotionData) return null;

    return (
      <div 
        id={isOffScreenPrint ? undefined : 'printable-document'} 
        className={isOffScreenPrint ? undefined : 'font-document text-slate-900'}
      >
        <div 
          id={isOffScreenPrint ? undefined : 'doc-page-1'} 
          className={isOffScreenPrint ? 'pdf-page' : 'a4-page print-page bg-white shadow-lg border border-slate-200 mx-auto'}
          style={a4PageStyle}
        >
          <div style={{ flex: '1 1 0%', display: 'flex', flexDirection: 'column' }}>
            {showLetterhead && <LetterheadHeader isPrint={isOffScreenPrint} />}

            <div style={{ marginBottom: '14px' }}>
              <p style={{ margin: 0, fontSize: '12px', fontWeight: 500 }}>
                <span style={{ fontWeight: 700 }}>Date:-</span> {formatDisplayDate(promotionData.letterDate) || '……………………'}
              </p>
              {promotionData.referenceNo && (
                <p style={{ margin: '2px 0 0 0', fontSize: '11px', color: '#475569' }}>
                  <span style={{ fontWeight: 600 }}>Ref:</span> {promotionData.referenceNo}
                </p>
              )}
            </div>

            <div style={{ marginBottom: '16px', fontSize: '12px', lineHeight: '16px' }}>
              <p style={{ margin: 0, fontWeight: 700 }}>To,</p>
              <p style={{ margin: 0, fontWeight: 600 }}>{promotionData.employeeName || '……………………..'}</p>
              <div style={{ whiteSpace: 'pre-line', color: '#1e293b' }}>
                {promotionData.employeeAddress || '…………………………..'}
              </div>
            </div>

            <div style={{ textAlign: 'center', margin: '16px 0' }}>
              <h2 style={{ fontSize: '14px', fontWeight: 700, textDecoration: 'underline', letterSpacing: '0.02em', margin: 0 }}>
                Subject: Promotion to {promotionData.newDesignation || '……………………………'}
              </h2>
            </div>

            <p style={{ margin: '0 0 12px 0', fontSize: '13px', lineHeight: '20px' }}>
              Dear <span style={{ fontWeight: 600 }}>{promotionData.employeeName || '…………………….'}</span>,
            </p>

            <p style={{ margin: '0 0 14px 0', fontSize: '13px', lineHeight: '20px', textAlign: 'justify' }}>
              We are pleased to inform you of your promotion to the position of <span style={{ fontWeight: 700, textDecoration: 'underline' }}>{promotionData.newDesignation || '…………………………'}</span> with <span style={{ fontWeight: 700 }}>{companySettings.companyName}</span>, effective <span style={{ fontWeight: 700, textDecoration: 'underline' }}>{formatDisplayDate(promotionData.effectiveDate) || '……………………...'}</span>. This decision has been made in recognition of your outstanding performance, dedication, and contribution to our team.
            </p>

            <div style={{ marginTop: '14px', textAlign: 'justify' }}>
              <h3 style={{ fontSize: '14px', fontWeight: 700, textDecoration: 'underline', margin: 0 }}>1. Position and Duties</h3>
              <p style={{ margin: '6px 0 0 0', fontSize: '13px', lineHeight: '20px' }}>
                In your new role as <span style={{ fontWeight: 700, textDecoration: 'underline' }}>{promotionData.newDesignation || '………………………'}</span>, you will be responsible for <span style={{ fontWeight: 500, textDecoration: 'underline' }}>{promotionData.responsibilities || '………………………….'}</span>. We believe in your abilities and trust that you will continue to excel and play a key role in our organization's growth.
              </p>
            </div>

            {/* SIGNATURE SECTION */}
            <SignatoryBlock />
          </div>

          <LetterheadFooter pageNum={1} totalPages={1} />
        </div>
      </div>
    );
  };

  /* =========================================================================
     4. RELIEVING LETTER CONTENT (1 Page)
     ========================================================================= */
  const renderRelievingLetter = (isOffScreenPrint = false) => {
    if (!relievingData) return null;
    const isFemale = relievingData.gender === 'Female';
    const pronounPoss = isFemale ? 'her' : 'his';
    const pronounObj = isFemale ? 'her' : 'him';

    return (
      <div 
        id={isOffScreenPrint ? undefined : 'printable-document'} 
        className={isOffScreenPrint ? undefined : 'font-document text-slate-900'}
      >
        <div 
          id={isOffScreenPrint ? undefined : 'doc-page-1'} 
          className={isOffScreenPrint ? 'pdf-page' : 'a4-page print-page bg-white shadow-lg border border-slate-200 mx-auto'}
          style={a4PageStyle}
        >
          <div style={{ flex: '1 1 0%', display: 'flex', flexDirection: 'column' }}>
            {showLetterhead && <LetterheadHeader isPrint={isOffScreenPrint} />}

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
              <p style={{ margin: 0, fontSize: '12px', fontWeight: 500 }}>
                <span style={{ fontWeight: 700 }}>Date: -</span> {formatDisplayDate(relievingData.letterDate) || '………………….'}
              </p>
            </div>

            <div style={{ textAlign: 'center', margin: '20px 0' }}>
              <h2 style={{ fontSize: '14px', fontWeight: 700, textDecoration: 'underline', letterSpacing: '0.04em', textTransform: 'uppercase', margin: 0 }}>
                TO WHOM SO EVER IT MAY CONCERN
              </h2>
            </div>

            <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '13px', lineHeight: '21px', textAlign: 'justify' }}>
              <p style={{ margin: 0 }}>
                This is to certify that <span style={{ fontWeight: 700, textDecoration: 'underline' }}>{relievingData.employeeName || '……………………………'}</span> has worked with us from <span style={{ fontWeight: 600, textDecoration: 'underline' }}>{formatDisplayDate(relievingData.fromDate) || '………………………………..'}</span> to <span style={{ fontWeight: 600, textDecoration: 'underline' }}>{formatDisplayDate(relievingData.toDate) || '…………………………………'}</span> and was designated as <span style={{ fontWeight: 700, textDecoration: 'underline' }}>{relievingData.designation || '……………………………………..'}</span> at the time of leaving the organization.
              </p>

              <p style={{ margin: 0 }}>
                During {pronounPoss} above tenure we found {pronounObj} time to be regular, honest and diligent in duties and responsibilities.
              </p>

              <p style={{ margin: 0 }}>
                This is to certify that <span style={{ fontWeight: 700, textDecoration: 'underline' }}>{relievingData.employeeName || '…………………………………………….'}</span> holds no liabilities towards the company.
              </p>

              <p style={{ margin: 0 }}>
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
  };

  const renderActiveLetter = (isOffScreenPrint: boolean) => {
    switch (documentType) {
      case 'offer':
        return renderOfferLetter(isOffScreenPrint);
      case 'appointment':
        return renderAppointmentLetter(isOffScreenPrint);
      case 'promotion':
        return renderPromotionLetter(isOffScreenPrint);
      case 'relieving':
        return renderRelievingLetter(isOffScreenPrint);
      default:
        return null;
    }
  };

  return (
    <>
      {/* 1. Interactive Responsive Screen Preview */}
      <div className="relative">
        {renderActiveLetter(false)}
      </div>

      {/* 2. Isolated, Dedicated Off-Screen Print DOM Container strictly for PDF export */}
      <div 
        id="pdf-render-target" 
        style={{
          position: 'absolute',
          left: '-9999px',
          top: '0',
          width: '794px',
          background: '#ffffff',
          pointerEvents: 'none',
          zIndex: -1,
        }}
        aria-hidden="true"
      >
        {renderActiveLetter(true)}
      </div>
    </>
  );
};
