import { Star } from "lucide-react";

type RatingStarsProps = {
  rating?: number | null;
};

export default function RatingStars({ rating }: RatingStarsProps) {
  const safeRating = rating ?? 0;

  return (
    <div className="flex items-center gap-1 text-yellow-400">
      <Star className="h-4 w-4 fill-yellow-400" />
      <span className="text-sm font-medium text-yellow-200">
        {safeRating.toFixed(1)}
      </span>
    </div>
  );
}
