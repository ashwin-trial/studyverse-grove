
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useStudyMaterials } from "@/contexts/StudyMaterialsContext";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
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
import { Star, Download, BookmarkIcon, ArrowLeft, Trash2, Send } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

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
  const [commentText, setCommentText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  
  const material = materials.find(m => m.id === id);
  const isBookmarked = bookmarks.includes(id || "");
  const isOwner = user?.id === material?.uploadedBy.id;
  
  useEffect(() => {
    if (material) {
      incrementViews(material.id);
    }
  }, [material]);
  
  if (!material) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Material Not Found</h1>
        <p className="text-muted-foreground mb-8">
          The study material you are looking for does not exist or has been removed.
        </p>
        <Button onClick={() => navigate('/materials')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Materials
        </Button>
      </div>
    );
  }
  
  const handleDownload = () => {
    incrementDownloads(material.id);
    // In a real app, this would initiate a file download
  };
  
  const handleRatingSubmit = (rating: number) => {
    if (user && material) {
      rateMaterial(material.id, rating, user.id);
      setUserRating(rating);
    }
  };
  
  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!commentText.trim() || !user) return;
    
    setIsSubmitting(true);
    
    try {
      await addComment(material.id, commentText, user.id, user.name);
      setCommentText("");
    } catch (error) {
      console.error("Failed to add comment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleDelete = async () => {
    try {
      await deleteMaterial(material.id);
      navigate('/materials');
    } catch (error) {
      console.error("Failed to delete material:", error);
    }
  };
  
  const renderStarRating = () => {
    return (
      <div className="flex items-center space-x-1 mb-4">
        <span className="text-sm mr-2">Rate this material: </span>
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            className="focus:outline-none"
            onClick={() => handleRatingSubmit(star)}
            onMouseEnter={() => setHoverRating(star)}
            onMouseLeave={() => setHoverRating(0)}
          >
            <Star
              className={`h-5 w-5 ${
                (hoverRating || userRating) >= star
                  ? "text-yellow-400 fill-yellow-400"
                  : "text-muted-foreground"
              }`}
            />
          </button>
        ))}
        <span className="text-sm ml-2">
          {material.averageRating 
            ? `${material.averageRating.toFixed(1)} (${material.ratings?.length || 0} ratings)` 
            : "No ratings yet"}
        </span>
      </div>
    );
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <Button variant="ghost" onClick={() => navigate('/materials')} className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Materials
      </Button>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="md:col-span-2 space-y-6">
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
                <Button
                  variant="default"
                  onClick={handleDownload}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download
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
            
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <div className="flex items-center space-x-1">
                <Download className="h-4 w-4" />
                <span>{material.downloads} downloads</span>
              </div>
            </div>
            
            {isAuthenticated && renderStarRating()}
          </div>
          
          <div className="bg-card p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Description</h2>
            <p className="whitespace-pre-line">{material.description}</p>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-4">Comments</h2>
            
            {isAuthenticated ? (
              <form onSubmit={handleCommentSubmit} className="mb-6">
                <Textarea
                  placeholder="Add a comment or question about this material..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  className="mb-2"
                />
                <div className="flex justify-end">
                  <Button type="submit" disabled={isSubmitting || !commentText.trim()}>
                    {isSubmitting ? (
                      <span className="flex items-center">
                        <span className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                        Posting...
                      </span>
                    ) : (
                      <span className="flex items-center">
                        <Send className="mr-2 h-4 w-4" />
                        Post Comment
                      </span>
                    )}
                  </Button>
                </div>
              </form>
            ) : (
              <div className="bg-secondary/30 p-4 rounded-lg mb-6 text-center">
                <p className="text-muted-foreground mb-2">Sign in to leave a comment</p>
                <Button onClick={() => navigate('/login')} variant="outline" size="sm">
                  Sign In
                </Button>
              </div>
            )}
            
            {material.comments.length > 0 ? (
              <div className="space-y-4">
                {material.comments.map((comment) => (
                  <Card key={comment.id}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div className="font-medium">{comment.user.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                        </div>
                      </div>
                      <p className="text-sm">{comment.text}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>No comments yet. Be the first to comment!</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Sidebar */}
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
                <Button className="w-full" onClick={handleDownload}>
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
                {materials
                  .filter(m => m.id !== material.id && m.subject === material.subject)
                  .slice(0, 3)
                  .map(relatedMaterial => (
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
                  ))}
                
                {materials.filter(m => m.id !== material.id && m.subject === material.subject).length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No related materials found
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MaterialDetail;
