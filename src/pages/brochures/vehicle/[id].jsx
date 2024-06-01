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
        `${process.env.NEXT_PUBLIC_VIEW_MOTOTRACKS_URL}brochures/vehicle/${router.query.id}?showRoomId=${router.query.showRoomId}`
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
    if (navigator?.share) {
      navigator
        ?.share({
          title: vehicleData.name,
          text: `Check out this brochure for ${vehicleData.name}!`,
          url: brochureUrl,
        })
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
      // getVehicleList();
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
              )}
              {vehicleLoading ? (
                <Skeleton variant="text" />
              ) : (
                `
                Available in ${vehicleData?.fuelType?.join(", ")}
                `
              )}
              {vehicleLoading ? (
                <Skeleton variant="text" />
              ) : (
                <div
                  dangerouslySetInnerHTML={{
                    __html:
                      "<style>img {  max-width: 100%;  height: auto;  display: block;  margin: 0 auto;}</style>" +
                      (description?.text || "<div>Summary</div>"),
                  }}
                />
              )}
            </CardContent>
            <CardContent>
              {vehicleLoading ? (
                <Skeleton variant="text" />
              ) : (
                offers?.data?.length &&
                offers.data
                  .filter((_) => _.some((a) => a))
                  .map((row, i) => {
                    return (
                      <div
                        key={i}
                        className={`tableRow ${i == 0 ? `tableHeader` : ""}`}
                        style={{
                          display: "flex",
                          justifyContent: "space-evenly",
                          width: "100%",
                        }}
                      >
                        {row
                          .filter((_) => _ != "")
                          .map((col, index) => {
                            return (
                              <div
                                style={{ width: `${100 / row.length + 1}%` }}
                                key={index}
                              >
                                {col}
                              </div>
                            );
                          })}
                      </div>
                    );
                  })
                  .filter(Boolean)
              )}
            </CardContent>
            <Divider sx={{ mt: 2 }} />
            <CardContent sx={{ mt: 2 }}>
              {vehicleLoading ? (
                <Skeleton variant="text" />
              ) : (
                pricingStructure?.data?.length &&
                pricingStructure.data
                  .filter((_) => _.some((a) => a))
                  .map((row, i) => {
                    return (
                      <div
                        key={i}
                        className={`tableRow ${i == 0 ? `tableHeader` : ""}`}
                        style={{
                          display: "flex",
                          justifyContent: "space-evenly",
                          width: "100%",
                        }}
                      >
                        {row.map((col, index) => {
                          return (
                            <div
                              key={index}
                              style={{ width: `${100 / row.length + 1}%` }}
                            >
                              {col}
                            </div>
                          );
                        })}
                      </div>
                    );
                  })
                  .filter(Boolean)
              )}
            </CardContent>
            <CardContent>
              {vehicleLoading ? (
                <Skeleton variant="text" />
              ) : (
                <div
                  dangerouslySetInnerHTML={{
                    __html:
                      "<style>img {  max-width: 100%;  height: auto;  display: block;  margin: 0 auto;}</style>" +
                      (summary?.data || "<div>Summary</div>"),
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
