"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";
import {
  useNote,
  useCreateNote,
  useUpdateNote,
  useDeleteNote,
} from "@/hooks/useNotes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ArrowLeft, Trash2, Save, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function NotePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const { toast } = useToast();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [summary, setSummary] = useState<string | null>(null);
  const [isSummarizing, setIsSummarizing] = useState(false);

  const { data: note, isLoading: isNoteLoading } = useNote(id as string);
  const createNote = useCreateNote();
  const updateNote = useUpdateNote();
  const deleteNote = useDeleteNote();

  const isNewNote = id === "new";
  const isLoading = authLoading || (isNoteLoading && !isNewNote);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [authLoading, user, router]);

  // Set form data from note
  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
      setSummary(note.summary);
    }
  }, [note]);

  const handleSave = async () => {
    if (!user) return;

    // Validation for title
    if (title.trim() === "") {
      toast({
        variant: "destructive",
        title: "Title required",
        description: "Please enter a title for your note.",
      });
      return;
    }

    try {
      if (isNewNote) {
        // Create a new note

        const newNote = await createNote.mutateAsync({
          title,
          content,
          summary,
          user_id: user.id!,
        });
        console.log(newNote.id);
        // Redirect to the newly created note's page
        router.push(`/note/${newNote.id}`);
      } else {
        // Update an existing note
        await updateNote.mutateAsync({
          id: id as string,
          title,
          content,
          summary,
        });
        // Redirect to the updated note's page or back to the dashboard
        router.push(`/note/${id}`);
      }
    } catch (error) {
      console.log(error);
      toast({
        variant: "destructive",
        title: "Error saving note",
        description: "There was an error while saving your note.",
      });
    }
  };

  const handleDelete = async () => {
    if (!user || isNewNote) return;

    await deleteNote.mutateAsync({
      id: id as string,
      userId: user.id,
    });

    router.push("/dashboard");
  };

  const handleSummarize = async () => {
    if (!content.trim()) {
      toast({
        variant: "destructive",
        title: "Empty content",
        description: "Please add some content to summarize.",
      });
      return;
    }

    setIsSummarizing(true);

    try {
      const response = await fetch("/api/summarize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.id || ""}`,
        },
        body: JSON.stringify({
          text: content,
          noteId: isNewNote ? null : id,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to summarize note");
      }

      const { summary: newSummary } = await response.json();
      setSummary(newSummary);

      toast({
        title: "Summary generated",
        description: "Your note has been summarized successfully.",
      });
    } catch (error) {
      console.error("Error summarizing note:", error);
      toast({
        variant: "destructive",
        title: "Summarization failed",
        description:
          error instanceof Error ? error.message : "An unknown error occurred",
      });
    } finally {
      setIsSummarizing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-4 max-w-4xl">
        <div className="mb-6">
          <Button variant="ghost" size="sm" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to dashboard
          </Button>
          <Skeleton className="h-10 w-full mb-6" />
          <Skeleton className="h-60 w-full mb-4" />
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Redirected in useEffect
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push("/dashboard")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to dashboard
        </Button>

        <div className="flex space-x-2">
          {!isNewNote && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    your note.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDelete}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}

          <Button
            size="sm"
            onClick={handleSave}
            disabled={createNote.isPending || updateNote.isPending}
          >
            <Save className="mr-2 h-4 w-4" />
            {createNote.isPending || updateNote.isPending
              ? "Saving..."
              : "Save"}
          </Button>
        </div>
      </div>

      <div className="mb-6">
        <Input
          type="text"
          placeholder="Note title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="text-xl font-bold mb-4"
        />

        <Textarea
          placeholder="Start typing your note here..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="min-h-[300px] resize-y"
        />
      </div>

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">AI Summary</h2>
        <Button
          onClick={handleSummarize}
          disabled={isSummarizing || !content.trim()}
          variant="outline"
          size="sm"
        >
          <Sparkles className="mr-2 h-4 w-4" />
          {isSummarizing ? "Summarizing..." : "Summarize"}
        </Button>
      </div>

      {isSummarizing ? (
        <Card>
          <CardContent className="p-4">
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-3/4" />
          </CardContent>
        </Card>
      ) : summary ? (
        <Card>
          <CardContent className="p-4 prose dark:prose-invert max-w-none">
            <div
              dangerouslySetInnerHTML={{
                __html: summary.replace(/\n/g, "<br />"),
              }}
            />
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-4 text-muted-foreground text-center py-8">
            <Sparkles className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>
              Click the Summarize button to generate an AI summary of your note.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
