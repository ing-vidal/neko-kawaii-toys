export default function ContactPage() {
  return (
    <div className="mx-auto max-w-7xl px-5 py-10 sm:px-6 lg:px-8">
      <div className="mb-10 space-y-3">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-accent">Contacto</p>
        <h1 className="text-4xl font-bold text-textPrimary sm:text-5xl">¿Tienes alguna pregunta?</h1>
        <p className="max-w-2xl text-slate-600">
          Envíanos un mensaje y responderemos lo antes posible para ayudarte con tus pedidos y dudas.
        </p>
      </div>
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="rounded-[40px] border border-slate-200 bg-white p-8 shadow-soft">
          <h2 className="text-2xl font-semibold text-textPrimary">Escríbenos</h2>
          <p className="mt-4 text-slate-600">nekokawaiitoys@gmail.com</p>
          <p className="mt-6 text-sm text-slate-500">Nuestro horario de atención es de lunes a viernes de 9:00 a 18:00.</p>
        </div>
        <div className="rounded-[40px] border border-slate-200 bg-white p-8 shadow-soft">
          <h2 className="text-2xl font-semibold text-textPrimary">Dirección</h2>
          <p className="mt-4 text-slate-600">Calle Sakura 18, Distrito Otaku, Ciudad Kawaii</p>
          <p className="mt-6 text-sm text-slate-500">Envíos rápidos y atención personalizada para tus colecciones favoritas.</p>
        </div>
      </div>
    </div>
  );
}
