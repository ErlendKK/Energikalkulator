import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { projectReducer } from "./features/projectSlice";
import { activeReducer } from "./features/activeSlice";

const rootReducer = combineReducers({
  project: projectReducer,
  active: activeReducer,
});

const store = configureStore({
  reducer: rootReducer,
});

export { store };
