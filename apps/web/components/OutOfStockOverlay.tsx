/**
 * OutOfStockOverlay — overlay oscuro + badge "AGOTADO" centrado sobre la imagen.
 *
 * Solo se renderiza cuando el producto está agotado.
 * El badge tiene una animación pulse muy lenta (3s) para captar atención sin molestar.
 * El overlay es puramente visual/decorativo; el estado se comunica adicionalmente
 * por texto (aria-hidden="true" en el overlay).
 */

interface OutOfStockOverlayProps {
  /** Controla si el overlay se muestra. Si false, no renderiza nada. */
  show: boolean;
  /** Clase CSS de border-radius. Por defecto: rounded-[24px] (ProductCard).
   *  Usa rounded-[26px] en ProductDetails para coincidir con el contenedor. */
  className?: string;
}

export function OutOfStockOverlay({ show, className = 'rounded-[24px]' }: OutOfStockOverlayProps) {
  if (!show) return null;

  return (
    <div
      aria-hidden="true"
      className={`absolute inset-0 z-20 flex items-center justify-center bg-black/45 ${className}`}
    >
      <span
        className="out-of-stock-pulse inline-flex items-center rounded-full bg-[#DC2626] px-5 py-2 text-sm font-black uppercase tracking-widest text-white shadow-lg"
        style={{ letterSpacing: '0.18em' }}
      >
        Agotado
      </span>
    </div>
  );
}

