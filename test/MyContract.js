// myContract.test.js
const { expect } = require("chai");
const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

describe("MyContract", function () {
  let myContract;
  let owner;
  let admin;
  const initialValue = 42;

  beforeEach(async function () {
    const MyContract = await ethers.getContractFactory("MyContract");
    myContract = await MyContract.deploy(initialValue);
    await myContract.waitForDeployment();

    [owner, admin] = await ethers.getSigners();
  });


  it("should initialize myVariable with the correct initial value", async function () {
    const actualValue = await myContract.myVariable();
    const expectedValue = initialValue;
    expect(actualValue).to.equal(expectedValue);
  });

  it("should initialize myFunction with the correct initial value", async function () {
    const actualValue = await myContract.myFunction();
    const expectedValue = initialValue;
    expect(actualValue).to.equal(expectedValue);
  });

  it("should initialize owner correctly", async function () {
    const contractOwner = await myContract.owner();
    expect(contractOwner).to.equal(owner.address);
  });

  it("should initialize admin correctly", async function () {
    const contractAdmin = await myContract.admin();
    expect(contractAdmin).to.equal(ZERO_ADDRESS);
  });

  it("should change owner correctly", async function () {
    await myContract.connect(owner).changeOwner(admin.address);
    const newOwner = await myContract.owner();
    expect(newOwner).to.equal(admin.address);
  });

  it("should set admin correctly", async function () {
    await myContract.connect(owner).setAdmin(admin.address);
    const newAdmin = await myContract.admin();
    expect(newAdmin).to.equal(admin.address);
  });

  it("should increment myVariable in restrictedFunction", async function () {
    await myContract.connect(owner).setAdmin(admin.address);
    await myContract.connect(admin).restrictedFunction();
    const myVariable = await myContract.myVariable();
    expect(myVariable).to.equal(43);
  });

  it("should revert when calling restrictedFunction without admin role", async function () {
    await expect(myContract.connect(owner).restrictedFunction()).to.be.revertedWith(
      "Only admin can call this function"
    );
  });
});
