
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const NotFoundState = () => {
  const navigate = useNavigate();
  
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
};
