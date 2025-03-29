
import { useStudyMaterials } from "@/contexts/StudyMaterialsContext";
import MaterialCard from "@/components/MaterialCard";
import { Button } from "@/components/ui/button";
import { BookmarkIcon } from "lucide-react";
import { Link } from "react-router-dom";

const Bookmarks = () => {
  const { materials, bookmarks, isLoading } = useStudyMaterials();
  
  // Filter materials to only show bookmarked ones
  const bookmarkedMaterials = materials.filter(material => 
    bookmarks.includes(material.id)
  );
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Your Bookmarks</h1>
      
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-secondary/30 rounded-lg h-64 animate-pulse"></div>
          ))}
        </div>
      ) : bookmarkedMaterials.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookmarkedMaterials.map((material) => (
            <MaterialCard key={material.id} material={material} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-secondary/50 mb-4">
            <BookmarkIcon className="h-6 w-6 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-semibold mb-2">No bookmarks yet</h2>
          <p className="text-muted-foreground mb-6">
            You haven't bookmarked any study materials yet.
          </p>
          <Link to="/materials">
            <Button>Browse Materials</Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default Bookmarks;
