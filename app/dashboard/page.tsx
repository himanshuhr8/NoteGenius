"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { NotesList } from "@/components/notes/NotesList";
import { useNotes } from "@/hooks/useNotes";
import { Button } from "@/components/ui/button";
import { Plus, RefreshCcw, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const { data: notes, isLoading, isError, refetch } = useNotes(user?.id || "");

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [authLoading, user, router]);

  const filteredNotes = notes?.filter(
    (note) =>
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateNote = () => {
    router.push("/note/new");
  };

  if (authLoading) {
    return (
      <DashboardLayout>
        <div className="container mx-auto p-4">
          <LoadingState />
        </div>
      </DashboardLayout>
    );
  }

  if (!user) {
    return null; // This will be redirected in the useEffect
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto p-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Your Notes</h1>
            <p className="text-muted-foreground">
              Manage your notes and create new ones
            </p>
          </div>
          <div className="flex items-center mt-4 md:mt-0 space-x-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search notes..."
                className="pl-8 w-full md:w-auto"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button onClick={handleCreateNote}>
              <Plus className="mr-2 h-4 w-4" />
              New Note
            </Button>
          </div>
        </div>

        {isLoading ? (
          <LoadingState />
        ) : isError ? (
          <ErrorState onRetry={() => refetch()} />
        ) : filteredNotes && filteredNotes.length > 0 ? (
          <NotesList notes={filteredNotes} />
        ) : notes && notes.length > 0 ? (
          <NoSearchResults
            query={searchQuery}
            onClear={() => setSearchQuery("")}
          />
        ) : (
          <EmptyState onCreateNote={handleCreateNote} />
        )}
      </div>
    </DashboardLayout>
  );
}

function LoadingState() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <Card key={i} className="overflow-hidden">
          <CardHeader className="pb-2">
            <Skeleton className="h-6 w-3/4 mb-1" />
            <Skeleton className="h-4 w-1/3" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-2/3" />
          </CardContent>
          <CardFooter>
            <Skeleton className="h-4 w-1/4" />
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}

function EmptyState({ onCreateNote }: { onCreateNote: () => void }) {
  return (
    <Card className="border-dashed border-2 bg-background/50">
      <CardContent className="py-12 flex flex-col items-center text-center">
        <div className="p-3 rounded-full bg-primary/10 mb-4">
          <FileText className="h-10 w-10 text-primary" />
        </div>
        <CardTitle className="mb-2">No notes yet</CardTitle>
        <CardDescription className="mb-6 max-w-md">
          You haven&apos;t created any notes yet. Get started by creating your
          first note.
        </CardDescription>
        <Button onClick={onCreateNote}>
          <Plus className="mr-2 h-4 w-4" />
          Create your first note
        </Button>
      </CardContent>
    </Card>
  );
}

function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <Card className="border-destructive/50 bg-destructive/5">
      <CardContent className="py-12 flex flex-col items-center text-center">
        <AlertTriangle className="h-10 w-10 text-destructive mb-4" />
        <CardTitle className="mb-2">Error loading notes</CardTitle>
        <CardDescription className="mb-6 max-w-md">
          We encountered an error while trying to load your notes. Please try
          again later.
        </CardDescription>
        <Button onClick={onRetry} variant="outline">
          <RefreshCcw className="mr-2 h-4 w-4" />
          Try Again
        </Button>
      </CardContent>
    </Card>
  );
}

function NoSearchResults({
  query,
  onClear,
}: {
  query: string;
  onClear: () => void;
}) {
  return (
    <Card className="border-dashed border-2 bg-background/50">
      <CardContent className="py-12 flex flex-col items-center text-center">
        <div className="p-3 rounded-full bg-muted mb-4">
          <Search className="h-10 w-10 text-muted-foreground" />
        </div>
        <CardTitle className="mb-2">No matching notes</CardTitle>
        <CardDescription className="mb-6 max-w-md">
          No notes matching &quot;<span className="font-medium">{query}</span>
          &quot; were found.
        </CardDescription>
        <Button onClick={onClear} variant="outline">
          Clear search
        </Button>
      </CardContent>
    </Card>
  );
}

// This is needed for the ErrorState component
import { AlertTriangle, FileText } from "lucide-react";
