//
// this script executes when you run 'yarn test'
//
// you can also test remote submissions like:
// CONTRACT_ADDRESS=0x43Ab1FCd430C1f20270C2470f857f7a006117bbb yarn test --network rinkeby
//
// you can even run mint commands if the tests pass like:
// yarn test && echo "PASSED" || echo "FAILED"
//
import { ethers, network } from "hardhat";
import { use, expect } from "chai";
import { Contract } from "ethers";

describe("🚩 Challenge 1: 🥩 Decentralized Staking App", function () {
  this.timeout(120000);

  let externalContract: Contract;
  let stakerContract: Contract;

  describe("Staker", function () {
    if (process.env.CONTRACT_ADDRESS) {
      it("Should connect to external contract", async function () {
        stakerContract = await ethers.getContractAt("Staker", process.env.CONTRACT_ADDRESS!);
        console.log("     🛰 Connected to external contract", stakerContract.address);
      });
    } else {
      it("Should deploy ExternalContract", async function () {
        const ExternalContract = await ethers.getContractFactory("ExternalContract");
        externalContract = await ExternalContract.deploy();
      });
      it("Should deploy Staker", async function () {
        const Staker = await ethers.getContractFactory("Staker");
        stakerContract = await Staker.deploy(externalContract.address);
      });
    }

    describe("mintItem()", function () {
      it("Balance should go up when you stake()", async function () {
        const [owner] = await ethers.getSigners();

        console.log("\t", " 🧑‍🏫 Tester Address: ", owner.address);

        const startingBalance = await stakerContract.balances(owner.address);
        console.log("\t", " ⚖️ Starting balance: ", startingBalance.toNumber());

        console.log("\t", " 🔨 Staking...");
        const stakeResult = await stakerContract.stake({ value: ethers.utils.parseEther("0.001") });
        console.log("\t", " 🏷  stakeResult: ", stakeResult.hash);

        console.log("\t", " ⏳ Waiting for confirmation...");
        const txResult = await stakeResult.wait();
        expect(txResult.status).to.equal(1);

        const newBalance = await stakerContract.balances(owner.address);
        console.log("\t", " 🔎 New balance: ", ethers.utils.formatEther(newBalance));
        expect(newBalance).to.equal(startingBalance.add(ethers.utils.parseEther("0.001")));
      });

      if (process.env.CONTRACT_ADDRESS) {
        console.log(
          " 🤷 since we will run this test on a live contract this is as far as the automated tests will go...",
        );
      } else {
        it("If enough is staked and time has passed, you should be able to complete", async function () {
          const timeLeft1 = await stakerContract.timeLeft();
          console.log("\t", "⏱ There should be some time left: ", timeLeft1.toNumber());
          expect(timeLeft1.toNumber()).to.greaterThan(0);

          console.log("\t", " 🚀 Staking a full eth!");
          const stakeResult = await stakerContract.stake({ value: ethers.utils.parseEther("1") });
          console.log("\t", " 🏷  stakeResult: ", stakeResult.hash);

          console.log("\t", " ⌛️ fast forward time...");
          await network.provider.send("evm_increaseTime", [3600]);
          await network.provider.send("evm_mine");

          const timeLeft2 = await stakerContract.timeLeft();
          console.log("\t", "⏱ Time should be up now: ", timeLeft2.toNumber());
          expect(timeLeft2.toNumber()).to.equal(0);

          console.log("\t", " 🎉 calling execute");
          const execResult = await stakerContract.execute();
          console.log("\t", " 🏷  execResult: ", execResult.hash);

          const result = await externalContract.completed();
          console.log("\t", " 🥁 complete: ", result);
          expect(result).to.equal(true);
        });

        it("Should redeploy Staker, stake, not get enough, and withdraw", async function () {
          const [owner, secondAccount] = await ethers.getSigners();

          const ExternalContract = await ethers.getContractFactory("ExternalContract");
          externalContract = await ExternalContract.deploy();

          const Staker = await ethers.getContractFactory("Staker");
          stakerContract = await Staker.deploy(ExternalContract.address);

          console.log("\t", " 🔨 Staking...");
          const stakeResult = await stakerContract
            .connect(secondAccount)
            .stake({ value: ethers.utils.parseEther("0.001") });
          console.log("\t", " 🏷  stakeResult: ", stakeResult.hash);

          console.log("\t", " ⏳ Waiting for confirmation...");
          const txResult = await stakeResult.wait();
          expect(txResult.status).to.equal(1);

          console.log("\t", " ⌛️ fast forward time...");
          await network.provider.send("evm_increaseTime", [3600]);
          await network.provider.send("evm_mine");

          console.log("\t", " 🎉 calling execute");
          const execResult = await stakerContract.execute();
          console.log("\t", " 🏷  execResult: ", execResult.hash);

          const result = await externalContract.completed();
          console.log("\t", " 🥁 complete should be false: ", result);
          expect(result).to.equal(false);

          const startingBalance = await ethers.provider.getBalance(secondAccount.address);
          //console.log("startingBalance before withdraw", ethers.utils.formatEther(startingBalance))

          console.log("\t", " 💵 calling withdraw");
          const withdrawResult = await stakerContract.connect(secondAccount).withdraw();
          console.log("\t", " 🏷  withdrawResult: ", withdrawResult.hash);

          // need to account for the gas cost from calling withdraw
          const tx = await ethers.provider.getTransaction(withdrawResult.hash);
          const receipt = await ethers.provider.getTransactionReceipt(withdrawResult.hash);
          const gasCost = tx.gasPrice?.mul(receipt.gasUsed);

          const endingBalance = await ethers.provider.getBalance(secondAccount.address);
          //console.log("endingBalance after withdraw", ethers.utils.formatEther(endingBalance))

          expect(endingBalance).to.equal(
            startingBalance.add(ethers.utils.parseEther("0.001")).sub(ethers.BigNumber.from(gasCost)),
          );
        });
      }
    });
  });
});
