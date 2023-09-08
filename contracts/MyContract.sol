// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract MyContract {
    uint256 public myVariable;
    address public owner;
    address public admin;

    constructor(uint256 initialValue) {
    myVariable = initialValue;
    owner = msg.sender;
    }

    function myFunction() public view returns (uint256){
    return myVariable;
    }


    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can call this function");
        _;
    }

    function changeOwner(address _owner) public onlyOwner {
        owner = _owner;
    }

    function setAdmin(address _admin) public onlyOwner {
        admin = _admin;
    }

    function restrictedFunction() public onlyAdmin {
        myVariable ++;
    }

}
