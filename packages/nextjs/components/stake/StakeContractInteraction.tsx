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
import { Countdown } from "../section/countdown";
import { useEffectOnce } from "usehooks-ts";

export const StakeContractInteraction = ({ address }: { address?: string }) => {
  const { address: connectedAddress } = useAccount();
  const { data: StakerContract } = useDeployedContractInfo("Staker");
  const { data: ExampleExternalContact } = useDeployedContractInfo("ExampleExternalContract");
  const { balance: stakerContractBalance } = useAccountBalance(StakerContract?.address);
  const { balance: exampleExternalContractBalance } = useAccountBalance(ExampleExternalContact?.address);

  const configuredNetwork = getTargetNetwork();

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
    contractName: "ExampleExternalContract",
    functionName: "completed",
    watch: true,
  });

  // Contract Write Actions
  const { writeAsync: stakeETH } = useScaffoldContractWrite({
    contractName: "Staker",
    functionName: "stake",
    value: "0.1",
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
    <div className="flex items-center flex-col flex-grow w-full px-4 gap-12">

      <div
        className={`flex flex-col items-center space-y-8 bg-white shadow-lg shadow-secondary border-8 border-secondary rounded-xl p-6 w-full ${!isStakingCompleted ? "mt-24" : ""
          }`}
      >
        <div className="stats text-primary-content">
          <Countdown />

          <div className="stat">
            <div className="stat-title">Account balance</div>
            <div className="stat-value">{stakerContractBalance != null ? stakerContractBalance.toString() : undefined} {configuredNetwork.nativeCurrency.symbol}</div>
            <div className="stat-actions">
              <button className="btn btn-sm btn-success" onClick={() => stakeETH()}>Deposit funds</button>
            </div>
          </div>

          <div className="stat">
            <div className="stat-title">Staked balance</div>
            <div className="stat-value">{myStake ? formatEther(myStake) : 0} {configuredNetwork.nativeCurrency.symbol}</div>
            <div className="stat-actions">
              <button className="btn btn-sm" onClick={() => withdrawETH()}>Withdraw Funds</button>

            </div>
          </div>

        </div>
        <div className="form-control w-full max-w-xs">
          <label className="label">
            <span className="label-text">Enter Matic amount</span>
            <span className="label-text-alt"><b>My MaticX : 0</b></span>
          </label>
          <input type="text" placeholder="0.0" className="input input-bordered w-full max-w-xs" />

          <label className="label">
            <span className="label-text-alt">You will get</span>
            <span className="label-text-alt">0 MaticX</span>
          </label>
        </div>
        <div className="flex flex-col w-full items-center">
          <p className="block text-2xl mt-0 mb-2 font-semibold">Staker Contract</p>
          <Address address={address} size="xl" />
        </div>
        <div className="flex items-start justify-around w-full">
          <div className="flex flex-col items-center justify-center w-1/2">
            {/* <p className="block text-xl mt-0 mb-1 font-semibold">Time Left</p> */}
            {/* <p className="m-0 p-0">{timeLeft ? `${humanizeDuration(Number(timeLeft) * 1000)}` : 0}</p> */}

          </div>
          <div className="flex flex-col items-center w-1/2">
            <p className="block text-xl mt-0 mb-1 font-semibold">You Staked</p>
            <span>
              {myStake ? formatEther(myStake) : 0} {configuredNetwork.nativeCurrency.symbol}
            </span>
          </div>
        </div>
        <div className="flex flex-col items-center shrink-0 w-full">
          <p className="block text-xl mt-0 mb-1 font-semibold">Total Staked</p>
          <div className="flex space-x-2">
            {<ETHToPrice value={stakerContractBalance != null ? stakerContractBalance.toString() : undefined} />}
            <span>/</span>
            {<ETHToPrice value={threshold ? formatEther(threshold) : undefined} />}
          </div>
        </div>
        <div className="flex flex-col space-y-5">
          <div className="flex space-x-7">
            <button className="btn btn-primary" onClick={() => execute()}>
              Stake
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
