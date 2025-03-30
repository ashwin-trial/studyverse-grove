import { useState, useEffect } from "react";
import { useStudyMaterials } from "@/contexts/StudyMaterialsContext";
import { useAuth } from "@/contexts/AuthContext";
import MaterialCard from "@/components/MaterialCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Search, Filter } from "lucide-react";

const subjects = ["All Subjects", "Computer Science", "Mathematics", "Physics", "Chemistry", "Biology", "History", "Literature", "Economics"];
const categories = ["All Categories", "Notes", "Assignment", "Quiz", "Exam", "Project", "Lab Report", "Tutorial", "Programming"];

const Materials = () => {
  const { materials, addMaterial, isLoading } = useStudyMaterials();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("All Subjects");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [showFilters, setShowFilters] = useState(false);
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState("");
  
  const filteredMaterials = materials.filter(material => {
    const matchesSearch = material.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          material.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = selectedSubject === "All Subjects" || material.subject === selectedSubject;
    const matchesCategory = selectedCategory === "All Categories" || material.category === selectedCategory;
    
    return matchesSearch && matchesSubject && matchesCategory;
  });
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploadError("");
    
    if (!title || !subject || !category || !description || !file) {
      setUploadError("Please fill in all fields and upload a file");
      return;
    }
    
    try {
      if (user) {
        await addMaterial({
          title,
          subject,
          category,
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
        setCategory("");
        setDescription("");
        setFile(null);
        setIsDialogOpen(false);
      }
    } catch (err) {
      setUploadError("Failed to upload material");
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Study Materials</h1>
        
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
              
              <div className="grid grid-cols-2 gap-4">
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
                  <Label htmlFor="category">Category</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.filter(c => c !== "All Categories").map((cat) => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
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
      </div>
      
      <div className="max-w-3xl mx-auto mb-12">
        <div className="flex flex-col items-center space-y-4">
          <h2 className="text-lg md:text-xl font-medium text-center mb-2">Find the perfect study material</h2>
          
          <div className="relative w-full max-w-xl">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by title, subject, or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 py-6 text-base"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-1"
            >
              <Filter className="h-4 w-4" />
              {showFilters ? "Hide Filters" : "Show Filters"}
            </Button>
          </div>
        </div>
      </div>
      
      {showFilters && (
        <div className="bg-secondary/50 rounded-lg p-4 mb-6 animate-fadeIn max-w-3xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="subjectFilter" className="mb-2 block">Subject</Label>
              <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                <SelectTrigger id="subjectFilter">
                  <SelectValue placeholder="Select subject" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map((subj) => (
                    <SelectItem key={subj} value={subj}>{subj}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="categoryFilter" className="mb-2 block">Category</Label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger id="categoryFilter">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      )}
      
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-secondary/30 rounded-lg h-64 animate-pulse"></div>
          ))}
        </div>
      ) : filteredMaterials.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMaterials.map((material) => (
            <MaterialCard key={material.id} material={material} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-muted-foreground">No study materials found.</p>
          <p className="text-sm mt-2">Try adjusting your search or filters, or upload a new material.</p>
        </div>
      )}
    </div>
  );
};

export default Materials;
