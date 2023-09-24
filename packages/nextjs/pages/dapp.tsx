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
      <div className="flex">
        <div className="md:block hidden overflow-y-scroll min-h-full bg-gray-100 md:w-1/4">
          <div className="grid card bg-white rounded-box p-4 m-4">
            <div className="gap-4 flex flex-col">
              <h3>Polygon</h3>
              <h3 className="bg-gray-200 rounded-box p-4">Staking</h3>
            </div>
          </div>


        </div>


        <div className="md:w-3/4 w-full bg-gray-100">
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
        </div>
      </div>

    </>
  );
};

export default StakerUI;
