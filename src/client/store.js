import { createStore } from "redux";
import flowReducer from "./reducers/flowReducer";
function configureStore(state = {
    flow_value: 90,
    trajectory_url: "https://raw.githubusercontent.com/pedestrian-vis/data_processing/master/trajectories/pedestrians_90.json",
    cross_url: "https://raw.githubusercontent.com/pedestrian-vis/data_processing/master/cross_frequence/statistics_90.json",
    utilization_url: "https://raw.githubusercontent.com/pedestrian-vis/data_processing/master/utilization/utilization_90.json",
    utilization_buf_url: "https://raw.githubusercontent.com/pedestrian-vis/data_processing/master/utilization/utilization_buf_90.json"
}) {
  return createStore(flowReducer,state);
}
export default configureStore;