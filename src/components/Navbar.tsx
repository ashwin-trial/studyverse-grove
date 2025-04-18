
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Book, User, LogOut, Home } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const [open, setOpen] = useState(false);
  
  const handleNavigation = (path: string) => {
    navigate(path);
    setOpen(false); // Close sidebar after navigation
  };
  
  return (
    <nav className="bg-secondary py-4 sticky top-0 z-10">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          {isAuthenticated && (
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:flex">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-menu">
                    <line x1="4" x2="20" y1="12" y2="12"/>
                    <line x1="4" x2="20" y1="6" y2="6"/>
                    <line x1="4" x2="20" y1="18" y2="18"/>
                  </svg>
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64">
                <div className="flex flex-col gap-4 mt-8">
                  <Button 
                    variant="ghost" 
                    className={`flex items-center justify-start gap-2 py-2 px-3 rounded-md transition-colors ${location.pathname === "/" ? "bg-primary/20 text-primary" : "hover:bg-secondary/80"}`}
                    onClick={() => handleNavigation("/")}
                  >
                    <Home className="h-5 w-5" />
                    <span>Home</span>
                  </Button>
                  <Button 
                    variant="ghost" 
                    className={`flex items-center justify-start gap-2 py-2 px-3 rounded-md transition-colors ${location.pathname === "/materials" ? "bg-primary/20 text-primary" : "hover:bg-secondary/80"}`}
                    onClick={() => handleNavigation("/materials")}
                  >
                    <Book className="h-5 w-5" />
                    <span>Study Materials</span>
                  </Button>
                  <Button 
                    variant="ghost" 
                    className={`flex items-center justify-start gap-2 py-2 px-3 rounded-md transition-colors ${location.pathname === "/bookmarks" ? "bg-primary/20 text-primary" : "hover:bg-secondary/80"}`}
                    onClick={() => handleNavigation("/bookmarks")}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-bookmark">
                      <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/>
                    </svg>
                    <span>Bookmarks</span>
                  </Button>
                  <Button 
                    variant="ghost" 
                    className={`flex items-center justify-start gap-2 py-2 px-3 rounded-md transition-colors ${location.pathname === "/profile" ? "bg-primary/20 text-primary" : "hover:bg-secondary/80"}`}
                    onClick={() => handleNavigation("/profile")}
                  >
                    <User className="h-5 w-5" />
                    <span>Profile</span>
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          )}
          <Link to="/" className="flex items-center space-x-2">
            <Book className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold text-foreground">StudyVerse</span>
          </Link>
        </div>
        
        {/* Desktop Navigation */}
        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <Button variant="outline" size="sm" onClick={logout} className="flex items-center space-x-1">
              <LogOut className="h-4 w-4" />
              <span className="hidden md:inline">Logout</span>
            </Button>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" size="sm">Login</Button>
              </Link>
              <Link to="/signup">
                <Button size="sm">Sign Up</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
