import DataService from "./DataService";
import { nanoid } from "nanoid";

const GA_MEASUREMENT_ID = "G-V523HZCZZ7";

const createAnalyticsService = () => {
  let initialized = false;
  let userId = null;

  const init = () => {
    if (initialized) return;
    userId = DataService.getItem("userId");
    if (!userId) {
      setUserId();
    }

    window.dataLayer = window.dataLayer || [];
    function gtag() {
      window.dataLayer.push(arguments);
    }

    window.gtag = gtag;
    gtag("js", new Date());
    gtag("config", GA_MEASUREMENT_ID, { user_id: userId });
    initialized = true;
  };

  const setUserId = () => {
    userId = nanoid();
    DataService.setItem("userId", userId);
    if (initialized && window.gtag) {
      window.gtag("config", GA_MEASUREMENT_ID, { user_id: userId });
    }
  };

  const trackEvent = (eventName, payload = {}) => {
    if (!initialized || !window.gtag) {
      console.warn("AnalyticsService not initialized yet");
      return;
    }

    window.gtag("event", eventName, {
      event_category: payload.category || "default",
      user_id_param: userId,
      event_label: payload.label,
      value: payload.value,
    });
  };

  return { init, setUserId, trackEvent };
};

const AnalyticsService = createAnalyticsService();

export default AnalyticsService;
