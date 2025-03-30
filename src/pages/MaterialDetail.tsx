
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useStudyMaterials } from "@/contexts/StudyMaterialsContext";
import { useAuth } from "@/contexts/AuthContext";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

// Import refactored components
import { MaterialHeader } from "@/components/material-detail/MaterialHeader";
import { MaterialRating } from "@/components/material-detail/MaterialRating";
import { MaterialDescription } from "@/components/material-detail/MaterialDescription";
import { MaterialComments } from "@/components/material-detail/MaterialComments";
import { MaterialSidebar } from "@/components/material-detail/MaterialSidebar";
import { NotFoundState } from "@/components/material-detail/NotFoundState";

const MaterialDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { 
    materials, 
    bookmarks, 
    toggleBookmark, 
    incrementViews, 
    incrementDownloads, 
    addComment, 
    deleteMaterial,
    rateMaterial 
  } = useStudyMaterials();
  const { user, isAuthenticated } = useAuth();
  
  const material = materials.find(m => m.id === id);
  const isBookmarked = bookmarks.includes(id || "");
  const isOwner = user?.id === material?.uploadedBy.id;
  
  const relatedMaterials = materials
    .filter(m => m.id !== material?.id && m.subject === material?.subject)
    .slice(0, 3);
  
  useEffect(() => {
    if (material) {
      incrementViews(material.id);
    }
  }, [material]);
  
  if (!material) {
    return <NotFoundState />;
  }
  
  const handleDownload = () => {
    incrementDownloads(material.id);
    // In a real app, this would initiate a file download
  };
  
  const handleRatingSubmit = (rating: number) => {
    if (user && material) {
      rateMaterial(material.id, rating, user.id);
    }
  };
  
  const handleCommentSubmit = async (text: string) => {
    if (!user) return;
    return addComment(material.id, text, user.id, user.name);
  };
  
  const handleDelete = async () => {
    try {
      await deleteMaterial(material.id);
      navigate('/materials');
    } catch (error) {
      console.error("Failed to delete material:", error);
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <MaterialHeader 
        material={material}
        isBookmarked={isBookmarked}
        isOwner={isOwner}
        isAuthenticated={isAuthenticated}
        toggleBookmark={toggleBookmark}
        handleDelete={handleDelete}
        handleDownload={handleDownload}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-6">
        {/* Main Content */}
        <div className="md:col-span-2 space-y-6">
          <div className="flex flex-col space-y-4">
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <div className="flex items-center space-x-1">
                <Download className="h-4 w-4" />
                <span>{material.downloads} downloads</span>
              </div>
            </div>
            
            {isAuthenticated && (
              <MaterialRating 
                material={material} 
                isAuthenticated={isAuthenticated}
                onRatingSubmit={handleRatingSubmit} 
              />
            )}
          </div>
          
          <MaterialDescription material={material} />
          
          <MaterialComments 
            material={material}
            isAuthenticated={isAuthenticated}
            userId={user?.id}
            userName={user?.name}
            onCommentSubmit={handleCommentSubmit}
          />
        </div>
        
        {/* Sidebar */}
        <MaterialSidebar 
          material={material}
          relatedMaterials={relatedMaterials}
          onDownload={handleDownload}
        />
      </div>
    </div>
  );
};

export default MaterialDetail;
