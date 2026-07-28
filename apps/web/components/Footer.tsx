import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t border-softPink/20 bg-white/40 backdrop-blur-md py-16 relative z-10">
      <div className="mx-auto flex max-w-7xl flex-col gap-10 px-5 sm:px-6 lg:px-8 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-md space-y-4">
          <div className="flex items-center gap-3 text-lg font-black tracking-tight text-textPrimary">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-[14px] bg-gradient-to-br from-softPink via-white to-sky text-xl shadow-sm border border-softPink/20">🌸</span>
            <span className="bg-gradient-to-r from-textPrimary via-[#5D4E6D] to-textPrimary bg-clip-text text-transparent font-extrabold">Neko Kawaii Toys</span>
          </div>
          <p className="text-sm text-[#5D4E6D]/80 leading-7 font-medium">
            Tu destino premium para productos kawaii, figuras y accesorios japoneses con una experiencia confiable, dulce y de ensueño.
          </p>
        </div>
        <div className="grid gap-8 sm:grid-cols-2 sm:gap-12 lg:w-[60%] lg:grid-cols-3">
          <div>
            <h3 className="font-bold text-[#4B4453] tracking-wide text-sm sm:text-base">Explorar</h3>
            <ul className="mt-4 space-y-3 text-sm text-[#5D4E6D]/80 font-medium">
              <li>
                <Link href="/products" className="hover:text-softPink transition-colors duration-200">
                  Catálogo completo
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-softPink transition-colors duration-200">
                  Contacto
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-[#4B4453] tracking-wide text-sm sm:text-base">Soporte</h3>
            <ul className="mt-4 space-y-3 text-sm text-[#5D4E6D]/80 font-medium">
              <li>🌸 Envíos seguros</li>
              <li>🌸 Devoluciones premium</li>
              <li>🌸 Atención personalizada</li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-[#4B4453] tracking-wide text-sm sm:text-base">Sigamos</h3>
            <p className="mt-4 text-sm text-[#5D4E6D]/80 leading-6 font-medium">Síguenos en redes para lanzamientos exclusivos y promociones dulces inspiradas en Hanami.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
