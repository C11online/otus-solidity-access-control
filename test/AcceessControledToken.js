const { expect } = require("chai");

describe("AccessControledToken", function () {
  let MyToken;
  let myToken;
  let owner;
  let minter;
  let burner;
  let addr1;
  let addr2;

  beforeEach(async function () {
    [owner, minter, burner, addr1, addr2] = await ethers.getSigners();

    MyToken = await ethers.getContractFactory("AccessControledToken");
    myToken = await MyToken.connect(owner).deploy(minter.address, burner.address);
    await myToken.waitForDeployment();
  });

  it("should have correct name and symbol", async function () {
    expect(await myToken.name()).to.equal("AccessControledToken");
    expect(await myToken.symbol()).to.equal("ACT");
  });

  it("should mint tokens when called by a minter", async function () {
    await myToken.connect(minter).mint(addr1.address, 1000);
    expect(await myToken.balanceOf(addr1.address)).to.equal(1000);
  });

  it("should not mint tokens when called by a non-minter", async function () {
    await expect(myToken.connect(addr1).mint(addr2.address, 1000)).to.be.revertedWith(
      "Caller is not a minter"
    );
  });

  it("should burn tokens when called by a burner", async function () {
    await myToken.connect(minter).mint(addr1.address, 1000);
    await myToken.connect(burner).burn(addr1.address, 500);
    expect(await myToken.balanceOf(addr1.address)).to.equal(500);
  });

  it("should not burn tokens when called by a non-burner", async function () {
    await myToken.connect(minter).mint(addr1.address, 1000);
    await expect(myToken.connect(addr1).burn(addr1.address, 500)).to.be.revertedWith(
      "Caller is not a burner"
    );
  });
});