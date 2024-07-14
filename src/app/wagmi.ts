import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { arbitrumSepolia, celoAlfajores, rootstockTestnet } from "wagmi/chains";

const walletConnectProjectId = "31b7a6907dcc1be39c4d4ca7e4ed20b1";

export const config = getDefaultConfig({
  appName: "savesquad",
  projectId: walletConnectProjectId,
  chains: [arbitrumSepolia, celoAlfajores, rootstockTestnet],
});
