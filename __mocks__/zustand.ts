import { act } from "@testing-library/react";
import { vi } from "vitest";
const { create: actualCreate } = (await vi.importActual(
  "zustand"
)) as typeof import("zustand");

// a variable to hold reset functions for all stores declared in the app
const storeResetFns = new Set<() => void>();

// when creating a store, we get its initial state, create a reset function and add it
export const create = (createState) => {
  const store = actualCreate(createState);
  const initialState = store.getState();
  storeResetFns.add(() => store.setState(initialState, true));
  return store;
};

// Reset all stores after each test run
beforeEach(() => {
  act(() => storeResetFns.forEach((resetFn) => resetFn()));
  console.log("called from __mocks__/zustand.ts");
});
