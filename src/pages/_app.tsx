import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { connectToDatabase } from "../lib/db";
import store from "@/redux/store";
import { Provider } from "react-redux";
import CustomSnackBar from "@/components/SnackBar/CustomSnackBar";

export async function getServerSideProps() {
  await connectToDatabase();

  return {
    props: {},
  };
}

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <Component {...pageProps} />
      <CustomSnackBar />
    </Provider>
  );
}
