"use client";

import { ImageOrFallback } from './ImageOrFallback';
import { useEffect, useRef, useState } from 'react';

interface AnchorRect {
  left: number;
  top: number;
  width: number;
  height: number;
}

interface ReelModalProps {
  isOpen: boolean;
  onClose: () => void;
  reelUrl?: string | null;
  title?: string;
  thumbnail?: string;
  /** If provided, the modal will position itself near this rect (fixed coordinates) */
  anchorRect?: AnchorRect | null;
}

export function ReelModal({ isOpen, onClose, reelUrl, title, thumbnail, anchorRect }: ReelModalProps) {
  const modalRef = useRef<HTMLDivElement | null>(null);
  const [pos, setPos] = useState<{ left?: number; top?: number } | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    if (!anchorRect) {
      setPos(null);
      return;
    }

    const compute = () => {
      const el = modalRef.current;
      const mw = el ? el.offsetWidth : 320;
      const mh = el ? el.offsetHeight : 160;
      const padding = 8;
      // Try to place below the anchor
      let left = Math.round(anchorRect.left);
      let top = Math.round(anchorRect.top + anchorRect.height + 8);

      // adjust horizontal overflow
      if (left + mw + padding > window.innerWidth) {
        left = Math.max(padding, window.innerWidth - mw - padding);
      }
      // if not enough space below, place above
      if (top + mh + padding > window.innerHeight) {
        const altTop = Math.round(anchorRect.top - mh - 8);
        if (altTop > padding) top = altTop;
        else top = Math.max(padding, window.innerHeight - mh - padding);
      }

      setPos({ left, top });
    };

    // compute after a tick to allow modal size measurement
    setTimeout(compute, 0);
    const onResize = () => compute();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [isOpen, anchorRect]);

  if (!isOpen || !reelUrl) return null;

  const openReel = () => {
    try {
      window.open(reelUrl, '_blank', 'noopener,noreferrer');
    } catch {
      window.location.href = reelUrl;
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 p-0 pointer-events-none">
      {/* backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-[#3B3443]/40 backdrop-blur-md transition-opacity"
      />

      <div
        ref={modalRef}
        style={pos ? { left: pos.left, top: pos.top } : undefined}
        className={`absolute z-60 w-full max-w-md pointer-events-auto ${pos ? '' : 'inset-0 m-auto flex'} `}
      >
        <div className="relative overflow-hidden rounded-[18px] border border-softPink/30 bg-white/95 backdrop-blur-xl p-4 shadow-[0_18px_40px_rgba(248,200,220,0.26)]">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-softPink/30 text-textPrimary border border-softPink/20 text-sm shadow-sm">📹</div>
            <div className="text-base font-bold text-[#5D4E6D]">{title ?? 'Ver video'}</div>
          </div>

          <div className="mt-3 flex gap-3 items-start">
            <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-[12px] bg-white border border-softPink/20 p-2 flex items-center justify-center">
              <ImageOrFallback src={thumbnail ?? ''} alt={title ?? 'Thumbnail'} width={112} height={112} className="max-h-full w-auto object-contain" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-[#8C84A2]">Se abrirá en una nueva pestaña.</p>
              <p className="mt-2 text-sm font-medium text-[#5D4E6D] line-clamp-3 break-words">{reelUrl}</p>
            </div>
          </div>

          <div className="mt-4 flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 rounded-full border border-softPink/30 bg-white/80 px-4 py-2 text-sm font-bold text-textPrimary transition hover:bg-softPink/10 hover:border-softPink/50 active:scale-95 duration-150"
            >
              Cerrar
            </button>
            <button
              onClick={openReel}
              className="flex-1 inline-flex items-center justify-center rounded-full bg-gradient-to-r from-softPink to-lavender px-4 py-2 text-sm font-bold text-textPrimary border border-white/60 shadow-soft hover:shadow-md hover:scale-[1.02] active:scale-95 transition-all duration-150"
            >
              Ver video
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
