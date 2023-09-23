import type { NextPage } from "next";
import { Header } from "~~/components/Header";
import { MetaHeader } from "~~/components/MetaHeader";
import Stakings from "~~/components/Transactions";
import { StakeContractInteraction } from "~~/components/stake";
import { useDeployedContractInfo } from "~~/hooks/scaffold-eth";

const StakerUI: NextPage = () => {
  const { data: StakerContract } = useDeployedContractInfo("Staker");
  return (
    <>
      <Header />

      <MetaHeader />
      <StakeContractInteraction key={StakerContract?.address} address={StakerContract?.address} />
      <Stakings />

    </>
  );
};

export default StakerUI;
