import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="py-20 lg:py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/5 z-0" />
      <div
        className="absolute right-0 top-1/2 -translate-y-1/2 w-full max-w-3xl h-full opacity-10 z-0"
        style={{
          backgroundImage:
            "url('https://images.pexels.com/photos/3826669/pexels-photo-3826669.jpeg?auto=compress')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          maskImage:
            "radial-gradient(circle at 70% 50%, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0) 70%)",
        }}
      />
      <div className="container px-4 mx-auto relative z-10">
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight">
            Capture ideas.
            <br />
            <span className="text-primary">Summarize with AI.</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8">
            Take notes that work for you. NoteGenius helps you capture your
            thoughts and distill them with the power of AI.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/signup">
              <Button size="lg" className="px-8 group">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline">
                Log in
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
