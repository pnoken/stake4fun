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
      <div className="flex flex-col w-full border-opacity-50">
        <div className="grid h-20 card bg-white rounded-box m-4 p-4">
          <div className="flex justify-between">
            <h3>Annual Staking Rewards</h3>
            <h3>4.38%</h3>
          </div>

          <div className="flex justify-between">
            <h3>Total matic Staked</h3>
            <h3>4.38%</h3>
          </div>
        </div>


      </div>

      <StakeContractInteraction key={StakerContract?.address} address={StakerContract?.address} />
      <div className="flex flex-col w-full border-opacity-50">
        <div className="grid h-20 card bg-white rounded-box m-4 p-4">
          <h3>Deposits</h3>
          <div className="divider">
          </div>
        </div>


      </div>
      <div className="flex flex-col w-full lg:flex-row">
        <div className="grid flex-grow card bg-white m-4 rounded-box p-4">
          <h2>Stakings</h2>
          <div className="divider"></div>
          <div className="flex gap-12">
            <div className="radial-progress" style={{ "--value": "100", "--size": "12rem", "--thickness": "2rem" }}>100%</div>
            <div>
              <h3>Deposit Composition</h3>
              <p>MATIC: <b>100%</b></p>
            </div>

          </div>
        </div>

        <div className="grid flex-grow card bg-white m-4 rounded-box p-4">
          <h2>Rewards</h2>
          <div className="divider"></div>
          <h3>Pending Rewards:</h3>
          <div className="divider"></div>
        </div>
      </div>
      <Stakings />

    </>
  );
};

export default StakerUI;
