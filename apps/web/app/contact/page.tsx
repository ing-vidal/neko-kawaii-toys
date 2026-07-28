export default function ContactPage() {
  return (
    <div className="mx-auto max-w-7xl px-5 py-10 sm:px-6 lg:px-8 animate-fade-in-up">
      <div className="mb-10 space-y-3">
        <p className="text-xs sm:text-sm font-extrabold uppercase tracking-[0.25em] bg-gradient-to-r from-softPink via-[#5D4E6D] to-lavender bg-clip-text text-transparent">Contacto</p>
        <h1 className="text-4xl font-black text-textPrimary sm:text-5xl">¿Tienes alguna pregunta?</h1>
        <p className="max-w-2xl text-[#5D4E6D]/80 font-medium mt-2">
          Envíanos un mensaje y responderemos lo antes posible para ayudarte con tus pedidos y dudas.
        </p>
      </div>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-[32px] sm:rounded-[36px] border border-softPink/20 bg-white/70 backdrop-blur-sm p-8 shadow-soft flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:bg-white">
          <div>
            <h2 className="text-2xl font-bold text-textPrimary">Escríbenos</h2>
            <p className="mt-4 text-[#5D4E6D]/85 font-semibold">nekokawaiitoys@gmail.com</p>
          </div>
          <p className="mt-6 text-sm text-[#8C84A2] font-semibold">Nuestro horario de atención es de lunes a viernes de 9:00 a 18:00.</p>
        </div>
        <div className="rounded-[32px] sm:rounded-[36px] border border-softPink/20 bg-white/70 backdrop-blur-sm p-8 shadow-soft flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:bg-white">
          <div>
            <h2 className="text-2xl font-bold text-textPrimary">Síguenos</h2>
            <p className="mt-4 text-[#5D4E6D]/80 font-medium">Síguenos en nuestras redes para enterarte de novedades y sorteos.</p>
            <div className="mt-6 flex flex-col gap-3">
              <a
                href="https://www.instagram.com/nekokawaiitoys/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 rounded-full border border-softPink/30 bg-white px-5 py-3 text-sm font-bold text-textPrimary transition-all hover:bg-softPink/10 hover:border-softPink/50 active:scale-95 duration-200"
              >
                <span className="text-xl">📸</span> Instagram
              </a>
              <a
                href="https://www.facebook.com/profile.php?id=61592058311480"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 rounded-full border border-softPink/30 bg-white px-5 py-3 text-sm font-bold text-textPrimary transition-all hover:bg-softPink/10 hover:border-softPink/50 active:scale-95 duration-200"
              >
                <span className="text-xl">👥</span> Facebook
              </a>
            </div>
          </div>
          <p className="mt-6 text-sm text-[#8C84A2] font-semibold">¡Publicamos novedades y sorpresas todos los días!</p>
        </div>
        <div className="rounded-[32px] sm:rounded-[36px] border border-softPink/20 bg-white/70 backdrop-blur-sm p-8 shadow-soft flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:bg-white">
          <div>
            <h2 className="text-2xl font-bold text-textPrimary">Dirección</h2>
            <p className="mt-4 text-[#5D4E6D]/80 font-medium">Calle Sakura 18, Distrito Otaku, Ciudad Kawaii</p>
          </div>
          <p className="mt-6 text-sm text-[#8C84A2] font-semibold">Envíos rápidos y atención personalizada para tus colecciones favoritas.</p>
        </div>
      </div>
    </div>
  );
}
