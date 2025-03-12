import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { toast } from "sonner";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function truncateMiddle(str: string, startChars = 6, endChars = 4): string {
  if (!str) return '';
  if (str.length <= startChars + endChars) return str;
  
  return `${str.substring(0, startChars)}...${str.substring(str.length - endChars)}`;
}

export function formatDate(timestamp: string): string {
  if (!timestamp) return 'Unknown';
  
  const date = new Date(Number(timestamp) * 1000);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
}

export function copyToClipboard(text: string, message = 'Copied to clipboard'): void {
  navigator.clipboard.writeText(text)
    .then(() => toast.success(message))
    .catch(() => toast.error('Failed to copy'));
}

export function getIPFSGatewayURL(hash: string): string {
  // Remove any '/ipfs/' prefix if present
  const cleanHash = hash.replace(/^\/ipfs\//, '');
  
  // List of reliable IPFS gateways
  const gateways = [
    'https://ipfs.io/ipfs/'
  ];
  
  // Select a random gateway for load distribution
  const gateway = gateways[Math.floor(Math.random() * gateways.length)];
  
  return `${gateway}${cleanHash}`;
}

export function getPropValue(props: any[], label: string): string {
  const prop = props.find(p => p.label === label);
  return prop?.value || 'N/A';
}

export function validateForm(values: Record<string, string>): Record<string, string> {
  const errors: Record<string, string> = {};
  
  // Required fields
  const requiredFields = [
    'Name', 
    'Description', 
    'Network name', 
    'Locator ID', 
    'Repository URL', 
    'Commit hash'
  ];
  
  requiredFields.forEach(field => {
    if (!values[field]) {
      errors[field] = `${field} is required`;
    }
  });
  
  // URL validation
  if (values['Repository URL'] && !/^https?:\/\/.+/.test(values['Repository URL'])) {
    errors['Repository URL'] = 'Must be a valid URL starting with http:// or https://';
  }
  
  // Commit hash validation (at least 7 characters)
  if (values['Commit hash'] && values['Commit hash'].length < 7) {
    errors['Commit hash'] = 'Commit hash must be at least 7 characters';
  }
  
  return errors;
}

export function stringToBuffer(str: string): Uint8Array {
  const encoder = new TextEncoder();
  return encoder.encode(str);
}
