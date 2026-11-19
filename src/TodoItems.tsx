import { Trash } from "lucide-react";
import React from "react";

type Priority = "Urgent" | "Moyenne" | "Basse";
type Todo = {
  id: number;
  text: string;
  priority: Priority;
};

type Props = {
  todo: Todo;
  deleteTodo: (id: number) => void;
  isSelected: boolean;
  toggleSelectedTodo: (id: number) => void;
};

export default function Todoitems({
  todo,
  deleteTodo,
  isSelected,
  toggleSelectedTodo,
}: Props) {
  return (
    <li className="p-3">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <input
            type="checkbox"
            className="checkbox checkbox-primary checkbox-sm"
            checked={isSelected}
            onChange={() => toggleSelectedTodo(todo.id)}
          />
          <span className="text-md font-bold">
            <span>{todo.text}</span>
          </span>
          <span
            className={`badge badge-sm badge-soft ${
              todo.priority === "Urgent"
                ? "badge-error"
                : todo.priority === "Moyenne"
                  ? "badge-warning"
                  : "badge-success"
            }`}
          >
            {todo.priority}
          </span>
        </div>
        <button
          className="btn btn-sm btn-error btn-soft"
          onClick={() => deleteTodo(todo.id)}
        >
          <Trash className="w-4 h-4" />
        </button>
      </div>
    </li>
  );
}
