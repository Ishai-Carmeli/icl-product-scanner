import ReactGA from "react-ga4";

const createAnalyticsService = () => {
  let initialized = false;

  const init = () => {
    if (!initialized) {
      ReactGA.initialize("G-V523HZCZZ7");
      initialized = true;
    }
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
