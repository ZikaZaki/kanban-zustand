import React, { useState, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import { useStore } from "../stores/store";
import Task from "./Task";
import { Task as TaskType } from "../types";
import "./Column.css";
import classNames from "classnames";

interface ColumnProps {
  state: string;
}

export default function Column({ state }: ColumnProps) {
  const [text, setText] = useState("");
  const [open, setOpen] = useState(false);
  const [drop, setDrop] = useState(false);

  const tasks = useStore((store) => store.tasks);
  const draggedTask = useStore((store) => store.draggedTask);
  const setDraggedTask = useStore((store) => store.setDraggedTask);
  const moveTask = useStore((store) => store.moveTask);
  const addTask = useStore((store) => store.addTask);

  // Memoize the filtered tasks
  const filteredTasks = React.useMemo(() => {
    return tasks.filter((task: TaskType) => task.state === state);
  }, [tasks, state]);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDrop(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDrop(false);
  }, []);

  const handleDrop = useCallback(() => {
    setDrop(false);
    if (draggedTask) {
      moveTask(draggedTask.id, state);
      setDraggedTask(null); // Only set to null if there's a dragged task
    }
  }, [draggedTask, moveTask, setDraggedTask, state]);

  const handleAddTask = useCallback(() => {
    if (text.trim()) {
      addTask(uuidv4(), text.trim(), state);
      setText("");
      setOpen(false);
    }
  }, [text, addTask, state]);

  return (
    <section
      className={classNames("column", { drop })}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      aria-labelledby={`column-${state}`}
    >
      <div className="title-wrapper">
        <p>{state}</p>
        <button onClick={() => setOpen(true)}>Add</button>
      </div>
      {filteredTasks.map((task: TaskType) => (
        <Task key={task.id} task={task} />
      ))}
      {open && (
        <dialog className="modal" open>
          <button
            className="close-modal"
            onClick={() => {
              setText("");
              setOpen(false);
            }}
            aria-label="Close"
          >
            x
          </button>
          <div className="modal-content">
            <input
              onChange={(e) => setText(e.target.value)}
              value={text}
              placeholder="Task title"
            />
            <button className="modal-submit" onClick={handleAddTask}>
              Submit
            </button>
          </div>
        </dialog>
      )}
    </section>
  );
}
