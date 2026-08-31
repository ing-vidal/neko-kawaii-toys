'use client';

import { useEffect, useState, type FormEvent } from 'react';
import { useAdminConfig } from '@hooks/useAdminConfig';
import { useAdminAccess } from '@hooks/useAdminAccess';
import { useToast } from '@hooks/useToast';
import { uploadImageFile } from '@lib/image';

export default function SettingsPage() {
  const { addToast } = useToast();
  const {
    whatsappNumber, setWhatsappNumber,
    logoUrl, bannerUrl, setLogoUrl, setBannerUrl,
    emailIconUrl, instagramIconUrl, facebookIconUrl, whatsappIconUrl,
    setEmailIconUrl, setInstagramIconUrl, setFacebookIconUrl, setWhatsappIconUrl,
    addCategory,
  } = useAdminConfig();
  const { setAdminPassword: setStoredAdminPassword, defaultPassword } = useAdminAccess();

  const [categoryName, setCategoryName] = useState('');
  const [logoPreview, setLogoPreview] = useState('');
  const [bannerPreview, setBannerPreview] = useState('');
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingBanner, setUploadingBanner] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [whatsappInput, setWhatsappInput] = useState(whatsappNumber);
  const [categories, setCategories] = useState<string[]>([]);
  const [emailIconPreview, setEmailIconPreview] = useState('');
  const [instagramIconPreview, setInstagramIconPreview] = useState('');
  const [facebookIconPreview, setFacebookIconPreview] = useState('');
  const [whatsappIconPreview, setWhatsappIconPreview] = useState('');

  useEffect(() => {
    if (logoUrl) setLogoPreview(logoUrl);
    if (bannerUrl) setBannerPreview(bannerUrl);
    setWhatsappInput(whatsappNumber);
    if (emailIconUrl) setEmailIconPreview(emailIconUrl);
    if (instagramIconUrl) setInstagramIconPreview(instagramIconUrl);
    if (facebookIconUrl) setFacebookIconPreview(facebookIconUrl);
    if (whatsappIconUrl) setWhatsappIconPreview(whatsappIconUrl);
  }, [logoUrl, bannerUrl, whatsappNumber, emailIconUrl, instagramIconUrl, facebookIconUrl, whatsappIconUrl]);

  useEffect(() => {
    fetch('/api/admin/categories', { cache: 'no-store' })
      .then((r) => r.json())
      .then((cats: string[]) => { if (Array.isArray(cats)) setCategories(cats); })
      .catch(() => {});
  }, []);

  const handleLogoUpload = async (file: File) => {
    setUploadingLogo(true);
    try {
      const url = await uploadImageFile(file, { maxWidth: 600, maxHeight: 600, quality: 0.9, preservePng: true });
      await setLogoUrl(url);
      setLogoPreview(url);
      addToast('Logo actualizado.', 'success');
    } catch (err: unknown) {
      console.error(err);
      const msg = err instanceof Error ? err.message : 'Error al subir el logo.';
      addToast(msg, 'error');
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleBannerUpload = async (file: File) => {
    setUploadingBanner(true);
    try {
      const url = await uploadImageFile(file, { maxWidth: 1600, maxHeight: 600, quality: 0.85 });
      await setBannerUrl(url);
      setBannerPreview(url);
      addToast('Banner actualizado.', 'success');
    } catch (err: unknown) {
      console.error(err);
      const msg = err instanceof Error ? err.message : 'Error al subir el banner.';
      addToast(msg, 'error');
    } finally {
      setUploadingBanner(false);
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
      setEmailIconPreview('');
      setInstagramIconPreview('');
      setFacebookIconPreview('');
      setWhatsappIconPreview('');
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
        <Section title="Logo del sitio" description="Recomendado: 400×400 px. Se sube directamente a la nube.">
          <label className={`flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-200 p-5 transition ${uploadingLogo ? 'opacity-60 cursor-wait bg-slate-50' : 'cursor-pointer hover:border-lavender/60 hover:bg-slate-50'}`}>
            {uploadingLogo ? (
              <div className="flex flex-col items-center gap-2 py-4">
                <svg className="h-6 w-6 animate-spin text-lavender" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                <span className="text-xs text-slate-500">Subiendo logo…</span>
              </div>
            ) : logoPreview ? (
              <img src={logoPreview} alt="Logo preview" className="h-20 w-20 rounded-xl object-cover" />
            ) : (
              <>
                <svg className="h-8 w-8 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-sm text-slate-400">Subir logo</span>
              </>
            )}
            <input type="file" accept="image/*" disabled={uploadingLogo} className="sr-only"
              onChange={(e) => { const f = e.target.files?.[0]; if (f) handleLogoUpload(f); }} />
          </label>
        </Section>

        {/* Banner */}
        <Section title="Banner de la página" description="Recomendado: 1200×400 px. Se sube directamente a la nube.">
          <label className={`flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-200 p-5 transition ${uploadingBanner ? 'opacity-60 cursor-wait bg-slate-50' : 'cursor-pointer hover:border-lavender/60 hover:bg-slate-50'}`}>
            {uploadingBanner ? (
              <div className="flex flex-col items-center gap-2 py-6">
                <svg className="h-6 w-6 animate-spin text-lavender" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                <span className="text-xs text-slate-500">Subiendo banner…</span>
              </div>
            ) : bannerPreview ? (
              <img src={bannerPreview} alt="Banner preview" className="h-28 w-full rounded-xl object-cover" />
            ) : (
              <>
                <svg className="h-8 w-8 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-sm text-slate-400">Subir banner</span>
              </>
            )}
            <input type="file" accept="image/*" disabled={uploadingBanner} className="sr-only"
              onChange={(e) => { const f = e.target.files?.[0]; if (f) handleBannerUpload(f); }} />
          </label>
        </Section>
      </div>

      {/* Contact Icons */}
      <Section title="Iconos de contacto" description="Sube iconos personalizados para cada canal. Si no subes uno, se mostrará el ícono de marca por defecto.">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {([
            { key: 'email', label: 'Email', preview: emailIconPreview, setPreview: setEmailIconPreview, setter: setEmailIconUrl, DefaultIcon: DefaultEmailIcon },
            { key: 'instagram', label: 'Instagram', preview: instagramIconPreview, setPreview: setInstagramIconPreview, setter: setInstagramIconUrl, DefaultIcon: DefaultInstagramIcon },
            { key: 'facebook', label: 'Facebook', preview: facebookIconPreview, setPreview: setFacebookIconPreview, setter: setFacebookIconUrl, DefaultIcon: DefaultFacebookIcon },
            { key: 'whatsapp', label: 'WhatsApp', preview: whatsappIconPreview, setPreview: setWhatsappIconPreview, setter: setWhatsappIconUrl, DefaultIcon: DefaultWhatsappIcon },
          ] as const).map(({ key, label, preview, setPreview, setter, DefaultIcon }) => (
            <label key={key} className="flex flex-col items-center gap-2 rounded-xl border-2 border-dashed border-slate-200 p-4 cursor-pointer hover:border-lavender/60 hover:bg-slate-50 transition text-center">
              <div className="h-14 w-14 flex items-center justify-center">
                {preview
                  ? <img src={preview} alt={label} className="h-14 w-14 rounded-xl object-contain" />
                  : <DefaultIcon />}
              </div>
              <span className="text-xs font-semibold text-slate-500">{label}</span>
              <span className="text-[10px] text-slate-400">Click para cambiar</span>
              <input type="file" accept="image/*" className="sr-only"
                onChange={async (e) => {
                  const f = e.target.files?.[0];
                  if (!f) return;
                  try {
                    const url = await uploadImageFile(f, { maxWidth: 256, maxHeight: 256, quality: 0.9, preservePng: true });
                    await setter(url);
                    setPreview(url);
                    addToast(`Icono de ${label} actualizado.`, 'success');
                  } catch (err: unknown) {
                    console.error(err);
                    const msg = err instanceof Error ? err.message : `Error al subir el icono de ${label}.`;
                    addToast(msg, 'error');
                  }
                }} />
            </label>
          ))}
        </div>
      </Section>

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

function DefaultEmailIcon() {
  return (
    <svg viewBox="0 0 48 48" className="h-12 w-12" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="48" height="48" rx="12" fill="#F0F4FF"/>
      <path d="M10 16a2 2 0 012-2h24a2 2 0 012 2v16a2 2 0 01-2 2H12a2 2 0 01-2-2V16z" fill="#4F6CF7" opacity="0.15"/>
      <path d="M10 16l14 10 14-10" stroke="#4F6CF7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <rect x="10" y="14" width="28" height="20" rx="2" stroke="#4F6CF7" strokeWidth="2"/>
    </svg>
  );
}

function DefaultInstagramIcon() {
  return (
    <svg viewBox="0 0 48 48" className="h-12 w-12" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="ig-grad" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#f9a825"/>
          <stop offset="40%" stopColor="#e91e8c"/>
          <stop offset="100%" stopColor="#8b29cf"/>
        </linearGradient>
      </defs>
      <rect width="48" height="48" rx="12" fill="url(#ig-grad)"/>
      <rect x="13" y="13" width="22" height="22" rx="6" stroke="white" strokeWidth="2.2" fill="none"/>
      <circle cx="24" cy="24" r="5.5" stroke="white" strokeWidth="2.2" fill="none"/>
      <circle cx="31" cy="17" r="1.5" fill="white"/>
    </svg>
  );
}

function DefaultFacebookIcon() {
  return (
    <svg viewBox="0 0 48 48" className="h-12 w-12" xmlns="http://www.w3.org/2000/svg">
      <rect width="48" height="48" rx="12" fill="#1877F2"/>
      <path d="M28 14h-3a5 5 0 00-5 5v3h-3v4h3v10h4V26h3l1-4h-4v-3a1 1 0 011-1h3v-4z" fill="white"/>
    </svg>
  );
}

function DefaultWhatsappIcon() {
  return (
    <svg viewBox="0 0 48 48" className="h-12 w-12" xmlns="http://www.w3.org/2000/svg">
      <rect width="48" height="48" rx="12" fill="#25D366"/>
      <path d="M24 11C16.82 11 11 16.82 11 24c0 2.3.63 4.45 1.73 6.3L11 37l6.87-1.7A12.93 12.93 0 0024 37c7.18 0 13-5.82 13-13S31.18 11 24 11z" fill="white" opacity="0.2"/>
      <path d="M24 12.5C17.6 12.5 12.5 17.6 12.5 24c0 2.12.58 4.1 1.6 5.8L12.5 35.5l5.83-1.57A11.47 11.47 0 0024 35.5c6.4 0 11.5-5.1 11.5-11.5S30.4 12.5 24 12.5z" stroke="white" strokeWidth="1.5" fill="none"/>
      <path d="M20.5 18.5c-.4-.9-1-.9-1.5-.9-.4 0-.8 0-1.2.4-.4.4-1.5 1.5-1.5 3.6s1.5 4.2 1.7 4.5c.2.3 2.9 4.6 7.2 6.2 3.6 1.4 4.3 1.1 5.1 1 .8-.1 2.5-1 2.9-2s.4-1.8.3-2c-.1-.2-.5-.3-.9-.5s-2.5-1.2-2.9-1.4c-.4-.1-.7-.2-1 .2-.3.4-1.2 1.4-1.5 1.7-.3.3-.5.3-.9.1s-1.7-.6-3.3-2c-1.2-1.1-2-2.5-2.3-2.9-.3-.4 0-.6.2-.8.2-.2.5-.5.7-.7.2-.3.3-.5.4-.8.1-.3 0-.6-.1-.8z" fill="white"/>
    </svg>
  );
}
