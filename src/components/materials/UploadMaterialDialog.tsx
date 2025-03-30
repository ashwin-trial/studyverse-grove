
import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { useStudyMaterials } from "@/contexts/StudyMaterialsContext";
import { subjects } from "./MaterialFilters";

interface UploadMaterialDialogProps {
  isDialogOpen: boolean;
  setIsDialogOpen: (value: boolean) => void;
}

const UploadMaterialDialog = ({ isDialogOpen, setIsDialogOpen }: UploadMaterialDialogProps) => {
  const { user } = useAuth();
  const { addMaterial, isLoading } = useStudyMaterials();
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploadError("");
    
    if (!title || !subject || !description || !file) {
      setUploadError("Please fill in all fields and upload a file");
      return;
    }
    
    try {
      if (user) {
        await addMaterial({
          title,
          subject,
          category: "General", // Default category since we're removing the field
          description,
          fileUrl: URL.createObjectURL(file),
          fileName: file.name,
          uploadedBy: {
            id: user.id,
            name: user.name
          }
        });
        
        setTitle("");
        setSubject("");
        setDescription("");
        setFile(null);
        setIsDialogOpen(false);
      }
    } catch (err) {
      setUploadError("Failed to upload material");
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button className="gap-1">
          <Plus className="h-4 w-4" />
          <span className="hidden md:inline">Upload</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Upload Study Material</DialogTitle>
          <DialogDescription>
            Share your study materials with other students.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter a descriptive title"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Select value={subject} onValueChange={setSubject}>
              <SelectTrigger id="subject">
                <SelectValue placeholder="Select subject" />
              </SelectTrigger>
              <SelectContent>
                {subjects.filter(s => s !== "All Subjects").map((subj) => (
                  <SelectItem key={subj} value={subj}>{subj}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your study material"
              className="min-h-[100px]"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="file">Upload File</Label>
            <Input
              id="file"
              type="file"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setFile(e.target.files[0]);
                }
              }}
            />
            {file && (
              <p className="text-xs text-muted-foreground">
                Selected file: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
              </p>
            )}
          </div>
          
          {uploadError && (
            <div className="text-sm text-destructive">
              {uploadError}
            </div>
          )}
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Uploading..." : "Upload Material"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UploadMaterialDialog;
