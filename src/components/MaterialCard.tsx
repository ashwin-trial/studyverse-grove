
import { useState } from "react";
import { Link } from "react-router-dom";
import { StudyMaterial, useStudyMaterials } from "@/contexts/StudyMaterialsContext";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Download, BookmarkIcon, MessageSquare } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface MaterialCardProps {
  material: StudyMaterial;
}

const MaterialCard = ({ material }: MaterialCardProps) => {
  const { bookmarks, toggleBookmark, incrementDownloads } = useStudyMaterials();
  const { isAuthenticated } = useAuth();
  const isBookmarked = bookmarks.includes(material.id);
  
  const handleDownload = (e: React.MouseEvent) => {
    e.preventDefault();
    // In a real app, this would trigger a file download
    incrementDownloads(material.id);
  };
  
  const handleBookmarkToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isAuthenticated) {
      toggleBookmark(material.id);
    }
  };
  
  return (
    <Link to={`/material/${material.id}`}>
      <Card className="hover-card overflow-hidden">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <CardTitle className="text-lg font-semibold line-clamp-1">{material.title}</CardTitle>
            <Button
              variant="ghost"
              size="icon"
              className={`${isBookmarked ? "text-primary" : "text-muted-foreground"}`}
              onClick={handleBookmarkToggle}
            >
              <BookmarkIcon className="h-5 w-5" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            <Badge variant="outline" className="bg-secondary/50">
              {material.subject}
            </Badge>
            <Badge variant="outline" className="bg-secondary/50">
              {material.category}
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
            {material.description}
          </p>
          <p className="text-xs text-muted-foreground">
            {material.fileName}
          </p>
        </CardContent>
        
        <CardFooter className="border-t border-border pt-3 flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Eye className="h-3.5 w-3.5" />
              <span>{material.views}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Download className="h-3.5 w-3.5" />
              <span>{material.downloads}</span>
            </div>
            <div className="flex items-center space-x-1">
              <MessageSquare className="h-3.5 w-3.5" />
              <span>{material.comments.length}</span>
            </div>
          </div>
          <div>
            <span>By {material.uploadedBy.name}</span>
            <span className="mx-1">•</span>
            <span>{formatDistanceToNow(new Date(material.createdAt), { addSuffix: true })}</span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default MaterialCard;
