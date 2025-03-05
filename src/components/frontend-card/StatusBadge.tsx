
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, AlertTriangle } from "lucide-react";

interface StatusBadgeProps {
  status: string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const getStatusInfo = (status: string) => {
    switch (status) {
      case "Registered":
        return { label: "Registered", icon: <CheckCircle className="h-3 w-3 mr-1" />, color: "bg-green-500/10 text-green-600 backdrop-blur-sm border-green-500/20" };
      case "RegistrationRequested":
        return { label: "Registration Pending", icon: <Clock className="h-3 w-3 mr-1" />, color: "bg-yellow-500/10 text-yellow-600 backdrop-blur-sm border-yellow-500/20" };
      case "ClearingRequested":
        return { label: "Removal Pending", icon: <Clock className="h-3 w-3 mr-1" />, color: "bg-red-500/10 text-red-600 backdrop-blur-sm border-red-500/20" };
      case "Absent":
        return { label: "Not Registered", icon: <AlertTriangle className="h-3 w-3 mr-1" />, color: "bg-gray-500/10 text-gray-600 backdrop-blur-sm border-gray-500/20" };
      default:
        return { label: status, icon: null, color: "bg-gray-500/10 text-gray-600 backdrop-blur-sm border-gray-500/20" };
    }
  };
  
  const statusInfo = getStatusInfo(status);
  
  return (
    <Badge variant="outline" className={statusInfo.color}>
      {statusInfo.icon}
      {statusInfo.label}
    </Badge>
  );
}
