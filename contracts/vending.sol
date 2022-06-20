// SPDX-License-Identifier: MIT
pragma solidity >0.7.0 <0.9.0;

import "./token.sol";

contract VendingMachine {

    // Properties
    address public owner2;
    mapping (address => uint) public GamaToBalances;
    uint256 private gamaBuyValue;
    uint256 private gamaSellValue;
    address private tokenAddress;

    event Transfer(address from, address to, uint256 value);

    // Modifers
    modifier isOwner2(){
        require(msg.sender == owner2, "Only the onwer can make this");
        _;
    }

    //Constructor
    constructor(address contractAddress){
        owner2 = msg.sender;
        gamaBuyValue = 1;
        gamaSellValue = 1;
        tokenAddress = contractAddress;
    }

    // Public Function

		//Função para Compra de Gama por ETH na máquina de venda.
    function purchaseGama(uint256 amount) public payable{
        uint256 avaiableEther;
        avaiableEther = msg.value/1000000000000000000;
        require(avaiableEther*gamaBuyValue == amount,"Please quantity of ethers must be proportional to the price ratio");
        require(msg.value > 0 ,"Erro, not enough ethers to trade.");
        
        require(GamaToBalances[address(this)] >= amount, "Not enough Gamas in stock to fulfill purchase request.");
        GamaToBalances[address(this)] -= amount;
        GamaToBalances[msg.sender] += amount;
        emit Transfer(address(this), msg.sender, amount);
    }

	  function sellingGama(uint256 amount) public{
        require(GamaToBalances[msg.sender] >= amount, "Not enough Gamas to trade for ether.");
        GamaToBalances[msg.sender] -= amount;
        GamaToBalances[address(this)] += amount;
        payable(msg.sender).transfer(weiToEther(amount)*gamaSellValue);
        emit Transfer(msg.sender, address(this), amount);
    }

    //Function weiToEther *Converte de wei para ether
    function weiToEther(uint256 amount) public pure returns(uint256 weiEther){
        weiEther = amount*1000000000000000000;
        return weiEther;
    }

    //Functions Getters and Setters
    function getVendingMachineBalanceGama() public view returns(uint256 GamaToken){
        return GamaToBalances[address(this)];
    }

    function getBuyerBalanceGama() public view returns(uint256 GamaToken){
        return GamaToBalances[address(owner2)];

    }

    function getVendingMachingBalanceEth() public view returns(uint256 EthToken){
        return address(this).balance;
    }

    function setGamaSellValue(uint256 newValue) public isOwner2{
        require(newValue > 0,"New value must be higher than 0.");
        gamaSellValue = newValue;
    }

    function setGamaBuyValue(uint256 newValue) public isOwner2{
        require(newValue > 0,"New value must be higher than 0.");
        gamaBuyValue = newValue;
    }

    //Funções de manutenção
    function restockGama() public isOwner2 {
        require(getVendingMachineBalanceGama() < 50,"You need to have less than 50 to restock.");
        uint256 amountGama = 1000;
        require(amountGama > 0,"You can't restock 0 or less Gamas.");
          
        CryptoToken(tokenAddress).transferFrom(owner2, address(this), amountGama);
        GamaToBalances[address(this)] += amountGama;
    }

    function getOwner() public view returns(address){
        return address(owner2);
    }
  
    function restockEth() public payable isOwner2{
        require(msg.value > 0,"You can't restock 0 or less Ethers.");
    }

    function contractBalance () public view returns(uint256) {
        return address(this).balance;
    }

    function ownerBalance() public view returns(uint256){
        return address(owner2).balance;
    }

    function toWithdraw(uint256 amountWithdraw) public payable isOwner2{
        require(amountWithdraw <= address(this).balance, "Not enough eth to withdraw.");
        payable(msg.sender).transfer(weiToEther(amountWithdraw));
        emit Transfer(address(this), msg.sender, amountWithdraw);
    }
}
