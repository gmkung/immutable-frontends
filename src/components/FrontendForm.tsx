
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ItemData, SubmissionStatus } from "@/types";
import { validateForm, stringToBuffer } from "@/lib/utils";
import { uploadJSONToIPFS } from "@/lib/ipfs";
import { connectWallet, submitToRegistry, handleWeb3Error, switchToMainnet } from "@/lib/web3";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  networkName: z.string().min(1, "Network name is required"),
  locatorId: z.string().min(1, "Locator ID is required"),
  repositoryUrl: z.string().url("Must be a valid URL"),
  commitHash: z.string().min(7, "Commit hash must be at least 7 characters"),
  versionTag: z.string().optional(),
  additionalInfo: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function FrontendForm() {
  const [status, setStatus] = useState<SubmissionStatus>({
    loading: false,
    success: false,
    error: null,
    txHash: null,
  });
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      networkName: "IPFS",
      locatorId: "",
      repositoryUrl: "",
      commitHash: "",
      versionTag: "",
      additionalInfo: "",
    },
  });
  
  const onSubmit = async (values: FormValues) => {
    try {
      // Reset status
      setStatus({
        loading: true,
        success: false,
        error: null,
        txHash: null,
      });
      
      // Format data for IPFS
      const itemData: ItemData = {
        columns: [
          {
            label: "Name",
            description: "Name of the protocol that this frontend is for.",
            type: "text",
            isIdentifier: true,
          },
          {
            label: "Description",
            description: "A brief description of the entry and what it is and does within the protocol.",
            type: "long text",
            isIdentifier: false,
          },
          {
            label: "Network name",
            description: "The name of the decentralized file storage network that the file is on.",
            type: "text",
          },
          {
            label: "Locator ID",
            description: "The unique ID/hash used to locate the file(s) in question within the decentralized file storage network.",
            type: "text",
            isIdentifier: true,
          },
          {
            label: "Repository URL",
            description: "URL where the repository can be found (on Github or other sources).",
            type: "link",
            isIdentifier: true,
          },
          {
            label: "Commit hash",
            description: "The hash of the commit within this Git repository represents the state of it such that if you build the project you get the exact file(s) in this entry. A short hash format of at least the 7 first characters is acceptable.",
            type: "text",
            isIdentifier: true,
          },
          {
            label: "Version tag (optional)",
            description: "The tag present in Git corresponding to the Commit hash.",
            type: "text",
          },
          {
            label: "Additional information (Optional)",
            description: "This is a field for providing any additional information relevant for the verification of the information in the entry. ",
            type: "long text",
            isIdentifier: false,
          },
        ],
        values: {
          Name: values.name,
          Description: values.description,
          "Network name": values.networkName,
          "Locator ID": values.locatorId,
          "Repository URL": values.repositoryUrl,
          "Commit hash": values.commitHash,
          "Version tag (optional)": values.versionTag || "",
          "Additional information (Optional)": values.additionalInfo || "",
        },
      };
      
      // Upload to IPFS
      toast.info("Uploading to IPFS...");
      const ipfsHash = await uploadJSONToIPFS(itemData);
      
      if (!ipfsHash) {
        throw new Error("Failed to upload to IPFS");
      }
      
      // Ensure user is on mainnet
      await switchToMainnet();
      
      // Connect wallet
      toast.info("Please approve wallet connection request");
      await connectWallet();
      
      // Submit to registry
      toast.info("Please approve transaction in your wallet (requires 0.435 ETH deposit)");
      const txHash = await submitToRegistry(ipfsHash);
      
      setStatus({
        loading: false,
        success: true,
        error: null,
        txHash,
      });
      
      toast.success("Frontend successfully submitted!");
    } catch (error: any) {
      console.error("Submission error:", error);
      
      const errorMessage = handleWeb3Error(error);
      
      setStatus({
        loading: false,
        success: false,
        error: errorMessage,
        txHash: null,
      });
      
      toast.error(errorMessage);
    }
  };
  
  return (
    <Card className="glass-card max-w-2xl mx-auto animate-slide-up">
      <CardHeader>
        <CardTitle className="text-2xl">Submit a New Frontend</CardTitle>
        <CardDescription>
          Add a decentralized frontend to the registry. All information will be permanently stored on IPFS and verified by the community.
          <span className="block mt-1 font-medium text-hawaii-teal">A deposit of 0.435 ETH is required for this submission.</span>
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Uniswap" {...field} />
                  </FormControl>
                  <FormDescription>
                    Name of the protocol this frontend is for
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe what this frontend does and its purpose"
                      rows={3}
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="networkName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Network Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormDescription>
                      e.g., IPFS, Arweave
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="locatorId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Locator ID</FormLabel>
                    <FormControl>
                      <Input placeholder="IPFS hash or other identifier" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="repositoryUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Repository URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://github.com/..." {...field} />
                  </FormControl>
                  <FormDescription>
                    URL to the GitHub or other repository
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="commitHash"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Commit Hash</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., a83fae0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="versionTag"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Version Tag (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., v1.2.3" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="additionalInfo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional Information (Optional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Any additional details relevant for verification"
                      rows={4}
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {status.error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {status.error}
                </AlertDescription>
              </Alert>
            )}
            
            {status.success && (
              <Alert className="bg-green-50 text-green-800 border-green-200">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertDescription>
                  Successfully submitted! Transaction hash: {status.txHash}
                </AlertDescription>
              </Alert>
            )}
            
            <div className="pt-2">
              <Button
                type="submit"
                className="w-full"
                disabled={status.loading}
              >
                {status.loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit Frontend"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
