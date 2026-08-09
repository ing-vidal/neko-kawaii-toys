'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@hooks/useToast';
import { compressImage } from '@lib/image';
import type { Product } from '@product-types/product';

interface ProductFormProps {
  initialProduct?: Partial<Product>;
  categories: string[];
  mode: 'create' | 'edit';
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

const FIELD_CLASS =
  'mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 outline-none transition focus:border-lavender focus:bg-white focus:ring-2 focus:ring-lavender/20';
const LABEL_CLASS = 'block text-sm font-medium text-slate-700';

export function ProductForm({ initialProduct, categories, mode }: ProductFormProps) {
  const router = useRouter();
  const { addToast } = useToast();

  const [name, setName] = useState(initialProduct?.name ?? '');
  const [description, setDescription] = useState(initialProduct?.description ?? '');
  const [price, setPrice] = useState(String(initialProduct?.price ?? ''));
  const [stock, setStock] = useState(String(initialProduct?.stock ?? ''));
  const [category, setCategory] = useState(initialProduct?.category ?? categories[0] ?? '');
  const [sku, setSku] = useState(initialProduct?.sku ?? '');
  const [status, setStatus] = useState<'active' | 'inactive'>(initialProduct?.status ?? 'active');
  const [image, setImage] = useState(initialProduct?.image ?? '');
  const [imagePreview, setImagePreview] = useState(initialProduct?.image ?? '');
  const [rating, setRating] = useState(String(initialProduct?.rating ?? '4.5'));
  const [reviews, setReviews] = useState(String(initialProduct?.reviews ?? '0'));
  const [hasOffer, setHasOffer] = useState(initialProduct?.hasOffer ?? false);
  const [offerPrice, setOfferPrice] = useState(
    initialProduct?.offerPrice != null ? String(initialProduct.offerPrice) : ''
  );
  const [hasReel, setHasReel] = useState(initialProduct?.hasReel ?? false);
  const [reelUrl, setReelUrl] = useState(initialProduct?.reelUrl ?? '');
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const next: Record<string, string> = {};
    if (!name.trim()) next.name = 'El nombre es requerido.';
    if (!price || isNaN(Number(price)) || Number(price) < 0) next.price = 'Precio inválido.';
    if (!stock || isNaN(Number(stock)) || Number(stock) < 0) next.stock = 'Stock inválido.';
    if (hasOffer) {
      if (!offerPrice || isNaN(Number(offerPrice)) || Number(offerPrice) <= 0)
        next.offerPrice = 'Precio de oferta inválido.';
      else if (Number(offerPrice) >= Number(price))
        next.offerPrice = 'El precio de oferta debe ser menor al precio normal.';
    }
    if (hasReel) {
      try {
        const u = new URL(reelUrl);
        if (!reelUrl.trim()) next.reelUrl = 'La URL del video es requerida.';
        // Optional: prefer instagram links but allow others
        else if (!u.protocol.startsWith('http')) next.reelUrl = 'URL inválida.';
      } catch {
        next.reelUrl = 'URL inválida.';
      }
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleImageUpload = async (file: File) => {
    try {
      const compressed = await compressImage(file, 800, 800, 0.8);
      setImage(compressed);
      setImagePreview(compressed);
    } catch {
      addToast('Error al comprimir la imagen.', 'error');
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);

    const id = initialProduct?.id ?? slugify(name) + '-' + Date.now();
    const product: Product = {
      id,
      name: name.trim(),
      description: description.trim(),
      price: Number(price),
      stock: Number(stock),
      category,
      image,
      rating: Number(rating) || 0,
      reviews: Number(reviews) || 0,
      sku: sku.trim() || undefined,
      status,
      createdAt: initialProduct?.createdAt ?? new Date().toISOString(),
      hasOffer,
        offerPrice: hasOffer ? Number(offerPrice) : null,
        hasReel,
        reelUrl: hasReel ? (reelUrl.trim() || null) : null,
    };

    try {
      const url =
        mode === 'edit'
          ? `/api/admin/products/${encodeURIComponent(id)}`
          : '/api/admin/products';
      const method = mode === 'edit' ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error((errData as { error?: string }).error ?? `HTTP ${res.status}`);
      }

      addToast(
        mode === 'edit' ? 'Producto actualizado correctamente.' : 'Producto creado correctamente.',
        'success'
      );
      router.push('/admin/products');
    } catch (err) {
      addToast(err instanceof Error ? err.message : 'Error al guardar el producto.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* Left column — main fields */}
        <div className="space-y-5">
          {/* Name */}
          <div>
            <label className={LABEL_CLASS}>
              Nombre <span className="text-rose-400">*</span>
            </label>
            <input
              value={name}
              onChange={(e) => { setName(e.target.value); setErrors((p) => ({ ...p, name: '' })); }}
              placeholder="Ej. Gatito Mágico Kawaii"
              className={`${FIELD_CLASS} ${errors.name ? 'border-rose-300 bg-rose-50' : ''}`}
            />
            {errors.name && <p className="mt-1 text-xs text-rose-500">{errors.name}</p>}
          </div>

          {/* Description */}
          <div>
            <label className={LABEL_CLASS}>Descripción</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe el producto…"
              rows={4}
              className={FIELD_CLASS}
            />
          </div>

          {/* Price + Stock */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={LABEL_CLASS}>
                Precio ($) <span className="text-rose-400">*</span>
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={price}
                onChange={(e) => { setPrice(e.target.value); setErrors((p) => ({ ...p, price: '' })); }}
                className={`${FIELD_CLASS} ${errors.price ? 'border-rose-300 bg-rose-50' : ''}`}
              />
              {errors.price && <p className="mt-1 text-xs text-rose-500">{errors.price}</p>}
            </div>
            <div>
              <label className={LABEL_CLASS}>
                Stock <span className="text-rose-400">*</span>
              </label>
              <input
                type="number"
                min="0"
                step="1"
                value={stock}
                onChange={(e) => { setStock(e.target.value); setErrors((p) => ({ ...p, stock: '' })); }}
                className={`${FIELD_CLASS} ${errors.stock ? 'border-rose-300 bg-rose-50' : ''}`}
              />
              {errors.stock && <p className="mt-1 text-xs text-rose-500">{errors.stock}</p>}
            </div>
          </div>

          {/* Category + SKU */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={LABEL_CLASS}>Categoría</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className={FIELD_CLASS}
              >
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={LABEL_CLASS}>SKU</label>
              <input
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                placeholder="Ej. NKT-001"
                className={FIELD_CLASS}
              />
            </div>
          </div>

          {/* Rating + Reviews */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={LABEL_CLASS}>Rating (0–5)</label>
              <input
                type="number"
                min="0"
                max="5"
                step="0.1"
                value={rating}
                onChange={(e) => setRating(e.target.value)}
                className={FIELD_CLASS}
              />
            </div>
            <div>
              <label className={LABEL_CLASS}>Reseñas</label>
              <input
                type="number"
                min="0"
                value={reviews}
                onChange={(e) => setReviews(e.target.value)}
                className={FIELD_CLASS}
              />
            </div>
          </div>

          {/* Offer */}
          <div className="rounded-2xl border border-softPink/30 bg-gradient-to-tr from-softPink/5 to-lavender/5 p-5 space-y-4">
            <p className="text-sm font-bold text-slate-700">🏷️ Oferta / Descuento</p>
            <label className="flex items-center gap-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={hasOffer}
                onChange={(e) => {
                  setHasOffer(e.target.checked);
                  if (!e.target.checked) { setOfferPrice(''); setErrors((p) => ({ ...p, offerPrice: '' })); }
                }}
                className="h-4 w-4 rounded accent-softPink"
              />
              <span className="text-sm font-medium text-slate-700">Producto en oferta</span>
            </label>

            {hasOffer && (
              <div>
                <label className={LABEL_CLASS}>
                  Precio de oferta ($) <span className="text-rose-400">*</span>
                </label>
                <input
                  type="number"
                  min="1"
                  step="0.01"
                  value={offerPrice}
                  onChange={(e) => { setOfferPrice(e.target.value); setErrors((p) => ({ ...p, offerPrice: '' })); }}
                  placeholder={`Ej. ${price ? Math.round(Number(price) * 0.8) : ''}`}
                  className={`${FIELD_CLASS} ${errors.offerPrice ? 'border-rose-300 bg-rose-50' : ''}`}
                />
                {errors.offerPrice && <p className="mt-1 text-xs text-rose-500">{errors.offerPrice}</p>}
                {offerPrice && !errors.offerPrice && Number(offerPrice) > 0 && Number(offerPrice) < Number(price) && (
                  <p className="mt-1.5 text-xs font-semibold text-slate-500">
                    Descuento: {Math.round((1 - Number(offerPrice) / Number(price)) * 100)}% —
                    Ahorras ${(Number(price) - Number(offerPrice)).toFixed(2)}
                  </p>
                )}
              </div>
            )}
          </div>
        
              {/* Reel / Video */}
              <div className="rounded-2xl border border-softPink/30 bg-gradient-to-tr from-softPink/5 to-lavender/5 p-5 space-y-4">
                <p className="text-sm font-bold text-slate-700">🎬 Video / Reel</p>
                <label className="flex items-center gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={hasReel}
                    onChange={(e) => {
                      setHasReel(e.target.checked);
                      if (!e.target.checked) { setReelUrl(''); setErrors((p) => ({ ...p, reelUrl: '' })); }
                    }}
                    className="h-4 w-4 rounded accent-softPink"
                  />
                  <span className="text-sm font-medium text-slate-700">Tiene Reel/Video</span>
                </label>

                {hasReel && (
                  <div>
                    <label className={LABEL_CLASS}>URL del Reel / Video</label>
                    <input
                      value={reelUrl}
                      onChange={(e) => { setReelUrl(e.target.value); setErrors((p) => ({ ...p, reelUrl: '' })); }}
                      placeholder="Ej. https://www.instagram.com/reel/XXXXXXXXX/"
                      className={`${FIELD_CLASS} ${errors.reelUrl ? 'border-rose-300 bg-rose-50' : ''}`}
                    />
                    {errors.reelUrl && <p className="mt-1 text-xs text-rose-500">{errors.reelUrl}</p>}
                  </div>
                )}
              </div>

            </div>

        {/* Right column — image + status + preview */}
        <div className="space-y-5">
          {/* Image upload */}
          <div>
            <label className={LABEL_CLASS}>Imagen del producto</label>
            <label className="mt-1.5 flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-slate-200 p-6 cursor-pointer hover:border-lavender/60 hover:bg-slate-50 transition">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Vista previa"
                  className="h-40 w-full object-contain rounded-xl"
                />
              ) : (
                <>
                  <svg className="h-10 w-10 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-sm text-slate-400">Click para subir imagen</span>
                </>
              )}
              <input
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={(e) => { const f = e.target.files?.[0]; if (f) handleImageUpload(f); }}
              />
            </label>
            {imagePreview && (
              <button
                type="button"
                onClick={() => { setImage(''); setImagePreview(''); }}
                className="mt-1.5 text-xs text-rose-400 hover:text-rose-600 transition"
              >
                Quitar imagen
              </button>
            )}
          </div>

          {/* Estado */}
          <div>
            <label className={LABEL_CLASS}>Estado</label>
            <div className="mt-1.5 flex gap-3">
              {(['active', 'inactive'] as const).map((s) => (
                <label key={s} className="flex flex-1 cursor-pointer items-center gap-2 rounded-xl border border-slate-200 px-4 py-3 transition hover:border-lavender/60 has-[:checked]:border-lavender has-[:checked]:bg-lavender/10">
                  <input
                    type="radio"
                    name="status"
                    value={s}
                    checked={status === s}
                    onChange={() => setStatus(s)}
                    className="accent-lavender"
                  />
                  <span className="text-sm font-medium text-slate-700 capitalize">
                    {s === 'active' ? 'Activo' : 'Inactivo'}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Summary card */}
          <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 space-y-2">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Resumen</p>
            <SummaryRow label="Nombre" value={name || '—'} />
            <SummaryRow label="Categoría" value={category || '—'} />
            <SummaryRow label="Precio" value={price ? `$${Number(price).toFixed(2)}` : '—'} />
            {hasOffer && offerPrice && (
              <SummaryRow label="Precio oferta" value={`$${Number(offerPrice).toFixed(2)}`} accent />
            )}
            <SummaryRow label="Stock" value={stock || '0'} />
            <SummaryRow label="Estado" value={status === 'active' ? 'Activo' : 'Inactivo'} />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 border-t border-slate-100 pt-6">
        <button
          type="submit"
          disabled={submitting}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-softPink to-lavender px-6 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:opacity-90 hover:shadow-md active:scale-[0.98] disabled:opacity-60"
        >
          {submitting && (
            <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          )}
          {submitting ? 'Guardando…' : mode === 'edit' ? 'Guardar cambios' : 'Crear producto'}
        </button>
        <button
          type="button"
          onClick={() => router.push('/admin/products')}
          className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 transition"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}

function SummaryRow({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="text-xs text-slate-500">{label}</span>
      <span className={`text-xs font-semibold truncate max-w-[60%] text-right ${accent ? 'text-rose-500' : 'text-slate-700'}`}>
        {value}
      </span>
    </div>
  );
}
