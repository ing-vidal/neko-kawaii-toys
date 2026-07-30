'use client';

import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { Button } from '@components/Button';
import { Product } from '@product-types/product';
import { useAdminAccess } from '@hooks/useAdminAccess';
import { useAdminConfig } from '@hooks/useAdminConfig';
import { useAdminCatalog } from '@hooks/useAdminCatalog';
import { getProducts } from '@lib/utils';
import { compressImage } from '@lib/image';


function createProductId(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export default function AdminPage() {
  const { whatsappNumber, setWhatsappNumber, logoUrl, bannerUrl, setLogoUrl, setBannerUrl, addCategory } = useAdminConfig();
  const { products: catalogProducts, categories: availableCategories, addProduct, deleteProduct, refreshCatalog } = useAdminCatalog(getProducts());
  const [isClearingCatalog, setIsClearingCatalog] = useState(false);

  const handleClearCatalog = async () => {
    if (!confirm('¿Estás seguro de que deseas restablecer el catálogo por completo? Esto eliminará todos tus productos agregados.')) {
      return;
    }
    setIsClearingCatalog(true);
    try {
      const res = await fetch('/api/admin/products?clear=true');
      if (res.ok) {
        await refreshCatalog();
        alert('Catálogo restablecido correctamente.');
      } else {
        alert('Error al restablecer el catálogo.');
      }
    } catch (e) {
      console.error(e);
      alert('Error de red al restablecer el catálogo.');
    } finally {
      setIsClearingCatalog(false);
    }
  };

  const handleClearConfig = async () => {
    if (!confirm('¿Estás seguro de que deseas restablecer la configuración de branding y WhatsApp a los valores predeterminados?')) {
      return;
    }
    try {
      const res = await fetch('/api/admin/config?clear=true');
      if (res.ok) {
        const data = await res.json();
        setWhatsappNumber(data.whatsappNumber || '');
        setLogoUrl(data.logoUrl || '');
        setLogoPreview(data.logoUrl || '');
        setBannerUrl(data.bannerUrl || '');
        setBannerPreview(data.bannerUrl || '');
        alert('Configuración de branding restablecida correctamente.');
      } else {
        alert('Error al restablecer la configuración.');
      }
    } catch (e) {
      console.error(e);
      alert('Error de red al restablecer la configuración.');
    }
  };

  const bloatedProducts = catalogProducts.filter(p => p.image && p.image.startsWith('data:') && p.image.length > 300000);
  const isLogoBloated = logoUrl && logoUrl.startsWith('data:') && logoUrl.length > 300000;
  const isBannerBloated = bannerUrl && bannerUrl.startsWith('data:') && bannerUrl.length > 500000;

  const [categoryName, setCategoryName] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('20');
  const [selectedCategory, setSelectedCategory] = useState(availableCategories[0] ?? 'Figuras');
  const [image, setImage] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [stock, setStock] = useState('10');
  const [rating, setRating] = useState('4.8');
  const [reviews, setReviews] = useState('10');
  const [logoPreview, setLogoPreview] = useState('');
  const [bannerPreview, setBannerPreview] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminPasswordError, setAdminPasswordError] = useState('');
  const [newAdminPassword, setNewAdminPassword] = useState('');
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [productError, setProductError] = useState<string | null>(null);
  // Offer fields
  const [hasOffer, setHasOffer] = useState(false);
  const [offerPrice, setOfferPrice] = useState('');
  const [offerPriceError, setOfferPriceError] = useState('');

  const { authenticated, unlock, lock, setAdminPassword: setStoredAdminPassword, defaultPassword } = useAdminAccess();

  useEffect(() => {
    if (!selectedCategory && availableCategories.length > 0) {
      setSelectedCategory(availableCategories[0]);
    }
  }, [availableCategories, selectedCategory]);

  useEffect(() => {
    if (logoUrl) setLogoPreview(logoUrl);
    if (bannerUrl) setBannerPreview(bannerUrl);
  }, [logoUrl, bannerUrl]);

  useEffect(() => {
    setImagePreview(image);
  }, [image]);

  const handleAddCategory = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!categoryName.trim()) return;
    await addCategory(categoryName.trim());
    setCategoryName('');
  };

  const handleLogoUpload = async (file: File) => {
    try {
      const compressed = await compressImage(file, 400, 400, 0.85);
      setLogoUrl(compressed);
      setLogoPreview(compressed);
    } catch (error) {
      console.error('Error compressing logo:', error);
    }
  };

  const handleBannerUpload = async (file: File) => {
    try {
      const compressed = await compressImage(file, 1200, 400, 0.8);
      setBannerUrl(compressed);
      setBannerPreview(compressed);
    } catch (error) {
      console.error('Error compressing banner:', error);
    }
  };

  const handleEditClick = (product: Product) => {
    setEditingProductId(product.id);
    setName(product.name);
    setDescription(product.description || '');
    setPrice(String(product.price));
    setSelectedCategory(product.category);
    setImage(product.image);
    setImagePreview(product.image);
    setStock(String(product.stock));
    setRating(String(product.rating));
    setReviews(String(product.reviews));
    // Offer fields
    setHasOffer(product.hasOffer ?? false);
    setOfferPrice(product.offerPrice != null ? String(product.offerPrice) : '');
    setOfferPriceError('');
  };

  const handleCancelEdit = () => {
    setEditingProductId(null);
    setName('');
    setDescription('');
    setPrice('20');
    setSelectedCategory(availableCategories[0] ?? 'Figuras');
    setImage('');
    setImagePreview('');
    setStock('10');
    setRating('4.8');
    setReviews('10');
    // Offer fields
    setHasOffer(false);
    setOfferPrice('');
    setOfferPriceError('');
  };

  const handleAddProduct = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!name.trim()) return;
    setProductError(null);
    setOfferPriceError('');

    if (!image) {
      setProductError('Por favor, selecciona una imagen para el producto.');
      return;
    }

    // Validate offer price if offer is enabled
    if (hasOffer) {
      const offerPriceNum = Number(offerPrice);
      const priceNum = Number(price);
      if (!offerPrice || isNaN(offerPriceNum) || offerPriceNum <= 0) {
        setOfferPriceError('El precio de oferta debe ser un número positivo.');
        return;
      }
      if (offerPriceNum >= priceNum) {
        setOfferPriceError('El precio de oferta debe ser menor al precio normal.');
        return;
      }
    }

    const id = editingProductId ?? createProductId(name);
    const product: Product = {
      id,
      name: name.trim(),
      description: description.trim() || 'Nuevo producto kawaii listo para ser publicado.',
      price: Number(price) || 0,
      category: selectedCategory,
      image,
      stock: Number(stock) || 0,
      rating: Number(rating) || 4.5,
      reviews: Number(reviews) || 0,
      hasOffer,
      offerPrice: hasOffer ? Number(offerPrice) : null,
    };

    if (!availableCategories.includes(selectedCategory)) {
      await addCategory(selectedCategory);
    }
    
    const result = await addProduct(product);
    if (!result.success) {
      setProductError(result.error || 'Error al guardar el producto');
      return;
    }

    // Reset form after saving
    setName('');
    setDescription('');
    setPrice('20');
    setSelectedCategory(availableCategories[0] ?? 'Figuras');
    setImage('');
    setImagePreview('');
    setStock('10');
    setRating('4.8');
    setReviews('10');
    setEditingProductId(null);
    setHasOffer(false);
    setOfferPrice('');
    setOfferPriceError('');
  };

  if (!authenticated) {
    return (
      <div className="mx-auto max-w-3xl px-5 py-14 sm:px-6 lg:px-8">
        <div className="rounded-[40px] border border-slate-200 bg-white p-10 shadow-soft">
          <div className="mb-8">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-accent">Acceso administrador</p>
            <h1 className="mt-3 text-4xl font-bold text-textPrimary">Solo administradores</h1>
            <p className="mt-3 text-slate-600">
              Ingresa la contraseña de administrador para acceder al panel. Si nunca la cambiaste, la contraseña predeterminada es <strong>{defaultPassword}</strong>.
            </p>
          </div>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              if (!unlock(adminPassword)) {
                setAdminPasswordError('Contraseña incorrecta. Intenta de nuevo.');
              }
            }}
            className="space-y-6"
          >
            <div>
              <label className="block text-sm font-medium text-textPrimary">Contraseña</label>
              <input
                type="password"
                value={adminPassword}
                onChange={(event) => {
                  setAdminPassword(event.target.value);
                  setAdminPasswordError('');
                }}
                placeholder="Contraseña de administrador"
                className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-textPrimary outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
              />
            </div>
            {adminPasswordError && <p className="text-sm text-rose-600">{adminPasswordError}</p>}
            <div className="flex justify-end">
              <Button type="submit">Entrar</Button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-5 py-10 sm:px-6 lg:px-8">
      <div className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-accent">Administración</p>
          <h1 className="text-4xl font-bold text-textPrimary sm:text-5xl">Panel de administrador</h1>
          <p className="max-w-2xl text-slate-600">
            Aquí puedes gestionar categorías, dar de alta productos, configurar logo y banner, y guardar los ajustes de WhatsApp en el servidor para que se muestren en la tienda.
          </p>
        </div>
        <div className="flex-shrink-0">
          <Button type="button" variant="ghost" onClick={lock}>
            Cerrar sesión
          </Button>
        </div>
      </div>

      {bloatedProducts.length > 0 && (
        <div className="mb-8 p-5 text-sm text-amber-800 bg-amber-50 rounded-[28px] border border-amber-200 shadow-sm space-y-3">
          <div className="font-semibold flex items-center gap-2 text-base text-amber-900">
            <span>⚠️</span> Atención: Productos con imágenes sin comprimir detectados
          </div>
          <p>
            Se detectaron <strong>{bloatedProducts.length}</strong> productos con imágenes excesivamente grandes (subidas anteriormente sin compresión). 
            Esto está provocando el error <code>max request size exceeded</code> en Vercel KV al intentar guardar nuevos productos.
          </p>
          <p>
            <strong>Solución recomendada:</strong> Elimina esos productos y vuelve a crearlos usando la nueva compresión de imágenes. O si lo prefieres, puedes:
          </p>
          <div>
            <Button type="button" onClick={handleClearCatalog} disabled={isClearingCatalog} className="bg-amber-600 hover:bg-amber-700 text-white text-xs px-4 py-2 rounded-2xl">
              {isClearingCatalog ? 'Restableciendo...' : 'Restablecer catálogo por completo'}
            </Button>
          </div>
        </div>
      )}

      {(isLogoBloated || isBannerBloated) && (
        <div className="mb-8 p-5 text-sm text-amber-800 bg-amber-50 rounded-[28px] border border-amber-200 shadow-sm space-y-3">
          <div className="font-semibold flex items-center gap-2 text-base text-amber-900">
            <span>⚠️</span> Atención: Logo o Banner sin comprimir detectado
          </div>
          <p>
            El logotipo o banner guardados actualmente ocupan mucho espacio. Te sugerimos volver a subirlos en la sección de **Branding** (abajo) para aplicar la compresión automática y reducir el uso de base de datos en Vercel. 
            También puedes restablecerlos haciendo clic en el botón de abajo.
          </p>
          <div>
            <Button type="button" onClick={handleClearConfig} className="bg-amber-600 hover:bg-amber-700 text-white text-xs px-4 py-2 rounded-2xl">
              Restablecer Branding a Valores por Defecto
            </Button>
          </div>
        </div>
      )}

      <div className="grid gap-8 xl:grid-cols-[1.2fr_0.8fr]">
        <section className="space-y-8 rounded-[40px] border border-slate-200 bg-white p-8 shadow-soft">
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-textPrimary">Configuración de WhatsApp</h2>
            <p className="text-sm text-slate-600">
              Ingresa el número completo de WhatsApp (incluye código de país) para solicitar el pedido desde el carrito.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-[1.3fr_0.7fr]">
            <input
              type="tel"
              value={whatsappNumber}
              onChange={(event) => setWhatsappNumber(event.target.value)}
              placeholder="Ej. 34123456789"
              className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-textPrimary outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
            />
            <Button type="button" onClick={() => setWhatsappNumber(whatsappNumber.trim())} className="w-full">
              Guardar número
            </Button>
          </div>
        </section>

        <section className="space-y-8 rounded-[40px] border border-slate-200 bg-white p-8 shadow-soft">
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-textPrimary">Contraseña de administrador</h2>
            <p className="text-sm text-slate-600">
              Cambia la contraseña que protege el panel de administración. Si nunca la cambiaste, la predeterminada es <strong>{defaultPassword}</strong>.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-[1.3fr_0.7fr]">
            <input
              type="password"
              value={newAdminPassword}
              onChange={(event) => setNewAdminPassword(event.target.value)}
              placeholder="Nueva contraseña de administrador"
              className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-textPrimary outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
            />
            <Button
              type="button"
              onClick={() => {
                if (newAdminPassword.trim()) {
                  setStoredAdminPassword(newAdminPassword.trim());
                  setNewAdminPassword('');
                }
              }}
              className="w-full"
            >
              Cambiar contraseña
            </Button>
          </div>
        </section>

        <section className="space-y-8 rounded-[40px] border border-slate-200 bg-white p-8 shadow-soft">
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-textPrimary">Branding</h2>
            <p className="text-sm text-slate-600">Sube un logo y un banner para que la tienda muestre tu imagen de marca.</p>
          </div>
          <div className="grid gap-4">
            <div>
              <label className="block text-sm font-medium text-textPrimary">Logo del sitio</label>
              <input
                type="file"
                accept="image/*"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) handleLogoUpload(file);
                }}
                className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-textPrimary outline-none"
              />
              {logoPreview && (
                <div className="mt-4 inline-flex h-20 w-20 items-center justify-center overflow-hidden rounded-3xl border border-slate-200 bg-white">
                  <img src={logoPreview} alt="Vista previa del logo" className="h-full w-full object-cover" />
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-textPrimary">Banner de la página</label>
              <input
                type="file"
                accept="image/*"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) handleBannerUpload(file);
                }}
                className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-textPrimary outline-none"
              />
              {bannerPreview && (
                <div className="mt-4 overflow-hidden rounded-[28px] border border-slate-200 bg-white">
                  <img src={bannerPreview} alt="Vista previa del banner" className="h-40 w-full object-cover" />
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="space-y-6 rounded-[40px] border border-slate-200 bg-white p-8 shadow-soft">
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-textPrimary">Categorías actuales</h2>
            <div className="flex flex-wrap gap-2">
              {availableCategories.map((category) => (
                <span key={category} className="rounded-3xl bg-slate-100 px-4 py-2 text-sm text-slate-700">
                  {category}
                </span>
              ))}
            </div>
          </div>

          <form className="space-y-4" onSubmit={handleAddCategory}>
            <label className="block text-sm font-medium text-textPrimary">Agregar categoría</label>
            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                value={categoryName}
                onChange={(event) => setCategoryName(event.target.value)}
                placeholder="Nombre de categoría"
                className="min-w-0 flex-1 rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-textPrimary outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
              />
              <Button type="submit" className="w-full sm:w-auto">
                Agregar categoría
              </Button>
            </div>
          </form>
        </section>
      </div>

      <section className="mt-10 rounded-[40px] border border-slate-200 bg-white p-8 shadow-soft">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-textPrimary">
              {editingProductId ? `Editar producto: ${name}` : 'Alta de productos'}
            </h2>
            <p className="text-sm text-slate-600">
              {editingProductId ? 'Modifica los campos del producto seleccionado.' : 'Crea un producto nuevo para mostrarlo en el catálogo de la tienda.'}
            </p>
          </div>
        </div>

        <form className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]" onSubmit={handleAddProduct}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-textPrimary">Nombre del producto</label>
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Ej. Gatito Mágico"
                className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-textPrimary outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-textPrimary">Descripción</label>
              <textarea
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Describe el producto"
                className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-textPrimary outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
                rows={4}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-textPrimary">Precio</label>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={price}
                  onChange={(event) => setPrice(event.target.value)}
                  className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-textPrimary outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-textPrimary">Stock</label>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={stock}
                  onChange={(event) => setStock(event.target.value)}
                  className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-textPrimary outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-textPrimary">Categoría</label>
                <select
                  value={selectedCategory}
                  onChange={(event) => setSelectedCategory(event.target.value)}
                  className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-textPrimary outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
                >
                  {availableCategories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-textPrimary">Imagen del producto</label>
                <div className="space-y-3">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={async (event) => {
                      const file = event.target.files?.[0];
                      if (file) {
                        try {
                          const compressed = await compressImage(file, 800, 800, 0.8);
                          setImage(compressed);
                          setImagePreview(compressed);
                        } catch (error) {
                          console.error('Error compressing product image:', error);
                        }
                      }
                    }}
                    className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-textPrimary outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
                  />
                  {imagePreview ? (
                    <div className="mt-3 overflow-hidden rounded-3xl border border-slate-200 bg-white">
                      <img src={imagePreview} alt="Vista previa del producto" className="h-40 w-full object-contain" />
                    </div>
                  ) : (
                    <div className="mt-3 flex h-40 items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-slate-50 text-sm text-slate-500">
                      Ninguna imagen seleccionada
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-textPrimary">Rating</label>
                <input
                  type="number"
                  min="0"
                  max="5"
                  step="0.1"
                  value={rating}
                  onChange={(event) => setRating(event.target.value)}
                  className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-textPrimary outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-textPrimary">Reseñas</label>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={reviews}
                  onChange={(event) => setReviews(event.target.value)}
                  className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-textPrimary outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
                />
              </div>
            </div>

            {/* Sección de oferta */}
            <div className="rounded-3xl border border-softPink/30 bg-gradient-to-tr from-softPink/5 to-lavender/5 p-5 space-y-4">
              <p className="text-sm font-bold text-textPrimary">🏷️ Oferta / Descuento</p>
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="hasOffer"
                  checked={hasOffer}
                  onChange={(e) => {
                    setHasOffer(e.target.checked);
                    if (!e.target.checked) {
                      setOfferPrice('');
                      setOfferPriceError('');
                    }
                  }}
                  className="h-4 w-4 rounded accent-softPink cursor-pointer"
                />
                <label htmlFor="hasOffer" className="text-sm font-medium text-textPrimary cursor-pointer select-none">
                  Producto en oferta
                </label>
              </div>
              {hasOffer && (
                <div>
                  <label className="block text-sm font-medium text-textPrimary">
                    Precio de oferta <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    step="1"
                    value={offerPrice}
                    onChange={(e) => {
                      setOfferPrice(e.target.value);
                      setOfferPriceError('');
                    }}
                    placeholder={`Ej. ${Math.round(Number(price) * 0.8) || ''}`}
                    required={hasOffer}
                    className={`mt-2 w-full rounded-3xl border px-4 py-3 text-sm text-textPrimary outline-none focus:ring-2 ${
                      offerPriceError
                        ? 'border-rose-300 bg-rose-50 focus:border-rose-400 focus:ring-rose-200/40'
                        : 'border-slate-200 bg-slate-50 focus:border-softPink focus:ring-softPink/20'
                    }`}
                  />
                  {offerPriceError && (
                    <p className="mt-1.5 text-xs font-semibold text-rose-500">{offerPriceError}</p>
                  )}
                  {offerPrice && !offerPriceError && Number(offerPrice) > 0 && Number(offerPrice) < Number(price) && (
                    <p className="mt-1.5 text-xs font-semibold text-[#5D4E6D]/70">
                      Descuento: {Math.round((1 - Number(offerPrice) / Number(price)) * 100)}% — Ahorras ${Number(price) - Number(offerPrice)}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4 rounded-[32px] border border-slate-100 bg-slate-50 p-6">
            <p className="text-sm font-semibold text-textPrimary">Vista previa</p>
            <div className="grid gap-3">
              <span className="text-sm text-slate-600">Producto: {name || 'Nombre del producto'}</span>
              <span className="text-sm text-slate-600">Categoría: {selectedCategory}</span>
              <span className="text-sm text-slate-600">Precio: ${price}</span>
              {hasOffer && offerPrice && (
                <span className="text-sm font-semibold text-[#C44A70]">Oferta: ${offerPrice}</span>
              )}
              <span className="text-sm text-slate-600">Stock: {stock}</span>
            </div>
            <div className="space-y-2">
              {productError && (
                <div className="p-3 text-xs text-rose-600 bg-rose-50 rounded-2xl border border-rose-100">
                  {productError}
                </div>
              )}
              <Button type="submit" className="w-full">
                {editingProductId ? 'Guardar cambios' : 'Guardar producto'}
              </Button>
              {editingProductId && (
                <Button type="button" variant="ghost" onClick={handleCancelEdit} className="w-full">
                  Cancelar edición
                </Button>
              )}
            </div>
          </div>
        </form>
      </section>

      <section className="mt-10 rounded-[40px] border border-slate-200 bg-white p-8 shadow-soft">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-2xl font-semibold text-textPrimary">Productos del catálogo</h2>
          <p className="text-sm text-slate-600">Estos son todos los productos activos actualmente en la tienda.</p>
        </div>

        {catalogProducts.length === 0 ? (
          <div className="rounded-[32px] border border-dashed border-slate-200 p-8 text-center text-sm text-slate-600">
            No hay productos en el catálogo aún.
          </div>
        ) : (
          <div className="grid gap-4">
            {catalogProducts.map((product) => (
              <div key={product.id} className="rounded-[32px] border border-slate-200 bg-slate-50 p-5 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="font-semibold text-textPrimary">{product.name}</p>
                  <p className="text-sm text-slate-600">{product.category}</p>
                </div>
                <div className="mt-4 flex flex-wrap items-center gap-3 sm:mt-0">
                  {product.hasOffer && product.offerPrice != null ? (
                    <>
                      <span className="rounded-full bg-white px-4 py-2 text-sm text-slate-400 line-through">${product.price}</span>
                      <span className="rounded-full bg-gradient-to-r from-softPink to-lavender px-4 py-2 text-sm font-bold text-textPrimary border border-white/60">🏷️ ${product.offerPrice}</span>
                    </>
                  ) : (
                    <span className="rounded-full bg-white px-4 py-2 text-sm text-slate-700">${product.price}</span>
                  )}
                  <Button type="button" variant="ghost" onClick={() => handleEditClick(product)}>
                    Editar
                  </Button>
                  <Button type="button" variant="ghost" onClick={() => deleteProduct(product.id)} className="text-rose-600 hover:text-rose-700">
                    Eliminar
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
