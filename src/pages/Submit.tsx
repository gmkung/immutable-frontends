
import { Header } from "@/components/Header";
import { FrontendForm } from "@/components/FrontendForm";
import { Container } from "@/components/ui/container";

const Submit = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 pt-24 pb-16">
        <Container className="text-center mb-12 animate-slide-down">
          <span className="text-xs font-semibold tracking-wider uppercase bg-secondary/50 px-3 py-1 rounded-full mb-3 inline-block">
            Submit New Entry
          </span>
          <h1 className="text-4xl font-bold mb-4">Add a Decentralized Frontend</h1>
          <p className="max-w-2xl mx-auto text-muted-foreground">
            Submit a new frontend to the registry. Your submission will be stored on IPFS and added to the blockchain registry.
          </p>
        </Container>
        
        <FrontendForm />
      </main>
    </div>
  );
};

export default Submit;
