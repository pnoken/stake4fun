import { useState } from "react";
import { Address } from "../scaffold-eth";
import { ETHToPrice } from "./EthToPrice";
import humanizeDuration from "humanize-duration";
import { formatEther } from "viem";
import { useAccount } from "wagmi";
import {
  useAccountBalance,
  useDeployedContractInfo,
  useScaffoldContractRead,
  useScaffoldContractWrite,
} from "~~/hooks/scaffold-eth";
import { getTargetNetwork } from "~~/utils/scaffold-eth";
import { useGlobalState } from "~~/services/store/store";
import { Countdown } from "../section/countdown";

export const StakeContractInteraction = ({ address }: { address?: string }) => {
  const { address: connectedAddress } = useAccount();
  const { data: StakerContract } = useDeployedContractInfo("Staker");
  const { data: ExternalContact } = useDeployedContractInfo("ExternalContract");
  const { balance: stakerContractBalance } = useAccountBalance(StakerContract?.address);
  const { balance: externalContractBalance } = useAccountBalance(ExternalContact?.address);
  const nativeCurrencyPrice = useGlobalState(state => state.nativeCurrencyPrice);


  const configuredNetwork = getTargetNetwork();

  const [amount, setAmount] = useState(0);

  // Contract Read Actions
  const { data: threshold } = useScaffoldContractRead({
    contractName: "Staker",
    functionName: "threshold",
    watch: true,
  });
  const { data: timeLeft } = useScaffoldContractRead({
    contractName: "Staker",
    functionName: "timeLeft",
    watch: true,
  });
  const { data: myStake } = useScaffoldContractRead({
    contractName: "Staker",
    functionName: "balances",
    args: [connectedAddress],
    watch: true,
  });
  const { data: isStakingCompleted } = useScaffoldContractRead({
    contractName: "ExternalContract",
    functionName: "completed",
    watch: true,
  });

  // Contract Write Actions
  const { writeAsync: stakeETH } = useScaffoldContractWrite({
    contractName: "Staker",
    functionName: "stake",
    value: amount.toString(),
  });
  const { writeAsync: execute } = useScaffoldContractWrite({
    contractName: "Staker",
    functionName: "execute",
  });
  const { writeAsync: withdrawETH } = useScaffoldContractWrite({
    contractName: "Staker",
    functionName: "withdraw",
    args: [myStake],
  });



  return (
    <div className="flex items-center flex-col flex-grow w-full bg-gray-100 px-4 gap-12">
      <div className="flex flex-col w-full border-opacity-50">
        <div className="grid card bg-white rounded-box p-4 mt-4">
          <div className="flex justify-between">
            <h3>Annual Staking Rewards</h3>
            <h3>4.38%</h3>
          </div>

          <div className="flex justify-between">
            <h3>Total matic Staked</h3>
            <div className="flex space-x-2">
              {<ETHToPrice value={stakerContractBalance != null ? stakerContractBalance.toString() : undefined} />} |
              <h3 className="text-sm mt-1">${stakerContractBalance != null && (nativeCurrencyPrice * stakerContractBalance).toFixed(3)}</h3>
              {/* {<ETHToPrice value={threshold ? formatEther(threshold) : undefined} />} */}
            </div>
          </div>
        </div>


      </div>
      {/* {isStakingCompleted && (
        <div className="flex flex-col items-center gap-2 bg-base-300 info-content shadow-lg shadow-secondary border-secondary rounded-xl p-6 mt-12 w-full max-w-lg">
          <p className="block m-0 font-semibold">
            {" "}
            🎉 &nbsp; Staking App triggered `ExternalContract` &nbsp; 🎉{" "}
          </p>
          <div className="flex items-center">
            <ETHToPrice
              value={externalContractBalance != null ? externalContractBalance.toString() : undefined}
              className="text-[1rem]"
            />
            <p className="block m-0 text-lg -ml-1">staked !!</p>
          </div>
        </div>
      )} */}
      <div className="flex justify-end w-full items-center">

        <div className="flex">
          <p className="block font-semibold">Contract:</p>
          <Address address={address} size="xl" />
        </div>
      </div>
      <Countdown />
      <div
        className={`flex flex-col items-center bg-white shadow-lg shadow-secondary border-secondary rounded-xl p-6 w-full md:w-2/3`}
      >

        <div className="form-control w-full max-w-xs sm:w-3/4">
          <div className="tabs">
            <a className="tab tab-lifted tab-active">Stake</a>
            <a className="tab tab-lifted">Unstake</a>
            <a className="tab tab-lifted">Withdraw</a>
          </div>
          <label className="label">
            <span className="label-text">Enter Matic amount</span>
            <span className="label-text-alt"><b>Staked : {myStake ? formatEther(myStake) : 0} {configuredNetwork.nativeCurrency.symbol}</b></span>
          </label>
          <input type="number" placeholder="0.0" value={amount} onChange={(e: React.ChangeEvent) => setAmount(e.target.value)} className="input input-bordered w-full" />

          <label className="label">
            <span className="label-text-alt">You will get</span>
            <span className="label-text-alt">{amount} Matic</span>
          </label>
        </div>



        <div className="divider">
        </div>
        <div className="grid card bg-white rounded-box w-full p-4 mt-4">
          <div className="flex gap-12 justify-between">
            <h3>Exchange Rate:</h3>
            <h3>${nativeCurrencyPrice}</h3>
          </div>

          <div className="flex justify-between">
            <h3>Transaction Cost:</h3>
            <h3>$0.00</h3>
          </div>
        </div>

        {/* <div className="flex flex-col space-y-5">
          <div className="flex space-x-7"> */}
        <button className="btn btn-primary w-full" onClick={() => stakeETH()}>
          Stake
        </button>
        {/* </div>
        </div> */}
      </div>
    </div>
  );
};
