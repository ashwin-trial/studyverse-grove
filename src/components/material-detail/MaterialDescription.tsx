
import { StudyMaterial } from "@/contexts/StudyMaterialsContext";

interface MaterialDescriptionProps {
  material: StudyMaterial;
}

export const MaterialDescription = ({ material }: MaterialDescriptionProps) => (
  <div className="bg-card p-6 rounded-lg">
    <h2 className="text-xl font-semibold mb-4">Description</h2>
    <p className="whitespace-pre-line">{material.description}</p>
  </div>
);
