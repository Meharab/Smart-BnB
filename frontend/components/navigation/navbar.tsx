import { ConnectButton } from "@rainbow-me/rainbowkit";
import styles from "../../styles/Navbar.module.css";
import UserRentals from "../UserRentals";
import { useSigner } from "wagmi";
export default function Navbar() {
  const { data: signer } = useSigner();
  return (
    <nav className={styles.navbar}>
      <img className={styles.smartbnb_logo} src="/smartbnb-logo.svg"></img>
      {signer && <UserRentals />}
      <ConnectButton />
    </nav>
  );
}
