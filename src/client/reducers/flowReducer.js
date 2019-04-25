export default (state, action) => {
    switch (action.type) {
      case "flow_control":
        return {
            ...state,
          trajectory_url: action.trajectory_url,
          cross_url: action.cross_url,
          utilization_url: action.utilization_url,
          utilization_buf_url: action.utilization_buf_url
        };
      default:
        return state;
    }
  };