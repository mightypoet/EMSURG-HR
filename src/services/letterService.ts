import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { DocumentRecord, DocumentType } from '../types';
import { initialDocumentHistory } from '../data/initialData';

const LOCAL_STORAGE_KEY = 'emsurg_documents';

function getLocalDocuments(): DocumentRecord[] {
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch (err) {
    console.warn('Error reading documents from localStorage:', err);
  }
  return initialDocumentHistory;
}

function setLocalDocuments(documents: DocumentRecord[]): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(documents));
  } catch (err) {
    console.warn('Error saving documents to localStorage:', err);
  }
}

function mapSupabaseRowToLetter(row: any): DocumentRecord {
  return {
    id: String(row.id),
    documentType: (row.document_type || row.documentType || row.type || 'offer') as DocumentType,
    title: row.title || 'Corporate Letter',
    employeeId: row.employee_id || row.employeeId || '',
    employeeName: row.employee_name || row.employeeName || 'Candidate',
    employeeEmail: row.employee_email || row.employeeEmail || '',
    designation: row.designation || '',
    dateGenerated: row.date_generated || row.dateGenerated || new Date().toISOString().split('T')[0],
    referenceNo: row.reference_no || row.referenceNo || 'EHIPL/HR',
    status: (row.status || 'Generated') as any,
    fileName: row.file_name || row.fileName || 'letter.pdf',
    data: typeof row.data === 'object' && row.data !== null ? row.data : (typeof row.payload === 'object' ? row.payload : {}),
  };
}

function mapLetterToSupabaseRow(doc: DocumentRecord): Record<string, any> {
  return {
    id: doc.id,
    document_type: doc.documentType,
    title: doc.title,
    employee_id: doc.employeeId || null,
    employee_name: doc.employeeName,
    employee_email: doc.employeeEmail,
    designation: doc.designation,
    date_generated: doc.dateGenerated,
    reference_no: doc.referenceNo,
    status: doc.status,
    file_name: doc.fileName,
    data: doc.data,
    created_at: new Date().toISOString(),
  };
}

/**
 * Fetches all saved letters from Supabase (or local storage fallback).
 */
export async function getLetters(): Promise<{ data: DocumentRecord[]; fromSupabase: boolean; error?: string }> {
  if (!isSupabaseConfigured) {
    return { data: getLocalDocuments(), fromSupabase: false };
  }

  try {
    // Attempt querying 'letters' table first, or 'documents' table
    let { data, error } = await supabase
      .from('letters')
      .select('*')
      .order('date_generated', { ascending: false });

    if (error && (error.code === '42P01' || error.message?.toLowerCase().includes('does not exist'))) {
      // Try fallback table name 'documents'
      const docQuery = await supabase
        .from('documents')
        .select('*')
        .order('date_generated', { ascending: false });
      data = docQuery.data;
      error = docQuery.error;
    }

    if (error) {
      console.warn('Supabase getLetters query warning, using local cache:', error.message);
      return { data: getLocalDocuments(), fromSupabase: false, error: error.message };
    }

    if (data && data.length > 0) {
      const mapped = data.map(mapSupabaseRowToLetter);
      setLocalDocuments(mapped);
      return { data: mapped, fromSupabase: true };
    }

    return { data: getLocalDocuments(), fromSupabase: true };
  } catch (err: any) {
    console.warn('Supabase getLetters exception:', err);
    return { data: getLocalDocuments(), fromSupabase: false, error: err?.message };
  }
}

/**
 * Inserts or updates a letter into Supabase and updates local cache.
 */
export async function saveLetter(
  doc: DocumentRecord
): Promise<{ data: DocumentRecord; savedToSupabase: boolean; error?: string }> {
  // Update local cache
  const current = getLocalDocuments();
  const existingIdx = current.findIndex((d) => d.id === doc.id);
  let updatedList: DocumentRecord[];
  if (existingIdx >= 0) {
    updatedList = [...current];
    updatedList[existingIdx] = doc;
  } else {
    updatedList = [doc, ...current];
  }
  setLocalDocuments(updatedList);

  if (!isSupabaseConfigured) {
    return { data: doc, savedToSupabase: false };
  }

  try {
    const row = mapLetterToSupabaseRow(doc);
    let { data, error } = await supabase
      .from('letters')
      .upsert(row)
      .select()
      .single();

    if (error && (error.code === '42P01' || error.message?.toLowerCase().includes('does not exist'))) {
      const docUpsert = await supabase
        .from('documents')
        .upsert(row)
        .select()
        .single();
      data = docUpsert.data;
      error = docUpsert.error;
    }

    if (error) {
      console.warn('Supabase saveLetter warning:', error.message);
      return { data: doc, savedToSupabase: false, error: error.message };
    }

    const saved = data ? mapSupabaseRowToLetter(data) : doc;
    return { data: saved, savedToSupabase: true };
  } catch (err: any) {
    console.warn('Supabase saveLetter exception:', err);
    return { data: doc, savedToSupabase: false, error: err?.message };
  }
}

/**
 * Deletes a letter from Supabase and local cache.
 */
export async function deleteLetter(
  id: string
): Promise<{ success: boolean; deletedFromSupabase: boolean; error?: string }> {
  const current = getLocalDocuments();
  const updatedList = current.filter((d) => d.id !== id);
  setLocalDocuments(updatedList);

  if (!isSupabaseConfigured) {
    return { success: true, deletedFromSupabase: false };
  }

  try {
    let { error } = await supabase.from('letters').delete().eq('id', id);
    if (error && (error.code === '42P01' || error.message?.toLowerCase().includes('does not exist'))) {
      const docDel = await supabase.from('documents').delete().eq('id', id);
      error = docDel.error;
    }

    if (error) {
      console.warn('Supabase deleteLetter warning:', error.message);
      return { success: true, deletedFromSupabase: false, error: error.message };
    }

    return { success: true, deletedFromSupabase: true };
  } catch (err: any) {
    console.warn('Supabase deleteLetter exception:', err);
    return { success: true, deletedFromSupabase: false, error: err?.message };
  }
}
