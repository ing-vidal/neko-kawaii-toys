'use client';

import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { Button } from '@components/Button';
import { Product } from '@product-types/product';
import { useAdminAccess } from '@hooks/useAdminAccess';
import { useAdminConfig } from '@hooks/useAdminConfig';
import { useAdminCatalog } from '@hooks/useAdminCatalog';
import { getProducts } from '@lib/utils';

const imageOptions = [
  '/images/product-1.svg',
  '/images/product-2.svg',
  '/images/product-3.svg',
  '/images/product-4.svg',
  '/images/product-5.svg'
];

function createProductId(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export default function AdminPage() {
  const { whatsappNumber, setWhatsappNumber, logoUrl, bannerUrl, setLogoUrl, setBannerUrl, addCategory } = useAdminConfig();
  const { products: catalogProducts, categories: availableCategories, addProduct, deleteProduct } = useAdminCatalog(getProducts());

  const [categoryName, setCategoryName] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('20');
  const [selectedCategory, setSelectedCategory] = useState(availableCategories[0] ?? 'Figuras');
  const [image, setImage] = useState(imageOptions[0]);
  const [imagePreview, setImagePreview] = useState(imageOptions[0]);
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

  const handleLogoUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const value = reader.result as string;
      setLogoUrl(value);
      setLogoPreview(value);
    };
    reader.readAsDataURL(file);
  };

  const handleBannerUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const value = reader.result as string;
      setBannerUrl(value);
      setBannerPreview(value);
    };
    reader.readAsDataURL(file);
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
  };

  const handleCancelEdit = () => {
    setEditingProductId(null);
    setName('');
    setDescription('');
    setPrice('20');
    setSelectedCategory(availableCategories[0] ?? 'Figuras');
    setImage(imageOptions[0]);
    setImagePreview(imageOptions[0]);
    setStock('10');
    setRating('4.8');
    setReviews('10');
  };

  const handleAddProduct = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!name.trim()) return;
    setProductError(null);

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
    setImage(imageOptions[0]);
    setImagePreview(imageOptions[0]);
    setStock('10');
    setRating('4.8');
    setReviews('10');
    setEditingProductId(null);
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
                <label className="block text-sm font-medium text-textPrimary">Imagen</label>
                <div className="space-y-3">
                  <select
                    value={image}
                    onChange={(event) => setImage(event.target.value)}
                    className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-textPrimary outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
                  >
                    {imageOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  <label className="block text-sm font-medium text-textPrimary">O sube una imagen desde tu computadora</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(event) => {
                      const file = event.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = () => {
                          const value = reader.result as string;
                          setImage(value);
                          setImagePreview(value);
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-textPrimary outline-none"
                  />
                  {imagePreview && (
                    <div className="mt-3 overflow-hidden rounded-3xl border border-slate-200 bg-white">
                      <img src={imagePreview} alt="Vista previa del producto" className="h-40 w-full object-contain" />
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
          </div>

          <div className="space-y-4 rounded-[32px] border border-slate-100 bg-slate-50 p-6">
            <p className="text-sm font-semibold text-textPrimary">Vista previa</p>
            <div className="grid gap-3">
              <span className="text-sm text-slate-600">Producto: {name || 'Nombre del producto'}</span>
              <span className="text-sm text-slate-600">Categoría: {selectedCategory}</span>
              <span className="text-sm text-slate-600">Precio: ${price}</span>
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
                  <span className="rounded-full bg-white px-4 py-2 text-sm text-slate-700">${product.price}</span>
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
