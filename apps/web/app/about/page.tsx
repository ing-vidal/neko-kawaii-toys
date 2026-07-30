'use client';

import { motion } from 'framer-motion';
import { Button } from '@components/Button';
import { Newsletter } from '@components/Newsletter';

const stats = [
  { label: 'Productos kawaii', value: '200+', emoji: '🌸' },
  { label: 'Clientes felices', value: '2,400+', emoji: '💕' },
  { label: 'Categorías', value: '6', emoji: '✨' },
  { label: 'Años de experiencia', value: '3+', emoji: '🎀' },
];

const values = [
  {
    emoji: '🌸',
    title: 'Nuestra misión',
    description:
      'Crear una experiencia de compra cálida, confiable y memorable para todos los amantes de la cultura kawaii. Queremos que cada producto que recibas te haga sonreír.',
  },
  {
    emoji: '🎀',
    title: 'Qué ofrecemos',
    description:
      'Figuras de colección, peluches suaves, accesorios únicos y lanzamientos exclusivos seleccionados cuidadosamente para inspirar ternura y estilo japonés.',
  },
  {
    emoji: '💫',
    title: 'Nuestra promesa',
    description:
      'Calidad premium en cada artículo, envíos rápidos y seguros, atención personalizada y devoluciones sin complicaciones. Tu satisfacción es nuestra prioridad.',
  },
  {
    emoji: '🌙',
    title: 'Comunidad kawaii',
    description:
      'Somos más que una tienda: somos una comunidad apasionada. Únete a nosotros en redes sociales y comparte tu amor por el estilo japonés y la cultura kawaii.',
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: 'easeOut' as const },
  }),
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-7xl px-5 py-10 sm:px-6 lg:px-8 animate-fade-in-up space-y-12">
      {/* Header */}
      <div className="space-y-3">
        <p className="text-xs sm:text-sm font-extrabold uppercase tracking-[0.25em] bg-gradient-to-r from-softPink via-[#5D4E6D] to-lavender bg-clip-text text-transparent">
          Nosotros
        </p>
        <h1 className="text-4xl font-black text-textPrimary sm:text-5xl">
          Conoce a Neko Kawaii Toys
        </h1>
        <p className="max-w-2xl text-[#5D4E6D]/80 font-medium mt-2">
          Somos una tienda dedicada a compartir productos kawaii de alta calidad con coleccionistas
          y fans del anime, con amor por el detalle y la cultura japonesa.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            custom={i}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={cardVariants}
            className="rounded-[28px] border border-softPink/20 bg-white/70 backdrop-blur-sm p-6 shadow-soft text-center"
          >
            <span className="text-3xl">{stat.emoji}</span>
            <p className="mt-2 text-2xl sm:text-3xl font-black text-textPrimary">{stat.value}</p>
            <p className="mt-1 text-xs sm:text-sm font-semibold text-[#8C84A2]">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Values grid */}
      <div className="grid gap-6 sm:grid-cols-2">
        {values.map((value, i) => (
          <motion.div
            key={value.title}
            custom={i}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={cardVariants}
            className="rounded-[32px] border border-softPink/20 bg-white/70 backdrop-blur-sm p-8 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:bg-white"
          >
            <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-[18px] bg-gradient-to-tr from-softPink/15 via-surface to-sky/20 border border-softPink/20 text-2xl">
              {value.emoji}
            </div>
            <h2 className="text-xl font-bold text-textPrimary">{value.title}</h2>
            <p className="mt-3 text-[#5D4E6D]/80 font-medium leading-7">{value.description}</p>
          </motion.div>
        ))}
      </div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="rounded-[36px] border border-softPink/20 bg-gradient-to-tr from-softPink/20 via-white/60 to-sky/20 backdrop-blur-sm p-10 sm:p-14 shadow-soft text-center space-y-5"
      >
        <p className="text-xs sm:text-sm font-extrabold uppercase tracking-[0.25em] bg-gradient-to-r from-softPink via-[#5D4E6D] to-lavender bg-clip-text text-transparent">
          ¿Lista para explorar?
        </p>
        <h2 className="text-3xl sm:text-4xl font-black text-textPrimary">
          Descubre el mundo kawaii
        </h2>
        <p className="max-w-xl mx-auto text-[#5D4E6D]/80 font-medium">
          Explora nuestro catálogo completo y encuentra la figura, el peluche o el accesorio que te
          robará el corazón.
        </p>
        <div className="flex flex-wrap gap-4 justify-center mt-2">
          <Button href="/products">Ver catálogo</Button>
          <Button href="/contact" variant="secondary">
            Contáctanos
          </Button>
        </div>
      </motion.div>

      {/* Newsletter */}
      <Newsletter />
    </div>
  );
}
