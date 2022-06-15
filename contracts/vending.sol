// SPDX-License-Identifier: MIT
pragma solidity >0.7.0 <0.9.0;

contract VendingMachine {

    // Properties
    address public owner;
    mapping (address => uint) public GamaToBalances;
    mapping (address => uint) private EthToBalances;
    uint256 private gamaBuyValue;
    uint256 private gamaSellValue;
    uint256 private senderValue;
    

    // Modifers
    modifier isOwner(){
        require(msg.sender == owner, "Only the onwer can make this");
        _;
    }

    //Constructor

    constructor(){
        owner = msg.sender;
        gamaBuyValue =1;
        gamaSellValue = 1;
    }

    // Public Function

		//Função para Compra de Gama por ETH na máquina de venda.
    function purchaseGama(uint256 amount) public payable  {
        uint256 avaiableEther;
        avaiableEther = msg.value/1000000000000000000;
        require(avaiableEther*gamaSellValue == amount*gamaBuyValue,"Please quantity of ethers must be proportional to the price ratio");
        //um "if" pra indicar o valor mínimo de compra no caso é de 1 eth, já que no exemplo 1 eth = 1gama
        require(msg.value > 0 ,"Erro, not enough ethers to trade.");
        
				//um "if" pra saber se existe gama suficiente pra vender na máquina da venda.
        require(GamaToBalances[address(this)] >= amount, "Not enough Gamas in stock to fulfill purchase request.");
				//decremento do valor comprado em gama da máqunia
        GamaToBalances[address(this)] -= amount;
				//incremento do valor comprado para carteira do comprador
        GamaToBalances[msg.sender] += amount;
				//incremento do eth pago na transação para o saldo de ETH da máquina de venda

        
    }

	    function sellingGama(uint256 amount) public payable {
			//Aqui são os mesmo comentários do de compra só que pro de venda.
        //require(GamaToBalances[msg.sender] >= amount * 1 ether, "You must Sell at least 1 ether in Gama.");
        require(GamaToBalances[msg.sender] >= amount, "Not enough Gamas to trade for ether.");
        GamaToBalances[msg.sender] -= amount;
        GamaToBalances[address(this)] += amount;
				//essas duas ultimas linhas estão diferentes da função de cima por causa de 
        //um detalhe que percebi, se agente coloca apenas 
			  //"EthToBalances[address(this)] -= amount" eu estaria adicionado o valor em wei
        //então quando a carteira vendesse 1 gama = 1 eth a gente receberia 1 wei, 
				//por isso criei uma var weiToEther com o valor de 1 eth em wei ai 
				// só multiplicar o amount pela weiToEther que temos o valor em ETHER, 
        //deu pra sacar? 
        EthToBalances[address(this)] -= weiToEther(amount);
        payable(msg.sender).transfer(weiToEther(amount)*gamaSellValue);
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
        return GamaToBalances[address(owner)];

    }

    function getVendingMachingBalanceEth() public view returns(uint256 EthToken){
        return address(this).balance;
    }


    function setGamaSellValue(uint256 newValue) public isOwner{
        require(newValue > 0,"New value must be higher than 0.");
        gamaSellValue = newValue;

    }

    function setGamaBuyValue(uint256 newValue) public isOwner{
        require(newValue > 0,"New value must be higher than 0.");
        gamaBuyValue = newValue;
    }

    //Funções de manutenção

    function restockGama(uint256 amountGama) public isOwner{
        require(amountGama > 0,"You can't restock 0 or less Gamas.");
        GamaToBalances[address(this)] += amountGama;
    }

    function restockEth() public payable isOwner{
        require(msg.value >0,"You can't restock 0 or less Ethers.");
        
    }

    function contractBalance () public view returns(uint256) {
      return address(this).balance;
    }

    function ownerBalance() public view returns(uint256){
      return address(owner).balance;
    }

    function toWithdraw(uint256 amountWithdraw) public payable isOwner{
        require(amountWithdraw <= address(this).balance, "Not enough eth to withdraw.");
        payable(msg.sender).transfer(weiToEther(amountWithdraw));
    }

    // Private Functions
    

    
}