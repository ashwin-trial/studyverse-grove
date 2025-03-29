
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useStudyMaterials } from "@/contexts/StudyMaterialsContext";
import MaterialCard from "@/components/MaterialCard";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Upload, BookmarkIcon } from "lucide-react";
import { Link } from "react-router-dom";

const Profile = () => {
  const { user } = useAuth();
  const { materials, bookmarks, getUserMaterials } = useStudyMaterials();
  const [userMaterials, setUserMaterials] = useState([] as any[]);
  const [bookmarkedMaterials, setBookmarkedMaterials] = useState([] as any[]);
  
  // Edit profile state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  
  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      
      // Get materials uploaded by user
      const uploadedMaterials = getUserMaterials(user.id);
      setUserMaterials(uploadedMaterials);
      
      // Get bookmarked materials
      const userBookmarks = materials.filter(material => 
        bookmarks.includes(material.id)
      );
      setBookmarkedMaterials(userBookmarks);
    }
  }, [user, materials, bookmarks]);
  
  const handleSaveProfile = () => {
    // In a real app, this would update the user profile
    setIsEditing(false);
  };
  
  if (!user) {
    return null;
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Profile Information */}
        <div>
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-xl">Profile</CardTitle>
                <Button variant="outline" size="sm" onClick={() => setIsEditing(!isEditing)}>
                  {isEditing ? "Cancel" : "Edit"}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col items-center">
                <Avatar className="h-24 w-24 mb-4">
                  <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`} alt={user.name} />
                  <AvatarFallback>
                    <User className="h-12 w-12" />
                  </AvatarFallback>
                </Avatar>
                <h2 className="text-2xl font-bold">{user.name}</h2>
                <p className="text-muted-foreground">{user.email}</p>
              </div>
              
              {isEditing ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Input
                      id="bio"
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder="Tell others about yourself"
                    />
                  </div>
                  
                  <Button onClick={handleSaveProfile} className="w-full">
                    Save Changes
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Account Statistics</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-secondary/30 p-3 rounded-lg text-center">
                        <p className="text-2xl font-bold">{userMaterials.length}</p>
                        <p className="text-xs text-muted-foreground">Uploads</p>
                      </div>
                      <div className="bg-secondary/30 p-3 rounded-lg text-center">
                        <p className="text-2xl font-bold">{bookmarkedMaterials.length}</p>
                        <p className="text-xs text-muted-foreground">Bookmarks</p>
                      </div>
                    </div>
                  </div>
                  
                  {bio && (
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">Bio</h3>
                      <p className="text-sm">{bio}</p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        {/* User Content */}
        <div className="md:col-span-2">
          <Tabs defaultValue="uploads">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="uploads">Your Uploads</TabsTrigger>
              <TabsTrigger value="bookmarks">Your Bookmarks</TabsTrigger>
            </TabsList>
            
            <TabsContent value="uploads" className="pt-6">
              {userMaterials.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {userMaterials.map((material) => (
                    <MaterialCard key={material.id} material={material} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-secondary/50 mb-4">
                    <Upload className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <h2 className="text-xl font-semibold mb-2">No uploads yet</h2>
                  <p className="text-muted-foreground mb-6">
                    You haven't uploaded any study materials yet.
                  </p>
                  <Link to="/materials">
                    <Button>Upload Your First Material</Button>
                  </Link>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="bookmarks" className="pt-6">
              {bookmarkedMaterials.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {bookmarkedMaterials.map((material) => (
                    <MaterialCard key={material.id} material={material} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-secondary/50 mb-4">
                    <BookmarkIcon className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <h2 className="text-xl font-semibold mb-2">No bookmarks yet</h2>
                  <p className="text-muted-foreground mb-6">
                    You haven't bookmarked any study materials yet.
                  </p>
                  <Link to="/materials">
                    <Button>Browse Materials</Button>
                  </Link>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Profile;
