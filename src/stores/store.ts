import { create } from "zustand";
import { persist, devtools } from "zustand/middleware";
import { Task } from "../types";

let nextId = 1; // ID counter

const store = (set) => ({
  tasks: [] as Task[],
  draggedTask: null as Task | null,
  setDraggedTask: (task: Task | null) =>
    set({ draggedTask: task }, false, "setDraggedTask"),
  moveTask: (id: number, state: string) =>
    set(
      (store) => {
        const tasks = store.tasks.map((task) =>
          task.id === id ? { ...task, state } : task
        );
        return { tasks };
      },
      false,
      "moveTask"
    ),
  addTask: (title: string, state: string) =>
    set(
      (store) => ({
        tasks: [...store.tasks, { id: nextId++, title, state }],
      }),
      false,
      "addTask"
    ),
  // Delete a task
  deleteTask: (id: number) =>
    set(
      (store) => ({
        tasks: store.tasks.filter((task: Task) => task.id !== id), // Creates a new array reference
      }),
      false,
      "deleteTask"
    ),
});

export const useStore = create(persist(devtools(store), { name: "kanban" }));
