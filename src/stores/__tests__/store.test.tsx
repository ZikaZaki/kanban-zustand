import { vi } from "vitest";
import { render } from "@testing-library/react";
import { useStore } from "../store";
import { useEffect } from "react";

vi.mock("zustand");

// Component for testing
function TestComponent({ selector, effect }) {
  const items = useStore(selector);

  useEffect(() => {
    effect(items);
  }, [items]);

  return null;
}

// Helper component to execute store methods
function ActionComponent({ action }) {
  action(useStore.getState());
  return null;
}

test("Should return default value at the start", () => {
  const selector = (store) => store.tasks ?? [];
  const effect = vi.fn();

  render(<TestComponent selector={selector} effect={effect} />);

  // Check that the initial state is empty
  expect(effect).toHaveBeenCalledWith([]);
});

test("Should add an item to the store and rerun the effect", () => {
  const selector = (store) => store.tasks;
  const effect = vi.fn();

  // Helper to execute store methods
  const action = (store) => {
    store.addTask("123ab", "a", "b");
  };

  render(
    <>
      <TestComponent selector={selector} effect={effect} />
      <ActionComponent action={action} />
    </>
  );

  // Ensure the effect runs twice: initial render + after adding a task
  expect(effect).toHaveBeenCalledTimes(2);

  // Check the updated state
  expect(effect).toHaveBeenCalledWith([
    { id: "123ab", title: "a", state: "b" },
  ]);

  // Ensure console logs are silenced during tests
  vi.spyOn(console, "log").mockImplementation(() => {});
});
