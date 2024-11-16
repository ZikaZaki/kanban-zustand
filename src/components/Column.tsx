import React, { useEffect, useState } from "react";
import { useStore } from "../stores/store";
import Task from "./Task";
import { Task as TaskType } from "../types";
import "./Column.css";

interface ColumnProps {
  state: string;
}

export default function Column({ state }: ColumnProps) {
  const [text, setText] = useState("");
  const [open, setOpen] = useState(false);

  const tasks = useStore((store) => store.tasks);
  const addTask = useStore((store) => store.addTask);

  // Memoize the filtered tasks
  const filteredTasks = React.useMemo(() => {
    return tasks.filter((task) => task.state === state);
  }, [tasks, state]);

  return (
    <div className="column">
      <div className="title-wrapper">
        <p>{state}</p>
        <button onClick={() => setOpen(true)}>Add</button>
      </div>
      {filteredTasks.map((task: TaskType) => (
        <Task key={task.id} task={task} />
      ))}
      {open && (
        <div className="modal">
          <button
            className="close-modal"
            onClick={() => {
              setText("");
              setOpen(false);
            }}
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
        </div>
      )}
    </div>
  );
}
