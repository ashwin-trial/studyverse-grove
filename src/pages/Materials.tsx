
import { useState } from "react";
import { useStudyMaterials } from "@/contexts/StudyMaterialsContext";
import SearchBar from "@/components/materials/SearchBar";
import MaterialFilters from "@/components/materials/MaterialFilters";
import MaterialsGrid from "@/components/materials/MaterialsGrid";
import UploadMaterialDialog from "@/components/materials/UploadMaterialDialog";

const Materials = () => {
  const { materials, isLoading } = useStudyMaterials();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("All Subjects");
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [showFilters, setShowFilters] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Filter and sort materials based on search, subject, and selected filter
  const filteredMaterials = materials
    .filter(material => {
      const matchesSearch = material.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          material.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSubject = selectedSubject === "All Subjects" || material.subject === selectedSubject;
      
      return matchesSearch && matchesSubject;
    })
    .sort((a, b) => {
      switch (selectedFilter) {
        case "Highest Rated":
          return ((b.averageRating || 0) - (a.averageRating || 0));
        case "Newest Upload":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case "Most Comments":
          return b.comments.length - a.comments.length;
        case "Most Downloaded":
          return b.downloads - a.downloads;
        default:
          return 0;
      }
    });
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Study Materials</h1>
        <UploadMaterialDialog 
          isDialogOpen={isDialogOpen}
          setIsDialogOpen={setIsDialogOpen}
        />
      </div>
      
      <div className="max-w-3xl mx-auto mb-12">
        <div className="flex flex-col items-center space-y-4">
          <h2 className="text-lg md:text-xl font-medium text-center mb-2">Find the perfect study material</h2>
          
          <SearchBar 
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />
          
          <MaterialFilters
            showFilters={showFilters}
            setShowFilters={setShowFilters}
            selectedSubject={selectedSubject}
            setSelectedSubject={setSelectedSubject}
            selectedFilter={selectedFilter}
            setSelectedFilter={setSelectedFilter}
          />
        </div>
      </div>
      
      <MaterialsGrid 
        materials={filteredMaterials}
        isLoading={isLoading}
      />
    </div>
  );
};

export default Materials;
