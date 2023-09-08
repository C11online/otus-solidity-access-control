// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract RBAC {
    mapping(address => bool) private admins;
    mapping(address => bool) private users;

    event AdminOnlyFunctionCalled(address admin);
    event UserOnlyFunctionCalled(address user);

    constructor() {
    admins[msg.sender] = true;
    }

    modifier onlyAdmin() {
        require(admins[msg.sender], "Only admins can call this function");
        _;
    }

    modifier onlyUser() {
        require(users[msg.sender], "Only users can call this function");
        _;
    }

    function addAdmin(address _admin) public onlyAdmin {
        admins[_admin] = true;
    }

    function removeAdmin(address _admin) public onlyAdmin {
        admins[_admin] = false;
    }

    function addUser(address _user) public onlyAdmin {
        users[_user] = true;
    }

    function removeUser(address _user) public onlyAdmin {
        users[_user] = false;
    }

    function isAdmin(address _address) public view returns (bool) {
        return admins[_address];
    }

    function isUser(address _address) public view returns (bool) {
        return users[_address];
    }

    // Example function accessible only to admins
    function adminOnlyFunction() public onlyAdmin {
        // Function logic here
        emit AdminOnlyFunctionCalled(msg.sender);
    }

    // Example function accessible only to users
    function userOnlyFunction() public onlyUser {
        // Function logic here
        emit UserOnlyFunctionCalled(msg.sender);
    }
}
