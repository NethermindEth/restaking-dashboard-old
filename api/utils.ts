
export const supportedChains = ["eth", "goerli", "holesky"] as const;
export type Chain = (typeof supportedChains)[number];

export const supportedTimelines = ["1w", "1m", "1y", "full"] as const;
export type Timeline = (typeof supportedTimelines)[number];

export const supportedTokens = [
  "stEth",
  "cbEth",
  "rEth",
  "wBEth",
  "osEth",
  "swEth",
  "ankrEth",
  "ethX",
  "oEth",
  "sfrxEth",
  "lsEth",
  "mEth",
] as const;
export type SupportedToken = (typeof supportedTokens)[number];

export function getContractAddresses(chain: Chain): Record<SupportedToken, string | undefined> {
  switch (chain) {
    case "eth":
      return {
        stEth: "0xae7ab96520de3a18e5e111b5eaab095312d7fe84",
        cbEth: "0xbe9895146f7af43049ca1c1ae358b0541ea49704",
        rEth: "0xae78736cd615f374d3085123a210448e74fc6393",
        wBEth: "0xa2e3356610840701bdf5611a53974510ae27e2e1",
        osEth: "0xf1c9acdc66974dfb6decb12aa385b9cd01190e38",
        swEth: "0xf951e335afb289353dc249e82926178eac7ded78",
        ankrEth: "0xe95a203b1a91a908f9b9ce46459d101078c2c3cb",
        ethX: "0xa35b1b31ce002fbf2058d22f30f95d405200a15b",
        oEth: "0x856c4efb76c1d1ae02e20ceb03a2a6a08b0b8dc3",
        sfrxEth: "0xac3E018457B222d93114458476f3E3416Abbe38F",
        lsEth: "0x8c1BEd5b9a0928467c9B1341Da1D7BD5e10b6549",
        mEth: "0xd5F7838F5C461fefF7FE49ea5ebaF7728bB0ADfa",
      };
    case "goerli":
      return {
        stEth: "0x1643e812ae58766192cf7d2cf9567df2c37e9b7f",
        cbEth: undefined,
        rEth: "0x178e141a0e3b34152f73ff610437a7bf9b83267a",
        wBEth: "0xE7bCB9e341D546b66a46298f4893f5650a56e99E",
        osEth: undefined,
        swEth: undefined,
        ankrEth: "0x2bbc91e1990f0dc5e5bad04aae000ca97f56990f",
        ethX: "0x3338ecd3ab3d3503c55c931d759fa6d78d287236",
        oEth: undefined,
        sfrxEth: undefined,
        lsEth: "0x3ecCAdA3e11c1Cc3e9B5a53176A67cc3ABDD3E46",
        mEth: "0x20d7E093B3fa5eBfA7a0fa414FaD547743a2400F",
      };
    case "holesky":
      return {
        stEth: "0x3F1c547b21f65e10480dE3ad8E19fAAC46C95034",
        cbEth: "0x8720095Fa5739Ab051799211B146a2EEE4Dd8B37",
        rEth: "0x7322c24752f79c05ffd1e2a6fcb97020c1c264f1",
        wBEth: undefined,
        osEth: "0xF603c5A3F774F05d4D848A9bB139809790890864", // unofficial
        swEth: undefined,
        ankrEth: "0x8783c9c904e1bdc87d9168ae703c8481e8a477fd",
        ethX: "0xB4F5fc289a778B80392b86fa70A7111E5bE0F859", // unofficial
        oEth: "0xdbA64Bd5a0144E98c8dACB23b005d679b172dBba", // unofficial
        sfrxEth: "0xa63f56985F9C7F3bc9fFc5685535649e0C1a55f3", // unofficial
        lsEth: "0x1d8b30cC38Dba8aBce1ac29Ea27d9cFd05379A09",
        mEth: "0xe3C063B1BEe9de02eb28352b55D49D85514C67FF",
      }
    default:
      throw new Error(`Unknown network '${chain}'`);
  }
}

export function extractGroupedResponse(
  tokenAddresses: Record<SupportedToken, string | undefined>,
  groupedResponse: Record<string, any>
): Record<SupportedToken | "beacon", any> {
  return Object.fromEntries([
    ...Object.entries(tokenAddresses).map(([token, address]) => {
      if (address != null) {
        return [token, groupedResponse[address]];
      }
      return [token, null];
    }),
    ["beacon", groupedResponse["null"]],
  ]);
}

export const timelineToDays: Readonly<Record<Timeline, number>> = {
  "1w": 7,
  "1m": 30,
  "1y": 365,
  "full": Infinity,
};

export const startingEpochTimestamps: Readonly<Record<Chain, number>> = {
  "eth": 1606824023,
  "goerli": 1616508000,
  "holesky": 0,
}
