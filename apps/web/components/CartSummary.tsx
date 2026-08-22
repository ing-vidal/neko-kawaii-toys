'use client';

import { Button } from './Button';
import { useCart } from '@hooks/useCart';
import { useAdminConfig } from '@hooks/useAdminConfig';
import { ImageOrFallback } from './ImageOrFallback';
import { hasValidOffer, getEffectivePrice } from '@lib/offers';

function buildWhatsAppMessage(items: Array<{ product: { name: string; price: number; hasOffer?: boolean; offerPrice?: number | null }; quantity: number }>, subtotal: number) {
  const lines = ['Me interesan los siguientes productos:'];
  items.forEach((item) => {
    const effectivePrice = hasValidOffer(item.product) ? (item.product.offerPrice as number) : item.product.price;
    const lineTotal = effectivePrice * item.quantity;
    if (hasValidOffer(item.product)) {
      lines.push(`- ${item.product.name} x${item.quantity} (Oferta: $${effectivePrice}, antes $${item.product.price}) → $${lineTotal}`);
    } else {
      lines.push(`- ${item.product.name} x${item.quantity} ($${lineTotal})`);
    }
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
      <div className="rounded-[36px] sm:rounded-[40px] border border-softPink/20 bg-white/70 backdrop-blur-sm p-8 sm:p-12 shadow-soft text-center animate-fade-in-up">
        <p className="text-xl font-bold text-textPrimary">🌸 Tu carrito está vacío</p>
        <p className="mt-3 text-sm text-[#5D4E6D]/80 font-medium">Añade tus figuras y accesorios kawaii favoritos antes de continuar.</p>
        <div className="mt-6 flex justify-center">
          <Button href="/products" type="button">
            Explorar productos
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="rounded-[36px] sm:rounded-[40px] border border-softPink/20 bg-white/70 backdrop-blur-sm p-6 sm:p-8 shadow-soft">
        <div className="space-y-6">
          {items.map((item) => (
            <div key={item.product.id} className="grid gap-4 rounded-3xl border border-softPink/10 bg-gradient-to-tr from-softPink/5 to-sky/5 p-5 sm:grid-cols-[auto_1fr_auto] sm:items-center">
              {/* Imagen del producto */}
              <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-2xl bg-white border border-softPink/20 p-2 flex items-center justify-center mx-auto sm:mx-0">
                <ImageOrFallback
                  src={item.product.image}
                  alt={item.product.name}
                  width={80}
                  height={80}
                  className="max-h-full w-auto object-contain"
                />
              </div>

              {/* Detalles del producto */}
              <div className="space-y-1.5 text-center sm:text-left">
                <p className="text-sm font-bold text-textPrimary">{item.product.name}</p>
                <p className="text-xs text-[#8C84A2] font-semibold">🌸 {item.product.category}</p>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-4 gap-y-1 text-xs sm:text-sm text-[#5D4E6D]/80 font-medium">
                  {hasValidOffer(item.product) ? (
                    <>
                      <span className="line-through text-[#8C84A2]">Precio: ${item.product.price}</span>
                      <span className="font-bold text-[#C44A70]">Oferta: ${item.product.offerPrice}</span>
                      <span className="font-semibold text-textPrimary">Subtotal: ${getEffectivePrice(item.product) * item.quantity}</span>
                    </>
                  ) : (
                    <>
                      <span>Precio: ${item.product.price}</span>
                      <span className="font-semibold text-textPrimary">Subtotal: ${item.product.price * item.quantity}</span>
                    </>
                  )}
                </div>
              </div>

              {/* Controles de cantidad y eliminar */}
              <div className="grid gap-3 text-right">
                <div className="flex items-center justify-center sm:justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-softPink/30 bg-white text-xl text-textPrimary transition hover:bg-softPink/10 active:scale-90"
                  >
                    −
                  </button>
                  <span className="w-10 text-center text-sm font-extrabold text-textPrimary">{item.quantity}</span>
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-softPink/30 bg-white text-xl text-textPrimary transition hover:bg-softPink/10 active:scale-90"
                  >
                    +
                  </button>
                </div>
                <div className="flex justify-center sm:justify-end">
                  <button
                    type="button"
                    onClick={() => removeProduct(item.product.id)}
                    className="text-sm font-bold text-[#8C84A2] hover:text-softPink transition-colors duration-200"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-[36px] sm:rounded-[40px] border border-softPink/20 bg-white/70 backdrop-blur-sm p-6 sm:p-8 shadow-soft">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs sm:text-sm font-extrabold uppercase tracking-[0.25em] bg-gradient-to-r from-softPink via-[#5D4E6D] to-lavender bg-clip-text text-transparent">Resumen del carrito</p>
            <p className="mt-2 text-2xl sm:text-3xl font-black text-textPrimary">Total: ${subtotal}</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button type="button" variant="ghost" onClick={clearCart}>
              Vaciar carrito
            </Button>
            <Button type="button" onClick={handleRequestOrder} disabled={!isOrderEnabled} className="w-full sm:w-auto">
              Solicitar información
            </Button>
          </div>
        </div>
        {!isOrderEnabled && (
          <p className="mt-4 text-xs sm:text-sm text-[#5D4E6D]/80 font-bold bg-softPink/15 border border-softPink/25 rounded-[20px] p-4 text-center">
            🌸 Para solicitar tu pedido, es necesario configurar un número de WhatsApp en el panel de administración.
          </p>
        )}
      </div>
    </div>
  );
}
