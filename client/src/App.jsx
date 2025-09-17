import { useEffect, useRef, useState } from "react";
import { style, theme } from "./AppStyle";
import { ThemeProvider } from "@mui/material/styles";
import {
  Container,
  Typography,
  Button,
  CssBaseline,
  Stack,
  Box,
  CircularProgress,
} from "@mui/material";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import Tesseract from "tesseract.js";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import rtlPlugin from "stylis-plugin-rtl";
import { prefixer } from "stylis";
import AnalyticsService from "./services/AnalyticsService";
import { BrowserRouter, Route, Routes } from "react-router";
import { Home } from "./features/Home";
import { WebcamCapture } from "./features/WebcamCapture";

const cacheRtl = createCache({
  key: "mui-rtl",
  stylisPlugins: [prefixer, rtlPlugin],
});

const App = () => {
  useEffect(() => {
    AnalyticsService.init();
    AnalyticsService.trackEvent("visit", {
      category: "Page View",
      label: "OCR Scanner",
      value: window.location.pathname, // optional, can use value for path
    });
  }, []);

  return (
    <CacheProvider value={cacheRtl}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/smart-scan" element={<WebcamCapture />} />
        </Routes>
      </ThemeProvider>
    </CacheProvider>
  );
};

export default App;
