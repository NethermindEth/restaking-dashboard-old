import {
  CBETH_ADDRESS,
  CBETH_STRATEGY_ADDRESS,
  MAX_LEADERBOARD_SIZE,
  RETH_ADDRESS,
  RETH_STRATEGY_ADDRESS,
  STETH_STRATEGY_ADDRESS,
  networkTokens,
  provider,
} from "./constants";
import {
  RocketTokenRETH__factory,
  StakedTokenV1__factory,
  StrategyBaseTVLLimits__factory,
} from "@/typechain";
import {
  LeaderboardUserData,
  Deposits,
  Withdrawals,
  extractAmountsAndTimestamps,
  DepositStakers,
} from "@/lib/utils";
import axios from "axios";
import { ethers } from "ethers";

const getProvider = (url: string) => new ethers.JsonRpcProvider(url);

export async function getDashboardData(network?: string) {
  const {
    depositData,
    withdrawData,
    totalStakedBeaconChainEth,
    stakersBeaconChainEth,
    depositStakersData,
  } = await fetchData(network);

  const {
    chartDataDepositsDaily,
    chartDataDepositsCumulative,
    chartDataBeaconStakesDaily,
    chartDataBeaconStakesCumulative,
    chartDataWithdrawalsDaily,
    chartDataWithdrawalsCumulative,
    stEthStakers,
    cbEthStakers,
    rEthStakers,
  } = generateChartData(depositData, withdrawData, depositStakersData);

  const { pieChartData, tvls } = await getRates(
    { stEthStakers, cbEthStakers, rEthStakers },
    stakersBeaconChainEth,
    network || "eth"
  );

  return {
    chartDataDepositsDaily,
    chartDataDepositsCumulative,
    chartDataWithdrawalsDaily,
    chartDataWithdrawalsCumulative,
    totalStakedBeaconChainEth,
    pieChartData,
    tvls,
    chartDataBeaconStakesDaily,
    chartDataBeaconStakesCumulative,
  };
}

async function fetchData(network?: string) {
  const depositDataPromise = axios.get<Deposits>(
    `${process.env.NEXT_PUBLIC_SPICE_PROXY_API_URL}/deposits`,
    {
      params: {
        chain: network,
      },
    }
  );

  const withdrawDataPromise = axios.get<Withdrawals>(
    `${process.env.NEXT_PUBLIC_SPICE_PROXY_API_URL}/withdrawals`,
    {
      params: {
        chain: network,
      },
    }
  );

  const depositStakersDataPromise = axios.get(
    `${process.env.NEXT_PUBLIC_SPICE_PROXY_API_URL}/getStrategyDepositLeaderBoard`,
    {
      params: {
        chain: network,
      },
    }
  );

  const totalStakedBeaconChainEthPromise = axios.get(
    `${process.env.NEXT_PUBLIC_SPICE_PROXY_API_URL}/totalStakedBeaconChainEth`,
    {
      params: {
        chain: network,
      },
    }
  );

  const stakersBeaconChainEthPromise = axios.get(
    `${process.env.NEXT_PUBLIC_SPICE_PROXY_API_URL}/stakersBeaconChainEth`,
    {
      params: {
        chain: network,
      },
    }
  );

  const [
    depositDataResponse,
    withdrawDataResponse,
    totalStakedBeaconResponse,
    stakersBeaconChainEthResponse,
    depositStakersDataResponse,
  ] = await Promise.all([
    depositDataPromise,
    withdrawDataPromise,
    totalStakedBeaconChainEthPromise,
    stakersBeaconChainEthPromise,
    depositStakersDataPromise,
  ]);

  const depositData = depositDataResponse.data;
  const withdrawData = withdrawDataResponse.data;

  const totalStakedBeaconChainEth =
    totalStakedBeaconResponse.data[0].final_balance;

  const stakersBeaconChainEth = stakersBeaconChainEthResponse.data;
  const depositStakersData = depositStakersDataResponse.data;

  return {
    depositData,
    withdrawData,
    totalStakedBeaconChainEth,
    stakersBeaconChainEth,
    depositStakersData,
  };
}

