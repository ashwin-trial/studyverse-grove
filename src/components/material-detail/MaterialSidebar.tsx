
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, Download } from "lucide-react";
import { StudyMaterial } from "@/contexts/StudyMaterialsContext";
import { useNavigate } from "react-router-dom";

interface MaterialSidebarProps {
  material: StudyMaterial;
  relatedMaterials: StudyMaterial[];
  onDownload: () => void;
}

export const MaterialSidebar = ({
  material,
  relatedMaterials,
  onDownload
}: MaterialSidebarProps) => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-4">File Information</h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">File name:</span>
              <span className="font-medium">{material.fileName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Uploaded by:</span>
              <span className="font-medium">{material.uploadedBy.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subject:</span>
              <span className="font-medium">{material.subject}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Category:</span>
              <span className="font-medium">{material.category}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Downloads:</span>
              <span className="font-medium">{material.downloads}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Comments:</span>
              <span className="font-medium">{material.comments.length}</span>
            </div>
            {material.averageRating > 0 && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Average Rating:</span>
                <span className="font-medium flex items-center">
                  {material.averageRating.toFixed(1)}
                  <Star className="h-4 w-4 ml-1 text-yellow-400 fill-yellow-400" />
                </span>
              </div>
            )}
          </div>
          
          <div className="mt-6">
            <Button className="w-full" onClick={onDownload}>
              <Download className="mr-2 h-4 w-4" />
              Download File
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-4">Related Materials</h2>
          <div className="space-y-4">
            {relatedMaterials.length > 0 ? (
              relatedMaterials.map(relatedMaterial => (
                <div 
                  key={relatedMaterial.id}
                  className="p-3 bg-secondary/30 rounded-lg cursor-pointer hover:bg-secondary/50 transition-colors"
                  onClick={() => navigate(`/material/${relatedMaterial.id}`)}
                >
                  <h3 className="font-medium line-clamp-1">{relatedMaterial.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    {relatedMaterial.subject} • {relatedMaterial.category}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                No related materials found
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
