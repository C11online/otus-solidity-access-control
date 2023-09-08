const { expect } = require("chai");

describe("ACL", function () {
  let token;
  let acl;
  let owner;
  let receiver10;
  let receiver20;

  const initialTokenSupply = ethers.parseEther("100");
  const amount10 = ethers.parseEther("0.00000000000000001");
  const amount20 = ethers.parseEther("0.00000000000000002");
  const amount30 = ethers.parseEther("0.00000000000000003");

  beforeEach(async function () {
    const Token = await ethers.getContractFactory("Token");
    token = await Token.deploy(initialTokenSupply);
    await token.waitForDeployment();

    const ACL = await ethers.getContractFactory("ACL");
    [owner, dropper10, dropper20, dropper30] = await ethers.getSigners();
    acl = await ACL.deploy(token.target);
    await acl.waitForDeployment();

    await token.transfer(acl.target, initialTokenSupply);

  });

  it("should initialize the contract correctly", async function () {
    expect(await acl.token()).to.equal(token.target);
    expect(await acl.owner()).to.equal(owner.address);
    expect(await token.balanceOf(acl.target)).to.equal(initialTokenSupply);
  });

  it("should add dropper10 and check drop10() by dropper10 and dropper20", async function () {
    await acl.setAccessToDrop10(dropper10.address);
    let selector10 = await acl.getFunctionSelectorDrop10();
    expect(await acl.hasFunctionAccess(dropper10.address, selector10)).to.be.true;
    await acl.connect(dropper10).drop10();
    expect(await token.balanceOf(dropper10.address)).to.equal(amount10);
    expect(await token.balanceOf(acl.target)).to.equal(initialTokenSupply - amount10);
    await expect(acl.connect(dropper20).drop10()).to.be.revertedWith("Access denied");
  });

  it("should add dropper20 and check drop20() by dropper20 and dropper10", async function () {
    await acl.setAccessToDrop20(dropper20.address);
    let selector20 = await acl.getFunctionSelectorDrop20();
    expect(await acl.hasFunctionAccess(dropper20.address, selector20)).to.be.true;
    await acl.connect(dropper20).drop20();
    expect(await token.balanceOf(dropper20.address)).to.equal(amount20);
    expect(await token.balanceOf(acl.target)).to.equal(initialTokenSupply - amount20);
    await expect(acl.connect(dropper10).drop20()).to.be.revertedWith("Access denied");
  });

  it("should add dropper30 and check drop10() & drop20() by dropper30", async function () {
    await acl.setAccessToDrop10(dropper30.address);
    await acl.setAccessToDrop20(dropper30.address);
    let selector10 = await acl.getFunctionSelectorDrop10();
    let selector20 = await acl.getFunctionSelectorDrop20();
    expect(await acl.hasFunctionAccess(dropper30.address, selector10)).to.be.true;
    expect(await acl.hasFunctionAccess(dropper30.address, selector20)).to.be.true;
    await acl.connect(dropper30).drop10();
    await acl.connect(dropper30).drop20();
    expect(await token.balanceOf(dropper30.address)).to.equal(amount30);
    expect(await token.balanceOf(acl.target)).to.equal(initialTokenSupply - amount30);
  });

});