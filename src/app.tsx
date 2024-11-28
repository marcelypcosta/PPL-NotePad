import { ChangeEvent, useState } from "react";
import { NewNoteCard } from "./components/new-note-card";
import { NoteCard } from "./components/note-card";
import { toast } from "sonner";
import { NotebookPen } from "lucide-react";

interface Note {
  id: string;
  date: Date;
  content: string;
}

export function App() {
  const [search, setSearch] = useState("");
  const [notes, setNotes] = useState<Note[]>(() => {
    const notesOnStorage = localStorage.getItem("notes");

    // Condição de existência do item
    if (notesOnStorage) {
      return JSON.parse(notesOnStorage);
    }

    return [];
  }); // Definindo o formato do estado com lista '<Note[]>' e buscando as notas salvas no Local Storage

  function onNoteCreated(content: string) {
    const newNote = {
      id: crypto.randomUUID(), // cria números aleatórios como string para ID, que nunca se repetem
      date: new Date(),
      content,
    };

    const notesArray = [newNote, ...notes]; // Concatenando a nota criada com as já existente em ordem

    setNotes(notesArray);

    localStorage.setItem("notes", JSON.stringify(notesArray)); // Salvando as notas no Local Storage
  }

  function handleSearch(event: ChangeEvent<HTMLInputElement>) {
    // Função para receber a pesquisa do usuário
    const query = event.target.value;

    setSearch(query);
  }

  // Condição para filtrar as notas
  const filteredNotes =
    search != ""
      ? notes.filter((note) =>
          note.content.toLocaleLowerCase().includes(search.toLocaleLowerCase())
        )
      : notes;

  // Função para deletar nota
  function onNoteDeleted(id: string) {
    // Filtrar as notas para retornar as notas que são diferentes do id da nota clicada
    const notesArray = notes.filter((note) => {
      return note.id !== id;
    });

    setNotes(notesArray); // Atualizando as notas após a remoção

    localStorage.setItem("notes", JSON.stringify(notesArray)); // Enviando a nova lista de notas

    toast.success("Nota removida com sucesso!");
  }

  // Função para editar nota
  function handleUpdateNote(id: string, updatedContent: string) {
    const updatedNotes = notes.map((note) =>
      note.id === id ? { ...note, content: updatedContent } : note
    );
  
    setNotes(updatedNotes); // Atualizando o estado das notas
    localStorage.setItem("notes", JSON.stringify(updatedNotes)); // Salvando as notas atualizadas no Local Storage
    toast.success("Nota editada com sucesso!");
  }

  return (
    <div className="mx-auto max-w-6xl my-12 space-y-6 px-5">
      <div className="flex justify-center items-center gap-2 text-slate-400">
        <NotebookPen />
        <h1 className="text-center text-slate-400 text-4xl font-bold">
          NotePad
        </h1>
      </div>

      <form className="w-full">
        <input
          type="text"
          placeholder="Busque em suas notas..."
          className="w-full bg-transparent text-3xl font-semibold tracking-tight outline-none placeholder:text-slate-500"
          onChange={handleSearch}
        />
      </form>

      <div className="h-px bg-slate-700" />

      <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 auto-rows-[250px] gap-6">
        <NewNoteCard onNoteCreated={onNoteCreated} />
        {filteredNotes.map((note) => {
          return (
            <NoteCard onNoteDeleted={onNoteDeleted} onNoteUpdated={handleUpdateNote} key={note.id} note={note} />
          );
        })}
        {/* Percorrendo as notas existentes no Local Storage */}
      </div>
    </div>
  );
}
