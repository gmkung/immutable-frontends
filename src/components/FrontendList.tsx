
import { useEffect, useState } from "react";
import { LItem } from "@/types";
import { fetchFrontends } from "@/services/graphql";
import { FrontendCard } from "@/components/FrontendCard";
import { Container } from "@/components/ui/container";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Search } from "lucide-react";

export function FrontendList() {
  const [frontends, setFrontends] = useState<LItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  
  useEffect(() => {
    const loadFrontends = async () => {
      try {
        setLoading(true);
        const data = await fetchFrontends();
        setFrontends(data);
        setError(null);
      } catch (err) {
        console.error("Failed to load frontends:", err);
        setError("Failed to load frontends. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    
    loadFrontends();
  }, []);
  
  const filteredFrontends = frontends.filter(frontend => {
    const query = searchQuery.toLowerCase();
    const props = frontend.metadata.props;
    
    // Search across all properties
    return props.some(prop => 
      prop.value && 
      prop.value.toString().toLowerCase().includes(query)
    );
  });
  
  return (
    <Container className="py-8">
      <div className="relative mb-6">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Search className="w-4 h-4 text-muted-foreground" />
        </div>
        <Input
          type="search"
          placeholder="Search frontends by name, IPFS hash, or repository..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      {loading ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="h-40 w-full rounded-lg" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="py-16 text-center">
          <p className="text-destructive">{error}</p>
        </div>
      ) : filteredFrontends.length === 0 ? (
        <div className="py-16 text-center">
          <p className="text-muted-foreground">
            {searchQuery ? "No frontends match your search" : "No frontends found"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredFrontends.map((frontend) => (
            <FrontendCard key={frontend.itemID} item={frontend} />
          ))}
        </div>
      )}
    </Container>
  );
}
