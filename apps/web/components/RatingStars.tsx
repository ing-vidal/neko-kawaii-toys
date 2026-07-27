interface RatingStarsProps {
  rating: number;
}

export function RatingStars({ rating }: RatingStarsProps) {
  const fullStars = Math.floor(rating);

  return (
    <div className="flex items-center gap-1 text-sm text-amber-500">
      {Array.from({ length: 5 }, (_, index) => (
        <span key={index} className={index < fullStars ? 'text-amber-500' : 'text-slate-300'}>
          ★
        </span>
      ))}
      <span className="text-slate-500 ml-2">{rating.toFixed(1)}</span>
    </div>
  );
}
