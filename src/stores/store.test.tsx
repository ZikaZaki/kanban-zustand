import { useEffect } from "react";
import { vi } from "vitest";
import { render } from "@testing-library/react";
import { useStore } from "./store";

function TestComponent({ selector, effect }) {
  const items = useStore(selector);

  useEffect(() => effect(items), [items]);

  return null;
}

test("Should return default value at the start", () => {
  const selector = (store) => store.tasks ?? [];
  const effect = vi.fn();
  render(<TestComponent selector={selector} effect={effect} />);
  expect(effect).toHaveBeenCalledWith([]);
});

test("Should add an item to the store and rerun the effect", () => {
  const selector = (store) => ({ tasks: store.tasks, addTask: store.addTask });
  const effect = vi.fn().mockImplementation((items) => {
    if (items.tasks.length === 0) {
      items.addTask({ title: "a", state: "b" });
    }
  });

  render(<TestComponent selector={selector} effect={effect} />);

  // Verify the effect was triggered twice (initial render + task added)
  expect(effect).toHaveBeenCalledTimes(2);

  // Verify that the task was added correctly
  expect(effect).toHaveBeenCalledWith(
    expect.objectContaining({
      tasks: [{ id: expect.any(String), title: "a", state: "b" }],
    })
  );

  //
  vi.spyOn(console, "log").mockImplementation(() => {});
});
