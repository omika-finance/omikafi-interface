import useSWR from "swr";
import { arrayURLFetcher, getTotalVolumeSum } from "lib/legacy";
import { ARBITRUM, AVALANCHE } from "config/chains";
import { getServerUrl } from "config/backend";
import { bigNumberify } from "lib/numbers";
const ACTIVE_CHAIN_IDS = [ARBITRUM, AVALANCHE];

export function useTotalVolume() {
  const { data: totalVolume } = useSWR<any>(
    ACTIVE_CHAIN_IDS.map((chain) => getServerUrl(chain, "/total_volume")),
    {
      fetcher: arrayURLFetcher,
    }
  );
  console.log(`${ARBITRUM}/total_volume---------` , totalVolume);
  if (totalVolume?.length > 0) {
    return ACTIVE_CHAIN_IDS.reduce(
      (acc, chainId, index) => {
        const sum = getTotalVolumeSum(totalVolume[index])!;
        acc[chainId] = sum;
        acc.total = acc.total.add(sum);
        return acc;
      },
      { total: bigNumberify(0)! }
    );
  }
}
