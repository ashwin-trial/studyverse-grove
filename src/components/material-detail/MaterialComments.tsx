
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Send } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { StudyMaterial } from "@/contexts/StudyMaterialsContext";

interface MaterialCommentsProps {
  material: StudyMaterial;
  isAuthenticated: boolean;
  userId?: string;
  userName?: string;
  onCommentSubmit: (text: string) => Promise<void>;
}

export const MaterialComments = ({
  material,
  isAuthenticated,
  userId,
  userName,
  onCommentSubmit
}: MaterialCommentsProps) => {
  const navigate = useNavigate();
  const [commentText, setCommentText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!commentText.trim()) return;
    
    setIsSubmitting(true);
    
    try {
      await onCommentSubmit(commentText);
      setCommentText("");
    } catch (error) {
      console.error("Failed to add comment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
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
  );
};
