import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Retrieve Supabase environment secrets
const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL || '').trim();
const supabaseKey = (
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  ''
).trim();

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseKey &&
  supabaseUrl.startsWith('http') &&
  !supabaseUrl.includes('placeholder') &&
  !supabaseKey.includes('placeholder')
);

// Fallback dummy client if credentials are not configured yet, preventing runtime init errors
export const supabase: SupabaseClient = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  : (createClient('https://mock-instance.supabase.co', 'mock-anon-key', {
      auth: { persistSession: false },
    }) as any);

export interface ConnectionStatusResult {
  isConnected: boolean;
  isConfigured: boolean;
  message: string;
  url?: string;
  latencyMs?: number;
  tablesFound?: string[];
}

/**
 * Tests connection with a lightweight query to Supabase.
 */
export async function checkSupabaseConnection(): Promise<ConnectionStatusResult> {
  if (!isSupabaseConfigured) {
    return {
      isConnected: false,
      isConfigured: false,
      message: 'Supabase credentials missing in environment variables (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY).',
    };
  }

  const startTime = performance.now();

  try {
    // Attempt lightweight ping by querying employees or checking schema
    const { data, error } = await supabase
      .from('employees')
      .select('id')
      .limit(1);

    const latency = Math.round(performance.now() - startTime);

    if (error) {
      // If table 'employees' does not exist yet (error 42P01 in postgres or relation doesn't exist),
      // the Supabase instance is still reachable!
      if (
        error.code === '42P01' ||
        error.message?.toLowerCase().includes('does not exist') ||
        error.message?.toLowerCase().includes('relation')
      ) {
        return {
          isConnected: true,
          isConfigured: true,
          latencyMs: latency,
          message: 'Connected to Supabase (Table `employees` not created yet, using fallback/sync).',
          url: supabaseUrl,
        };
      }

      console.warn('Supabase ping check error:', error.message);
      return {
        isConnected: false,
        isConfigured: true,
        latencyMs: latency,
        message: `Supabase reachable but returned error: ${error.message}`,
        url: supabaseUrl,
      };
    }

    return {
      isConnected: true,
      isConfigured: true,
      latencyMs: latency,
      message: 'Connected directly to Supabase Postgres database.',
      url: supabaseUrl,
    };
  } catch (err: any) {
    console.warn('Supabase connection check network exception:', err);
    return {
      isConnected: false,
      isConfigured: true,
      message: err?.message || 'Network error connecting to Supabase endpoint.',
      url: supabaseUrl,
    };
  }
}
