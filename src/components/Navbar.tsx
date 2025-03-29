
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Search, Book, User, BookmarkIcon, LogOut, Menu, X } from "lucide-react";

const Navbar = () => {
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  
  return (
    <nav className="bg-secondary py-4 sticky top-0 z-10">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <Book className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold text-foreground">StudyVerse</span>
        </Link>
        
        {/* Search Bar - Hidden on mobile */}
        <div className="hidden md:flex relative w-1/3">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-muted-foreground" />
          </div>
          <input 
            type="text"
            placeholder="Search for study materials..."
            className="study-input w-full pl-10"
          />
        </div>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-4">
          {isAuthenticated ? (
            <>
              <Link to="/materials" className={`text-sm font-medium ${location.pathname === "/materials" ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}>
                Study Materials
              </Link>
              <Link to="/bookmarks" className={`text-sm font-medium ${location.pathname === "/bookmarks" ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}>
                Bookmarks
              </Link>
              <Link to="/profile" className={`text-sm font-medium ${location.pathname === "/profile" ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}>
                Profile
              </Link>
              <Button variant="outline" size="sm" onClick={logout} className="flex items-center space-x-1">
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </Button>
            </>
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
        
        {/* Mobile Menu Button */}
        <button className="md:hidden text-foreground" onClick={toggleMenu}>
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>
      
      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-secondary px-4 pt-2 pb-4 space-y-3 animate-fadeIn">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-muted-foreground" />
            </div>
            <input 
              type="text"
              placeholder="Search for study materials..."
              className="study-input w-full pl-10"
            />
          </div>
          
          {isAuthenticated ? (
            <div className="space-y-3">
              <Link to="/materials" className="block py-2 text-sm font-medium text-foreground" onClick={toggleMenu}>
                Study Materials
              </Link>
              <Link to="/bookmarks" className="block py-2 text-sm font-medium text-foreground" onClick={toggleMenu}>
                Bookmarks
              </Link>
              <Link to="/profile" className="block py-2 text-sm font-medium text-foreground" onClick={toggleMenu}>
                Profile
              </Link>
              <Button variant="outline" className="w-full flex items-center justify-center space-x-1" onClick={() => { toggleMenu(); logout(); }}>
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </Button>
            </div>
          ) : (
            <div className="flex flex-col space-y-2">
              <Link to="/login" onClick={toggleMenu}>
                <Button variant="outline" className="w-full">Login</Button>
              </Link>
              <Link to="/signup" onClick={toggleMenu}>
                <Button className="w-full">Sign Up</Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
