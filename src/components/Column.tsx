import React, { useEffect, useState } from "react";
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
    return tasks.filter((task) => task.state === state);
  }, [tasks, state]);

  return (
    <div
      className={classNames("column", { drop: drop })}
      onDragOver={(e) => {
        setDrop(true);
        e.preventDefault();
      }}
      onDragLeave={(e) => {
        setDrop(false);
        e.preventDefault();
      }}
      onDrop={() => {
        setDrop(false);
        moveTask(draggedTask!.id, state);
        setDraggedTask(null);
      }}
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
            <input onChange={(e) => setText(e.target.value)} value={text} />
            <button
              className="modal-submit"
              onClick={() => {
                addTask(text, state);
                setText("");
                setOpen(false);
              }}
            >
              Submit
            </button>
          </div>
        </dialog>
      )}
    </div>
  );
}
