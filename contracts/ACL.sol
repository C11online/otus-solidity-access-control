// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract ACL {
    IERC20 public token;
    address public owner;
    mapping(address => mapping(bytes4 => bool)) private acl;

    event FunctionAccessSet(address indexed user, bytes4 indexed functionSig, bool allowed);

    modifier onlyOwner() {
    require(msg.sender == owner, "Only owner can call this function");
    _;
    }

    constructor(IERC20 _token) {
        token = _token;
        owner = msg.sender;
    }

    function setFunctionAccess(address user, bytes4 functionSig, bool allowed) external onlyOwner() {
        acl[user][functionSig] = allowed;
        emit FunctionAccessSet(user, functionSig, allowed);
    }

    function setAccessToDrop10(address user) external onlyOwner() {
        acl[user][bytes4(keccak256("drop10()"))] = true;
        emit FunctionAccessSet(user, bytes4(keccak256("drop10()")), true);
    }

    function setAccessToDrop20(address user) external onlyOwner() {
        acl[user][bytes4(keccak256("drop20()"))] = true;
        emit FunctionAccessSet(user, bytes4(keccak256("drop20()")), true);
    }

    function hasFunctionAccess(address user, bytes4 functionSig) public view returns (bool) {
        return acl[user][functionSig];
    }

    function getFunctionName() public pure returns (string memory) {
        bytes4 functionSelector = bytes4(keccak256("getFunctionName()"));
        functionSelector;
        return abi.decode(msg.data[4:], (string));
    }

    function getFunctionSelectorDrop10() public pure returns (bytes4) {
        return bytes4(keccak256("drop10()"));
    }

    function getFunctionSelectorDrop20() public pure returns (bytes4) {
        return bytes4(keccak256("drop20()"));
    }

    modifier onlyWithAccessTo(bytes4 _functionSig) {
        require(hasFunctionAccess(msg.sender, _functionSig), "Access denied");
        _;
    }

    function drop10() external onlyWithAccessTo(bytes4(keccak256("drop10()"))) {
        require(token.balanceOf(address(this)) >= 10, "Not enough tokens available");
        token.transfer(msg.sender, 10);
    }

    function drop20() external onlyWithAccessTo(bytes4(keccak256("drop20()"))) {
        require(token.balanceOf(address(this)) >= 20, "Not enough tokens available");
        token.transfer(msg.sender, 20);
    }

}