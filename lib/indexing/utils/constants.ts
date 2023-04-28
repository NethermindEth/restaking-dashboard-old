
export const STRATEGY_MANAGER_ADDRESS = "0x779d1b5315df083e3F9E94cB495983500bA8E907";
export const EIGEN_POD_MANAGER_ADDRESS = "0xa286b84C96aF280a49Fe1F40B9627C2A2827df41";
export const STETH_STRATEGY_ADDRESS = "0xB613E78E2068d7489bb66419fB1cfa11275d14da";
export const RETH_STRATEGY_ADDRESS = "0x879944A8cB437a5f8061361f82A6d4EED59070b5";
export const RETH_ADDRESS = "0x178E141a0E3b34152f73Ff610437A7bf9B83267A";
export const STETH_ADDRESS = "0x1643E812aE58766192Cf7D2Cf9567dF2C37e9B7F";

// from https://github.com/Layr-Labs/eigenlayer-contracts/blob/master/script/output/M1_deployment_goerli_2023_3_23.json
export const INDEXING_START_BLOCK = 8705851;

// this depends on the provider's own limits for getLogs, but 2k seems like a
// good value to agnostically avoid any limit issues
export const INDEXING_BLOCK_CHUNK_SIZE = 2_000;