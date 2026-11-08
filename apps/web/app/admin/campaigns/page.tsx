'use client';

import { useEffect, useState } from 'react';
import { useToast } from '@hooks/useToast';
import {
  CAMPAIGN_THEMES,
  createDefaultCampaignSettings,
  type CampaignId,
  type CampaignSettings,
} from '@lib/campaigns';

export default function CampaignsPage() {
  const { addToast } = useToast();
  const [campaigns, setCampaigns] = useState<CampaignSettings>(() => createDefaultCampaignSettings());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;
    const loadCampaigns = async () => {
      try {
        const response = await fetch('/api/admin/config', { cache: 'no-store' });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const config = (await response.json()) as { campaigns?: CampaignSettings };
        if (active && config.campaigns) setCampaigns(config.campaigns);
      } catch (error) {
        console.error('Error loading campaign settings:', error);
        if (active) addToast('No se pudieron cargar las temporadas guardadas.', 'error');
      } finally {
        if (active) setLoading(false);
      }
    };

    loadCampaigns();
    return () => {
      active = false;
    };
  }, [addToast]);

  const updateCampaign = (id: CampaignId, changes: Partial<CampaignSettings[CampaignId]>) => {
    setCampaigns((current) => ({
      ...current,
      [id]: { ...current[id], ...changes },
    }));
  };

  const saveCampaigns = async () => {
    for (const theme of CAMPAIGN_THEMES) {
      const schedule = campaigns[theme.id];
      if (schedule.enabled && (!schedule.startDate || !schedule.endDate)) {
        addToast(`Completa las fechas de ${theme.name} antes de activarla.`, 'error');
        return;
      }
    }

    setSaving(true);
    try {
      const response = await fetch('/api/admin/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ campaigns }),
      });
      if (!response.ok) {
        const result = (await response.json()) as { error?: string };
        throw new Error(result.error || `HTTP ${response.status}`);
      }
      addToast('Temporadas guardadas correctamente.', 'success');
    } catch (error) {
      console.error('Error saving campaign settings:', error);
      addToast(error instanceof Error ? error.message : 'No se pudieron guardar las temporadas.', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <header>
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Admin</p>
        <h1 className="mt-1 text-3xl font-bold text-slate-800">Temporadas del catálogo</h1>
        <p className="mt-1 max-w-2xl text-sm text-slate-500">
          Activa una temática para que aparezca automáticamente dentro de sus fechas. Cambia los colores de
          las tarjetas y agrega un banner al catálogo, sin modificar sus filtros ni su distribución.
        </p>
      </header>

      <div className="rounded-2xl border border-sky-100 bg-sky-50 px-5 py-4 text-sm text-sky-900">
        Las fechas se repiten cada año usando el mes y el día. Black Friday y El Buen Fin pueden cambiar de
        fecha: actualiza su rango cuando se anuncie el calendario. Los temas no agregan descuentos ficticios;
        las ofertas mostradas siguen siendo las configuradas en cada producto.
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        {CAMPAIGN_THEMES.map((theme) => {
          const schedule = campaigns[theme.id];
          return (
            <section
              key={theme.id}
              className="overflow-hidden rounded-2xl border bg-white shadow-sm"
              style={{ borderColor: theme.border }}
            >
              <div className="h-2" style={{ backgroundColor: theme.accent }} />
              <div className="space-y-5 p-5 sm:p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-2xl" aria-hidden="true">{theme.emoji}</p>
                    <h2 className="mt-2 text-lg font-bold text-slate-800">{theme.name}</h2>
                    <p className="mt-1 text-sm text-slate-500">{theme.message}</p>
                  </div>
                  <label className="flex shrink-0 cursor-pointer items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700">
                    <input
                      type="checkbox"
                      checked={schedule.enabled}
                      disabled={loading || saving}
                      onChange={(event) => updateCampaign(theme.id, { enabled: event.target.checked })}
                      className="h-4 w-4 accent-lavender"
                    />
                    Activar
                  </label>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="space-y-1.5 text-sm font-medium text-slate-600">
                    <span>Desde</span>
                    <input
                      type="date"
                      value={schedule.startDate}
                      disabled={loading || saving}
                      onChange={(event) => updateCampaign(theme.id, { startDate: event.target.value })}
                      className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-slate-800 outline-none focus:border-lavender focus:ring-2 focus:ring-lavender/20"
                    />
                  </label>
                  <label className="space-y-1.5 text-sm font-medium text-slate-600">
                    <span>Hasta</span>
                    <input
                      type="date"
                      value={schedule.endDate}
                      disabled={loading || saving}
                      onChange={(event) => updateCampaign(theme.id, { endDate: event.target.value })}
                      className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-slate-800 outline-none focus:border-lavender focus:ring-2 focus:ring-lavender/20"
                    />
                  </label>
                </div>

                <div
                  className="rounded-xl border px-4 py-3 text-sm font-semibold"
                  style={{ backgroundColor: theme.surface, borderColor: theme.border, color: theme.accent }}
                >
                  {theme.emoji} Vista previa: {theme.headline}
                </div>
              </div>
            </section>
          );
        })}
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          disabled={loading || saving}
          onClick={saveCampaigns}
          className="rounded-xl bg-gradient-to-r from-softPink to-lavender px-6 py-3 text-sm font-bold text-slate-800 shadow-sm transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saving ? 'Guardando…' : 'Guardar temporadas'}
        </button>
      </div>
    </div>
  );
}
