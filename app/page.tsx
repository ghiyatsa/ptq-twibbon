import { TwibbonEditor } from "@/components/twibbon-editor";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4 text-balance">
            Twibbon Milad Ke-16 UKM PTQ
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            Upload foto anda dan buat twibbon milad ke-16 UKM PTQ
          </p>
        </div>
        <TwibbonEditor />
      </main>
      <Footer />
    </div>
  );
}
