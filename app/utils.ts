import {
  CBETH_ADDRESS,
  CBETH_STRATEGY_ADDRESS,
  MAX_LEADERBOARD_SIZE,
  RETH_ADDRESS,
  RETH_STRATEGY_ADDRESS,
  STETH_STRATEGY_ADDRESS,
  networkTokens,
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

function getProvider(url: string) {
  return new ethers.JsonRpcProvider(url);
}

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
    stakersStEth,
    stakersCbEth,
    stakersREth,
  } = generateChartData(depositData, withdrawData, depositStakersData);

  const {
    stEthSharesRate,
    rEthSharesRate,
    cbEthSharesRate,
    cbEthRate,
    rEthRate,
    stEthTvl,
    rEthTvl,
    cbEthTvl,
  } = await getRates(network);

  const stakersBeaconChainEthConverted: LeaderboardUserData[] =
    // @ts-ignore
    stakersBeaconChainEth.map((d) => {
      return {
        depositor: d.pod_owner,
        totalStaked: parseInt(d.total_effective_balance),
      };
    });

  const stakersREthConverted: LeaderboardUserData[] = stakersREth.map((d) => ({
    depositor: d.depositor,
    totalStaked: d.total_shares * rEthSharesRate * rEthRate,
  }));

  const stakersStEthConverted: LeaderboardUserData[] = stakersStEth.map(
    (d) => ({
      depositor: d.depositor,
      totalStaked: d.total_shares * stEthSharesRate,
    })
  );

  const stakersCbEthConverted: LeaderboardUserData[] = stakersCbEth.map(
    (d) => ({
      depositor: d.depositor,
      totalStaked: d.total_shares! * cbEthSharesRate * cbEthRate,
    })
  );

  const groupedStakers = [
    ...stakersBeaconChainEthConverted,
    ...stakersStEthConverted,
    ...stakersREthConverted,
    ...stakersCbEthConverted,
  ]
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

  return {
    rEthTvl,
    stEthTvl,
    cbEthTvl,
    chartDataDepositsDaily,
    chartDataDepositsCumulative,
    chartDataWithdrawalsDaily,
    chartDataWithdrawalsCumulative,
    totalStakedBeaconChainEth,
    stakersBeaconChainEthConverted,
    stakersREthConverted,
    stakersStEthConverted,
    stakersCbEthConverted,
    groupedStakers,
    rEthRate,
    cbEthRate,
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

  const stakersStEth = depositStakersData.stEthDeposits || [];

  const stakersCbEth = depositStakersData.cbEthDeposits || [];

  const stakersREth = depositStakersData.rEthDeposits || [];

  return {
    chartDataDepositsDaily,
    chartDataDepositsCumulative,
    chartDataBeaconStakesDaily,
    chartDataBeaconStakesCumulative,
    chartDataWithdrawalsDaily,
    chartDataWithdrawalsCumulative,
    stakersStEth,
    stakersCbEth,
    stakersREth,
  };
}

async function getRates(network = "eth") {
  const networks = networkTokens(network);

  const provider = getProvider(networks.url);
  const networkToken = networks.tokens;

  const rEth = networkToken["rEth"]
    ? RocketTokenRETH__factory.connect(networkToken["rEth"].address, provider)
    : null;
  console.log(rEth);
  const rEthRate = rEth ? Number(await rEth.getExchangeRate()) / 1e18 : 0;

  console.log(networkToken["cbEth"]);
  const cbEth = networkToken["cbEth"]
    ? StakedTokenV1__factory.connect(networkToken["cbEth"].address, provider)
    : null;
  const cbEthRate = cbEth ? Number(await cbEth.exchangeRate()) / 1e18 : 0;

  const stEthStrategy = networkToken["stEth"]
    ? StrategyBaseTVLLimits__factory.connect(
        networkToken["stEth"].strategyAddress,
        provider
      )
    : null;
  const rEthStrategy = networkToken["rEth"]
    ? StrategyBaseTVLLimits__factory.connect(
        networkToken["rEth"].strategyAddress,
        provider
      )
    : null;
  const cbEthStrategy = networkToken["cbEth"]
    ? StrategyBaseTVLLimits__factory.connect(
        networkToken["cbEth"].strategyAddress,
        provider
      )
    : null;

  const stEthTvl = stEthStrategy
    ? Number(
        await stEthStrategy.sharesToUnderlyingView(
          await stEthStrategy.totalShares()
        )
      ) / 1e18
    : 0;
  const rEthTvl = rEthStrategy
    ? Number(
        await rEthStrategy.sharesToUnderlyingView(
          await rEthStrategy.totalShares()
        )
      ) / 1e18
    : 0;
  const cbEthTvl = cbEthStrategy
    ? Number(
        await cbEthStrategy.sharesToUnderlyingView(
          await cbEthStrategy.totalShares()
        )
      ) / 1e18
    : 0;

  const rEthSharesRate = rEthStrategy
    ? Number(await rEthStrategy.sharesToUnderlyingView(BigInt(1e18))) / 1e18
    : 0;
  const stEthSharesRate = stEthStrategy
    ? Number(await stEthStrategy.sharesToUnderlyingView(BigInt(1e18))) / 1e18
    : 0;
  const cbEthSharesRate = cbEthStrategy
    ? Number(await cbEthStrategy.sharesToUnderlyingView(BigInt(1e18))) / 1e18
    : 0;
  console.log(
    rEthSharesRate,
    stEthSharesRate,
    cbEthSharesRate,
    rEthRate,
    cbEthRate,
    stEthTvl,
    rEthTvl,
    cbEthTvl
  );
  return {
    rEthSharesRate,
    stEthSharesRate,
    cbEthSharesRate,
    rEthRate,
    cbEthRate,
    stEthTvl,
    rEthTvl,
    cbEthTvl,
  };
}