function generateChartData(
  depositData: Deposits,
  withdrawData: Withdrawals,
  depositStakersData: DepositStakers
) {
  const chartDataDepositsDaily = extractAmountsAndTimestamps(
    false,
    depositData.stEthDeposits || [],
    depositData.rEthDeposits || [],
    depositData.cbEthDeposits || []
  );

  const chartDataDepositsCumulative = extractAmountsAndTimestamps(
    true,
    depositData.stEthDeposits || [],
    depositData.rEthDeposits || [],
    depositData.cbEthDeposits || []
  );

  // all bool values herafter are for test purpose only for now
  const chartDataBeaconStakesDaily = extractAmountsAndTimestamps(
    false,
    depositData.beaconChainDeposits || []
  );

  const chartDataBeaconStakesCumulative = extractAmountsAndTimestamps(
    true,
    depositData.beaconChainDeposits || []
  );

  const chartDataWithdrawalsDaily = extractAmountsAndTimestamps(
    false,
    withdrawData.stEthWithdrawals || [],
    withdrawData.rEthWithdrawals || [],
    withdrawData.cbEthWithdrawals || []
  );

  const chartDataWithdrawalsCumulative = extractAmountsAndTimestamps(
    true,
    withdrawData.stEthWithdrawals || [],
    withdrawData.rEthWithdrawals || [],
    withdrawData.cbEthWithdrawals || []
  );

  const stEthStakers = depositStakersData.stEthDeposits || [];

  const cbEthStakers = depositStakersData.cbEthDeposits || [];

  const rEthStakers = depositStakersData.rEthDeposits || [];

  return {
    chartDataDepositsDaily,
    chartDataDepositsCumulative,
    chartDataBeaconStakesDaily,
    chartDataBeaconStakesCumulative,
    chartDataWithdrawalsDaily,
    chartDataWithdrawalsCumulative,
    stEthStakers,
    cbEthStakers,
    rEthStakers,
  };
}

async function getRates(stakersData, stakersBeaconChainEth, network: string) {
  const networkData = networkTokens(network);
  const provider = getProvider(networkData.url || "");

  // Object.entries(networkData).map((key, value) => {});

  const groupedStakersInfo = await Object.entries(
    networkTokens(network).tokens
  ).reduce(async (accPromise, [tokenKey, tokenData]) => {
    const acc = await accPromise;
    const token = RocketTokenRETH__factory.connect(RETH_ADDRESS, provider);

    const tokenRate =
      tokenKey === "stEth" ? 1 : Number(await token.getExchangeRate()) / 1e18;

    const tokenStrategy = StrategyBaseTVLLimits__factory.connect(
      tokenData.STRATEGY_ADDRESS,
      provider
    );

    const tokenSharesRate =
      Number(await tokenStrategy.sharesToUnderlyingView(BigInt(1e18))) / 1e18;

    const tokenTvl =
      Number(
        await tokenStrategy.sharesToUnderlyingView(
          await tokenStrategy.totalShares()
        )
      ) / 1e18;

    const stakersTokenConverted: LeaderboardUserData[] = stakersData[
      `${tokenKey}Stakers`
    ].map((d) => ({
      depositor: d.depositor,
      totalStaked: d.total_shares * tokenSharesRate * tokenRate,
    }));

    acc.push({
      stakersTokenConverted,
      tvl: [tokenKey, tokenTvl],
      label: tokenData.pieChartLabel,
    });

    return acc;
  }, Promise.resolve([]));

  const stakersBeaconChainEthConverted: LeaderboardUserData[] =
    // @ts-ignore
    stakersBeaconChainEth.map((d) => {
      return {
        depositor: d.pod_owner,
        totalStaked: parseInt(d.total_effective_balance),
      };
    });

  const stakersCombined = groupedStakersInfo.map(
    (value) => value.stakersTokenConverted
  );

  const labels = groupedStakersInfo.map((value) => value.label);
  const tvls = groupedStakersInfo.reduce((acc, value) => {
    acc[value.tvl[0]] = value.tvl[1];
    return acc;
  }, {});

  console.log(stakersCombined, labels, tvls);

  const groupedStakers = [stakersCombined, stakersBeaconChainEthConverted]
    .reduce((acc, cur) => {
      const existingDepositor = acc.find(
        (d: LeaderboardUserData) => d.depositor === cur.depositor
      );
      existingDepositor
        ? (existingDepositor.totalStaked += cur.totalStaked)
        : acc.push({ ...cur });
      return acc;
    }, [] as LeaderboardUserData[])
    .sort((a, b) => b.totalStaked - a.totalStaked)
    .slice(0, MAX_LEADERBOARD_SIZE);

  const pieChartData = {
    labels,
    amounts: [...groupedStakers, ...stakersCombined],
  };

  return {
    pieChartData,
    tvls,
  };
}
