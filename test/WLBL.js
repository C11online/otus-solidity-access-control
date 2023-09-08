const { expect } = require("chai");

describe("WLBL", function () {
    let accessControl;
    let owner;
    let whitelistedUser;
    let blacklistedUser;

    beforeEach(async function () {
        const AccessControl = await ethers.getContractFactory("WLBL");
        accessControl = await AccessControl.deploy();
        await accessControl.waitForDeployment();

        [owner, whitelistedUser, blacklistedUser] = await ethers.getSigners();
    });

    it("should allow whitelisted user to perform restricted action", async function () {
        await accessControl.addToWhitelist(whitelistedUser.address);
        await expect(accessControl.connect(whitelistedUser).performRestrictedAction())
      .to.emit(accessControl, "performRestrictedActionEvent").withArgs(whitelistedUser.address);

    });

    it("should deny blacklisted user from performing restricted action", async function () {
        await accessControl.addToBlacklist(blacklistedUser.address);

        // Attempt to perform the restricted action
        await expect(accessControl.connect(blacklistedUser).performRestrictedAction()).to.be.revertedWith("Access denied");
    });
});
