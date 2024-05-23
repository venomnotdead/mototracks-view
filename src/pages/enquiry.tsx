import React, { useState, useEffect } from "react";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Autocomplete,
  DialogActions,
  DialogContent,
  Divider,
  Grid,
  TextField,
} from "@mui/material";
import { addDoc, getDocs } from "@/pages/api";
import { snackBarEvent } from "@/redux/actions";
import { useRouter } from "next/router";
import { collection } from "@/config/collectionName";
import { useDispatch, useSelector } from "react-redux";

const Enquiry = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const enquiryRef = collection.enquiryRef;
  const vehiclesRef = collection.vehicleRef;
  const [submit, setSubmit] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [vehiclesList, setVehiclesList] = useState([]);
  const [vehicleLoading, setVehicleLoading] = useState(true);
  const [newEnquiryData, setNewEnquiryData] = useState<any>({});
  const handleChange = (e: any) => {
    setNewEnquiryData({ ...newEnquiryData, [e.target.name]: e.target.value });
  };

  const getVehicleList = async () => {
    let data = await getDocs(vehiclesRef, {
      showRoomId: router?.query?.showRoomId,
    });
    setVehiclesList(data);
    setVehicleLoading(false);
  };

  useEffect(() => {
    if (router.query.showRoomId) {
      getVehicleList();
    }
  }, [router.query.showRoomId]);

  const handleSubmit = async () => {
    setSubmit(true);
    if (
      newEnquiryData.name &&
      newEnquiryData.contactNumber &&
      newEnquiryData.lastName
    ) {
      await addDoc(enquiryRef, {
        ...newEnquiryData,
        showRoomId: router?.query?.showRoomId,
        feedBacks: [],
        interested: true,
        dateCreated: new Date().getTime(),
      });
      setSubmitted(true);
      dispatch(
        snackBarEvent({
          open: true,
          message: "Enquiry created successfully",
          severity: "success",
        })
      );
    } else {
      dispatch(
        snackBarEvent({
          open: true,
          message: "Required data missing",
          severity: "error",
        })
      );
    }
  };

  return (
    <div>
      <Card>
        <DialogContent>
          <CardHeader title="Enter Details" />
          <Divider />
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Name"
                  placeholder="name"
                  value={newEnquiryData.name}
                  error={submit && !newEnquiryData.name}
                  onChange={handleChange}
                  name="name"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Surname"
                  error={submit && !newEnquiryData.lastName}
                  placeholder="last name"
                  value={newEnquiryData.lastName}
                  onChange={handleChange}
                  name="lastName"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Contact number"
                  placeholder="+91 9046573576"
                  error={submit && !newEnquiryData.contactNumber}
                  value={newEnquiryData.contactNumber}
                  onChange={handleChange}
                  type="number"
                  name="contactNumber"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="E-mail"
                  type="email"
                  placeholder="abcdef@gmail.com"
                  error={submit && !newEnquiryData.email}
                  value={newEnquiryData.email}
                  onChange={handleChange}
                  name="email"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={vehiclesList || []}
                  sx={{ width: "100%" }}
                  fullWidth
                  // multiple
                  onChange={(e, v: any) => {
                    setNewEnquiryData({
                      ...newEnquiryData,
                      vehicle: v?.name || "",
                    });
                  }}
                  getOptionKey={(e: any) => e._id}
                  getOptionLabel={(e: any) => e.name}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      error={submit && !newEnquiryData.vehicle}
                      label="Interested vehicle"
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={12}>
                <TextField
                  fullWidth
                  label="Address"
                  multiline
                  minRows={2}
                  placeholder="1 street, city..."
                  error={submit && !newEnquiryData.address}
                  value={newEnquiryData.address}
                  onChange={handleChange}
                  name="address"
                />
              </Grid>
            </Grid>
          </CardContent>
          <Divider />
          <DialogActions>
            <Button
              onClick={() => {
                setNewEnquiryData({});
              }}
            >
              Cancel
            </Button>
            <Button
              disabled={submitted}
              variant="contained"
              onClick={() => {
                handleSubmit();
              }}
            >
              Save
            </Button>
          </DialogActions>
        </DialogContent>
      </Card>
    </div>
  );
};

export default Enquiry;
