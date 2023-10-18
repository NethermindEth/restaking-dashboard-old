"use client";
import { cloneDeep } from "lodash";
import { useMemo } from "react";
import { Pie } from "react-chartjs-2";

const tokens = {
  stEth: {
    backgroundColor: "rgba(26, 12, 109, 1)",
    label: "stETH",
  },
  cbEth: {
    backgroundColor: "rgba(255, 184, 0, 1)",
    label: "cbETH (as ETH)",
  },
  rEth: {
    backgroundColor: "rgba(0, 153, 153, 1)",
    label: "rETH (as ETH)",
  },
  ETH: {
    backgroundColor: "rgba(254, 156, 147, 1)",
    label: "Beacon Chain ETH",
  },
};

const dataConfig = {
  labels: [],
  datasets: [
    {
      data: [],
      backgroundColor: [],
      hoverBackgroundColor: [],
    },
  ],
};

const PieChart = (data: any) => {
  const chartData = useMemo(() => {
    const internalChartData = cloneDeep(dataConfig);
    const amounts = data.data.amounts.filter((e) => e !== null);

    internalChartData.datasets[0].data = data.data.amounts;
    internalChartData.labels = data.data.labels;
    return internalChartData;
  }, [data]);

  return <Pie data={chartData} width={"100%"} />;
};

export default PieChart;
