
import { useState } from "react";
import { Star } from "lucide-react";
import { StudyMaterial } from "@/contexts/StudyMaterialsContext";

interface MaterialRatingProps {
  material: StudyMaterial;
  isAuthenticated: boolean;
  onRatingSubmit: (rating: number) => void;
}

export const MaterialRating = ({ 
  material, 
  isAuthenticated, 
  onRatingSubmit 
}: MaterialRatingProps) => {
  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  const handleRatingSubmit = (rating: number) => {
    onRatingSubmit(rating);
    setUserRating(rating);
  };

  if (!isAuthenticated) return null;

  return (
    <div className="flex items-center space-x-1 mb-4">
      <span className="text-sm mr-2">Rate this material: </span>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          className="focus:outline-none"
          onClick={() => handleRatingSubmit(star)}
          onMouseEnter={() => setHoverRating(star)}
          onMouseLeave={() => setHoverRating(0)}
        >
          <Star
            className={`h-5 w-5 ${
              (hoverRating || userRating) >= star
                ? "text-yellow-400 fill-yellow-400"
                : "text-muted-foreground"
            }`}
          />
        </button>
      ))}
      <span className="text-sm ml-2">
        {material.averageRating 
          ? `${material.averageRating.toFixed(1)} (${material.ratings?.length || 0} ratings)` 
          : "No ratings yet"}
      </span>
    </div>
  );
};
