export default function AboutPage() {
  return (
    <div className="mx-auto max-w-7xl px-5 py-10 sm:px-6 lg:px-8">
      <div className="mb-10 space-y-3">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-accent">Nosotros</p>
        <h1 className="text-4xl font-bold text-textPrimary sm:text-5xl">Conoce a Neko Kawaii Toys</h1>
        <p className="max-w-2xl text-slate-600">
          Somos una tienda dedicada a compartir productos kawaii de alta calidad con coleccionistas y fans del anime.
        </p>
      </div>
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="rounded-[40px] border border-slate-200 bg-white p-8 shadow-soft">
          <h2 className="text-2xl font-semibold text-textPrimary">Nuestra misión</h2>
          <p className="mt-4 text-slate-600">
            Crear una experiencia de compra cálida y confiable para todos los amantes de la cultura kawaii.
          </p>
        </div>
        <div className="rounded-[40px] border border-slate-200 bg-white p-8 shadow-soft">
          <h2 className="text-2xl font-semibold text-textPrimary">Qué ofrecemos</h2>
          <p className="mt-4 text-slate-600">
            Figuras de colección, peluches suaves, accesorios únicos y lanzamientos exclusivos pensados para inspirar ternura.
          </p>
        </div>
      </div>
    </div>
  );
}
