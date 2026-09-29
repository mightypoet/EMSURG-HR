import React, { useState } from 'react';
import { CompanySettings } from '../types';
import { Building2, Save, RotateCcw, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { defaultCompanySettings } from '../data/initialData';

interface SettingsViewProps {
  settings: CompanySettings;
  onUpdateSettings: (newSettings: CompanySettings) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  onUpdateSettings,
}) => {
  const [formData, setFormData] = useState<CompanySettings>(settings);
  const [toast, setToast] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings(formData);
    setToast('Company settings successfully updated.');
    setTimeout(() => setToast(null), 3000);
  };

  const handleReset = () => {
    setFormData(defaultCompanySettings);
    onUpdateSettings(defaultCompanySettings);
    setToast('Reset settings to standard corporate defaults.');
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {toast && (
        <div className="p-3 bg-teal-50 border border-teal-200 text-teal-800 rounded-lg text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-teal-600" />
          <span>{toast}</span>
        </div>
      )}

      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Building2 className="w-5 h-5 text-teal-600" />
            <span>Corporate Letterhead &amp; HR Configuration</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure signing authority, registration details, and default letter metadata for Emsurg Healthcare India Pvt. Ltd.
          </p>
        </div>

        <button
          type="button"
          onClick={handleReset}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-200 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Defaults</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-6">
        {/* Company Identity */}
        <div>
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-4 pb-2 border-b border-slate-100">
            Company Identity &amp; Registration
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Full Legal Entity Name *
              </label>
              <input
                type="text"
                required
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                className="w-full text-xs px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Corporate Identification Number (CIN) *
              </label>
              <input
                type="text"
                value={formData.cin}
                onChange={(e) => setFormData({ ...formData, cin: e.target.value })}
                className="w-full text-xs px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Registered Office Address Line 1
              </label>
              <input
                type="text"
                value={formData.addressLine1}
                onChange={(e) => setFormData({ ...formData, addressLine1: e.target.value })}
                className="w-full text-xs px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                City, State &amp; PIN Code
              </label>
              <input
                type="text"
                value={formData.cityStateZip}
                onChange={(e) => setFormData({ ...formData, cityStateZip: e.target.value })}
                className="w-full text-xs px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Official HR Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full text-xs px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Official Phone Number(s)
              </label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full text-xs px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="e.g. 033-2560 0045, 7439757452"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Official Website
              </label>
              <input
                type="text"
                value={formData.website || ''}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                className="w-full text-xs px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="e.g. www.emsurg.com"
              />
            </div>
          </div>
        </div>

        {/* Signing Authority */}
        <div>
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-4 pb-2 border-b border-slate-100 flex items-center justify-between">
            <span>Signing Authority (Source of Truth)</span>
            <span className="text-[10px] text-teal-700 font-semibold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Template Signatory
            </span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Signatory Name *
              </label>
              <input
                type="text"
                required
                value={formData.signatoryName}
                onChange={(e) => setFormData({ ...formData, signatoryName: e.target.value })}
                className="w-full text-xs px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 font-semibold"
                placeholder="e.g. Swarnali Dey"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Signatory Designation / Department *
              </label>
              <input
                type="text"
                required
                value={formData.signatoryTitle}
                onChange={(e) => setFormData({ ...formData, signatoryTitle: e.target.value })}
                className="w-full text-xs px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="e.g. General Manager Admin & HR"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Letter Reference Prefix
              </label>
              <input
                type="text"
                value={formData.letterRefPrefix}
                onChange={(e) => setFormData({ ...formData, letterRefPrefix: e.target.value })}
                className="w-full text-xs px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 font-mono"
                placeholder="e.g. EHIPL/HR"
              />
            </div>
          </div>
        </div>

        {/* Authorized Digital Signature & Company Seal Stamp */}
        <div className="pt-2">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-4 pb-2 border-b border-slate-100 flex items-center justify-between">
            <span>Authorized Digital Signature &amp; Company Seal</span>
            <span className="text-[10px] text-slate-500">Transparent PNG or SVG Recommended</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Signature Upload & Toggle */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-800">Signatory Digital Signature</h4>
                  <p className="text-[11px] text-slate-500">Official signature of {formData.signatoryName}</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.showSignature}
                    onChange={(e) => setFormData({ ...formData, showSignature: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-teal-600"></div>
                </label>
              </div>

              {/* Signature Preview Box */}
              <div className="h-20 bg-white rounded-lg border border-slate-200 flex items-center justify-center p-2 relative overflow-hidden">
                {formData.signatureImage ? (
                  <img
                    src={formData.signatureImage}
                    alt="Active Signature"
                    className="max-h-16 max-w-full object-contain"
                  />
                ) : (
                  <span className="text-xs text-slate-400 italic">No signature uploaded</span>
                )}
                {!formData.showSignature && (
                  <div className="absolute inset-0 bg-slate-100/80 backdrop-blur-2xs flex items-center justify-center text-xs font-medium text-slate-500">
                    Signature Display Disabled
                  </div>
                )}
              </div>

              {/* Upload Input & Reset */}
              <div className="flex items-center gap-2">
                <label className="flex-1 cursor-pointer">
                  <span className="block text-center py-1.5 px-3 rounded-lg text-xs font-semibold bg-white border border-slate-200 hover:border-teal-400 hover:text-teal-700 text-slate-700 transition-colors shadow-2xs">
                    Upload New Signature (PNG/SVG)
                  </span>
                  <input
                    type="file"
                    accept="image/png,image/svg+xml,image/jpeg,image/webp"
                    className="hidden"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = () => {
                          if (typeof reader.result === 'string') {
                            setFormData({
                              ...formData,
                              signatureImage: reader.result,
                              showSignature: true,
                            });
                          }
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </label>

                <button
                  type="button"
                  onClick={() =>
                    setFormData({
                      ...formData,
                      signatureImage: defaultCompanySettings.signatureImage,
                      showSignature: true,
                    })
                  }
                  className="px-2.5 py-1.5 rounded-lg text-[11px] font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-200 cursor-pointer"
                  title="Restore default Swarnali Dey signature"
                >
                  Restore Default
                </button>
              </div>
            </div>

            {/* Seal Stamp Upload & Toggle */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-800">Official Company Seal Stamp</h4>
                  <p className="text-[11px] text-slate-500">Emsurg Healthcare India Pvt. Ltd. Seal</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.showStamp}
                    onChange={(e) => setFormData({ ...formData, showStamp: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-teal-600"></div>
                </label>
              </div>

              {/* Stamp Preview Box */}
              <div className="h-20 bg-white rounded-lg border border-slate-200 flex items-center justify-center p-2 relative overflow-hidden">
                {formData.stampImage ? (
                  <img
                    src={formData.stampImage}
                    alt="Active Seal Stamp"
                    className="max-h-16 max-w-full object-contain"
                  />
                ) : (
                  <span className="text-xs text-slate-400 italic">No seal stamp uploaded</span>
                )}
                {!formData.showStamp && (
                  <div className="absolute inset-0 bg-slate-100/80 backdrop-blur-2xs flex items-center justify-center text-xs font-medium text-slate-500">
                    Seal Stamp Display Disabled
                  </div>
                )}
              </div>

              {/* Upload Input & Reset */}
              <div className="flex items-center gap-2">
                <label className="flex-1 cursor-pointer">
                  <span className="block text-center py-1.5 px-3 rounded-lg text-xs font-semibold bg-white border border-slate-200 hover:border-teal-400 hover:text-teal-700 text-slate-700 transition-colors shadow-2xs">
                    Upload Seal Stamp (PNG/SVG)
                  </span>
                  <input
                    type="file"
                    accept="image/png,image/svg+xml,image/jpeg,image/webp"
                    className="hidden"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = () => {
                          if (typeof reader.result === 'string') {
                            setFormData({
                              ...formData,
                              stampImage: reader.result,
                              showStamp: true,
                            });
                          }
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </label>

                <button
                  type="button"
                  onClick={() =>
                    setFormData({
                      ...formData,
                      stampImage: defaultCompanySettings.stampImage,
                      showStamp: true,
                    })
                  }
                  className="px-2.5 py-1.5 rounded-lg text-[11px] font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-200 cursor-pointer"
                  title="Restore default company seal"
                >
                  Restore Default
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Save button */}
        <div className="pt-4 border-t border-slate-200 flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg text-xs font-semibold bg-teal-600 hover:bg-teal-500 text-white shadow-sm transition-all cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save Configuration</span>
          </button>
        </div>
      </form>
    </div>
  );
};
