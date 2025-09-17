import { createTheme } from "@mui/material";

const style = {
  container: {
    height: "100vh", // full viewport height
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    padding: 2,
    boxSizing: "border-box",
    alignItems: "center",
    backgroundImage: `linear-gradient(rgba(0,0,0,0.87), rgba(0,0,0,0.87)), url('123.png')`, // use imported variable    backgroundSize: "cover", // cover the whole container
    backgroundSize: "cover",
    backgroundPosition: "center",
  },
  stack: {
    width: "100%",
    maxWidth: 600,
  },
  buttonWrapper: {
    display: "flex",
    width: "100%",
    gap: 2,
    justifyContent: "center",
  },
  imageWrapper: {
    position: "relative", // container relative
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  capturedImage: {
    maxWidth: "70%",
    objectFit: "contain",
    borderRadius: 16,
  },
  overlaySpinner: {
    position: "absolute",
    display: "flex",
    flexDirection: "column",
    gap: 10,
    alignItems: "center",
  },
  webcam: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
};

// Dark theme
const theme = createTheme({
  direction: "rtl",
  palette: {
    mode: "dark",
  },
});

export { style, theme };
