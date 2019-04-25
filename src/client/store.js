import { createStore } from "redux";
import flowReducer from "./reducers/flowReducer";
function configureStore(state = {
    trajectory_url: "https://raw.githubusercontent.com/pedestrian-vis/data_processing/master/trajectories/pedestrians_150.json",
    cross_url: "https://raw.githubusercontent.com/pedestrian-vis/data_processing/master/cross_frequence/statistics_150.json",
    utilization_url: "https://raw.githubusercontent.com/pedestrian-vis/data_processing/master/utilization/utilization_150.json",
    utilization_buf_url: "https://raw.githubusercontent.com/pedestrian-vis/data_processing/master/utilization/utilization_buf_150.json"
}) {
  return createStore(flowReducer,state);
}
export default configureStore;