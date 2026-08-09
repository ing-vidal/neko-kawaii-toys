"use client";

import { ImageOrFallback } from './ImageOrFallback';

interface ReelModalProps {
  isOpen: boolean;
  onClose: () => void;
  reelUrl?: string | null;
  title?: string;
  thumbnail?: string;
}

export function ReelModal({ isOpen, onClose, reelUrl, title, thumbnail }: ReelModalProps) {
  if (!isOpen || !reelUrl) return null;

  const openReel = () => {
    try {
      window.open(reelUrl, '_blank', 'noopener,noreferrer');
    } catch {
      // fallback
      window.location.href = reelUrl;
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#3B3443]/40 backdrop-blur-md transition-opacity animate-in fade-in duration-200">
      <div className="relative w-full max-w-md overflow-hidden rounded-[36px] border border-softPink/30 bg-white/90 backdrop-blur-xl p-6 shadow-[0_24px_60px_rgba(248,200,220,0.28)] animate-in zoom-in-95 duration-300">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-softPink/30 text-textPrimary border border-softPink/20 text-sm shadow-sm">📹</div>
          <div className="text-lg font-bold text-[#5D4E6D]">{title ?? 'Ver video'}</div>
        </div>

        <div className="mt-4 flex gap-4">
          <div className="h-28 w-28 flex-shrink-0 overflow-hidden rounded-[16px] bg-white border border-softPink/20 p-2 flex items-center justify-center">
            <ImageOrFallback src={thumbnail} alt={title ?? 'Thumbnail'} width={112} height={112} className="max-h-full w-auto object-contain" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-[#8C84A2]">Se abrirá en una nueva pestaña.</p>
            <p className="mt-2 text-sm font-medium text-[#5D4E6D] line-clamp-3">{reelUrl}</p>
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 rounded-full border border-softPink/30 bg-white/80 px-5 py-3.5 text-sm font-bold text-textPrimary transition hover:bg-softPink/10 hover:border-softPink/50 active:scale-95 duration-200"
          >
            Cerrar
          </button>
          <button
            onClick={openReel}
            className="flex-1 inline-flex items-center justify-center rounded-full bg-gradient-to-r from-softPink to-lavender px-5 py-3.5 text-sm font-bold text-textPrimary border border-white/60 shadow-soft hover:shadow-md hover:scale-[1.02] active:scale-95 transition-all duration-200"
          >
            Ver video
          </button>
        </div>
      </div>
    </div>
  );
}
