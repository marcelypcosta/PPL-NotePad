import * as Dialog from "@radix-ui/react-dialog";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { X } from "lucide-react";
import { useState, ChangeEvent } from "react";

interface NoteCardProps {
  note: {
    id: string;
    date: Date;
    content: string;
  };
  onNoteDeleted: (id: string) => void;
  onNoteUpdated: (id: string, updatedContent: string) => void; // Nova prop para editar
}

export function NoteCard({ note, onNoteDeleted, onNoteUpdated }: NoteCardProps) {
  const [isEditing, setIsEditing] = useState(false); // Controla se o card está no modo de edição
  const [editedContent, setEditedContent] = useState(note.content); // Estado para conteúdo editado

  function handleEditToggle() {
    setIsEditing((prev) => !prev); // Alterna entre editar e exibir
  }

  function handleSaveEdit() {
    if (editedContent.trim() === "") {
      alert("A nota não pode estar vazia.");
      return;
    }

    onNoteUpdated(note.id, editedContent); // Salva a edição
    setIsEditing(false); // Sai do modo de edição
  }

  return (
    <Dialog.Root>
      <Dialog.Trigger className="rounded-md text-left flex flex-col bg-slate-800 p-5 gap-3 outline-none overflow-hidden relative hover:ring-2 hover:ring-slate-600 hover:cursor-pointer focus-visible:ring-2 focus-visible:ring-lime-400">
        <span className="text-sm font-medium text-slate-300">
          {formatDistanceToNow(note.date, {
            locale: ptBR,
            addSuffix: true,
          })}
        </span>
        <p className="text-sm leading-6 text-slate-400">{note.content}</p>
        <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-b from-slate-800/0 to-slate-950/60 pointer-events-none" />
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="inset-0 fixed bg-black/50" />
        <Dialog.Content className="fixed overflow-hidden inset-0 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-[640px] md:h-[60vh] w-full bg-slate-700 md:rounded-md flex flex-col outline-none">
          <Dialog.Close className="absolute right-0 top-0 bg-slate-800 p-1.5 text-slate-400 hover:text-slate-100">
            <X className="size-5" />
          </Dialog.Close>
          <div className="flex flex-1 flex-col gap-3 p-5">
            <span className="text-sm font-medium text-slate-300">
              {formatDistanceToNow(note.date, {
                locale: ptBR,
                addSuffix: true,
              })}
            </span>
            {isEditing ? (
              <textarea
                className="text-sm leading-6 text-slate-400 bg-transparent resize-none flex-1 outline-none"
                value={editedContent}
                onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                  setEditedContent(e.target.value)
                }
              />
            ) : (
              <p className="text-sm leading-6 text-slate-400">{note.content}</p>
            )}
          </div>
          {isEditing ? (
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleSaveEdit}
                className="flex-1 bg-lime-400 py-4 text-center text-sm text-slate-950 outline-none font-medium hover:bg-lime-500"
              >
                Salvar edição
              </button>
              <button
                type="button"
                onClick={handleEditToggle}
                className="flex-1 bg-slate-800 py-4 text-center text-sm text-slate-300 outline-none font-medium hover:bg-slate-600"
              >
                Cancelar
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleEditToggle}
                className="flex-1 bg-slate-800 py-4 text-center text-sm text-slate-300 outline-none font-medium hover:bg-slate-600"
              >
                Editar nota
              </button>
              <button
                type="button"
                onClick={() => onNoteDeleted(note.id)}
                className="flex-1 bg-red-500 py-4 text-center text-sm text-slate-300 outline-none font-medium hover:bg-red-600"
              >
                Apagar nota
              </button>
            </div>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
