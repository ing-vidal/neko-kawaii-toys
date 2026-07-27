import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white/90 py-12">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-5 sm:px-6 lg:px-8 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-md space-y-4">
          <div className="flex items-center gap-3 text-lg font-bold text-textPrimary">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-blush text-2xl">🐾</span>
            Neko Kawaii Toys
          </div>
          <p className="text-sm text-slate-600">
            Tu destino premium para productos kawaii, figuras y accesorios japoneses con una experiencia confiable y cálida.
          </p>
        </div>
        <div className="grid gap-8 sm:grid-cols-2 sm:gap-12 lg:w-[60%] lg:grid-cols-3">
          <div>
            <h3 className="font-semibold text-textPrimary">Explorar</h3>
            <ul className="mt-4 space-y-3 text-sm text-slate-600">
              <li>
                <Link href="/products" className="hover:text-accent">
                  Catálogo completo
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-accent">
                  Contacto
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-textPrimary">Soporte</h3>
            <ul className="mt-4 space-y-3 text-sm text-slate-600">
              <li>Envíos seguros</li>
              <li>Devoluciones premium</li>
              <li>Atención personalizada</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-textPrimary">Sigamos</h3>
            <p className="mt-4 text-sm text-slate-600">Síguenos en redes para lanzamientos exclusivos y promociones suaves.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
