'use client';

interface CsvExporterProps {
  activeFilters?: {
    category?: string;
    status?: string;
  };
}

export function CsvExporter({ activeFilters = {} }: CsvExporterProps) {
  const handleExport = () => {
    const params = new URLSearchParams();
    if (activeFilters.category) params.set('category', activeFilters.category);
    if (activeFilters.status) params.set('status', activeFilters.status);
    const qs = params.toString();
    const url = `/api/admin/products/export${qs ? `?${qs}` : ''}`;
    // Trigger browser download
    const a = document.createElement('a');
    a.href = url;
    a.download = '';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <button
      onClick={handleExport}
      className="flex h-9 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-600 hover:border-slate-300 hover:bg-slate-50 transition"
    >
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
      </svg>
      Exportar CSV
    </button>
  );
}
