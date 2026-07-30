'use client';

import { useEffect, useState, type FormEvent } from 'react';
import { useAdminConfig } from '@hooks/useAdminConfig';
import { useAdminAccess } from '@hooks/useAdminAccess';
import { useToast } from '@hooks/useToast';
import { compressImage } from '@lib/image';

export default function SettingsPage() {
  const { addToast } = useToast();
  const { whatsappNumber, setWhatsappNumber, logoUrl, bannerUrl, setLogoUrl, setBannerUrl, addCategory } =
    useAdminConfig();
  const { setAdminPassword: setStoredAdminPassword, defaultPassword } = useAdminAccess();

  const [categoryName, setCategoryName] = useState('');
  const [logoPreview, setLogoPreview] = useState('');
  const [bannerPreview, setBannerPreview] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [whatsappInput, setWhatsappInput] = useState(whatsappNumber);
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    if (logoUrl) setLogoPreview(logoUrl);
    if (bannerUrl) setBannerPreview(bannerUrl);
    setWhatsappInput(whatsappNumber);
  }, [logoUrl, bannerUrl, whatsappNumber]);

  useEffect(() => {
    fetch('/api/admin/categories', { cache: 'no-store' })
      .then((r) => r.json())
      .then((cats: string[]) => { if (Array.isArray(cats)) setCategories(cats); })
      .catch(() => {});
  }, []);

  const handleLogoUpload = async (file: File) => {
    try {
      const compressed = await compressImage(file, 400, 400, 0.85);
      await setLogoUrl(compressed);
      setLogoPreview(compressed);
      addToast('Logo actualizado.', 'success');
    } catch {
      addToast('Error al comprimir el logo.', 'error');
    }
  };

  const handleBannerUpload = async (file: File) => {
    try {
      const compressed = await compressImage(file, 1200, 400, 0.8);
      await setBannerUrl(compressed);
      setBannerPreview(compressed);
      addToast('Banner actualizado.', 'success');
    } catch {
      addToast('Error al comprimir el banner.', 'error');
    }
  };

  const handleSaveWhatsapp = async () => {
    await setWhatsappNumber(whatsappInput.trim());
    addToast('Número de WhatsApp guardado.', 'success');
  };

  const handleChangePassword = () => {
    const trimmed = newPassword.trim();
    if (!trimmed) { addToast('La contraseña no puede estar vacía.', 'error'); return; }
    setStoredAdminPassword(trimmed);
    setNewPassword('');
    addToast('Contraseña actualizada.', 'success');
  };

  const handleAddCategory = async (e: FormEvent) => {
    e.preventDefault();
    if (!categoryName.trim()) return;
    await addCategory(categoryName.trim());
    setCategories((prev) => Array.from(new Set([...prev, categoryName.trim()])));
    setCategoryName('');
    addToast(`Categoría "${categoryName.trim()}" agregada.`, 'success');
  };

  const handleResetCatalog = async () => {
    if (!confirm('¿Restablecer el catálogo completo? Esta acción no se puede deshacer.')) return;
    const res = await fetch('/api/admin/products?clear=true');
    if (res.ok) { addToast('Catálogo restablecido.', 'success'); }
    else { addToast('Error al restablecer el catálogo.', 'error'); }
  };

  const handleResetConfig = async () => {
    if (!confirm('¿Restablecer branding a valores predeterminados?')) return;
    const res = await fetch('/api/admin/config?clear=true');
    if (res.ok) {
      const data = await res.json();
      await setWhatsappNumber(data.whatsappNumber || '');
      await setLogoUrl(data.logoUrl || '');
      setLogoPreview(data.logoUrl || '');
      await setBannerUrl(data.bannerUrl || '');
      setBannerPreview(data.bannerUrl || '');
      addToast('Branding restablecido.', 'success');
    } else {
      addToast('Error al restablecer la configuración.', 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Admin</p>
        <h1 className="mt-1 text-3xl font-bold text-slate-800">Configuración</h1>
        <p className="mt-1 text-sm text-slate-500">
          WhatsApp, branding, categorías y contraseña del panel.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* WhatsApp */}
        <Section title="WhatsApp" description="Número para recibir pedidos desde el carrito (incluye código de país).">
          <div className="flex gap-3">
            <input
              type="tel"
              value={whatsappInput}
              onChange={(e) => setWhatsappInput(e.target.value)}
              placeholder="Ej. 34123456789"
              className={FIELD_CLASS}
            />
            <Btn onClick={handleSaveWhatsapp}>Guardar</Btn>
          </div>
        </Section>

        {/* Password */}
        <Section
          title="Contraseña de administrador"
          description={`Contraseña predeterminada: ${defaultPassword}`}
        >
          <div className="flex gap-3">
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Nueva contraseña"
              className={FIELD_CLASS}
            />
            <Btn onClick={handleChangePassword}>Cambiar</Btn>
          </div>
        </Section>

        {/* Logo */}
        <Section title="Logo del sitio" description="Recomendado: 400×400 px. Se comprime automáticamente.">
          <label className="flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-200 p-5 cursor-pointer hover:border-lavender/60 hover:bg-slate-50 transition">
            {logoPreview ? (
              <img src={logoPreview} alt="Logo preview" className="h-20 w-20 rounded-xl object-cover" />
            ) : (
              <>
                <svg className="h-8 w-8 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-sm text-slate-400">Subir logo</span>
              </>
            )}
            <input type="file" accept="image/*" className="sr-only"
              onChange={(e) => { const f = e.target.files?.[0]; if (f) handleLogoUpload(f); }} />
          </label>
        </Section>

        {/* Banner */}
        <Section title="Banner de la página" description="Recomendado: 1200×400 px. Se comprime automáticamente.">
          <label className="flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-200 p-5 cursor-pointer hover:border-lavender/60 hover:bg-slate-50 transition">
            {bannerPreview ? (
              <img src={bannerPreview} alt="Banner preview" className="h-28 w-full rounded-xl object-cover" />
            ) : (
              <>
                <svg className="h-8 w-8 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-sm text-slate-400">Subir banner</span>
              </>
            )}
            <input type="file" accept="image/*" className="sr-only"
              onChange={(e) => { const f = e.target.files?.[0]; if (f) handleBannerUpload(f); }} />
          </label>
        </Section>
      </div>

      {/* Categories */}
      <Section title="Categorías" description="Las categorías aparecen como filtros y opciones al crear productos.">
        <div className="flex flex-wrap gap-2 mb-4">
          {categories.length === 0 && (
            <p className="text-sm text-slate-400">No hay categorías personalizadas.</p>
          )}
          {categories.map((cat) => (
            <span key={cat} className="rounded-full bg-lavender/20 px-3 py-1 text-sm font-medium text-slate-600">
              {cat}
            </span>
          ))}
        </div>
        <form onSubmit={handleAddCategory} className="flex gap-3">
          <input
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            placeholder="Nombre de la nueva categoría"
            className={`${FIELD_CLASS} flex-1`}
          />
          <Btn type="submit">Agregar</Btn>
        </form>
      </Section>

      {/* Danger zone */}
      <div className="rounded-2xl border border-rose-200 bg-rose-50/50 p-6 space-y-4">
        <p className="text-sm font-bold text-rose-700 uppercase tracking-wider">Zona de peligro</p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            onClick={handleResetConfig}
            className="rounded-xl border border-rose-200 bg-white px-4 py-2 text-sm font-medium text-rose-600 hover:bg-rose-50 transition"
          >
            Restablecer branding
          </button>
          <button
            onClick={handleResetCatalog}
            className="rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700 transition shadow-sm"
          >
            Restablecer catálogo completo
          </button>
        </div>
      </div>
    </div>
  );
}

const FIELD_CLASS =
  'h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-800 outline-none transition focus:border-lavender focus:bg-white focus:ring-2 focus:ring-lavender/20';

function Btn({
  children,
  onClick,
  type = 'button',
}: {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit';
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      className="h-10 flex-shrink-0 rounded-xl bg-gradient-to-r from-softPink to-lavender px-5 text-sm font-semibold text-slate-700 shadow-sm hover:opacity-90 transition"
    >
      {children}
    </button>
  );
}

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
      <div>
        <h2 className="text-base font-bold text-slate-800">{title}</h2>
        {description && <p className="mt-0.5 text-sm text-slate-500">{description}</p>}
      </div>
      {children}
    </div>
  );
}
