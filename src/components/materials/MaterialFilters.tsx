
import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Define subject and filter options
export const subjects = ["All Subjects", "Computer Science", "Mathematics", "Physics", "Chemistry", "Biology", "History", "Literature", "Economics"];
export const filterOptions = ["All", "Highest Rated", "Newest Upload", "Most Comments", "Most Downloaded"];

interface MaterialFiltersProps {
  showFilters: boolean;
  setShowFilters: (value: boolean) => void;
  selectedSubject: string;
  setSelectedSubject: (value: string) => void;
  selectedFilter: string;
  setSelectedFilter: (value: string) => void;
}

const MaterialFilters = ({
  showFilters,
  setShowFilters,
  selectedSubject,
  setSelectedSubject,
  selectedFilter,
  setSelectedFilter,
}: MaterialFiltersProps) => {
  return (
    <>
      <div className="flex items-center gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-1"
        >
          <Filter className="h-4 w-4" />
          {showFilters ? "Hide Filters" : "Show Filters"}
        </Button>
      </div>
      
      {showFilters && (
        <div className="bg-secondary/50 rounded-lg p-4 mb-6 animate-fadeIn max-w-3xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="subjectFilter" className="mb-2 block">Subject</Label>
              <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                <SelectTrigger id="subjectFilter">
                  <SelectValue placeholder="Select subject" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map((subj) => (
                    <SelectItem key={subj} value={subj}>{subj}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="sortFilter" className="mb-2 block">Sort By</Label>
              <Select value={selectedFilter} onValueChange={setSelectedFilter}>
                <SelectTrigger id="sortFilter">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  {filterOptions.map((option) => (
                    <SelectItem key={option} value={option}>{option}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MaterialFilters;
