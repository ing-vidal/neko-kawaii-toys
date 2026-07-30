'use client';

import { useState } from 'react';
import { useToast } from '@hooks/useToast';

interface ImportReport {
  imported: number;
  errors: number;
  errorDetails: { row: number; error: string }[];
}

const CSV_TEMPLATE = 'nombre,descripcion,precio,stock,categoria,imagen,estado,sku\nEjemplo de Producto,Descripción del producto,29.99,10,Figuras,,active,SKU-001\n';

export function CsvImporter({ onSuccess }: { onSuccess: () => void }) {
  const { addToast } = useToast();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<ImportReport | null>(null);
  const [fileName, setFileName] = useState('');

  const handleFile = async (file: File) => {
    if (!file.name.endsWith('.csv')) {
      addToast('Solo se aceptan archivos .csv', 'error');
      return;
    }
    setFileName(file.name);
    setLoading(true);
    setReport(null);
    try {
      const text = await file.text();
      const res = await fetch('/api/admin/products/import', {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: text,
      });
      const data = (await res.json()) as ImportReport | { error: string };
      if ('error' in data) throw new Error(data.error);
      setReport(data as ImportReport);
      if ((data as ImportReport).imported > 0) {
        addToast(`${(data as ImportReport).imported} productos importados.`, 'success');
        onSuccess();
      }
    } catch (e) {
      addToast(e instanceof Error ? e.message : 'Error al importar CSV.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const downloadTemplate = () => {
    const blob = new Blob([CSV_TEMPLATE], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'plantilla-productos.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadErrorReport = () => {
    if (!report) return;
    const lines = ['fila,error', ...report.errorDetails.map((e) => `${e.row},"${e.error}"`)].join('\r\n');
    const blob = new Blob([lines], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'reporte-errores.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <button
        onClick={() => { setOpen(true); setReport(null); setFileName(''); }}
        className="flex h-9 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-600 hover:border-slate-300 hover:bg-slate-50 transition"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
        </svg>
        Importar CSV
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/30 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="relative w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl shadow-slate-900/20 animate-fade-in-up space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-800">Importar CSV</h2>
              <button onClick={() => setOpen(false)} className="text-slate-400 hover:text-slate-600 text-2xl leading-none">×</button>
            </div>

            {/* Template download */}
            <div className="rounded-xl bg-slate-50 border border-slate-200 p-3 flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold text-slate-700">Columnas requeridas</p>
                <p className="text-xs text-slate-500 mt-0.5 font-mono">nombre, precio, stock, categoria</p>
              </div>
              <button onClick={downloadTemplate} className="flex-shrink-0 text-xs font-medium text-lavender hover:underline">
                Descargar plantilla
              </button>
            </div>

            {/* Drop zone */}
            <label
              className={`flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed p-8 cursor-pointer transition ${
                loading ? 'border-lavender/40 bg-lavender/5' : 'border-slate-200 hover:border-lavender/60 hover:bg-slate-50'
              }`}
            >
              {loading ? (
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <svg className="h-5 w-5 animate-spin text-lavender" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Procesando {fileName}…
                </div>
              ) : (
                <>
                  <svg className="h-8 w-8 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <p className="text-sm text-slate-500">
                    {fileName || 'Arrastra un archivo .csv o haz click aquí'}
                  </p>
                </>
              )}
              <input
                type="file"
                accept=".csv"
                className="sr-only"
                onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
              />
            </label>

            {/* Report */}
            {report && (
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-2">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1.5 text-sm font-semibold text-emerald-600">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {report.imported} importados
                  </span>
                  {report.errors > 0 && (
                    <span className="flex items-center gap-1.5 text-sm font-semibold text-rose-500">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      {report.errors} errores
                    </span>
                  )}
                </div>
                {report.errors > 0 && (
                  <button onClick={downloadErrorReport} className="text-xs font-medium text-lavender hover:underline">
                    Descargar reporte de errores
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
