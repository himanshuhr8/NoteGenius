import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { Edit2 } from "lucide-react";
import { Note } from "@/hooks/useNotes";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type NotesListProps = {
  notes: Note[];
};

export function NotesList({ notes }: NotesListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {notes.map((note) => (
        <NoteCard key={note.id} note={note} />
      ))}
    </div>
  );
}

function NoteCard({ note }: { note: Note }) {
  const updatedAtText = formatDistanceToNow(new Date(note.updated_at), {
    addSuffix: true,
  });
  const contentPreview =
    note.content.length > 150
      ? `${note.content.substring(0, 150)}...`
      : note.content;

  return (
    <Link href={`/note/${note.id}`}>
      <Card className="h-full overflow-hidden transition-all hover:shadow-md group">
        <CardHeader className="pb-2">
          <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors">
            {note.title}
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            Updated {updatedAtText}
          </p>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground line-clamp-4 text-sm">
            {contentPreview}
          </p>
        </CardContent>
        <CardFooter className="pt-2 flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" asChild>
            <div>
              <Edit2 className="h-4 w-4" />
              <span className="sr-only">Edit</span>
            </div>
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
}
