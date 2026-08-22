'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@components/Button';

type FormState = 'idle' | 'submitting' | 'success' | 'error';

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

interface ContactConfig {
  whatsappNumber: string;
  emailIconUrl: string;
  instagramIconUrl: string;
  facebookIconUrl: string;
  whatsappIconUrl: string;
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.45, ease: 'easeOut' as const },
  }),
};

function validate(data: FormData): FormErrors {
  const errors: FormErrors = {};
  if (!data.name.trim()) errors.name = 'El nombre es obligatorio.';
  if (!data.email.trim()) {
    errors.email = 'El correo es obligatorio.';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = 'Ingresa un correo válido.';
  }
  if (!data.subject.trim()) errors.subject = 'El asunto es obligatorio.';
  if (!data.message.trim()) {
    errors.message = 'El mensaje es obligatorio.';
  } else if (data.message.trim().length < 10) {
    errors.message = 'El mensaje debe tener al menos 10 caracteres.';
  }
  return errors;
}

const inputClass = (hasError: boolean) =>
  `w-full rounded-[20px] border px-5 py-4 text-sm font-medium text-textPrimary outline-none
   placeholder:text-[#8C84A2] bg-white/90 transition duration-200 focus:ring-2
   ${hasError
     ? 'border-red-300 focus:border-red-400 focus:ring-red-200/40'
     : 'border-softPink/30 focus:border-softPink focus:ring-softPink/20'
   }`;

/* ── Default Brand Icons ── */
function EmailIcon({ className = 'h-7 w-7' }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="48" height="48" rx="12" fill="#F0F4FF"/>
      <path d="M10 16a2 2 0 012-2h24a2 2 0 012 2v16a2 2 0 01-2 2H12a2 2 0 01-2-2V16z" fill="#4F6CF7" opacity="0.15"/>
      <path d="M10 16l14 10 14-10" stroke="#4F6CF7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <rect x="10" y="14" width="28" height="20" rx="2" stroke="#4F6CF7" strokeWidth="2"/>
    </svg>
  );
}

function InstagramIcon({ className = 'h-7 w-7' }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="ig-contact-grad" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#f9a825"/>
          <stop offset="40%" stopColor="#e91e8c"/>
          <stop offset="100%" stopColor="#8b29cf"/>
        </linearGradient>
      </defs>
      <rect width="48" height="48" rx="12" fill="url(#ig-contact-grad)"/>
      <rect x="13" y="13" width="22" height="22" rx="6" stroke="white" strokeWidth="2.2" fill="none"/>
      <circle cx="24" cy="24" r="5.5" stroke="white" strokeWidth="2.2" fill="none"/>
      <circle cx="31" cy="17" r="1.5" fill="white"/>
    </svg>
  );
}

function FacebookIcon({ className = 'h-7 w-7' }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} xmlns="http://www.w3.org/2000/svg">
      <rect width="48" height="48" rx="12" fill="#1877F2"/>
      <path d="M28 14h-3a5 5 0 00-5 5v3h-3v4h3v10h4V26h3l1-4h-4v-3a1 1 0 011-1h3v-4z" fill="white"/>
    </svg>
  );
}

function WhatsAppIcon({ className = 'h-7 w-7' }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} xmlns="http://www.w3.org/2000/svg">
      <rect width="48" height="48" rx="12" fill="#25D366"/>
      <path d="M24 12.5C17.6 12.5 12.5 17.6 12.5 24c0 2.12.58 4.1 1.6 5.8L12.5 35.5l5.83-1.57A11.47 11.47 0 0024 35.5c6.4 0 11.5-5.1 11.5-11.5S30.4 12.5 24 12.5z" stroke="white" strokeWidth="1.5" fill="none"/>
      <path d="M20.5 18.5c-.4-.9-1-.9-1.5-.9-.4 0-.8 0-1.2.4-.4.4-1.5 1.5-1.5 3.6s1.5 4.2 1.7 4.5c.2.3 2.9 4.6 7.2 6.2 3.6 1.4 4.3 1.1 5.1 1 .8-.1 2.5-1 2.9-2s.4-1.8.3-2c-.1-.2-.5-.3-.9-.5s-2.5-1.2-2.9-1.4c-.4-.1-.7-.2-1 .2-.3.4-1.2 1.4-1.5 1.7-.3.3-.5.3-.9.1s-1.7-.6-3.3-2c-1.2-1.1-2-2.5-2.3-2.9-.3-.4 0-.6.2-.8.2-.2.5-.5.7-.7.2-.3.3-.5.4-.8.1-.3 0-.6-.1-.8z" fill="white"/>
    </svg>
  );
}

