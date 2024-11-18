import { create } from "zustand";
import { persist, devtools } from "zustand/middleware";
import { Task } from "../types";
import { produce } from "immer";

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
  addTask: (id: string, title: string, state: string) =>
    set(
      produce((store) => {
        store.tasks.push({ id, title, state });
      }),
      // (store) => ({
      //   tasks: [...store.tasks, { id, title, state }],
      // }),
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

// we can use our store
useStore.subscribe((newStore, prevStore) => {
  if (newStore.tasks !== prevStore.tasks) {
    let planned = 0,
      ongoing = 0,
      done = 0;
    newStore.tasks.map((task) => {
      if (task.state === "PLANNED") planned += 1;
      if (task.state === "ONGOING") ongoing += 1;
      if (task.state === "DONE") done += 1;
    });
    useStore.setState({
      plannedTasks: planned,
      ongoingTasks: ongoing,
      doneTasks: done,
    });
  }
});
