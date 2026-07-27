export function Newsletter() {
  return (
    <section className="rounded-[40px] border border-slate-200 bg-white p-8 shadow-soft sm:p-12">
      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-accent">Newsletter</p>
          <h2 className="mt-4 text-3xl font-bold text-textPrimary sm:text-4xl">Recibe las novedades más tiernas</h2>
          <p className="mt-4 max-w-xl text-sm leading-7 text-slate-600">
            Suscríbete para conocer lanzamientos exclusivos, colecciones limitadas y ofertas especiales de Neko Kawaii Toys.
          </p>
        </div>
        <form className="space-y-4 sm:flex sm:items-center sm:gap-4">
          <input
            type="email"
            placeholder="Tu correo electrónico"
            className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm text-textPrimary outline-none placeholder:text-slate-400 focus:border-accent focus:ring-2 focus:ring-accent/10"
          />
          <button type="submit" className="inline-flex min-w-[10rem] items-center justify-center rounded-full bg-accent px-6 py-4 text-sm font-semibold text-white transition hover:bg-[#6549ff]">
            Unirme
          </button>
        </form>
      </div>
    </section>
  );
}
