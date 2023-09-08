const { expect } = require("chai");

describe("MultiSigWallet", function () {
  let multiSigWallet;
  let testContract;
  let testContractAddr;
  let owner1;
  let owner2;
  let owner3;

  beforeEach(async function () {
    [owner1, owner2, owner3] = await ethers.getSigners();

    const MultiSigWallet = await ethers.getContractFactory("MultiSigWallet");
    multiSigWallet = await MultiSigWallet.deploy(
      [owner1.address, owner2.address, owner3.address],
      2 // numConfirmationsRequired
    );
    await multiSigWallet.waitForDeployment();

    const TestContract = await ethers.getContractFactory("TestContract");
    testContract = await TestContract.deploy();
    await testContract.waitForDeployment();
    testContractAddr = await testContract.getAddress();

  });

  it("should submit and execute a transaction", async function () {
    const data = testContract.interface.encodeFunctionData("callMe", [123]);

    await multiSigWallet.submitTransaction(testContractAddr, 0, data);

    const txIndex = 0;
    const [to, value, txData, executed, numConfirmations] =
      await multiSigWallet.getTransaction(txIndex);

    expect(to).to.equal(testContractAddr);
    expect(value).to.equal(0);
    expect(txData).to.equal(data);
    expect(executed).to.equal(false);
    expect(numConfirmations).to.equal(0);

    await multiSigWallet.connect(owner1).confirmTransaction(txIndex);
    await multiSigWallet.connect(owner2).confirmTransaction(txIndex);

    const initialI = await testContract.i();
    expect(initialI).to.equal(0);

    await multiSigWallet.executeTransaction(txIndex);

    const finalI = await testContract.i();
    expect(finalI).to.equal(123);
  });

  it("should revoke a confirmation", async function () {
    const data = testContract.interface.encodeFunctionData("callMe", [123]);

    await multiSigWallet.submitTransaction(testContractAddr, 0, data);

    const txIndex = 0;

    await multiSigWallet.connect(owner1).confirmTransaction(txIndex);
    await multiSigWallet.connect(owner2).confirmTransaction(txIndex);

    const [to, value, txData, executed, numConfirmations] =
      await multiSigWallet.getTransaction(txIndex);

    expect(to).to.equal(testContractAddr);
    expect(value).to.equal(0);
    expect(txData).to.equal(data);
    expect(executed).to.equal(false);
    expect(numConfirmations).to.equal(2);

    await multiSigWallet.connect(owner1).revokeConfirmation(txIndex);

    const [arg1, arg2, arg3, arg4, newNumConfirmations] = await multiSigWallet.getTransaction(txIndex);

    expect(newNumConfirmations).to.equal(1);
  });
});
