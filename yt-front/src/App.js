import React, { useState } from "react";
import axios from "axios";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  CircularProgress,
  Snackbar,
  IconButton,
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import CloseIcon from "@mui/icons-material/Close";
import Instructions from "./instructions";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#dc004e",
    },
  },
});

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function App() {
  const [videoUrl, setVideoUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar(false);
  };

  const handleDownload = async () => {
    if (!videoUrl) {
      setSnackbarMessage("Por favor, ingresa una URL de YouTube");
      setSnackbarSeverity("warning");
      setOpenSnackbar(true);
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        "http://127.0.0.1:5000/download",
        { url: videoUrl },
        {
          responseType: "blob",
          timeout: 30000,
        }
      );

      if (response.data.type === "application/json") {
        const reader = new FileReader();
        reader.onload = () => {
          const error = JSON.parse(reader.result);
          throw new Error(error.error || "Error desconocido");
        };
        reader.readAsText(response.data);
        return;
      }

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "video.mp4");
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      setSnackbarMessage("Descarga exitosa");
      setSnackbarSeverity("success");
      setOpenSnackbar(true);
      setVideoUrl("");
    } catch (error) {
      console.error("Error al descargar el video:", error);
      setSnackbarMessage(error.message || "Error al descargar el video");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="sm">
        <Box sx={{ my: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            Descargador de Videos de YouTube
          </Typography>
          <TextField
            fullWidth
            variant="outlined"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            placeholder="Introduce la URL del video de YouTube"
            margin="normal"
            disabled={loading}
            error={Boolean(
              videoUrl &&
                !videoUrl.includes("youtube.com") &&
                !videoUrl.includes("youtu.be")
            )}
            helperText={
              videoUrl &&
              !videoUrl.includes("youtube.com") &&
              !videoUrl.includes("youtu.be")
                ? "Por favor, ingresa una URL válida de YouTube"
                : ""
            }
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleDownload}
            disabled={loading || !videoUrl}
            fullWidth
            sx={{ mt: 2 }}
            startIcon={loading ? undefined : <CloudDownloadIcon />}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Descargar Video"
            )}
          </Button>
        </Box>

        <Instructions />

        <Snackbar
          open={openSnackbar}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={snackbarSeverity}
            sx={{ width: "100%" }}
            action={
              <IconButton
                size="small"
                color="inherit"
                onClick={handleCloseSnackbar}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            }
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Container>
    </ThemeProvider>
  );
}

export default App;
