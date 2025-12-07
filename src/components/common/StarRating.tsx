"use client";

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: "xs" | "sm" | "md" | "lg";
  interactive?: boolean;
  onRatingChange?: (rating: number) => void;
  showValue?: boolean;
  className?: string;
}

export default function StarRating({
  rating,
  maxRating = 5,
  size = "md",
  interactive = false,
  onRatingChange,
  showValue = false,
  className = "",
}: StarRatingProps) {
  const sizeClasses = {
    xs: "text-xs",
    sm: "text-sm sm:text-base",
    md: "text-lg sm:text-xl",
    lg: "text-2xl sm:text-3xl",
  };

  // Para modo interactivo, mostrar todas las estrellas para selección
  // Para modo display, solo mostrar el número de estrellas del rating
  const starsToShow = interactive
    ? Array.from({ length: maxRating }, (_, i) => i + 1)
    : Array.from({ length: Math.min(rating, maxRating) }, (_, i) => i + 1);

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <div className="flex items-center">
        {starsToShow.map((star) => {
          if (interactive && onRatingChange) {
            const isHighlighted = star <= rating;
            return (
              <button
                key={star}
                type="button"
                onClick={() => onRatingChange(star)}
                className="transition-transform hover:scale-110 active:scale-95 focus:outline-none"
              >
                <span
                  className={`${
                    sizeClasses[size]
                  } transition-colors duration-150 ${
                    isHighlighted ? "text-yellow-400" : "text-gray-300"
                  }`}
                >
                  ⭐
                </span>
              </button>
            );
          }

          // Modo display: solo mostrar estrellas destacadas (amarillas)
          return (
            <span key={star} className={`${sizeClasses[size]} text-yellow-400`}>
              ⭐
            </span>
          );
        })}
      </div>
      {showValue && rating > 0 && (
        <span className="text-xs sm:text-sm text-gray-700 font-medium ml-1">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
}
