import Image from "next/image";
import { PHASE_PRODUCTION_BUILD } from "next/constants";
import { cache } from "react";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";

import Data from "./components/Data";
import Disclaimer from "./components/Disclaimer";
import { prefetchApiData } from "./utils/prefetching";

const getQueryClient = cache(() => new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
    },
  },
}));

let prefetched = false;

export default async function Home() {
  const queryClient = getQueryClient();
  const isBuild = process.env.NEXT_PHASE === PHASE_PRODUCTION_BUILD;

  if (((isBuild && !prefetched) || !isBuild) && process.env.NODE_ENV === "production") {
    prefetched = true;
    await prefetchApiData(queryClient);
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <main className="flex min-h-screen flex-col items-center justify-between p-8 md:p-24 font-semibold">
        <div>
          <div className="z-10 max-w-5xl items-center justify-between font-mono text-sm">
            <div className="h-48 flex w-full items-center justify-center lg:static lg:h-auto lg:w-auto lg:bg-none lgmb-12">
              <Image
                src={"/logo.png"}
                alt="EigenLayer Logo"
                width={64}
                height={72}
              />
              <p className="text-lg md:text-2xl ml-4">EigenLayer Stats</p>
            </div>
          </div>
        </div>
        <Data />
        <div className="mt-32">
          <p className="flex items-center">
            <span className="pr-2">Made with ❤️ at Nethermind </span>
            <Image
              src={"/nethermind.png"}
              width={32}
              height={32}
              alt={"Nethermind logo"}
              style={{ display: "inline-block" }}
            />
          </p>
          <Disclaimer />
        </div>
      </main>
    </HydrationBoundary>
  );
}
