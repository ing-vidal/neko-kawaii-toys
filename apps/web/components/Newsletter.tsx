'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function Newsletter() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Por favor ingresa un correo válido.');
      return;
    }
    setError('');
    setSubmitted(true);
    setEmail('');
  };

  return (
    <section className="rounded-[36px] sm:rounded-[40px] border border-softPink/20 bg-gradient-to-tr from-softPink/15 via-white/60 to-sky/15 backdrop-blur-sm p-8 sm:p-12 shadow-soft">
      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div>
          <p className="text-xs sm:text-sm font-extrabold uppercase tracking-[0.25em] bg-gradient-to-r from-softPink via-[#5D4E6D] to-lavender bg-clip-text text-transparent">
            Newsletter
          </p>
          <h2 className="mt-4 text-3xl font-black text-textPrimary sm:text-4xl">
            Recibe las novedades más tiernas
          </h2>
          <p className="mt-4 max-w-xl text-[#5D4E6D]/80 leading-7 font-medium">
            Suscríbete para conocer lanzamientos exclusivos, colecciones limitadas y ofertas
            especiales de Neko Kawaii Toys.
          </p>
        </div>
        <AnimatePresence mode="wait">
          {submitted ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="rounded-[28px] bg-white/80 border border-softPink/30 p-8 text-center shadow-sm"
            >
              <span className="text-4xl">🌸</span>
              <p className="mt-3 text-lg font-black text-textPrimary">¡Gracias por suscribirte!</p>
              <p className="mt-2 text-sm text-[#5D4E6D]/80 font-medium">
                Pronto recibirás las mejores novedades kawaii.
              </p>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onSubmit={handleSubmit}
              className="space-y-4"
            >
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError('');
                  }}
                  placeholder="Tu correo electrónico"
                  className={`w-full rounded-[20px] border px-5 py-4 text-sm font-medium text-textPrimary outline-none placeholder:text-[#8C84A2] bg-white/90 transition duration-200 focus:ring-2 ${
                    error
                      ? 'border-red-300 focus:border-red-400 focus:ring-red-200/40'
                      : 'border-softPink/30 focus:border-softPink focus:ring-softPink/20'
                  }`}
                />
                {error && (
                  <p className="mt-2 text-xs font-semibold text-red-400">{error}</p>
                )}
              </div>
              <button
                type="submit"
                className="w-full rounded-[20px] bg-gradient-to-r from-softPink to-lavender px-6 py-4 text-sm font-bold text-white shadow-md transition-all duration-200 hover:opacity-90 hover:shadow-lg active:scale-95"
              >
                Unirme 🌸
              </button>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
