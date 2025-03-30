
import { Button } from "@/components/ui/button";
import { BookmarkIcon, ArrowLeft, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { useNavigate } from "react-router-dom";
import { StudyMaterial } from "@/contexts/StudyMaterialsContext";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface MaterialHeaderProps {
  material: StudyMaterial;
  isBookmarked: boolean;
  isOwner: boolean;
  isAuthenticated: boolean;
  toggleBookmark: (materialId: string) => void;
  handleDelete: () => Promise<void>;
  handleDownload: () => void;
}

export const MaterialHeader = ({
  material,
  isBookmarked,
  isOwner,
  isAuthenticated,
  toggleBookmark,
  handleDelete,
  handleDownload
}: MaterialHeaderProps) => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <Button variant="ghost" onClick={() => navigate('/materials')} className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Materials
      </Button>
      
      <div className="flex flex-col space-y-4">
        <div className="flex justify-between items-start">
          <h1 className="text-3xl font-bold">{material.title}</h1>
          <div className="flex items-center space-x-2">
            {isOwner && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="icon">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Study Material</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete this study material? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
            <Button
              variant={isBookmarked ? "default" : "outline"}
              size="icon"
              onClick={() => toggleBookmark(material.id)}
              disabled={!isAuthenticated}
            >
              <BookmarkIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Badge>{material.subject}</Badge>
          <Badge variant="outline">{material.category}</Badge>
        </div>
        
        <div className="flex items-center text-sm text-muted-foreground">
          <span>Uploaded by {material.uploadedBy.name}</span>
          <span className="mx-2">•</span>
          <span>{formatDistanceToNow(new Date(material.createdAt), { addSuffix: true })}</span>
        </div>
      </div>
    </div>
  );
};
