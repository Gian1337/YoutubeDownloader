import React from "react";
import { Box, Typography, Card, CardContent } from "@mui/material";

function Instructions() {
  return (
    <Box sx={{ textAlign: "center", marginTop: 4 }}>
      <Typography variant="h5" gutterBottom>
        ¿Cómo descargar videos de Youtube?
      </Typography>

      <Box
        sx={{ display: "flex", justifyContent: "space-around", marginTop: 4 }}
      >
        {/* Paso 1 */}
        <Card sx={{ width: "30%", margin: 1 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              1. Copiar la URL de un video
            </Typography>
            <Typography variant="body2">
              Abra el video de Youtube en una nueva pestaña y copie su URL de la
              barra de direcciones del navegador. Seleccione el enlace completo
              y cópielo desde el menú contextual o el atajo de teclado CTRL + C
              para Windows o CMD + C en Mac.
            </Typography>
          </CardContent>
        </Card>

        {/* Paso 2 */}
        <Card sx={{ width: "30%", margin: 1 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              2. Pegue la URL en el campo de entrada
            </Typography>
            <Typography variant="body2">
              Pegue el enlace en el formulario, desde la parte superior de la
              página, y haga clic en el botón Descargar para ejecutar el
              proceso, por lo general, se inicia automáticamente.
            </Typography>
          </CardContent>
        </Card>

        {/* Paso 3 */}
        <Card sx={{ width: "30%", margin: 1 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              3. Haga clic en el botón de descarga
            </Typography>
            <Typography variant="body2">
              Una vez que los enlaces estén listos, la descarga comenzará.
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}

export default Instructions;
