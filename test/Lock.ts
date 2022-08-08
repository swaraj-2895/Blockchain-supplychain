import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";
import { SupplyChain } from "../typechain-types";
import { id } from "ethers/lib/utils";
import { int } from "hardhat/internal/core/params/argumentTypes";

describe("SupplyChain", function() {


  async function deployFixture() {
    const SupplyChain = await ethers.getContractFactory("SupplyChain");
    let supplychain = await SupplyChain.deploy();
    const [accounts] = await ethers.getSigners(); 
    return { supplychain, accounts };
  }

  // Checking the creation of new item 

  it ("New item created with id = 1 and price = 1200 wei", async function(){
    var price_item;
    var id;
    const { supplychain, accounts } = await loadFixture(deployFixture);
    await supplychain.CreateItem(1, 1200);
    [price_item, id] = await supplychain.get_item(0);
    expect (price_item).to.equal(1200);
    expect (id).to.equal(1);

  });

  it ("Sending insufficient payment to the contract must revert the transaction", async function(){
    const { supplychain, accounts } = await loadFixture(deployFixture);
    await supplychain.CreateItem(1, 1200);
    var Item_addr = await supplychain.view_address();
    await expect (accounts.sendTransaction({
      to: Item_addr,
      value: ethers.utils.parseEther("1"),
    })).to.be.revertedWith("Insufficient payment");
  });

  it ("Successful payment after sending sufficient amount", async function(){
    const { supplychain, accounts } = await loadFixture(deployFixture);
    await supplychain.CreateItem(1, 1200);
    var Item_addr = await supplychain.view_address();
    await accounts.sendTransaction({
      to: Item_addr,
      value: ethers.utils.parseEther("0.0000000000000012"),
    });
    var getB = await supplychain.get_balance();
    expect (getB).to.equal(1200);
  });

});













/*
describe("Lock", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshopt in every test.
  async function deployOneYearLockFixture() {
    const ONE_YEAR_IN_SECS = 365 * 24 * 60 * 60;
    const ONE_GWEI = 1_000_000_000;

    const lockedAmount = ONE_GWEI;
    const unlockTime = (await time.latest()) + ONE_YEAR_IN_SECS;

    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await ethers.getSigners();

    const Lock = await ethers.getContractFactory("Lock");
    const lock = await Lock.deploy(unlockTime, { value: lockedAmount });

    return { lock, unlockTime, lockedAmount, owner, otherAccount };
  }

  describe("Deployment", function () {
    it("Should set the right unlockTime", async function () {
      const { lock, unlockTime } = await loadFixture(deployOneYearLockFixture);

      expect(await lock.unlockTime()).to.equal(unlockTime);
    });

    it("Should set the right owner", async function () {
      const { lock, owner } = await loadFixture(deployOneYearLockFixture);

      expect(await lock.owner()).to.equal(owner.address);
    });

    it("Should receive and store the funds to lock", async function () {
      const { lock, lockedAmount } = await loadFixture(
        deployOneYearLockFixture
      );

      expect(await ethers.provider.getBalance(lock.address)).to.equal(
        lockedAmount
      );
    });

    it("Should fail if the unlockTime is not in the future", async function () {
      // We don't use the fixture here because we want a different deployment
      const latestTime = await time.latest();
      const Lock = await ethers.getContractFactory("Lock");
      await expect(Lock.deploy(latestTime, { value: 1 })).to.be.revertedWith(
        "Unlock time should be in the future"
      );
    });
  });

  describe("Withdrawals", function () {
    describe("Validations", function () {
      it("Should revert with the right error if called too soon", async function () {
        const { lock } = await loadFixture(deployOneYearLockFixture);

        await expect(lock.withdraw()).to.be.revertedWith(
          "You can't withdraw yet"
        );
      });

      it("Should revert with the right error if called from another account", async function () {
        const { lock, unlockTime, otherAccount } = await loadFixture(
          deployOneYearLockFixture
        );

        // We can increase the time in Hardhat Network
        await time.increaseTo(unlockTime);

        // We use lock.connect() to send a transaction from another account
        await expect(lock.connect(otherAccount).withdraw()).to.be.revertedWith(
          "You aren't the owner"
        );
      });

      it("Shouldn't fail if the unlockTime has arrived and the owner calls it", async function () {
        const { lock, unlockTime } = await loadFixture(
          deployOneYearLockFixture
        );

        // Transactions are sent using the first signer by default
        await time.increaseTo(unlockTime);

        await expect(lock.withdraw()).not.to.be.reverted;
      });
    });

    describe("Events", function () {
      it("Should emit an event on withdrawals", async function () {
        const { lock, unlockTime, lockedAmount } = await loadFixture(
          deployOneYearLockFixture
        );

        await time.increaseTo(unlockTime);

        await expect(lock.withdraw())
          .to.emit(lock, "Withdrawal")
          .withArgs(lockedAmount, anyValue); // We accept any value as `when` arg
      });
    });

    describe("Transfers", function () {
      it("Should transfer the funds to the owner", async function () {
        const { lock, unlockTime, lockedAmount, owner } = await loadFixture(
          deployOneYearLockFixture
        );

        await time.increaseTo(unlockTime);

        await expect(lock.withdraw()).to.changeEtherBalances(
          [owner, lock],
          [lockedAmount, -lockedAmount]
        );
      });
    });
  });
});
*/