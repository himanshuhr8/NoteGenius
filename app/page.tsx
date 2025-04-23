import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FileText, Sparkles, Lock } from "lucide-react";
import HeroSection from "@/components/layout/HeroSection";

import RedirectToDashboard from "@/components/providers/CheckAuth";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <RedirectToDashboard />
      <header className="border-b bg-background">
        <div className="container px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <FileText className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold">NoteGenius</h1>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link href="/signup">
              <Button>Sign Up</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <HeroSection />

        <section className="py-20 bg-muted/50">
          <div className="container px-4 mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">
              Key Features
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <FeatureCard
                icon={<FileText className="h-8 w-8 text-primary" />}
                title="Smart Notes"
                description="Create, edit, and organize your notes with our intuitive interface."
              />
              <FeatureCard
                icon={<Sparkles className="h-8 w-8 text-primary" />}
                title="AI Summaries"
                description="Let AI summarize your notes with a single click, saving you time."
              />
              <FeatureCard
                icon={<Lock className="h-8 w-8 text-primary" />}
                title="Secure Storage"
                description="Your notes are encrypted and stored securely in our database."
              />
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t bg-background">
        <div className="container px-4 py-6 text-center text-muted-foreground">
          <p>© 2025 NoteGenius. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-card rounded-lg p-6 shadow-sm border hover:shadow-md transition-shadow">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}
