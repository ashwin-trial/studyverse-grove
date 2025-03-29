
import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Book, BookOpen, Share2, Users, ChevronRight, BookmarkIcon, Upload, Download } from "lucide-react";

const Index = () => {
  const { isAuthenticated } = useAuth();
  
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-background to-secondary/10 py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center justify-center p-3 rounded-full bg-primary/10 mb-6">
            <Book className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 animate-slideUp">
            Share & Access Study <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
              Resources Easily
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8 animate-slideUp">
            A platform for students to upload, find, and collaborate on study materials. 
            Get better grades together!
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slideUp">
            {isAuthenticated ? (
              <Link to="/materials">
                <Button size="lg" className="px-8">
                  Browse Materials
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/signup">
                  <Button size="lg" className="px-8">
                    Get Started
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/login">
                  <Button variant="outline" size="lg">
                    Sign In
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Everything You Need for Effective Studying</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our platform offers a comprehensive solution for students to share, 
              discover, and collaborate on high-quality study materials.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="p-6 rounded-xl gradient-border bg-card hover-card"
              >
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 mb-4">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="bg-gradient-to-b from-secondary/10 to-background py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Enhance Your Learning?</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
            Join thousands of students already improving their grades 
            with our collaborative study platform.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {isAuthenticated ? (
              <Link to="/materials">
                <Button size="lg" className="px-8">
                  Browse Materials
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/signup">
                  <Button size="lg" className="px-8">
                    Sign Up Now
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/materials">
                  <Button variant="outline" size="lg">
                    Browse Materials
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-secondary py-8">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center flex-col md:flex-row">
            <div className="flex items-center mb-4 md:mb-0">
              <Book className="h-6 w-6 text-primary mr-2" />
              <span className="text-xl font-bold">StudyVerse</span>
            </div>
            <div className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} StudyVerse. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

const features = [
  {
    title: "Find Quality Resources",
    description: "Easily search and filter through a vast library of student-uploaded study materials across all subjects.",
    icon: BookOpen,
  },
  {
    title: "Upload & Share",
    description: "Contribute to the community by sharing your notes, assignments, and study guides with fellow students.",
    icon: Upload,
  },
  {
    title: "Download Materials",
    description: "Access and download study resources anytime, anywhere to enhance your learning experience.",
    icon: Download,
  },
  {
    title: "Bookmark Favorites",
    description: "Save useful study materials to your personal collection for quick and easy access later.",
    icon: BookmarkIcon,
  },
  {
    title: "Engage & Discuss",
    description: "Ask questions, provide feedback, and engage in discussions about specific study materials.",
    icon: Users,
  },
  {
    title: "Track Usage",
    description: "See how many people have viewed and downloaded your shared study resources.",
    icon: Share2,
  },
];

export default Index;
