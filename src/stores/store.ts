import { create } from "zustand";
import { Task } from "../types";

let nextId = 1; // ID counter

const store = (set) => ({
  tasks: [] as Task[],
  addTask: (title: string, state: string) =>
    set((store) => ({
      tasks: [...store.tasks, { id: nextId++, title, state }],
    })),
  // Delete a task
  deleteTask: (id: number) =>
    set((store) => ({
      tasks: store.tasks.filter((task: Task) => task.id !== id), // Creates a new array reference
    })),
});

export const useStore = create(store);
