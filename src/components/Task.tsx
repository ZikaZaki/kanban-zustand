import classNames from "classnames";
import { Task as TaskType } from "../types";
import "./Task.css";
import { useStore } from "../stores/store";
import { Trash } from "lucide-react";

interface TaskProps {
  readonly task: TaskType;
}

export default function Task({ task }: TaskProps) {
  const setDraggedTask = useStore((store) => store.setDraggedTask);
  const deleteTask = useStore((store) => store.deleteTask);

  return (
    <div
      className="task"
      draggable
      onDragStart={() => {
        setDraggedTask(task);
      }}
    >
      <div>{task.title}</div>
      <div className="bottom-wrapper">
        <button className="delete-task" onClick={() => deleteTask(task.id)}>
          <Trash size={20} />
        </button>
        <div className={classNames("status", task.state)}>{task.state}</div>
      </div>
    </div>
  );
}
