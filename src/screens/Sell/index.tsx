import { ton } from "tokens";
import { observer } from "mobx-react";

import { useStore } from "store";
import Icon from "assets/images/shared/sell.svg";
import { TokenLayout } from "../layouts/TokenLayout";
import { ReactComponent as Arrow } from "assets/images/shared/arrow.svg";
import { SvgIcon } from "@mui/material";
import TokenOperations from "screens/cmponents/TokenOperations";
import * as API from "services/api";
import {
  TokenOperationsStore,
  useTokenOperationsStore,
} from "screens/cmponents/TokenOperations/Context";

export const SellScreen = () => {
  return (
    <TokenOperationsStore>
      <Sell />
    </TokenOperationsStore>
  );
};

const Sell = observer(() => {
  const store = useStore();
  const {
    srcTokenAmount,
    srcTokenAmountCopy,
    destTokenAmountCopy,
    destTokenAmount
  } = useTokenOperationsStore();

  const onSubmit = () => {
    if (store.selectedToken) {
      // TODO
      API.generateSellLink(store.selectedToken.name, srcTokenAmount, destTokenAmount);
    }
  };

  const getBalances = () => {
    return Promise.all([
      API.getTokenBalance(store.selectedToken!!),
      API.getTonBalance(),
    ]);
  };

  return (
    <TokenLayout
      title={`Swap ${store.selectedToken?.displayName} to TON`}
      titleImage={Icon}
    >
      {store.selectedToken && (
        <TokenOperations
          successText={`Successfully swapped ${srcTokenAmountCopy} ${store.selectedToken.displayName} for ${destTokenAmountCopy} TON`}
          icon={<SvgIcon component={Arrow} viewBox="0 0 13 22" />}
          disableButton={false}
          onSubmit={onSubmit}
          getAmountFunc={API.getAmountsOut}
          getBalances={getBalances}
          srcToken={store.selectedToken}
          destToken={ton}
          submitButtonText={`Sell ${store.selectedToken?.displayName}`}
        />
      )}
    </TokenLayout>
  );
});