function ContactIcon({
  customUrl,
  DefaultIcon,
  alt,
}: {
  customUrl: string;
  DefaultIcon: React.ComponentType<{ className?: string }>;
  alt: string;
}) {
  if (customUrl) {
    return <img src={customUrl} alt={alt} className="h-8 w-8 object-contain rounded-lg" />;
  }
  return <DefaultIcon className="h-8 w-8" />;
}

export default function ContactPage() {
  const [form, setForm] = useState<FormData>({ name: '', email: '', subject: '', message: '' });
  const [errors, setErrors] = useState<FormErrors>({});
  const [formState, setFormState] = useState<FormState>('idle');
  const [config, setConfig] = useState<ContactConfig>({
    whatsappNumber: '',
    emailIconUrl: '',
    instagramIconUrl: '',
    facebookIconUrl: '',
    whatsappIconUrl: '',
  });

  useEffect(() => {
    fetch('/api/admin/config', { cache: 'no-store' })
      .then((r) => r.json())
      .then((data: Partial<ContactConfig>) => {
        setConfig({
          whatsappNumber: data.whatsappNumber || '',
          emailIconUrl: data.emailIconUrl || '',
          instagramIconUrl: data.instagramIconUrl || '',
          facebookIconUrl: data.facebookIconUrl || '',
          whatsappIconUrl: data.whatsappIconUrl || '',
        });
      })
      .catch(() => {});
  }, []);

  const contactCards = [
    {
      key: 'email',
      title: 'Correo electrónico',
      content: 'nekokawaiitoys@gmail.com',
      note: 'Lunes a viernes · 9:00 – 18:00',
      href: 'mailto:nekokawaiitoys@gmail.com',
      customIconUrl: config.emailIconUrl,
      DefaultIcon: EmailIcon,
    },
    {
      key: 'instagram',
      title: 'Instagram',
      content: '@nekokawaiitoys',
      note: '¡Publicamos novedades y sorpresas todos los días!',
      href: 'https://www.instagram.com/nekokawaiitoys/',
      customIconUrl: config.instagramIconUrl,
      DefaultIcon: InstagramIcon,
    },
    {
      key: 'facebook',
      title: 'Facebook',
      content: 'Neko Kawaii Toys',
      note: 'Síguenos para conocer nuestros sorteos exclusivos.',
      href: 'https://www.facebook.com/profile.php?id=61592058311480',
      customIconUrl: config.facebookIconUrl,
      DefaultIcon: FacebookIcon,
    },
    {
      key: 'whatsapp',
      title: 'WhatsApp',
      content: config.whatsappNumber ? `+${config.whatsappNumber}` : 'WhatsApp',
      note: 'Escríbenos directamente, ¡respondemos rápido!',
      href: config.whatsappNumber
        ? `https://wa.me/${config.whatsappNumber}`
        : '#',
      customIconUrl: config.whatsappIconUrl,
      DefaultIcon: WhatsAppIcon,
    },
  ];

  const handleChange = (field: keyof FormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validate(form);
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setFormState('submitting');
    // Simulated async send — replace with real API call if needed
    await new Promise((r) => setTimeout(r, 1200));
    setFormState('success');
  };

  return (
    <div className="mx-auto max-w-7xl px-5 py-10 sm:px-6 lg:px-8 animate-fade-in-up space-y-12">
      {/* Header */}
      <div className="space-y-3">
        <p className="text-xs sm:text-sm font-extrabold uppercase tracking-[0.25em] bg-gradient-to-r from-softPink via-[#5D4E6D] to-lavender bg-clip-text text-transparent">
          Contacto
        </p>
        <h1 className="text-4xl font-black text-textPrimary sm:text-5xl">
          ¿Tienes alguna pregunta?
        </h1>
        <p className="max-w-2xl text-[#5D4E6D]/80 font-medium mt-2">
          Escríbenos y responderemos lo antes posible. También puedes encontrarnos en nuestras redes sociales.
        </p>
      </div>

      {/* Contact cards */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {contactCards.map((card, i) => (
          <motion.a
            key={card.key}
            href={card.href}
            target={card.href.startsWith('http') ? '_blank' : undefined}
            rel={card.href.startsWith('http') ? 'noopener noreferrer' : undefined}
            custom={i}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={cardVariants}
            className="rounded-[32px] border border-softPink/20 bg-white/70 backdrop-blur-sm p-7 shadow-soft flex flex-col gap-3 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:bg-white group"
          >
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-[16px] bg-white border border-softPink/20 shadow-sm">
              <ContactIcon
                customUrl={card.customIconUrl}
                DefaultIcon={card.DefaultIcon}
                alt={card.title}
              />
            </span>
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#8C84A2]">{card.title}</p>
              <p className="mt-1 text-base font-bold text-textPrimary group-hover:text-softPink transition-colors duration-200">
                {card.content}
              </p>
            </div>
            <p className="text-xs text-[#8C84A2] font-semibold">{card.note}</p>
          </motion.a>
        ))}
      </div>

      {/* Contact form */}
      <div className="grid gap-10 lg:grid-cols-[1fr_0.85fr] items-start">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="rounded-[36px] border border-softPink/20 bg-white/70 backdrop-blur-sm p-8 sm:p-10 shadow-soft"
        >
          <p className="text-xs sm:text-sm font-extrabold uppercase tracking-[0.25em] bg-gradient-to-r from-softPink via-[#5D4E6D] to-lavender bg-clip-text text-transparent">
            Formulario
          </p>
          <h2 className="mt-3 text-2xl sm:text-3xl font-black text-textPrimary">
            Envíanos un mensaje
          </h2>

          <AnimatePresence mode="wait">
            {formState === 'success' ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                className="mt-8 rounded-[28px] bg-gradient-to-tr from-softPink/10 to-sky/10 border border-softPink/20 p-10 text-center space-y-3"
              >
                <span className="text-5xl">🌸</span>
                <p className="text-xl font-black text-textPrimary">¡Mensaje enviado!</p>
                <p className="text-sm text-[#5D4E6D]/80 font-medium">
                  Gracias por contactarnos. Responderemos a tu correo a la brevedad.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setForm({ name: '', email: '', subject: '', message: '' });
                    setFormState('idle');
                  }}
                  className="mt-2 text-sm font-bold text-[#C44A70] hover:underline"
                >
                  Enviar otro mensaje
                </button>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={handleSubmit}
                className="mt-8 space-y-5"
                noValidate
              >
                {/* Nombre */}
                <div>
                  <label className="block text-sm font-bold text-textPrimary mb-1.5">
                    Nombre <span className="text-[#C44A70]">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Tu nombre"
                    value={form.name}
                    onChange={handleChange('name')}
                    className={inputClass(!!errors.name)}
                  />
                  {errors.name && <p className="mt-1.5 text-xs font-semibold text-red-400">{errors.name}</p>}
                </div>

                {/* Correo */}
                <div>
                  <label className="block text-sm font-bold text-textPrimary mb-1.5">
                    Correo electrónico <span className="text-[#C44A70]">*</span>
                  </label>
                  <input
                    type="email"
                    placeholder="tu@correo.com"
                    value={form.email}
                    onChange={handleChange('email')}
                    className={inputClass(!!errors.email)}
                  />
                  {errors.email && <p className="mt-1.5 text-xs font-semibold text-red-400">{errors.email}</p>}
                </div>

                {/* Asunto */}
                <div>
                  <label className="block text-sm font-bold text-textPrimary mb-1.5">
                    Asunto <span className="text-[#C44A70]">*</span>
                  </label>
                  <select
                    value={form.subject}
                    onChange={handleChange('subject')}
                    className={inputClass(!!errors.subject)}
                  >
                    <option value="">Selecciona un asunto</option>
                    <option value="Consulta de producto">Consulta de producto</option>
                    <option value="Estado de pedido">Estado de pedido</option>
                    <option value="Devolución o cambio">Devolución o cambio</option>
                    <option value="Colaboración">Colaboración</option>
                    <option value="Otro">Otro</option>
                  </select>
                  {errors.subject && <p className="mt-1.5 text-xs font-semibold text-red-400">{errors.subject}</p>}
                </div>

                {/* Mensaje */}
                <div>
                  <label className="block text-sm font-bold text-textPrimary mb-1.5">
                    Mensaje <span className="text-[#C44A70]">*</span>
                  </label>
                  <textarea
                    placeholder="Escribe tu mensaje aquí..."
                    value={form.message}
                    onChange={handleChange('message')}
                    rows={5}
                    className={inputClass(!!errors.message)}
                  />
                  {errors.message && <p className="mt-1.5 text-xs font-semibold text-red-400">{errors.message}</p>}
                </div>

                <Button
                  type="submit"
                  disabled={formState === 'submitting'}
                  className="w-full py-4 text-base"
                >
                  {formState === 'submitting' ? 'Enviando...' : 'Enviar mensaje 🌸'}
                </Button>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Info lateral */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15, ease: 'easeOut' }}
          className="space-y-6"
        >
          <div className="rounded-[32px] border border-softPink/20 bg-white/70 backdrop-blur-sm p-8 shadow-soft space-y-5">
            <p className="text-xs sm:text-sm font-extrabold uppercase tracking-[0.25em] bg-gradient-to-r from-softPink via-[#5D4E6D] to-lavender bg-clip-text text-transparent">
              Preguntas frecuentes
            </p>
            {[
              {
                q: '¿Cuánto tarda un envío?',
                a: 'Los pedidos se procesan en 1–2 días hábiles. El tiempo de entrega depende de tu ubicación.',
              },
              {
                q: '¿Puedo devolver un producto?',
                a: 'Sí, aceptamos devoluciones dentro de los 7 días posteriores a la recepción del pedido.',
              },
              {
                q: '¿Tienen productos en oferta?',
                a: 'Siempre tenemos productos destacados con descuento. Revisa el catálogo para ver las ofertas activas.',
              },
            ].map((faq) => (
              <div key={faq.q} className="border-t border-softPink/10 pt-4">
                <p className="text-sm font-bold text-textPrimary">{faq.q}</p>
                <p className="mt-1.5 text-sm text-[#5D4E6D]/80 font-medium leading-6">{faq.a}</p>
              </div>
            ))}
          </div>

          <div className="rounded-[32px] border border-softPink/20 bg-gradient-to-tr from-softPink/15 via-white/60 to-sky/15 backdrop-blur-sm p-8 shadow-soft text-center space-y-3">
            <span className="text-4xl">🎀</span>
            <p className="text-base font-black text-textPrimary">Horario de atención</p>
            <p className="text-sm text-[#5D4E6D]/80 font-medium">
              Lunes a viernes · 9:00 a 18:00
            </p>
            <p className="text-xs text-[#8C84A2] font-semibold">
              Respondemos todos los mensajes con mucho amor 💕
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
