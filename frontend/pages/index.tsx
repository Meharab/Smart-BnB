import styles from "../styles/Home.module.css";
import AddRental from "../components/AddRental";
import Rentals from "../components/Rentals";
import { useSigner } from "wagmi";

export default function Home() {
  const { data: signer } = useSigner();
  if (!signer) return <></>;
  return (
    <div>
      <Rentals />
      <AddRental />
    </div>
  );
}
