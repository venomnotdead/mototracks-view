import Head from "next/head";
import { useRouter } from "next/router";
import { getDoc, getDocs } from "@/pages/api";
import React, { useState, useEffect } from "react";
import { collection } from "@/config/collectionName";
import { useDispatch, useSelector } from "react-redux";
import { Icon } from "@iconify/react";
import QRCode from "react-qr-code";
import { snackBarEvent } from "@/redux/actions";
import {
  Box,
  CardActions,
  CardHeader,
  Divider,
  Skeleton,
  TextField,
  styled,
} from "@mui/material";
import {
  Container,
  Typography,
  Grid,
  Card,
  Dialog,
  CardContent,
  IconButton,
  Button,
} from "@mui/material";
import { formattedString } from "@/components/stringOperations";

const Index = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const vehiclesRef = collection.vehicleRef;
  const showroomRef = collection.showRoomRef;
  const [description, setDescription] = useState({});
  const [pricingStructure, setPricingStructure] = useState([]);
  const [offers, setOffers] = useState([]);
  const [showroomLoading, setShowroomLoading] = useState(true);
  const [vehicleListLoading, setVehicleListLoading] = useState(true);
  const [vehicleLoading, setVehicleLoading] = useState(true);
  const [summary, setSummary] = useState([]);
  const [brochureUrl, setBrochureUrl] = useState();
  const [vehiclesList, setVehiclesList] = useState([]);
  const [showroomData, setShowroomData] = useState({});
  const [vehicleData, setVehicleData] = useState({});
  const [showroomId, setShowroomId] = useState("");
  const [qrDialog, setQrDialog] = useState(false);
  const [downloading, setDownloading] = useState(false);
  // const permissionData = useSelector((state) => state.permissionData);
  const [defaultDialog, setDefaultDialog] = useState(true);

  useEffect(() => {
    if (router?.query?.id) {
      setShowroomId(router.query.showRoomId);
      getVehicleData();
      setBrochureUrl(
        `${process.env.NEXT_PUBLIC_VIEW_MOTOTRACKS_URL}brochure/vehicle/${router.query.id}?showRoomId=${showroomData._id}`
      );
    }
  }, [router?.query]);

  const getShowroomData = async () => {
    let data = await getDoc(showroomRef, showroomId);
    setShowroomData(data);
    setShowroomLoading(false);
  };

  const handleDownload = async () => {
    setDownloading(true);
    const html2pdf = (await import("html2pdf.js/dist/html2pdf.js")).default;
    const element = document.getElementById("page");
    const pdfOptions = {
      margin: 10,
      filename: `${vehicleData?.name}-${showroomData?.showroomName}.pdf`,
      image: { type: "jpeg", quality: 1 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    };
    html2pdf()
      .from(element)
      .set(pdfOptions)
      .save()
      .then(async (r) => {
        setDownloading(false);
      });
  };

  const shareContent = () => {
    if (navigator.share) {
      navigator
        .share({
          title: vehicleInfo.name,
          text: `Check out this brochure for ${vehicleInfo.name}!`,
          url: brochureUrl,
        })
        .then(() => console.log("Successfully shared"))
        .catch((error) => {
          navigator.clipboard.writeText(brochureUrl);
          dispatch(
            snackBarEvent({
              open: true,
              message: "Copied link successfully",
              severity: "success",
            })
          );
        });
    } else {
      navigator.clipboard.writeText(brochureUrl);
      dispatch(
        snackBarEvent({
          open: true,
          message: "Copied link successfully",
          severity: "success",
        })
      );
    }
  };

  const getVehicleData = async () => {
    let data = await getDoc(vehiclesRef, router.query.id);
    setVehicleData(data);
    setVehicleLoading(false);
    if (data?.brochureData?.length > 0) {
      for (let i = 0; i < data?.brochureData?.length; i++) {
        switch (data?.brochureData[i]?.type) {
          case "description":
            setDescription(data?.brochureData[i]);
            break;
          case "offers":
            setOffers(data?.brochureData[i]);
            break;
          case "pricingStructure":
            setPricingStructure(data?.brochureData[i]);
            break;
          case "summary":
            setSummary(data?.brochureData[i]);
            break;
          default:
            break;
        }
      }
    }
  };

  const getVehicleList = async () => {
    let data = await getDocs(vehiclesRef, { showRoomId: showroomId });
    setVehiclesList(data);
    setVehicleListLoading(false);
  };

  useEffect(() => {
    if (showroomId) {
      getShowroomData(showroomId);
      getVehicleList();
    }
  }, [showroomId]);

  return (
    <>
      <Head>
        <title>{vehicleData?.name || "Vehicle"}</title>
      </Head>

      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          padding: "10px",
        }}
      >
        <div>
          <IconButton
            onClick={() => {
              shareContent();
            }}
          >
            <Icon icon="ic:baseline-share" width="24" height="24" />
          </IconButton>
          <IconButton onClick={() => setQrDialog(true)}>
            <Icon icon="bx:qr" width="24" height="24" />
          </IconButton>
          {downloading ? (
            <IconButton>
              <Icon
                icon="line-md:loading-twotone-loop"
                width="24"
                height="24"
              />
            </IconButton>
          ) : (
            <IconButton onClick={() => handleDownload()}>
              <Icon icon="material-symbols:download" width="24" height="24" />
            </IconButton>
          )}
        </div>
      </div>
      <Container id="page">
        <Card>
          <Container>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "20px",
              }}
            >
              {vehicleLoading ? (
                <Skeleton variant="text" />
              ) : (
                <Typography variant="h5">{vehicleData?.name}</Typography>
              )}
            </div>
            <Divider />
            <CardContent>
              {vehicleLoading ? (
                <Skeleton variant="text" />
              ) : (
                formattedString(vehicleData?.price)
              )}{" "}
              Available in {vehicleData?.fuelType?.join(", ")}
              {vehicleLoading ? (
                <Skeleton variant="text" />
              ) : (
                <div
                  dangerouslySetInnerHTML={{
                    __html: description?.text || "<div>Summary</div>",
                  }}
                />
              )}
            </CardContent>
            <CardContent>
              {vehicleLoading ? (
                <Skeleton variant="text" />
              ) : (
                <div
                  dangerouslySetInnerHTML={{
                    __html: summary?.data || "<div>Summary</div>",
                  }}
                />
              )}
            </CardContent>
          </Container>
        </Card>
        <div>
          <footer>
            {/* Footer Section */}
            <Typography variant="body2" align="center" gutterBottom>
              © {new Date().getFullYear()} {showroomData.showroomName}. All
              rights reserved.
            </Typography>
            <Grid container justifyContent="center" spacing={2}>
              <Grid item>
                <Typography
                  variant="body2"
                  color="inherit"
                  sx={{ display: "flex", alignItems: "center" }}
                >
                  <Icon icon="material-symbols:call" width="24" height="24" />{" "}
                  {showroomData.showroomContact}
                </Typography>
              </Grid>
              <Grid item>
                <Typography
                  variant="body2"
                  color="inherit"
                  sx={{ display: "flex", alignItems: "center" }}
                >
                  <Icon icon="ic:outline-email" width="24" height="24" />{" "}
                  {showroomData.showroomEmail}
                </Typography>
              </Grid>
              <Grid item>
                <Typography
                  variant="body2"
                  color="inherit"
                  sx={{ display: "flex", alignItems: "center" }}
                >
                  <Icon icon="iconamoon:options" width="24" height="24" />{" "}
                  {showroomData?.showroomCategory?.join(", ")}
                </Typography>
              </Grid>
              <Grid item>
                <Typography
                  variant="body2"
                  color="inherit"
                  sx={{ display: "flex", alignItems: "center" }}
                >
                  <Icon icon="akar-icons:location" width="24" height="24" />{" "}
                  {showroomData.showroomAddress}
                </Typography>
              </Grid>
            </Grid>
          </footer>
        </div>
      </Container>
      <Dialog open={qrDialog} onClose={() => setQrDialog(false)}>
        <div id="qrCode">
          <CardContent>
            <Typography
              variant="h6"
              color={"primary"}
              textAlign={"center"}
              gutterBottom
            >
              {showroomData?.showroomName}
            </Typography>
            <Typography
              variant="body2"
              color={"gray"}
              textAlign={"center"}
              gutterBottom
            >
              {showroomData?.showroomAddress}
            </Typography>
            <QRCode fgColor="#3f51b5" value={brochureUrl} />
            <Typography
              variant="h6"
              color={"primary"}
              textAlign={"center"}
              gutterBottom
            >
              Scan to get details
            </Typography>
          </CardContent>
        </div>
      </Dialog>
    </>
  );
};

export default Index;