import { Fade } from "@mui/material";
import SlidingMenu from "components/SlidingMenu";
import useEffectOnce from "hooks/useEffectOnce";
import useWebAppResize from "hooks/useWebAppResize";
import {  useMemo } from "react";
import { Route, Routes, useNavigate, useParams } from "react-router-dom";
import { ROUTES } from "router/routes";
import { Tokens } from "screens/components/Tokens";
import { useTokenOperationsActions } from "store/token-operations/hooks";
import { OperationType } from "store/token-operations/reducer";
import { useTokensStore } from "store/tokens/hooks";
import { StyledTokenOperation, StyledTokenOperationTitle } from "styles/styles";
import { getActionFromParams } from "utils";
import Buy from "./Buy";
import Sell from "./Sell";


function SwapScreen() {
  const { selectedToken } = useTokensStore();
  const { toggleBuyToSell, toggleSellToBuy, onOperationTypeChange } = useTokenOperationsActions();
  const navigate = useNavigate();
  const params = useParams();
  const action = getActionFromParams(params);
  const expanded = useWebAppResize()

  useEffectOnce(() => {
    onOperationTypeChange(OperationType.SWAP)
  })
  const menuItems = useMemo(
    () =>
      selectedToken
        ? [
            {
              text: "Buy",
              method: toggleSellToBuy,
            },
            {
              text: "Sell",
              method: toggleBuyToSell,
            },
          ]
        : [],
    [navigate, selectedToken]
  );

  const onTokenSelect = (tokenName: string) => {
    navigate(ROUTES.swap.navigateToBuy.replace(":id", tokenName));
  };


  console.log(action);
  

  return (
   
    <StyledTokenOperation>
      {selectedToken && <StyledTokenOperationTitle
      expanded={expanded}
      >Trade</StyledTokenOperationTitle>}
      {selectedToken && <SlidingMenu symbol={selectedToken.displayName} items={menuItems} action={action} />}

      <Routes>
        <Route path={ROUTES.swap.buy} element={<Buy />} />
        <Route path={ROUTES.swap.sell} element={<Sell />} />
        <Route
          path={ROUTES.swap.tokens}
          element={
            <Tokens
              onTokenSelect={onTokenSelect}
              title="Jettons available for trade"
            />
          }
        />
      </Routes>
    </StyledTokenOperation>
   
  );
}

export { SwapScreen };
