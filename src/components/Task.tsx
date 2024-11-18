import React, { useCallback } from "react";
import classNames from "classnames";
import { Task as TaskType } from "../types";
import "./Task.css";
import { useStore } from "../stores/store";
import { Trash } from "lucide-react";

interface TaskProps {
  readonly task: TaskType;
}

const Task = React.memo(({ task }: TaskProps) => {
  const setDraggedTask = useStore((store) => store.setDraggedTask);
  const deleteTask = useStore((store) => store.deleteTask);

  const handleDragStart = useCallback(() => {
    setDraggedTask(task);
  }, [setDraggedTask, task]);

  const handleDelete = useCallback(() => {
    deleteTask(task.id);
  }, [deleteTask, task.id]);

  return (
    <summary
      className="task"
      draggable
      onDragStart={handleDragStart}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          handleDragStart();
        }
      }}
      role="button"
      tabIndex={0}
      aria-expanded={false}
    >
      <div>{task.title}</div>
      <div className="bottom-wrapper">
        <button
          className="delete-task"
          onClick={handleDelete}
          aria-label="Delete task"
        >
          <Trash size={20} />
        </button>
        <span className={classNames("status", task.state)}>{task.state}</span>
      </div>
    </summary>
  );
});

export default Task;
