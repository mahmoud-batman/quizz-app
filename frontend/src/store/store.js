import { createStore, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk";
import rootReducer from "../store/reducers";

const initialState = {};

const middleware = [thunk];
const middlewareEnhancer = applyMiddleware(...middleware)

const store = createStore(
  rootReducer,
  initialState,
  composeWithDevTools(middlewareEnhancer)
);

export default store;
