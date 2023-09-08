const { expect } = require("chai");

describe("RBAC", function () {
  let rbac;
  let admin;
  let user;

  beforeEach(async function () {
    const RBAC = await ethers.getContractFactory("RBAC");
    rbac = await RBAC.deploy();
    await rbac.waitForDeployment();

    [admin, user] = await ethers.getSigners();
  });

  it("should add and remove admin", async function () {
    await rbac.addAdmin(admin.address);
    expect(await rbac.isAdmin(admin.address)).to.be.true;

    await rbac.removeAdmin(admin.address);
    expect(await rbac.isAdmin(admin.address)).to.be.false;
  });

  it("should add and remove user", async function () {
    await rbac.addUser(user.address);
    expect(await rbac.isUser(user.address)).to.be.true;

    await rbac.removeUser(user.address);
    expect(await rbac.isUser(user.address)).to.be.false;
  });

  it("should allow admin to call adminOnlyFunction", async function () {
    await rbac.addAdmin(admin.address);

    await expect(rbac.adminOnlyFunction())
      .to.emit(rbac, "AdminOnlyFunctionCalled")
      .withArgs(admin.address);
  });

  it("should allow user to call userOnlyFunction", async function () {
    await rbac.addUser(user.address);

    await expect(rbac.connect(user).userOnlyFunction())
      .to.emit(rbac, "UserOnlyFunctionCalled")
      .withArgs(user.address);
  });

  it("should revert when non-admin calls adminOnlyFunction", async function () {
    await expect(rbac.connect(user).adminOnlyFunction()).to.be.revertedWith(
      "Only admins can call this function"
    );
  });

  it("should revert when non-user calls userOnlyFunction", async function () {
    await expect(rbac.connect(admin).userOnlyFunction()).to.be.revertedWith(
      "Only users can call this function"
    );
  });
});
