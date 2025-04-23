"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase/client";

export type Note = {
  id: string;
  title: string;
  content: string;
  summary: string | null;
  created_at: string;
  updated_at: string;
  user_id: string;
};

export function useNote(id: string) {
  const fetchNote = async (): Promise<Note | null> => {
    const { data, error } = await supabase
      .from("notes")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data as Note | null;
  };

  return useQuery<Note | null, Error>({
    queryKey: ["note", id],
    queryFn: fetchNote,
    enabled: !!id && id !== "new", // skip if invalid or creating
  });
}


export function useNotes(userId: string) {
  const fetchNotes = async (): Promise<Note[]> => {
    if (!userId) return [];
    const { data, error } = await supabase
      .from("notes")
      .select("*")
      .eq("user_id", userId);

    if (error) {
      throw new Error(error.message);
    }
    return data as Note[];
  };

  return useQuery<Note[], Error>({
    queryKey: ["notes", userId],
    queryFn: fetchNotes,
    enabled: !!userId,
  });
}


export function useCreateNote() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (
      noteData: Omit<Note, "id" | "created_at" | "updated_at">
    ) => {
      const { data, error } = await supabase
        .from("notes")
        .insert([
          {
            ...noteData,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ])
        .select()
        .single(); // Use .single() to get a single inserted note

      if (error) {
        throw new Error(error.message);
      }
      return data as Note;
    },
    onSuccess: (data) => {
    
      queryClient.invalidateQueries({ queryKey: ["notes", data.user_id] });
      toast({
        title: "Note created",
        description: "Your note has been created successfully.",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error creating note",
        description:
          error instanceof Error ? error.message : "An unknown error occurred",
      });
    },
  });
}


export function useUpdateNote() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...noteData }: Partial<Note> & { id: string }) => {
      const { data, error } = await supabase
        .from("notes")
        .update({ ...noteData, updated_at: new Date().toISOString() })
        .eq("id", id).select().single(); // Use .single() to return the updated note

      if (error) {
        throw new Error(error.message);
      }
      return data as Note;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["notes", data.user_id] });
      queryClient.invalidateQueries({ queryKey: ["note", data.id] });
      toast({
        title: "Note updated",
        description: "Your note has been updated successfully.",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error updating note",
        description:
          error instanceof Error ? error.message : "An unknown error occurred",
      });
    },
  });
}



export function useDeleteNote() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, userId }: { id: string; userId: string }) => {
      const { error } = await supabase.from("notes").delete().eq("id", id);

      if (error) {
        throw new Error(error.message);
      }
      return { id, userId };
    },
    onSuccess: ({ id, userId }) => {
      queryClient.invalidateQueries({ queryKey: ["notes", userId] });
      toast({
        title: "Note deleted",
        description: "Your note has been deleted successfully.",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error deleting note",
        description:
          error instanceof Error ? error.message : "An unknown error occurred",
      });
    },
  });
}
