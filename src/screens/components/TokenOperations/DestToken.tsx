import SwapCard from "components/SwapCard";
import { useEffect, useRef } from "react";
import { PoolInfo } from "services/api/addresses";
import {
  useTokenOperationsActions,
  useTokenOperationsStore,
} from "store/token-operations/hooks";
import { useDebouncedCallback } from "use-debounce";
import { calculateTokens } from "./util";

interface Props {
  token: PoolInfo;
  srcTokenName: string;
  getAmountFunc: any;
}

function DestToken({ token, srcTokenName, getAmountFunc }: Props) {
  const {
    destTokenAmount,
    totalBalances,
    destLoading,
    destAvailableAmountLoading,
  } = useTokenOperationsStore();

  const { updateDestTokenAmount, updateSrcTokenAmount, updateSrcTokenLoading } =
    useTokenOperationsActions();

  const balanceRef = useRef(0);
  const debounce = useDebouncedCallback(async () => {
    if (!balanceRef.current) {
      return;
    }
    let result = 0;
    const jetton = srcTokenName === "ton" ? token.name : srcTokenName;
    try {
      result = await calculateTokens(
        jetton,
        srcTokenName !== "ton",
        null,
        balanceRef.current || "0",
        getAmountFunc
      );

      if (!balanceRef.current) {
        return;
      }
    } catch (error) {
      console.log(error);
    } finally {
      if (!balanceRef.current) {
        return;
      }
      updateSrcTokenLoading(false);
      if (result === 0) {
        return;
      } else {
        updateSrcTokenAmount(result / 1e9);
      }
    }
  }, 600);

  const onChange = (value: string) => {
    updateDestTokenAmount(Number(value));
    balanceRef.current = Number(value);
    if (!value) {
      updateSrcTokenLoading(false);
      updateSrcTokenAmount(0);
    } else {
      updateSrcTokenLoading(true);
      debounce();
    }
  };


  return (
    <SwapCard
      isLoading={destLoading}
      onChange={onChange}
      inputAmount={destTokenAmount}
      token={token}
      availableAmount={totalBalances.destBalance}
      maxAmount={totalBalances.destBalance}
      availableAmountLoading={destAvailableAmountLoading}
    />
  );
}

export default DestToken;
