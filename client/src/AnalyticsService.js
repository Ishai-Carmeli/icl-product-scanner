import ReactGA from "react-ga4";
import DataService from "./DataService";
import { nanoid } from "nanoid";

const createAnalyticsService = () => {
  let initialized = false;
  let userId = null; 

  const init = () => {
    if (!initialized) {
      ReactGA.initialize("G-V523HZCZZ7");
      initialized = true;
      userId = DataService.getItem("userId");
      if (!userId) {
        setUserId();
      } else {
        ReactGA.set({ user_id: userId });
      }
    }
  };

  const setUserId = () => {
    userId = nanoid();
    ReactGA.set({ user_id: userId });
    DataService.setItem("userId", userId);
  };

  const trackEvent = (eventName, payload = {}) => {
    if (!initialized) {
      console.warn("AnalyticsService not initialized yet");
      return;
    }

    ReactGA.event({
      category: payload.category || "default",
      action: eventName,
      label: payload.label,
      value: payload.value,
    });
  };

  return { init, trackEvent };
};

const AnalyticsService = createAnalyticsService();

export default AnalyticsService;