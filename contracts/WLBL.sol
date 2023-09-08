// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract WLBL {
    mapping(address => bool) private whitelist;
    mapping(address => bool) private blacklist;

    event performRestrictedActionEvent(address user);

    constructor() {
    whitelist[msg.sender] = true;
    }

    modifier onlyWhitelisted() {
        require(whitelist[msg.sender], "Access denied");
        _;
    }

    modifier notBlacklisted() {
        require(!blacklist[msg.sender], "Access denied");
        _;
    }

    function addToWhitelist(address _address) external onlyWhitelisted {
        whitelist[_address] = true;
    }

    function addToBlacklist(address _address) external onlyWhitelisted {
        blacklist[_address] = true;
    }

    function removeFromWhitelist(address _address) external onlyWhitelisted {
        whitelist[_address] = false;
    }

    function removeFromBlacklist(address _address) external onlyWhitelisted {
        blacklist[_address] = false;
    }

    function isWhitelisted(address _address) external view returns (bool) {
        return whitelist[_address];
    }

    function isBlacklisted(address _address) external view returns (bool) {
        return blacklist[_address];
    }

    function performRestrictedAction() external onlyWhitelisted notBlacklisted {
        // Perform restricted action here
        emit performRestrictedActionEvent(msg.sender);
    }
}
