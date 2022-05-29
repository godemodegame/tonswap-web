import styled from "@emotion/styled";
import { Box, Button, IconButton, Typography } from "@mui/material";
import QRCode from "react-qr-code";
import Fade from "@mui/material/Fade";
import CircularProgress from "@mui/material/CircularProgress";
import Title from "./Title";

const StyledContainer = styled(Box)({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: "20px",
  position: "absolute",
  left: "50%",
  top: "50%",
  transform: "translate(-50%, -50%)",
  background: "white",
});



const StyledQrBox = styled(Box)({
  width: "260px",
  height: "300px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

interface Props {
  onClose: () => void;
  link?: string;
  open: boolean;
}

function QR({ onClose, link, open }: Props) {


  return (
    <Fade in={open}>
     
        <StyledContainer>
         <Title onClose={onClose} text='Connect Tonhub' />
          <StyledQrBox>
            {link ? (
              <Fade in={true}>
                <Box>
                  <QRCode
                    style={{ width: "100%", height: "100%" }}
                    value={link}
                  />
                </Box>
              </Fade>
            ) : (
              <CircularProgress />
            )}
          </StyledQrBox>
        </StyledContainer>
    </Fade>
  );
}

export default QR;
