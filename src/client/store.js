import { createStore } from "redux";
import flowReducer from "./reducers/flowReducer";
function configureStore(state = {
    flow_value: 120,
    trajectory_url: "https://raw.githubusercontent.com/pedestrian-vis/data/master/trajectories/pedestrians_120.json",
    cross_url: "https://raw.githubusercontent.com/pedestrian-vis/data/master/cross_frequence/statistics_120.json",
    utilization_url: "https://raw.githubusercontent.com/pedestrian-vis/data/master/utilization/utilization_120.json",
    utilization_buf_url: "https://raw.githubusercontent.com/pedestrian-vis/data/master/utilization/utilization_buf_120.json",
    loading: false
}) {
  return createStore(flowReducer,state);
}
export default configureStore;