
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Copy } from "lucide-react";
import { copyToClipboard } from "@/lib/utils";
import { ReactNode } from "react";

interface MetadataFieldProps {
  icon: ReactNode;
  label: string;
  value: string;
  copyable?: boolean;
  copyMessage?: string;
  isLink?: boolean;
  truncated?: boolean;
  truncateFunction?: (str: string, startChars?: number, endChars?: number) => string;
  suffix?: ReactNode;
}

export function MetadataField({ 
  icon, 
  label, 
  value, 
  copyable = false,
  copyMessage = "Copied!",
  isLink = false,
  truncated = false,
  truncateFunction = (str) => str,
  suffix
}: MetadataFieldProps) {
  const displayValue = truncated && truncateFunction ? truncateFunction(value, 8, 6) : value;
  
  return (
    <div className="flex items-center gap-3 text-sm">
      <div className="w-5 flex-shrink-0 flex justify-center">
        {icon}
      </div>
      <span className="font-medium mr-1 whitespace-nowrap">{label}:</span>
      
      {isLink ? (
        <a 
          href={value} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-hawaii-blue hover:underline flex-1 truncate"
        >
          {displayValue}
        </a>
      ) : (
        <span className={truncated ? "ipfs-hash flex-1" : "flex-1"}>{displayValue}</span>
      )}
      
      {copyable && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon"
                className="h-7 w-7"
                onClick={() => copyToClipboard(value, copyMessage)}
              >
                <Copy className="h-3.5 w-3.5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Copy {label.toLowerCase()}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
      
      {suffix}
    </div>
  );
}
