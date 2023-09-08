const { expect } = require("chai");

describe("Token", function () {
  let Token;
  let token;
  let owner;
  const initialSupply = ethers.parseEther("1000");

  beforeEach(async function () {
    Token = await ethers.getContractFactory("Token");
    [owner] = await ethers.getSigners();
    token = await Token.deploy(initialSupply);
    await token.waitForDeployment();
  });

  it("should have the correct name, symbol, and initial supply", async function () {
    expect(await token.name()).to.equal("OtusSolidityUnitTests");
    expect(await token.symbol()).to.equal("OSUT");
    expect(await token.totalSupply()).to.equal(initialSupply);
  });

  it("should transfer tokens correctly", async function () {
    const recipient = ethers.Wallet.createRandom().address;
    const amount = ethers.parseEther("100");

    await token.transfer(recipient, amount);

    expect(await token.balanceOf(owner.address)).to.equal(initialSupply - amount);
    expect(await token.balanceOf(recipient)).to.equal(amount);
  });

  it("should not allow transfers exceeding the balance", async function () {
    const recipient = ethers.Wallet.createRandom().address;
    const amount = ethers.parseEther("3000");

    await expect(token.transfer(recipient, amount)).to.be.revertedWith("ERC20: transfer amount exceeds balance");
  });
});
