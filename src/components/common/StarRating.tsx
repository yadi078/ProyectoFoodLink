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

  const stars = Array.from({ length: maxRating }, (_, i) => i + 1);

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <div className="flex items-center">
        {stars.map((star) => {
          const isHighlighted = star <= rating;
          
          if (interactive && onRatingChange) {
            return (
              <button
                key={star}
                type="button"
                onClick={() => onRatingChange(star)}
                className="transition-transform hover:scale-110 active:scale-95 focus:outline-none"
              >
                <span
                  className={`${sizeClasses[size]} transition-colors duration-150 ${
                    isHighlighted ? "text-yellow-400" : "text-gray-300"
                  }`}
                >
                  ⭐
                </span>
              </button>
            );
          }

          return (
            <span
              key={star}
              className={`${sizeClasses[size]} ${
                isHighlighted ? "text-yellow-400" : "text-gray-300"
              }`}
            >
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

