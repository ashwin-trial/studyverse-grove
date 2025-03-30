
import MaterialCard from "@/components/MaterialCard";
import { StudyMaterial } from "@/contexts/StudyMaterialsContext";

interface MaterialsGridProps {
  materials: StudyMaterial[];
  isLoading: boolean;
}

const MaterialsGrid = ({ materials, isLoading }: MaterialsGridProps) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-secondary/30 rounded-lg h-64 animate-pulse"></div>
        ))}
      </div>
    );
  }

  if (materials.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-muted-foreground">No study materials found.</p>
        <p className="text-sm mt-2">Try adjusting your search or filters, or upload a new material.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {materials.map((material) => (
        <MaterialCard key={material.id} material={material} />
      ))}
    </div>
  );
};

export default MaterialsGrid;
