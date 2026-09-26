import React, { useState, useMemo } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  UserPlus, 
  FileText, 
  TrendingUp, 
  Mail, 
  Phone, 
  MapPin, 
  Briefcase, 
  Calendar, 
  IndianRupee, 
  Edit, 
  Trash2, 
  Check, 
  X,
  FileCheck,
  ChevronRight,
  UserCheck,
  Building
} from 'lucide-react';
import { Employee, EmploymentStatus, DocumentRecord, DocumentType } from '../types';
import { formatIndianCurrency, formatDisplayDate } from '../utils/numberToWords';

interface EmployeeDirectoryProps {
  employees: Employee[];
  documents: DocumentRecord[];
  onAddEmployee: (emp: Employee) => void;
  onUpdateEmployee: (emp: Employee) => void;
  onDeleteEmployee: (empId: string) => void;
  onGenerateDocumentForEmployee: (employee: Employee, docType: DocumentType) => void;
}

export const EmployeeDirectory: React.FC<EmployeeDirectoryProps> = ({
  employees,
  documents,
  onAddEmployee,
  onUpdateEmployee,
  onDeleteEmployee,
  onGenerateDocumentForEmployee,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  // Form State for Add / Edit
  const [formData, setFormData] = useState<Partial<Employee>>({
    employeeId: '',
    name: '',
    personalEmail: '',
    officialEmail: '',
    phone: '',
    address: '',
    designation: '',
    department: 'Biomedical Field Engineering',
    location: 'Gurugram Corporate Office',
    reportingManager: '',
    dateOfJoining: new Date().toISOString().split('T')[0],
    currentCtc: 900000,
    employmentStatus: 'Active',
    gender: 'Male',
  });

  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  const departments = useMemo(() => {
    const deps = new Set(employees.map((e) => e.department));
    return ['All', ...Array.from(deps)];
  }, [employees]);

  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) => {
      const matchSearch =
        emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.designation.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.officialEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.personalEmail.toLowerCase().includes(searchTerm.toLowerCase());

      const matchDept = departmentFilter === 'All' || emp.department === departmentFilter;
      const matchStatus = statusFilter === 'All' || emp.employmentStatus === statusFilter;

      return matchSearch && matchDept && matchStatus;
    });
  }, [employees, searchTerm, departmentFilter, statusFilter]);

  const openAddModal = () => {
    setIsEditMode(false);
    setFormData({
      employeeId: `EH-${Math.floor(1000 + Math.random() * 9000)}`,
      name: '',
      personalEmail: '',
      officialEmail: '',
      phone: '',
      address: '',
      designation: '',
      department: 'Biomedical Field Engineering',
      location: 'Gurugram Corporate Office',
      reportingManager: 'Swarnali Dey, General Manager Admin & HR',
      dateOfJoining: new Date().toISOString().split('T')[0],
      currentCtc: 850000,
      employmentStatus: 'Active',
      gender: 'Male',
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const openEditModal = (emp: Employee) => {
    setIsEditMode(true);
    setFormData({ ...emp });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const validateForm = () => {
    const errors: { [key: string]: string } = {};
    if (!formData.name?.trim()) errors.name = 'Employee name is required.';
    if (!formData.employeeId?.trim()) errors.employeeId = 'Employee ID is required.';
    if (!formData.officialEmail?.trim()) errors.officialEmail = 'Official email is required.';
    if (!formData.designation?.trim()) errors.designation = 'Designation is required.';
    if (!formData.department?.trim()) errors.department = 'Department is required.';
    if (!formData.dateOfJoining) errors.dateOfJoining = 'Joining date is required.';
    if (!formData.reportingManager?.trim()) errors.reportingManager = 'Reporting manager is required.';
    if (!formData.currentCtc || Number(formData.currentCtc) <= 0) errors.currentCtc = 'Valid CTC is required.';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (isEditMode && formData.id) {
      onUpdateEmployee(formData as Employee);
      if (selectedEmployee?.id === formData.id) {
        setSelectedEmployee(formData as Employee);
      }
    } else {
      const newEmp: Employee = {
        ...(formData as Employee),
        id: `emp-${Date.now()}`,
        createdAt: new Date().toISOString(),
      };
      onAddEmployee(newEmp);
      setSelectedEmployee(newEmp);
    }

    setIsModalOpen(false);
  };

  // Find documents generated for selected employee
  const employeeDocuments = useMemo(() => {
    if (!selectedEmployee) return [];
    return documents.filter(
      (d) =>
        d.employeeId === selectedEmployee.id ||
        d.employeeName.toLowerCase() === selectedEmployee.name.toLowerCase()
    );
  }, [selectedEmployee, documents]);

  return (
    <div className="space-y-6">
      {/* Top Header & Search Controls */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Users className="w-5 h-5 text-teal-600" />
            <span>Employee Directory</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage Emsurg Healthcare personnel records, designations, compensation and generate official letters.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold bg-teal-600 hover:bg-teal-500 text-white shadow-sm transition-all cursor-pointer self-start md:self-auto"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add Employee</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, Employee ID, designation or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="flex items-center gap-1.5 text-xs text-slate-600 shrink-0">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span>Dept:</span>
          </div>
          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            {departments.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="On Probation">On Probation</option>
            <option value="Notice Period">Notice Period</option>
            <option value="Relieved">Relieved</option>
            <option value="Offer Extended">Offer Extended</option>
          </select>
        </div>
      </div>

      {/* Directory Grid / Split view */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Employee Cards List */}
        <div className="lg:col-span-2 space-y-3">
          {filteredEmployees.length === 0 ? (
            <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-500">
              <Users className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="font-semibold text-sm">No employees match your search criteria</p>
              <p className="text-xs text-slate-400 mt-1">Try resetting the search or filter filters</p>
            </div>
          ) : (
            filteredEmployees.map((emp) => {
              const isSelected = selectedEmployee?.id === emp.id;
              const statusBadgeColor =
                emp.employmentStatus === 'Active'
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : emp.employmentStatus === 'On Probation'
                  ? 'bg-amber-50 text-amber-700 border-amber-200'
                  : emp.employmentStatus === 'Notice Period'
                  ? 'bg-orange-50 text-orange-700 border-orange-200'
                  : emp.employmentStatus === 'Relieved'
                  ? 'bg-slate-100 text-slate-700 border-slate-300'
                  : 'bg-blue-50 text-blue-700 border-blue-200';

              return (
                <div
                  key={emp.id}
                  onClick={() => setSelectedEmployee(emp)}
                  className={`bg-white rounded-xl border p-4 sm:p-5 shadow-xs transition-all cursor-pointer ${
                    isSelected
                      ? 'border-teal-500 ring-2 ring-teal-500/20 shadow-sm'
                      : 'border-slate-200 hover:border-slate-300 hover:shadow-sm'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200 text-teal-700 flex items-center justify-center font-bold text-sm shrink-0 shadow-xs">
                        {emp.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-slate-900 text-sm hover:text-teal-700">
                            {emp.name}
                          </h3>
                          <span className="font-mono text-[11px] text-slate-500 font-semibold">
                            {emp.employeeId}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 font-medium mt-0.5">
                          {emp.designation}
                        </p>
                        <p className="text-[11px] text-slate-400">
                          {emp.department} • {emp.location}
                        </p>
                      </div>
                    </div>

                    <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-1.5 shrink-0">
                      <span className={`px-2 py-0.5 text-[11px] font-semibold rounded border uppercase tracking-wider ${statusBadgeColor}`}>
                        {emp.employmentStatus}
                      </span>
                      <span className="text-xs font-semibold text-slate-700">
                        ₹{formatIndianCurrency(emp.currentCtc)} / yr
                      </span>
                    </div>
                  </div>

                  {/* Quick Card Footer with Fast Actions */}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
                    <div className="text-[11px] text-slate-400">
                      Joined: <strong className="text-slate-600">{formatDisplayDate(emp.dateOfJoining)}</strong>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onGenerateDocumentForEmployee(emp, 'offer');
                        }}
                        className="px-2.5 py-1 rounded bg-teal-50 text-teal-700 font-semibold hover:bg-teal-100 text-[11px] cursor-pointer transition-colors"
                      >
                        + Offer
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onGenerateDocumentForEmployee(emp, 'promotion');
                        }}
                        className="px-2.5 py-1 rounded bg-blue-50 text-blue-700 font-semibold hover:bg-blue-100 text-[11px] cursor-pointer transition-colors"
                      >
                        + Promotion
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onGenerateDocumentForEmployee(emp, 'appointment');
                        }}
                        className="px-2.5 py-1 rounded bg-slate-100 text-slate-700 font-semibold hover:bg-slate-200 text-[11px] cursor-pointer transition-colors"
                      >
                        + Appointment
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right 1 Col: Employee Detail Profile Drawer */}
        <div className="space-y-4">
          {selectedEmployee ? (
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs sticky top-24">
              <div className="flex items-start justify-between pb-4 border-b border-slate-100">
                <div>
                  <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-teal-100 text-teal-800 uppercase tracking-wide">
                    {selectedEmployee.employeeId}
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 mt-1">
                    {selectedEmployee.name}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    {selectedEmployee.designation}
                  </p>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEditModal(selectedEmployee)}
                    className="p-1.5 text-slate-500 hover:text-teal-700 hover:bg-slate-100 rounded-lg cursor-pointer"
                    title="Edit Employee"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Information Rows */}
              <div className="py-4 space-y-3 text-xs border-b border-slate-100">
                <div className="flex items-start gap-2.5 text-slate-600">
                  <Mail className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-slate-800 font-semibold">{selectedEmployee.officialEmail}</p>
                    <p className="text-[11px] text-slate-400">Personal: {selectedEmployee.personalEmail}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 text-slate-600">
                  <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="text-slate-800">{selectedEmployee.phone}</span>
                </div>

                <div className="flex items-start gap-2.5 text-slate-600">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
                  <span className="text-slate-700 leading-snug">{selectedEmployee.address}</span>
                </div>

                <div className="flex items-center gap-2.5 text-slate-600">
                  <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{selectedEmployee.department} • {selectedEmployee.location}</span>
                </div>

                <div className="flex items-center gap-2.5 text-slate-600">
                  <UserCheck className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>Reporting To: <strong>{selectedEmployee.reportingManager}</strong></span>
                </div>

                <div className="flex items-center gap-2.5 text-slate-600">
                  <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>Joining Date: <strong>{formatDisplayDate(selectedEmployee.dateOfJoining)}</strong></span>
                </div>

                <div className="flex items-center gap-2.5 text-slate-600">
                  <IndianRupee className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>Annual CTC: <strong className="text-emerald-700 font-bold">₹{formatIndianCurrency(selectedEmployee.currentCtc)}</strong></span>
                </div>
              </div>

              {/* Document Generation Launchpad */}
              <div className="pt-4">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Generate Letter for {selectedEmployee.name.split(' ')[0]}
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => onGenerateDocumentForEmployee(selectedEmployee, 'offer')}
                    className="p-2.5 rounded-lg border border-teal-200 bg-teal-50/50 hover:bg-teal-100/70 text-teal-800 text-xs font-semibold text-center transition-colors cursor-pointer"
                  >
                    + Offer Letter
                  </button>
                  <button
                    onClick={() => onGenerateDocumentForEmployee(selectedEmployee, 'promotion')}
                    className="p-2.5 rounded-lg border border-blue-200 bg-blue-50/50 hover:bg-blue-100/70 text-blue-800 text-xs font-semibold text-center transition-colors cursor-pointer"
                  >
                    + Promotion Letter
                  </button>
                  <button
                    onClick={() => onGenerateDocumentForEmployee(selectedEmployee, 'appointment')}
                    className="p-2.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-800 text-xs font-semibold text-center transition-colors cursor-pointer"
                  >
                    + Appointment
                  </button>
                  <button
                    onClick={() => onGenerateDocumentForEmployee(selectedEmployee, 'relieving')}
                    className="p-2.5 rounded-lg border border-purple-200 bg-purple-50/50 hover:bg-purple-100/70 text-purple-800 text-xs font-semibold text-center transition-colors cursor-pointer"
                  >
                    + Relieving Letter
                  </button>
                </div>
              </div>

              {/* History of letters for this employee */}
              <div className="mt-5 pt-4 border-t border-slate-100">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center justify-between">
                  <span>Document History</span>
                  <span className="text-[10px] text-slate-400 font-normal">({employeeDocuments.length})</span>
                </h4>
                {employeeDocuments.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">No previous documents generated for this employee.</p>
                ) : (
                  <div className="space-y-2">
                    {employeeDocuments.map((doc) => (
                      <div key={doc.id} className="p-2 rounded bg-slate-50 border border-slate-200 text-xs flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-slate-800 capitalize">{doc.documentType} Letter</p>
                          <p className="text-[10px] text-slate-400">{formatDisplayDate(doc.dateGenerated)}</p>
                        </div>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-white text-slate-600 border border-slate-200">
                          {doc.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-slate-50 border border-dashed border-slate-300 rounded-xl p-8 text-center text-slate-400 text-xs">
              <Users className="w-8 h-8 mx-auto mb-2 text-slate-300" />
              Select an employee card to view full profile details and generate official letters.
            </div>
          )}
        </div>
      </div>

      {/* Add / Edit Employee Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden my-8">
            <div className="px-6 py-4 bg-gradient-to-r from-sky-50 to-white border-b border-sky-100 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base text-slate-900">
                  {isEditMode ? 'Edit Employee Record' : 'Add New Emsurg Healthcare Employee'}
                </h3>
                <p className="text-xs text-slate-500">
                  Accurate details populate directly into official offer, promotion, and appointment letters.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Employee ID */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Employee ID *
                  </label>
                  <input
                    type="text"
                    value={formData.employeeId}
                    onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                    className="w-full text-xs px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 font-mono"
                    placeholder="e.g. EH-1092"
                  />
                  {formErrors.employeeId && <p className="text-xs text-red-600 mt-1">{formErrors.employeeId}</p>}
                </div>

                {/* Full Name */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full text-xs px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="e.g. Dr. Rajesh Sharma"
                  />
                  {formErrors.name && <p className="text-xs text-red-600 mt-1">{formErrors.name}</p>}
                </div>

                {/* Designation */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Designation / Position *
                  </label>
                  <input
                    type="text"
                    value={formData.designation}
                    onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                    className="w-full text-xs px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="e.g. Senior Clinical Specialist"
                  />
                  {formErrors.designation && <p className="text-xs text-red-600 mt-1">{formErrors.designation}</p>}
                </div>

                {/* Department */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Department *
                  </label>
                  <input
                    type="text"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full text-xs px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="e.g. Clinical Affairs & Medical Advisory"
                  />
                  {formErrors.department && <p className="text-xs text-red-600 mt-1">{formErrors.department}</p>}
                </div>

                {/* Official Email */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Official Email *
                  </label>
                  <input
                    type="email"
                    value={formData.officialEmail}
                    onChange={(e) => setFormData({ ...formData, officialEmail: e.target.value })}
                    className="w-full text-xs px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="e.g. r.sharma@emsurghealthcare.com"
                  />
                  {formErrors.officialEmail && <p className="text-xs text-red-600 mt-1">{formErrors.officialEmail}</p>}
                </div>

                {/* Personal Email */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Personal Email
                  </label>
                  <input
                    type="email"
                    value={formData.personalEmail}
                    onChange={(e) => setFormData({ ...formData, personalEmail: e.target.value })}
                    className="w-full text-xs px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="e.g. rajesh.sharma@gmail.com"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full text-xs px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="e.g. +91 98112 34567"
                  />
                </div>

                {/* Work Location */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Work Location
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full text-xs px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="e.g. Gurugram Corporate Office"
                  />
                </div>

                {/* Reporting Manager */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Reporting Manager *
                  </label>
                  <input
                    type="text"
                    value={formData.reportingManager}
                    onChange={(e) => setFormData({ ...formData, reportingManager: e.target.value })}
                    className="w-full text-xs px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="e.g. Swarnali Dey, General Manager Admin & HR"
                  />
                  {formErrors.reportingManager && <p className="text-xs text-red-600 mt-1">{formErrors.reportingManager}</p>}
                </div>

                {/* Date of Joining */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Date of Joining *
                  </label>
                  <input
                    type="date"
                    value={formData.dateOfJoining}
                    onChange={(e) => setFormData({ ...formData, dateOfJoining: e.target.value })}
                    className="w-full text-xs px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                  {formErrors.dateOfJoining && <p className="text-xs text-red-600 mt-1">{formErrors.dateOfJoining}</p>}
                </div>

                {/* Current CTC in INR */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Annual CTC (INR) *
                  </label>
                  <input
                    type="number"
                    value={formData.currentCtc || ''}
                    onChange={(e) => setFormData({ ...formData, currentCtc: parseFloat(e.target.value) || 0 })}
                    className="w-full text-xs px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 font-semibold"
                    placeholder="e.g. 1200000"
                  />
                  {formErrors.currentCtc && <p className="text-xs text-red-600 mt-1">{formErrors.currentCtc}</p>}
                </div>

                {/* Employment Status */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Employment Status
                  </label>
                  <select
                    value={formData.employmentStatus}
                    onChange={(e) => setFormData({ ...formData, employmentStatus: e.target.value as EmploymentStatus })}
                    className="w-full text-xs px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="Active">Active</option>
                    <option value="On Probation">On Probation</option>
                    <option value="Notice Period">Notice Period</option>
                    <option value="Relieved">Relieved</option>
                    <option value="Offer Extended">Offer Extended</option>
                  </select>
                </div>
              </div>

              {/* Full Address */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Residential Address (as to appear in letters)
                </label>
                <textarea
                  rows={2}
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full text-xs px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="e.g. B-402, Oakwood Enclave, Sector 54, Golf Course Road, Gurugram, Haryana 122002"
                />
              </div>

              <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg text-xs font-semibold bg-teal-600 hover:bg-teal-500 text-white shadow-sm cursor-pointer"
                >
                  {isEditMode ? 'Update Employee' : 'Save Employee'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
