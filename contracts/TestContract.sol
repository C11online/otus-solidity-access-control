// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract TestContract {
    uint public i;
    address public immutable msig;

    constructor(address _msig) {
    msig = _msig;
    }

    modifier onlyMsig() {
        require(msg.sender == msig, "Only msig can call this function");
        _;
    }

    function callMe(uint j) public onlyMsig {
        i += j;
    }

    function getData(uint256 arg1) public pure returns (bytes memory) {
        return abi.encodeWithSignature("callMe(uint256)", arg1);
    }
}