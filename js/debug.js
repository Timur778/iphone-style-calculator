import { state } from "./state.js";

export function logState(actionName) {
  console.log("==============");
  console.log("ACTION:", actionName);
  console.log("currentInput:", state.currentInput);
  console.log("finalInput:", state.finalInput);
  console.log("lastInputType:", state.lastInputType);
  console.log("tokens:", [...state.tokens]);
  console.log("repeatMemory:", [...state.repeatMemory]);
  console.log("percentageMemory:", { ...state.percentageMemory });
  console.log("results:", [...state.percentageMemory.results]);
  console.log("==============");
}
