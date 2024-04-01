import { ethers } from "ethers";
import {
  TokenNetworkInfo,
  SupportedNetwork,
  SupportedToken,
  TokenInfo,
  TokenRecord,
  SupportedTimeline,
  SupportedTimeRange,
} from "@/app/utils/types";

export const MAX_LEADERBOARD_SIZE = 50;
export const DEFAULT_TIMELINE: SupportedTimeline = "1y";
export const DEFAULT_TIME_RANGE: SupportedTimeRange = "daily";

if (process.env.NEXT_PUBLIC_MAINNET_RPC_URL === undefined) {
  throw new Error("NEXT_PUBLIC_MAINNET_RPC_URL env variable not set");
}

export const ETH_MAINNET_PROVIDER = new ethers.JsonRpcProvider(
  process.env.NEXT_PUBLIC_MAINNET_RPC_URL,
);

if (process.env.NEXT_PUBLIC_GOERLI_RPC_URL === undefined) {
  throw new Error("NEXT_PUBLIC_GOERLI_RPC_URL env variable not set");
}

export const GOERLI_PROVIDER = new ethers.JsonRpcProvider(
  process.env.NEXT_PUBLIC_GOERLI_RPC_URL,
);

if (process.env.NEXT_PUBLIC_HOLESKY_RPC_URL === undefined) {
  throw new Error("NEXT_PUBLIC_HOLESKY_RPC_URL env variable not set");
}

export const HOLESKY_PROVIDER = new ethers.JsonRpcProvider(
  process.env.NEXT_PUBLIC_HOLESKY_RPC_URL,
);

export function getNetworkProvider(network: SupportedNetwork) {
  switch (network) {
    case "eth":
      return ETH_MAINNET_PROVIDER;
    case "goerli":
      return GOERLI_PROVIDER;
    case "holesky":
      return HOLESKY_PROVIDER;
    default:
      throw Error("Invalid network");
  }
};

export const TOKEN_INFO: TokenRecord<TokenInfo> = {
  stEth: {
    classId: "steth",
    label: "stETH",
    image: "/steth_logo.webp",
    color: "#4fa1fa",
  },
  rEth: {
    classId: "reth",
    label: "rETH",
    image: "/reth.webp",
    color: "#ee9d83",
  },
  cbEth: {
    classId: "cbeth",
    label: "cbETH",
    image: "/cbeth.png",
    color: "#2a54f8",
  },
  wBEth: {
    classId: "wbeth",
    label: "wBETH",
    image: "/wbeth.png",
    color: "#ecc946",
  },
  osEth: {
    classId: "oseth",
    label: "osETH",
    image: "/oseth.png",
    color: "#345b89",
  },
  swEth: {
    classId: "sweth",
    label: "swETH",
    image: "/sweth.png",
    color: "#273ba5",
  },
  ankrEth: {
    classId: "ankreth",
    label: "AnkrETH",
    image: "/ankreth.png",
    color: "#fae84a",
  },
  ethX: {
    classId: "ethx",
    label: "ETHx",
    image: "/ethx.png",
    color: "#182428",
  },
  oEth: {
    classId: "oeth",
    label: "OETH",
    image: "/oeth.png",
    color: "#3874ea",
  },
  sfrxEth: {
    classId: "sfrxeth",
    label: "sfrxETH",
    image: "/sfrxeth.png",
    color: "#000000",
  },
  lsEth: {
    classId: "lseth",
    label: "LsETH",
    image: "/lseth.png",
    color: "#dde47f",
  },
  mEth: {
    classId: "meth",
    label: "mETH",
    image: "/meth.png",
    color: "#731916",
  },
  beacon: {
    classId: "beacon",
    label: "Native ETH",
    image: "/beaconChainETH.png",
    color: "#aad782",
  },
};

