export default (state, action) => {
    switch (action.type) {
      case "flow_control":
        return {
          ...state,
          flow_value: action.flow_value,
          trajectory_url: action.trajectory_url,
          cross_url: action.cross_url,
          utilization_url: action.utilization_url,
          utilization_buf_url: action.utilization_buf_url
        };
      case "load":
        return {
          ...state,
          loading: action.loading
        }
      default:
        return state;
    }
  };