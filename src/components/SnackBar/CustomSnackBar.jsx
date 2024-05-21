import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

const CustomSnackBar = () => {
  const data = useSelector((state) => state.snackBarData);
  const [open, setOpen] = useState(data);
  useEffect(()=>{setOpen(data)},[data]) 

  const handleClose = () => {
    setOpen({
      open: false,
      message: "",
      severity:''
    });
  };

  return (
    <Snackbar open={open.open} autoHideDuration={6000} onClose={handleClose}>
      <MuiAlert
        elevation={6}
        variant="filled"
        onClose={handleClose}
        severity={open.severity}
      >
        {open.message}
      </MuiAlert>
    </Snackbar>
  );
};

export default CustomSnackBar;