export const NETWORK_TOKEN_INFO: Record<SupportedNetwork, Partial<TokenRecord<TokenNetworkInfo>>> = {
  "eth": {
    stEth: {
      strategyAddress: "0x93c4b944D05dfe6df7645A86cd2206016c51564D",
      address: "0xae7ab96520de3a18e5e111b5eaab095312d7fe84",
    },
    rEth: {
      strategyAddress: "0x1BeE69b7dFFfA4E2d53C2a2Df135C388AD25dCD2",
      address: "0xae78736Cd615f374D3085123A210448E74Fc6393",
    },
    cbEth: {
      strategyAddress: "0x54945180dB7943c0ed0FEE7EdaB2Bd24620256bc",
      address: "0xBe9895146f7AF43049ca1c1AE358B0541Ea49704",
    },
    wBEth: {
      strategyAddress: "0x7CA911E83dabf90C90dD3De5411a10F1A6112184",
      address: "0xa2E3356610840701BDf5611a53974510Ae27E2e1",
    },
    osEth: {
      strategyAddress: "0x57ba429517c3473B6d34CA9aCd56c0e735b94c02",
      address: "0xf1C9acDc66974dFB6dEcB12aA385b9cD01190E38",
      feed: "0x8023518b2192FB5384DAdc596765B3dD1cdFe471",
    },
    swEth: {
      strategyAddress: "0x0Fe4F44beE93503346A3Ac9EE5A26b130a5796d6",
      address: "0xf951E335afb289353dc249e82926178EaC7DEd78",
    },
    ankrEth: {
      strategyAddress: "0x13760F50a9d7377e4F20CB8CF9e4c26586c658ff",
      address: "0xE95A203B1a91a908F9B9CE46459d101078c2c3cb",
    },
    ethX: {
      strategyAddress: "0x9d7eD45EE2E8FC5482fa2428f15C971e6369011d",
      address: "0xA35b1B31Ce002FBF2058D22F30f95D405200A15b",
      feed: "0xcf5EA1b38380f6aF39068375516Daf40Ed70D299",
    },
    oEth: {
      strategyAddress: "0xa4C637e0F704745D182e4D38cAb7E7485321d059",
      address: "0x856c4Efb76C1D1AE02e20CEB03A2A6a08b0b8dC3",
    },
    sfrxEth: {
      strategyAddress: "0x8CA7A5d6f3acd3A7A8bC468a8CD0FB14B6BD28b6",
      address: "0xac3E018457B222d93114458476f3E3416Abbe38F",
    },
    lsEth: {
      strategyAddress: "0xAe60d8180437b5C34bB956822ac2710972584473",
      address: "0x8c1BEd5b9a0928467c9B1341Da1D7BD5e10b6549",
    },
    mEth: {
      strategyAddress: "0x298aFB19A105D59E74658C4C334Ff360BadE6dd2",
      address: "0xd5F7838F5C461fefF7FE49ea5ebaF7728bB0ADfa",
      feed: "0xe3cBd06D7dadB3F4e6557bAb7EdD924CD1489E8f",
    },
    beacon: {
      strategyAddress: ethers.ZeroAddress as `0x${string}`,
      address: ethers.ZeroAddress as `0x${string}`,
    },
  },
  "goerli": {
    stEth: {
      strategyAddress: "0xB613E78E2068d7489bb66419fB1cfa11275d14da",
      address: "0x1643e812ae58766192cf7d2cf9567df2c37e9b7f",
    },
    rEth: {
      strategyAddress: "0x879944A8cB437a5f8061361f82A6d4EED59070b5",
      address: "0x178e141a0e3b34152f73ff610437a7bf9b83267a",
    },
    wBEth: {
      strategyAddress: "0xD89dc4C40d901D4622C203Fb8808e6e7C7fcE164",
      address: "0xE7bCB9e341D546b66a46298f4893f5650a56e99E",
    },
    ankrEth: {
      strategyAddress: "0x98b47798B68b734af53c930495595729E96cdB8E",
      address: "0x2bBC91e1990F0dc5e5BAD04AaE000Ca97f56990f",
    },
    ethX: {
      strategyAddress: "0x5d1E9DC056C906CBfe06205a39B0D965A6Df7C14",
      address: "0x3338eCd3ab3d3503c55c931d759fA6d78d287236",
      feed: "0xd0e400Ec6Ed9C803A9D9D3a602494393E806F823",
    },
    lsEth: {
      strategyAddress: "0xa9DC3c93ae59B8d26AF17Ae63c96Be78793537A9",
      address: "0x3ecCAdA3e11c1Cc3e9B5a53176A67cc3ABDD3E46",
    },
    mEth: {
      strategyAddress: "0x1755d34476BB4DaEd726ee4a81E8132dF00F9b14",
      address: "0x20d7E093B3fa5eBfA7a0fa414FaD547743a2400F",
      feed: "0x307770388c483BF225DCbe55EE5BA8b9d0bC5C1d",
    },
    beacon: {
      strategyAddress: ethers.ZeroAddress as `0x${string}`,
      address: ethers.ZeroAddress as `0x${string}`,
    },
  },
  "holesky": {
    ankrEth: {
      strategyAddress: "0x7673a47463F80c6a3553Db9E54c8cDcd5313d0ac",
      address: "0x8783c9c904e1bdc87d9168ae703c8481e8a477fd"
    },
    cbEth: {
      strategyAddress: "0x70EB4D3c164a6B4A5f908D4FBb5a9cAfFb66bAB6",
      address:"0x8720095Fa5739Ab051799211B146a2EEE4Dd8B37"
    },
    ethX: {
      strategyAddress: "0x31B6F59e1627cEfC9fA174aD03859fC337666af7",
      address: "0xB4F5fc289a778B80392b86fa70A7111E5bE0F859",
      feed: "0x7F09ceb3874F5E35Cd2135F56fd4329b88c5d119"
    },
    lsEth: {
      strategyAddress: "0x05037A81BD7B4C9E0F7B430f1F2A22c31a2FD943",
      address: "0x1d8b30cC38Dba8aBce1ac29Ea27d9cFd05379A09"
    },
    mEth: {
      strategyAddress: "0xaccc5A86732BE85b5012e8614AF237801636F8e5",
      address: "0xe3C063B1BEe9de02eb28352b55D49D85514C67FF",
      feed: "0xbe16244EAe9837219147384c8A7560BA14946262"
    },
    osEth: {
      strategyAddress: "0x46281E3B7fDcACdBa44CADf069a94a588Fd4C6Ef",
      address: "0xF603c5A3F774F05d4D848A9bB139809790890864",
      feed: "0x030dB3BdF04Ae498078e2E167945f13ae73eAdD8"
    },
    rEth: {
      strategyAddress: "0xf5ea7BC413da13dBF9b67531472e7fbd899cA513",
      address:"0x7322c24752f79c05ffd1e2a6fcb97020c1c264f1"
    },
    sfrxEth: {
      strategyAddress: "0x9281ff96637710Cd9A5CAcce9c6FAD8C9F54631c",
      address: "0xa63f56985F9C7F3bc9fFc5685535649e0C1a55f3"
    },
    stEth: {
      strategyAddress: "0x1354B44F4dAcFDE30b51954dB62EA7C66E553F3E",
      address: "0x3F1c547b21f65e10480dE3ad8E19fAAC46C95034"
    },
    beacon: {
      strategyAddress: ethers.ZeroAddress as `0x${string}`,
      address: ethers.ZeroAddress as `0x${string}`,
    }
  }
};

export function getTokenInfo(token: SupportedToken) {
  return TOKEN_INFO[token];
}

export function getTokenNetworkInfo(network: SupportedNetwork, token: SupportedToken) {
  return NETWORK_TOKEN_INFO[network][token];
}

export function getNetworkTokens(network: SupportedNetwork): SupportedToken[] {
  return Object.keys(NETWORK_TOKEN_INFO[network]) as SupportedToken[];
}

export function getNetworkStrategyTokens(network: SupportedNetwork): SupportedToken[] {
  return getNetworkTokens(network).filter(token => token !== "beacon");
}
