import React, { useEffect, useState } from "react";
import Todoitems from "./TodoItems";
import { Construction } from "lucide-react";

type Props = {};

type Priority = "Urgent" | "Moyenne" | "Basse";
type Todo = {
  id: number;
  text: string;
  priority: Priority;
};

export default function App({}: Props) {
  const [input, setInput] = useState<string>("");
  const [priority, setPriority] = useState<Priority>("Moyenne");
  const savedTodos = localStorage.getItem("todos");
  const initialTodo = savedTodos ? JSON.parse(savedTodos) : [];

  const [filter, setFilter] = useState<Priority | "Tous">("Tous");
  const [todos, setTodos] = useState<Todo[]>(initialTodo);

  // Sauvegarde des taches dans le localStorage
  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  // Ajouter Tache
  function addTodo() {
    if (input.trim() == "") {
      return;
    }

    const newTodo: Todo = {
      id: Date.now(),
      text: input.trim(),
      priority: priority,
    };

    const newTodos = [newTodo, ...todos];
    setTodos(newTodos);
    setInput("");
    setPriority("Moyenne");
    console.log(newTodos);
  }

  // Filtrer les taches
  let filteredTodos: Todo[] = [];
  if (filter === "Tous") {
    filteredTodos = todos;
  } else {
    filteredTodos = todos.filter((todo) => todo.priority === filter);
  }

  // Compter le nombre de taches par priorité
  const urgentCount = todos.filter((todo) => todo.priority === "Urgent").length;
  const moyenneCount = todos.filter(
    (todo) => todo.priority === "Moyenne",
  ).length;
  const basseCount = todos.filter((todo) => todo.priority === "Basse").length;

  // Supprimer une tache
  function deleteTodo(id: number) {
    // Supprimer la tâche
    setTodos((prev) => prev.filter((todo) => todo.id !== id));

    // Nettoyer également la sélection
    setSelectedTodo((prev) => {
      const newSelected = new Set(prev);
      newSelected.delete(id);
      return newSelected;
    });
  }

  // Selectionner les taches
  const [selectedTodo, setSelectedTodo] = useState<Set<number>>(new Set());
  function toggleSelectedTodo(id: number) {
    const newSelectedTodo = new Set(selectedTodo);
    if (newSelectedTodo.has(id)) {
      newSelectedTodo.delete(id);
    } else {
      newSelectedTodo.add(id);
    }
    setSelectedTodo(newSelectedTodo);
  }

  // Finir les taches
  function finishSelected() {
    const newTodosFinish = todos.filter((todo) => !selectedTodo.has(todo.id));

    setTodos(newTodosFinish);
    setSelectedTodo(new Set());
  }

  return (
    <div className="flex justify-center">
      <div className="w-2/3 flex flex-col gap-4 my-15 bg-base-300 p-5 rounded-2xl">
        {/* Formulaire */}
        <div className="flex w-full gap-4">
          <input
            type="text"
            className="input w-full"
            placeholder="Ajouter une tache..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <select
            className="select w-full"
            value={priority}
            onChange={(e) => setPriority(e.target.value as Priority)}
          >
            <option value="Urgent">Urgent</option>
            <option value="Moyenne">Moyenne</option>
            <option value="Basse">Basse</option>
          </select>
          <button className="btn btn-primary" onClick={addTodo}>
            Ajouter
          </button>
        </div>
        {/* Btn de filtre */}
        <div className="space-y-2 flex-1 h-fit">
          <div className="flex items-center justify-between">
            <div className="flex flex-wrap gap-4">
              <button
                className={`btn btn-soft ${filter === "Tous" ? "btn-primary" : ""}`}
                onClick={() => setFilter("Tous")}
              >
                Tous ({todos.length})
              </button>
              <button
                className={`btn btn-soft ${filter === "Urgent" ? "btn-primary" : ""}`}
                onClick={() => setFilter("Urgent")}
              >
                Urgent ({urgentCount})
              </button>
              <button
                className={`btn btn-soft ${filter === "Moyenne" ? "btn-primary" : ""}`}
                onClick={() => setFilter("Moyenne")}
              >
                Moyenne ({moyenneCount})
              </button>
              <button
                className={`btn btn-soft ${filter === "Basse" ? "btn-primary" : ""}`}
                onClick={() => setFilter("Basse")}
              >
                Basse ({basseCount})
              </button>
            </div>
            <button
              className="btn btn-primary"
              disabled={selectedTodo.size == 0}
              onClick={finishSelected}
            >
              Finir la selection ({selectedTodo.size})
            </button>
          </div>
        </div>
        {/* Liste des Taches */}
        {filteredTodos.length > 0 ? (
          <ul className="divide-y divide-primary/20">
            {filteredTodos.map((todo) => (
              <li key={todo.id}>
                <Todoitems
                  todo={todo}
                  isSelected={selectedTodo.has(todo.id)}
                  deleteTodo={deleteTodo}
                  toggleSelectedTodo={toggleSelectedTodo}
                />
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex justify-center items-center flex-col p-5">
            <div>
              <Construction
                strokeWidth={1}
                className="w-40 h-40 text-primary"
              />
            </div>
            <p className="text-sm">Aucune tâche pour ce filtre</p>
          </div>
        )}
      </div>
    </div>
  );
}
