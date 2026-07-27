'use client';

import { Button } from './Button';
import { useCart } from '@hooks/useCart';
import { useAdminConfig } from '@hooks/useAdminConfig';

function buildWhatsAppMessage(items: Array<{ product: { name: string; price: number }; quantity: number }>, subtotal: number) {
  const lines = ['Me interesan los siguientes productos:'];
  items.forEach((item) => {
    lines.push(`- ${item.product.name} x${item.quantity} ($${item.product.price * item.quantity})`);
  });
  lines.push(`Total: $${subtotal}`);
  return encodeURIComponent(lines.join('\n'));
}

export function CartSummary() {
  const { items, subtotal, updateQuantity, removeProduct, clearCart } = useCart();
  const { whatsappNumber } = useAdminConfig();
 
  const handleRequestOrder = () => {
    if (typeof window === 'undefined') return;
    const normalized = whatsappNumber.replace(/\D/g, '');
    if (!normalized) return;
    const message = buildWhatsAppMessage(items, subtotal);
    window.open(`https://api.whatsapp.com/send?phone=${normalized}&text=${message}`, '_blank');
  };

  const isOrderEnabled = whatsappNumber.trim().length > 0;

  if (items.length === 0) {
    return (
      <div className="rounded-[40px] border border-slate-200 bg-white p-8 shadow-soft text-center">
        <p className="text-lg font-semibold text-textPrimary">Tu carrito está vacío</p>
        <p className="mt-3 text-sm text-slate-600">Añade tus figuras y accesorios kawaii favoritos antes de continuar.</p>
        <div className="mt-6 flex justify-center">
          <Button href="/products" type="button">
            Explorar productos
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-[40px] border border-slate-200 bg-white p-8 shadow-soft">
        <div className="space-y-6">
          {items.map((item) => (
            <div key={item.product.id} className="grid gap-4 rounded-3xl border border-slate-100 bg-slate-50 p-5 sm:grid-cols-[1fr_auto] sm:items-center">
              <div className="space-y-3">
                <p className="text-sm font-semibold text-textPrimary">{item.product.name}</p>
                <p className="text-sm text-slate-600">{item.product.category}</p>
                <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600">
                  <span>Precio: ${item.product.price}</span>
                  <span>Subtotal: ${item.product.price * item.quantity}</span>
                </div>
              </div>
              <div className="grid gap-3 text-right">
                <div className="flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-white text-xl text-textPrimary"
                  >
                    −
                  </button>
                  <span className="w-10 text-center text-sm font-semibold text-textPrimary">{item.quantity}</span>
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-white text-xl text-textPrimary"
                  >
                    +
                  </button>
                </div>
                <div className="flex flex-wrap justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => removeProduct(item.product.id)}
                    className="text-sm font-semibold text-accent transition hover:text-[#6549ff]"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-[40px] border border-slate-200 bg-white p-8 shadow-soft">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-accent">Resumen del carrito</p>
            <p className="mt-2 text-2xl font-bold text-textPrimary">Total: ${subtotal}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button type="button" variant="ghost" onClick={clearCart}>
              Vaciar carrito
            </Button>
            <Button type="button" onClick={handleRequestOrder} disabled={!isOrderEnabled} className="w-full sm:w-auto">
              Solicitar pedido
            </Button>
          </div>
        </div>
        {!isOrderEnabled && (
          <p className="mt-4 text-sm text-rose-600">
            No hay un número de WhatsApp configurado. Ve a la administración y agrega uno para solicitar el pedido.
          </p>
        )}
      </div>
    </div>
  );
}
