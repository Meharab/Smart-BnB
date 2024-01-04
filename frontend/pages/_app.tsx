import "../styles/globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { createClient, useAccount, WagmiConfig } from "wagmi";
import MainLayout from "../layout/mainLayout";
import { getChainsConfig } from "../assets/utils";
import { useRouter } from "next/router";
import { NotificationProvider } from "@web3uikit/core";

const { chains, provider } = getChainsConfig(process.env.ALCHEMY_API_KEY);

const { connectors } = getDefaultWallets({
  appName: "SmartBnb",
  chains,
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});

export { WagmiConfig, RainbowKitProvider };

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const account = useAccount({
    onConnect({ address, connector, isReconnected }) {
      if (!isReconnected) router.reload();
    },
    onDisconnect() {
      router.reload();
    },
  });
  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider modalSize="compact" chains={chains}>
        <NotificationProvider>
          <MainLayout>
            <Component {...pageProps} />
          </MainLayout>
        </NotificationProvider>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

export default MyApp;
