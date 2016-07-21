interface Action {
  type: string;
  payload?: any;
  error?: string;
}

const rootReducer = (state: any, action: Action) => state;
export default rootReducer;
