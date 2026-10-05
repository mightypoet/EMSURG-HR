import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { Employee } from '../types';
import { initialEmployees } from '../data/initialData';

const LOCAL_STORAGE_KEY = 'emsurg_employees';

function getLocalEmployees(): Employee[] {
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch (err) {
    console.warn('Error reading employees from localStorage:', err);
  }
  return initialEmployees;
}

function setLocalEmployees(employees: Employee[]): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(employees));
  } catch (err) {
    console.warn('Error saving employees to localStorage:', err);
  }
}

function mapSupabaseRowToEmployee(row: any): Employee {
  return {
    id: String(row.id),
    employeeId: row.employee_id || row.employeeId || row.id,
    name: row.name || 'Unnamed Employee',
    personalEmail: row.personal_email || row.personalEmail || '',
    officialEmail: row.official_email || row.officialEmail || '',
    phone: row.phone || '',
    address: row.address || '',
    designation: row.designation || '',
    department: row.department || '',
    location: row.location || '',
    reportingManager: row.reporting_manager || row.reportingManager || '',
    dateOfJoining: row.date_of_joining || row.dateOfJoining || new Date().toISOString().split('T')[0],
    currentCtc: Number(row.current_ctc ?? row.currentCtc ?? 0),
    employmentStatus: row.employment_status || row.employmentStatus || 'Active',
    gender: row.gender || 'Male',
    relievingDate: row.relieving_date || row.relievingDate,
    notes: row.notes || '',
    createdAt: row.created_at || row.createdAt || new Date().toISOString(),
  };
}

function mapEmployeeToSupabaseRow(emp: Employee): Record<string, any> {
  return {
    id: emp.id,
    employee_id: emp.employeeId,
    name: emp.name,
    personal_email: emp.personalEmail,
    official_email: emp.officialEmail,
    phone: emp.phone,
    address: emp.address,
    designation: emp.designation,
    department: emp.department,
    location: emp.location,
    reporting_manager: emp.reportingManager,
    date_of_joining: emp.dateOfJoining,
    current_ctc: emp.currentCtc,
    employment_status: emp.employmentStatus,
    gender: emp.gender,
    relieving_date: emp.relievingDate || null,
    notes: emp.notes || null,
    created_at: emp.createdAt || new Date().toISOString(),
  };
}

/**
 * Fetches all employees from Supabase if connected, otherwise falls back to local storage.
 */
export async function getEmployees(): Promise<{ data: Employee[]; fromSupabase: boolean; error?: string }> {
  if (!isSupabaseConfigured) {
    return { data: getLocalEmployees(), fromSupabase: false };
  }

  try {
    const { data, error } = await supabase
      .from('employees')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Supabase getEmployees query returned error, using fallback:', error.message);
      return { data: getLocalEmployees(), fromSupabase: false, error: error.message };
    }

    if (data && data.length > 0) {
      const mapped = data.map(mapSupabaseRowToEmployee);
      // Cache in local storage for offline resilience
      setLocalEmployees(mapped);
      return { data: mapped, fromSupabase: true };
    }

    // Table is empty in Supabase, return local employees
    return { data: getLocalEmployees(), fromSupabase: true };
  } catch (err: any) {
    console.warn('Supabase getEmployees exception:', err);
    return { data: getLocalEmployees(), fromSupabase: false, error: err?.message };
  }
}

/**
 * Inserts or syncs an employee to Supabase and updates local storage.
 */
export async function createEmployee(
  employee: Employee
): Promise<{ data: Employee; savedToSupabase: boolean; error?: string }> {
  // Always update local cache first
  const current = getLocalEmployees();
  const updatedList = [employee, ...current.filter((e) => e.id !== employee.id)];
  setLocalEmployees(updatedList);

  if (!isSupabaseConfigured) {
    return { data: employee, savedToSupabase: false };
  }

  try {
    const row = mapEmployeeToSupabaseRow(employee);
    const { data, error } = await supabase
      .from('employees')
      .upsert(row)
      .select()
      .single();

    if (error) {
      console.warn('Supabase createEmployee error:', error.message);
      return { data: employee, savedToSupabase: false, error: error.message };
    }

    const saved = data ? mapSupabaseRowToEmployee(data) : employee;
    return { data: saved, savedToSupabase: true };
  } catch (err: any) {
    console.warn('Supabase createEmployee exception:', err);
    return { data: employee, savedToSupabase: false, error: err?.message };
  }
}

/**
 * Updates an employee in Supabase and local cache.
 */
export async function updateEmployee(
  employee: Employee
): Promise<{ data: Employee; savedToSupabase: boolean; error?: string }> {
  const current = getLocalEmployees();
  const updatedList = current.map((e) => (e.id === employee.id ? employee : e));
  setLocalEmployees(updatedList);

  if (!isSupabaseConfigured) {
    return { data: employee, savedToSupabase: false };
  }

  try {
    const row = mapEmployeeToSupabaseRow(employee);
    const { data, error } = await supabase
      .from('employees')
      .update(row)
      .eq('id', employee.id)
      .select()
      .maybeSingle();

    if (error) {
      console.warn('Supabase updateEmployee error:', error.message);
      return { data: employee, savedToSupabase: false, error: error.message };
    }

    const saved = data ? mapSupabaseRowToEmployee(data) : employee;
    return { data: saved, savedToSupabase: true };
  } catch (err: any) {
    console.warn('Supabase updateEmployee exception:', err);
    return { data: employee, savedToSupabase: false, error: err?.message };
  }
}

/**
 * Deletes an employee from Supabase and local cache.
 */
export async function deleteEmployee(
  id: string
): Promise<{ success: boolean; deletedFromSupabase: boolean; error?: string }> {
  const current = getLocalEmployees();
  const updatedList = current.filter((e) => e.id !== id);
  setLocalEmployees(updatedList);

  if (!isSupabaseConfigured) {
    return { success: true, deletedFromSupabase: false };
  }

  try {
    const { error } = await supabase
      .from('employees')
      .delete()
      .eq('id', id);

    if (error) {
      console.warn('Supabase deleteEmployee error:', error.message);
      return { success: true, deletedFromSupabase: false, error: error.message };
    }

    return { success: true, deletedFromSupabase: true };
  } catch (err: any) {
    console.warn('Supabase deleteEmployee exception:', err);
    return { success: true, deletedFromSupabase: false, error: err?.message };
  }
}
