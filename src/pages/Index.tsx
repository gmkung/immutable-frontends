import { FrontendList } from "@/components/FrontendList";
import { Container } from "@/components/ui/container";

const Index = () => {
  return (
    <main className="flex-1 pt-24 pb-16">
      <Container className="text-center mb-12 animate-slide-down">
        <span className="text-xs font-semibold tracking-wider uppercase bg-secondary/50 px-3 py-1 rounded-full mb-3 inline-block">
          Decentralized Registry
        </span>
        <h1 className="text-4xl font-bold mb-4">Immutable Frontends</h1>
        <p className="max-w-2xl mx-auto text-muted-foreground">
          A curated collection of verified frontends that can be accessed
          directly from their IPFS hashes, ensuring censorship resistance and
          authenticity via the Kleros Curate registry.
        </p>
      </Container>

      <FrontendList />
    </main>
  );
};

export default Index;
