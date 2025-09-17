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
import AnalyticsService from "./AnalyticsService";

AnalyticsService.init();

const cacheRtl = createCache({
  key: "mui-rtl",
  stylisPlugins: [prefixer, rtlPlugin],
});

const App = () => {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);
  const inputRef = useRef(null);

  const handleCapture = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setLoading(true);
    setFailed(false);

    try {
      setImage(URL.createObjectURL(file));
      const optimizedFile = await optimizeImage(file);
      await runOCR(optimizedFile);
    } catch (err) {
      console.error(err);
      setFailed(true);
    } finally {
      setLoading(false);
    }
  };

  const optimizeImage = (file) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = URL.createObjectURL(file);

      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.width = img.width;
        canvas.height = img.height;

        ctx.drawImage(img, 0, 0);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        const brightnessFactor = 1.5; // >1 brighter
        const contrastFactor = 1.0; // >1 more contrast

        for (let i = 0; i < data.length; i += 4) {
          // Grayscale
          let avg = (data[i] + data[i + 1] + data[i + 2]) / 3;

          // Brightness
          avg = Math.min(255, avg * brightnessFactor);

          // Contrast
          data[i] = Math.min(255, (avg - 128) * contrastFactor + 128); // R
          data[i + 1] = Math.min(255, (avg - 128) * contrastFactor + 128); // G
          data[i + 2] = Math.min(255, (avg - 128) * contrastFactor + 128); // B
        }

        ctx.putImageData(imageData, 0, 0);

        canvas.toBlob(
          (blob) => {
            if (blob) resolve(blob);
            else reject(new Error("Failed to create optimized image"));
          },
          "image/jpeg",
          0.9
        );
      };

      img.onerror = () => reject(new Error("Failed to load image"));
    });
  };

  const runOCR = async (file) => {
    try {
      const {
        data: { text },
      } = await Tesseract.recognize(file, "heb+eng");

      const skuMatch = text.match(/\d{10,15}/);
      if (skuMatch) {
        const sku = skuMatch[0];
        AnalyticsService.trackEvent("scan_success", { label: "sku" });
        const searchUrl = `https://365mashbir.co.il/search?q=${sku}`;
        window.location.href = searchUrl;
      } else {
        setFailed(true);
        AnalyticsService.trackEvent("scan_fail", { label: "no_sku_found" });
        console.error(err);
      }
    } catch (err) {
      setFailed(true);
      console.error(err);
    }
  };

  const openCamera = () => {
    AnalyticsService.trackEvent("scan_button_click");
    inputRef.current.click();
  };

  useEffect(() => {
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
        <Container sx={style.container}>
          <Stack spacing={2} sx={style.stack}>
            <Typography variant="h4">ממק"ט לתמונה</Typography>
            <Typography variant="body1">
              סרקו את מסך המסופון כדי לקבל תמונה של המוצר. יש לוודא שמסך המסופון
              בבהירות מקסימלית ושרואים את המקט בבירור.
            </Typography>

            <Box sx={style.buttonWrapper}>
              <input
                ref={inputRef}
                type="file"
                accept="image/*"
                capture="environment"
                style={{ display: "none" }}
                onChange={handleCapture}
              />
              <Button
                variant="contained"
                color="primary"
                endIcon={<CameraAltIcon />}
                onClick={openCamera}
              >
                לסריקה
              </Button>
            </Box>
            {image && (
              <Box sx={style.imageWrapper}>
                <img
                  src={image}
                  alt="Captured"
                  style={{
                    ...style.capturedImage,
                    opacity: loading || failed ? "50%" : "100%",
                  }}
                />
                {image && (
                  <div style={style.overlaySpinner}>
                    {loading && <CircularProgress color="white" />}
                    {failed && (
                      <Typography variant="body1">
                        לא מצאנו את המק"ט. נסו שוב
                      </Typography>
                    )}
                  </div>
                )}
              </Box>
            )}
          </Stack>
        </Container>
      </ThemeProvider>
    </CacheProvider>
  );
};

export default App;
