const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("TestToken", function () {
  let token, owner, user1;
  const feePercent = 1000; // 10%

  beforeEach(async () => {
    [owner, user1] = await ethers.getSigners();

    const FeeToken = await ethers.getContractFactory("Token");
    token = await FeeToken.deploy(
      "TestToken",
      "TsT",
      ethers.parseUnits("1000000", 18),
      feePercent
    );
    await token.waitForDeployment();
  });

  it("should assign total supply to owner", async function () {
    const ownerBalance = await token.balanceOf(owner.address);
    const totalSupply = await token.totalSupply();
    expect(ownerBalance).to.equal(totalSupply);
  });

  it("should charge fee on transfer", async function () {
    const transferAmount = ethers.parseUnits("1000", 18);
    const expectedFee = (transferAmount * BigInt(feePercent)) / 10000n;
    const expectedRecipientAmount = transferAmount - expectedFee;

    await token.transfer(user1.address, transferAmount);

    const user1Balance = await token.balanceOf(user1.address);
    expect(user1Balance).to.equal(expectedRecipientAmount);
  });

  it("should emit Transfer event with correct parameters", async function () {
    const transferAmount = ethers.parseUnits("1000", 18);
    const expectedAmountAfterFee =
      transferAmount - (transferAmount * BigInt(feePercent)) / 10000n;
    await expect(token.transfer(user1.address, transferAmount))
      .to.emit(token, "Transfer")
      .withArgs(owner.address, user1.address, expectedAmountAfterFee);
  });

});
