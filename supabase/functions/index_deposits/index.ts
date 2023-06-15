import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

import { ethers } from "ethers";
import { createClient } from "@supabase/supabase-js";

import { indexDeposits } from "../utils/indexing/deposits.ts";

serve(async () => {
  try {
    const { startBlock, endBlock } = await indexDeposits(
      createClient(
        Deno.env.get("SUPABASE_URL") ?? "",
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      ),
      new ethers.JsonRpcProvider(Deno.env.get("RPC_URL") ?? "", "goerli"),
    );

    console.log(`Indexing successful! Block range: ${startBlock}-${endBlock}`);
    return new Response(`Indexing successful! Block range: ${startBlock}-${endBlock}\n`, { status: 200 });
  }
  catch (err) {
    console.error(err);
    return new Response("Got an error while indexing, check the logs\n", { status: 500 });
  }
});