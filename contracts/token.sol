// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

import "./libs.sol";

interface IERC20 {
    //Implementado (mais ou menos)
    function totalSupply() external view returns (uint256);

    function balanceOf(address account) external view returns (uint256);

    function transfer(address recipient, uint256 amount)
        external
        returns (bool);

    //Não implementados (ainda)
    //function allowence(address owner, address spender) external view returns(uint256);
    //function approve(address spender, uint256 amount) external returns(bool);
    //function transferFrom(address sender, address recipient, uint256 amount) external returns(bool);

    //Implementado
    event Transfer(address from, address to, uint256 value);

    //Não está implementado (ainda)
    //event Approval(address owner, address spender, uint256 value);
}

contract CryptoToken is IERC20 {
    //Libs
    using Math for uint256;

    //Enums

    enum Status {
        ACTIVE,
        PAUSED,
        CANCELLED,
        KILLED
    }

    //Properties
    string public constant name = "CryptoToken";
    string public constant symbol = "CRY";
    uint8 public constant decimals = 3; //Default dos exemplos é sempre 18
    uint256 private totalsupply;
    uint256 private burnable;
    address private owner;
    address[] private tokenOwners;
    address private furnace;
    Status contractState;

    mapping(address => uint256) private addressToBalance;

    modifier isOwner() {
        require(address(msg.sender) == owner, "Sender is not owner!");
        _;
    }

    // Events

    //Constructor
    constructor() {
        uint256 total = 100;
        totalsupply = total;
        owner = msg.sender;
        addressToBalance[owner] = totalsupply;
        tokenOwners.push(owner);
        contractState = Status.ACTIVE;
    }

    //Public Functions
    function totalSupply() public view override returns (uint256) {
        require(
            contractState == Status.ACTIVE,
            "The Contract is not available now :("
        );
        return totalsupply;
    }

    function balanceOf(address tokenOwner)
        public
        view
        override
        returns (uint256)
    {
        require(
            contractState == Status.ACTIVE,
            "The Contract is not available now :("
        );
        return addressToBalance[tokenOwner];
    }

    function burn(uint256 value) public isOwner returns (bool) {
        //require(contractState == Status.ACTIVE,"The Airdrop is not available now :(");
        require(
            contractState == Status.ACTIVE,
            "The Contract is not available now :("
        );
        furnace = 0xf000000000000000000000000000000000000000;

        for (uint256 i = 0; i < tokenOwners.length; i++) {
            addressToBalance[tokenOwners[i]] = addressToBalance[tokenOwners[i]]
                .percent(value);

            emit Transfer(
                tokenOwners[i],
                furnace,
                addressToBalance[tokenOwners[i]]
            );
        }
        totalsupply = totalsupply.percent(value);

        return true;
    }

    function autoBurn(uint256 value) public isOwner {
        require(
            contractState == Status.ACTIVE,
            "The Contract is not available now :("
        );
        burnable = value;
        burn(burnable);
    }

    function transfer(address receiver, uint256 quantity)
        public
        override
        isOwner
        returns (bool)
    {
        require(
            contractState == Status.ACTIVE,
            "The Contract is not available now :("
        );
        require(
            quantity <= addressToBalance[owner],
            "Insufficient Balance to Transfer"
        );
        addressToBalance[owner] = addressToBalance[owner] - quantity;
        addressToBalance[receiver] = addressToBalance[receiver] + quantity;
        tokenOwners.push(receiver);
        autoBurn(burnable);

        emit Transfer(owner, receiver, quantity);
        return true;
    }

    //Mint: Adicionar tokens ao total supply
    function mintToken() public isOwner {
        require(
            contractState == Status.ACTIVE,
            "The Contract is not available now :("
        );
        uint256 amount = 50;
        if (balanceOf(owner) < 51) {
            totalsupply += amount;
            addressToBalance[owner] += amount;
            emit Transfer(owner, owner, 50);
        }
    }

    function state() public view returns (Status) {
        return contractState;
    }

    function cancelContract() public isOwner {
        contractState = Status.CANCELLED;
    }

    function pauseContract() public isOwner {
        contractState = Status.PAUSED;
    }

    function activeContract() public isOwner {
        contractState = Status.ACTIVE;
    }

    function kill() public isOwner {
        require(contractState == Status.CANCELLED, "The contract is active");
        contractState = Status.KILLED;
        selfdestruct(payable(owner));
    }
}
