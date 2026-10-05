import React, { useState, useEffect } from 'react';
import { checkSupabaseConnection, ConnectionStatusResult } from '../lib/supabaseClient';
import { Database, CheckCircle2, AlertTriangle, RefreshCw, Server } from 'lucide-react';

interface SupabaseStatusBadgeProps {
  variant?: 'pill' | 'card' | 'footer';
  onStatusChange?: (status: ConnectionStatusResult) => void;
}

export const SupabaseStatusBadge: React.FC<SupabaseStatusBadgeProps> = ({
  variant = 'pill',
  onStatusChange,
}) => {
  const [status, setStatus] = useState<ConnectionStatusResult>({
    isConnected: false,
    isConfigured: false,
    message: 'Checking Supabase connection...',
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const runCheck = async () => {
    setIsLoading(true);
    try {
      const res = await checkSupabaseConnection();
      setStatus(res);
      onStatusChange?.(res);
    } catch (err: any) {
      const failed = {
        isConnected: false,
        isConfigured: false,
        message: err?.message || 'Connection check failed.',
      };
      setStatus(failed);
      onStatusChange?.(failed);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    runCheck();
  }, []);

  if (variant === 'card') {
    return (
      <div className={`p-4 rounded-xl border transition-all ${
        status.isConnected 
          ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950' 
          : 'bg-amber-50/70 border-amber-200 text-amber-950'
      }`}>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
              status.isConnected ? 'bg-emerald-600 text-white' : 'bg-amber-500 text-white'
            }`}>
              <Database className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-xs font-bold">
                  {status.isConnected ? 'Connected to Supabase' : 'Fallback: Using Local Mock Data'}
                </h4>
                <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full uppercase tracking-wider ${
                  status.isConnected 
                    ? 'bg-emerald-200 text-emerald-900' 
                    : 'bg-amber-200 text-amber-900'
                }`}>
                  {status.isConnected ? 'Active Database' : 'Local Fallback'}
                </span>
              </div>
              <p className="text-[11px] text-slate-600 mt-0.5">
                {status.message}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={runCheck}
            disabled={isLoading}
            className="px-2.5 py-1 text-[11px] font-semibold rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 flex items-center gap-1.5 shadow-2xs cursor-pointer disabled:opacity-50"
            title="Re-test database connection"
          >
            <RefreshCw className={`w-3 h-3 ${isLoading ? 'animate-spin' : ''}`} />
            <span>{isLoading ? 'Checking...' : 'Ping Test'}</span>
          </button>
        </div>

        {status.latencyMs !== undefined && status.isConnected && (
          <div className="mt-2.5 pt-2 border-t border-emerald-200/60 flex items-center gap-4 text-[11px] text-emerald-800">
            <span>Latency: <strong className="font-mono">{status.latencyMs}ms</strong></span>
            {status.url && (
              <span className="truncate">Endpoint: <strong className="font-mono">{status.url}</strong></span>
            )}
          </div>
        )}
      </div>
    );
  }

  if (variant === 'footer') {
    return (
      <div className="flex items-center gap-1.5 text-[11px]">
        {status.isConnected ? (
          <span className="flex items-center gap-1 text-emerald-700 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Connected to Supabase</span>
          </span>
        ) : (
          <span className="flex items-center gap-1 text-amber-700 font-medium">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <span>Fallback: Using Local Mock Data</span>
          </span>
        )}
      </div>
    );
  }

  // Default 'pill'
  return (
    <div
      onClick={runCheck}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border transition-all cursor-pointer shadow-2xs ${
        status.isConnected
          ? 'bg-emerald-50 border-emerald-300 text-emerald-800 hover:bg-emerald-100'
          : 'bg-amber-50 border-amber-300 text-amber-800 hover:bg-amber-100'
      }`}
      title={status.message}
    >
      {isLoading ? (
        <RefreshCw className="w-3 h-3 animate-spin text-slate-500" />
      ) : status.isConnected ? (
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
        </span>
      ) : (
        <span className="inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
      )}
      <span>{status.isConnected ? 'Connected to Supabase' : 'Fallback: Using Local Mock Data'}</span>
    </div>
  );
};
