
import React, { createContext, useContext, useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";

export interface StudyMaterial {
  id: string;
  title: string;
  subject: string;
  category: string;
  description: string;
  fileUrl: string;
  fileName: string;
  uploadedBy: {
    id: string;
    name: string;
  };
  createdAt: string;
  views: number;
  downloads: number;
  comments: Comment[];
}

export interface Comment {
  id: string;
  text: string;
  user: {
    id: string;
    name: string;
  };
  createdAt: string;
}

interface StudyMaterialsContextType {
  materials: StudyMaterial[];
  bookmarks: string[];
  isLoading: boolean;
  addMaterial: (material: Omit<StudyMaterial, "id" | "createdAt" | "views" | "downloads" | "comments">) => Promise<void>;
  toggleBookmark: (materialId: string) => void;
  addComment: (materialId: string, text: string, userId: string, userName: string) => Promise<void>;
  deleteMaterial: (materialId: string) => Promise<void>;
  incrementViews: (materialId: string) => void;
  incrementDownloads: (materialId: string) => void;
  getUserMaterials: (userId: string) => StudyMaterial[];
}

// Mock data
const mockMaterials: StudyMaterial[] = [
  {
    id: "1",
    title: "Introduction to React",
    subject: "Computer Science",
    category: "Programming",
    description: "A comprehensive guide to React fundamentals",
    fileUrl: "#",
    fileName: "intro-to-react.pdf",
    uploadedBy: {
      id: "1",
      name: "John Doe"
    },
    createdAt: new Date().toISOString(),
    views: 120,
    downloads: 45,
    comments: [
      {
        id: "c1",
        text: "This was really helpful, thanks!",
        user: {
          id: "2",
          name: "Jane Smith"
        },
        createdAt: new Date().toISOString()
      }
    ]
  },
  {
    id: "2",
    title: "Advanced Calculus Notes",
    subject: "Mathematics",
    category: "Calculus",
    description: "Detailed notes on advanced calculus topics",
    fileUrl: "#",
    fileName: "advanced-calculus.pdf",
    uploadedBy: {
      id: "2",
      name: "Jane Smith"
    },
    createdAt: new Date().toISOString(),
    views: 85,
    downloads: 32,
    comments: []
  },
  {
    id: "3",
    title: "Organic Chemistry Lab Guide",
    subject: "Chemistry",
    category: "Laboratory",
    description: "Step-by-step guide for organic chemistry lab experiments",
    fileUrl: "#",
    fileName: "organic-chem-lab.pdf",
    uploadedBy: {
      id: "3",
      name: "Robert Johnson"
    },
    createdAt: new Date().toISOString(),
    views: 210,
    downloads: 98,
    comments: [
      {
        id: "c2",
        text: "Saved me during finals week!",
        user: {
          id: "1",
          name: "John Doe"
        },
        createdAt: new Date().toISOString()
      },
      {
        id: "c3",
        text: "Could use more detail on experiment 4",
        user: {
          id: "4",
          name: "Sarah Wilson"
        },
        createdAt: new Date().toISOString()
      }
    ]
  }
];

const StudyMaterialsContext = createContext<StudyMaterialsContextType | undefined>(undefined);

export const StudyMaterialsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [materials, setMaterials] = useState<StudyMaterial[]>(mockMaterials);
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Load bookmarks from local storage
    const storedBookmarks = localStorage.getItem("bookmarks");
    if (storedBookmarks) {
      setBookmarks(JSON.parse(storedBookmarks));
    }
    
    setIsLoading(false);
  }, []);

  const saveBookmarks = (newBookmarks: string[]) => {
    localStorage.setItem("bookmarks", JSON.stringify(newBookmarks));
  };

  const addMaterial = async (material: Omit<StudyMaterial, "id" | "createdAt" | "views" | "downloads" | "comments">) => {
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newMaterial: StudyMaterial = {
        ...material,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        views: 0,
        downloads: 0,
        comments: []
      };
      
      setMaterials(prev => [newMaterial, ...prev]);
      
      toast({
        title: "Material uploaded",
        description: "Your study material has been uploaded successfully.",
      });
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "There was an error uploading your material.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const toggleBookmark = (materialId: string) => {
    let newBookmarks;
    
    if (bookmarks.includes(materialId)) {
      newBookmarks = bookmarks.filter(id => id !== materialId);
      toast({
        title: "Bookmark removed",
        description: "Study material removed from bookmarks.",
      });
    } else {
      newBookmarks = [...bookmarks, materialId];
      toast({
        title: "Bookmarked",
        description: "Study material added to bookmarks.",
      });
    }
    
    setBookmarks(newBookmarks);
    saveBookmarks(newBookmarks);
  };

  const addComment = async (materialId: string, text: string, userId: string, userName: string) => {
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newComment: Comment = {
        id: Date.now().toString(),
        text,
        user: {
          id: userId,
          name: userName
        },
        createdAt: new Date().toISOString()
      };
      
      setMaterials(prev => 
        prev.map(material => 
          material.id === materialId 
            ? { ...material, comments: [newComment, ...material.comments] } 
            : material
        )
      );
      
      toast({
        title: "Comment added",
        description: "Your comment has been added successfully.",
      });
    } catch (error) {
      toast({
        title: "Comment failed",
        description: "There was an error adding your comment.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteMaterial = async (materialId: string) => {
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setMaterials(prev => prev.filter(material => material.id !== materialId));
      
      // Also remove from bookmarks if it's there
      if (bookmarks.includes(materialId)) {
        const newBookmarks = bookmarks.filter(id => id !== materialId);
        setBookmarks(newBookmarks);
        saveBookmarks(newBookmarks);
      }
      
      toast({
        title: "Material deleted",
        description: "The study material has been deleted successfully.",
      });
    } catch (error) {
      toast({
        title: "Deletion failed",
        description: "There was an error deleting the material.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const incrementViews = (materialId: string) => {
    setMaterials(prev => 
      prev.map(material => 
        material.id === materialId 
          ? { ...material, views: material.views + 1 } 
          : material
      )
    );
  };

  const incrementDownloads = (materialId: string) => {
    setMaterials(prev => 
      prev.map(material => 
        material.id === materialId 
          ? { ...material, downloads: material.downloads + 1 } 
          : material
      )
    );
    
    toast({
      title: "Downloading",
      description: "Your file is being downloaded.",
    });
  };

  const getUserMaterials = (userId: string) => {
    return materials.filter(material => material.uploadedBy.id === userId);
  };

  return (
    <StudyMaterialsContext.Provider
      value={{
        materials,
        bookmarks,
        isLoading,
        addMaterial,
        toggleBookmark,
        addComment,
        deleteMaterial,
        incrementViews,
        incrementDownloads,
        getUserMaterials
      }}
    >
      {children}
    </StudyMaterialsContext.Provider>
  );
};

export const useStudyMaterials = () => {
  const context = useContext(StudyMaterialsContext);
  if (context === undefined) {
    throw new Error("useStudyMaterials must be used within a StudyMaterialsProvider");
  }
  return context;
};
