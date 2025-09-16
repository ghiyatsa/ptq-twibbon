import { TwibbonEditor } from "@/components/twibbon-editor";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto py-6">
        <TwibbonEditor />
      </main>
      <Footer />
    </div>
  );
}
