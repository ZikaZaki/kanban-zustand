import { v4 as uuidv4 } from "uuid";
import { create } from "zustand";
import { persist, devtools } from "zustand/middleware";
import { Task } from "../types";

const store = (set) => ({
  tasks: [] as Task[],
  draggedTask: null as Task | null,
  setDraggedTask: (task: Task | null) =>
    set({ draggedTask: task }, false, "setDraggedTask"),
  moveTask: (id: string, state: string) =>
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
        tasks: [...store.tasks, { id: uuidv4(), title, state }],
      }),
      false,
      "addTask"
    ),
  // Delete a task
  deleteTask: (id: string) =>
    set(
      (store) => ({
        tasks: store.tasks.filter((task: Task) => task.id !== id), // Creates a new array reference
      }),
      false,
      "deleteTask"
    ),
});

// Custom Wrapper (Middleware) for logging state
const log = (config) => (set, get, api) =>
  config(
    (...args) => {
      console.log(args);
      set(...args);
    },
    get,
    api
  );

export const useStore = create(
  log(persist(devtools(store), { name: "kanban" }))
);
