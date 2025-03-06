import { Badge } from "@/components/ui/badge";
import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Waves } from "lucide-react";
import { StatusBadge } from "./StatusBadge";

interface FrontendCardHeaderProps {
  name: string;
  description: string;
  networkName: string;
  status: string;
  disputed?: boolean;
}

export function FrontendCardHeader({ 
  name, 
  description, 
  networkName, 
  status,
  disputed,
}: FrontendCardHeaderProps) {
  return (
    <CardHeader className="pb-2 relative">
      <div className="flex items-start justify-between">
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="bg-hawaii-blue/10 text-hawaii-blue backdrop-blur-sm border-hawaii-blue/20">
              <Waves className="h-3 w-3 mr-1" />
              {networkName}
            </Badge>
            
            <StatusBadge status={status} />
            
            {disputed && (
              <Badge variant="outline" className="bg-red-500/10 text-red-500 backdrop-blur-sm border-red-500/20">
                Disputed
              </Badge>
            )}
          </div>
          <CardTitle className="text-xl font-semibold mt-2">{name}</CardTitle>
          <CardDescription className="line-clamp-2 mt-2">
            {description}
          </CardDescription>
        </div>
      </div>
    </CardHeader>
  );
}
