import React, { useRef } from "react";
import { Container } from "@mui/material";
import { style } from "../AppStyle";
import Webcam from "react-webcam";

export const WebcamCapture = () => {
  const webcamRef = useRef(null);

  return (
    <Container
      sx={{
        ...style.container,
        p: 0,
        display: "flex",
      }}
    >
      <Webcam
        ref={webcamRef}
        audio={false}
        screenshotFormat="image/jpeg"
        style={style.webcam}
        videoConstraints={{
          facingMode: "environment", // use back camera on mobile
        }}
      />
    </Container>
  );
};
