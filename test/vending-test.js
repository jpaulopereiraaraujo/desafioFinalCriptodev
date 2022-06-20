const { messagePrefix } = require("@ethersproject/hash");
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("vending", async () => {
    
    let libTest,token, tokenTest, VENDING, vending;
    

    beforeEach(async () => {
    const lib = await ethers.getContractFactory("Math");
    libTest = await lib.deploy();
    

    

    
  });



  it("1 restock gama-Test", async function () {
    const [owner, wallet1] = await ethers.getSigners();

    const token = await ethers.getContractFactory("CryptoToken", {
      libraries: { Math: libTest.address },
      signer: owner,
    });

    const tokenTest = await token.deploy();

    await tokenTest.deployed();

    const VENDING = await ethers.getContractFactory("VendingMachine");
    const vending = await VENDING.deploy(tokenTest.address);
    await vending.deployed();

    await tokenTest.approve(vending.address,1000);

    console.log(await tokenTest.allowence(owner.address,vending.address))
    
    await vending.restockGama();
    
    console.log(await vending.getVendingMachineBalanceGama())

    console.log(await tokenTest.totalSupply());
    expect(1000).to.equal(await vending.getVendingMachineBalanceGama());
    
    
    
    await vending.purchaseGama(1000, {
      value: ethers.utils.parseEther("1000"),

      
    });
    console.log(await tokenTest.allowence(owner.address,vending.address));

    console.log(await vending.getVendingMachineBalanceGama());


    await tokenTest.mintToken();

    await tokenTest.approve(vending.address,1000);

    await vending.restockGama();

    console.log(await tokenTest.totalSupply());
  
    

     expect(1000).to.equal(await vending.getVendingMachineBalanceGama());

     expect(await vending.contractBalance()).to.equal("1000000000000000000000")
 
    
  });

 
   it("2 restock Test-ether-exchange", async function () {
    const [owner, wallet1] = await ethers.getSigners();

    const token = await ethers.getContractFactory("CryptoToken", {
      libraries: { Math: libTest.address },
      signer: owner,
    });

    const tokenTest = await token.deploy();

    await tokenTest.deployed();

    const VENDING = await ethers.getContractFactory("VendingMachine");
    const vending = await VENDING.deploy(tokenTest.address);
    await vending.deployed();
    
    //console.log(taxchange)
    //await vending.connect(wallet1); modifica a carteira de ethers da transação

    const restockEth = await vending.restockEth({
      value: ethers.utils.parseEther("50.0"),
    }); //juntamente com o restockEth() passa o valor em ethers para o contrato

    await restockEth.wait();

    expect(await vending.contractBalance()).to.equal("50000000000000000000");
  });

  it("4 restock Test-ether-exchange -negative", async function () {
    const [owner, wallet1] = await ethers.getSigners();

    const token = await ethers.getContractFactory("CryptoToken", {
      libraries: { Math: libTest.address },
      signer: owner,
    });

    const tokenTest = await token.deploy();

    await tokenTest.deployed();

    const VENDING = await ethers.getContractFactory("VendingMachine");
    const vending = await VENDING.deploy(tokenTest.address);
    await vending.deployed();

  
    //console.log(taxchange)
    //await vending.connect(wallet1); modifica a carteira de ethers da transação


    await expect(
      vending.restockEth({
        value: ethers.utils.parseEther("0"),
      })
    ).to.be.revertedWith("You can't restock 0 or less Ethers.");
  });

  it("5 withdraw-test", async function () {
    const [owner, wallet1] = await ethers.getSigners();

    const token = await ethers.getContractFactory("CryptoToken", {
      libraries: { Math: libTest.address },
      signer: owner,
    });

    const tokenTest = await token.deploy();

    await tokenTest.deployed();

    const VENDING = await ethers.getContractFactory("VendingMachine");
    const vending = await VENDING.deploy(tokenTest.address);
    await vending.deployed();
    
    const firstBalance = await vending.ownerBalance();

    const restockEth = await vending.restockEth({
      value: ethers.utils.parseEther("50.0"),
    });
    await restockEth.wait();

    const valueToWithdraw = 50;
    await vending.toWithdraw(valueToWithdraw);

    // doc das operações com BigNumber>>"https://docs.ethers.io/v5/api/utils/bignumber/"
    const newBalance = await vending.ownerBalance();

    //Primeiro calcula o tax exchange, subtraindo o valor anterior do posterior
    const taxchange = firstBalance.sub(newBalance);

    //Depois soma-se com o valor do saldo apos o withdraw
    const balanceAfterWithdrawPlusTax = newBalance.add(taxchange);

    //assim >>>> novo saldo + transferência = saldo anterior<<< tem q ser verdadeiro
    expect(balanceAfterWithdrawPlusTax).to.equal(firstBalance);

    expect(await vending.contractBalance()).to.equal("0");
  });

  it("6 conversion weiEther test", async function () {
    const [owner, wallet1] = await ethers.getSigners();

    const token = await ethers.getContractFactory("CryptoToken", {
      libraries: { Math: libTest.address },
      signer: owner,
    });

    const tokenTest = await token.deploy();

    await tokenTest.deployed();

    const VENDING = await ethers.getContractFactory("VendingMachine");
    const vending = await VENDING.deploy(tokenTest.address);
    await vending.deployed();


    const oneEtherTest = "1000000000000000000";
    const twoEtherTest = "2000000000000000000";

    expect(await vending.weiToEther(1)).to.equal(oneEtherTest);
    expect(await vending.weiToEther(2)).to.equal(twoEtherTest);
  });
 
   it("7 purchase test", async function () {
    const [owner, wallet1] = await ethers.getSigners();

    const token = await ethers.getContractFactory("CryptoToken", {
      libraries: { Math: libTest.address },
      signer: owner,
    });

    const tokenTest = await token.deploy();

    await tokenTest.deployed();

    

    const VENDING = await ethers.getContractFactory("VendingMachine");
    const vending = await VENDING.deploy(tokenTest.address);
    await vending.deployed();

    await vending.setGamaBuyValue(2);

    await tokenTest.approve(vending.address,1000);

    console.log(await tokenTest.allowence(owner.address,vending.address))
    
    await vending.restockGama();

    await vending.purchaseGama(320, {
      value: ethers.utils.parseEther("160"),
    });

    //Teste do valor em ethers no caixa da máquina
    expect("160000000000000000000").to.equal(
      await vending.getVendingMachingBalanceEth()
    );

    //Teste do valor em gamas no caixa
    expect(680).to.equal(await vending.getVendingMachineBalanceGama());

    //Teste do valor em gamas no comprador
    expect(await vending.getBuyerBalanceGama()).to.equal(320);
  });

  it("8 selling test", async function () {
    const [owner, wallet1] = await ethers.getSigners();

    const token = await ethers.getContractFactory("CryptoToken", {
      libraries: { Math: libTest.address },
      signer: owner,
    });

    const tokenTest = await token.deploy();

    await tokenTest.deployed();

    const VENDING = await ethers.getContractFactory("VendingMachine");
    const vending = await VENDING.deploy(tokenTest.address);
    await vending.deployed();

    await tokenTest.approve(vending.address,1000);
    

    await vending.restockGama();

    await vending.setGamaBuyValue(1);

    await vending.setGamaSellValue(2);

    expect(await vending.contractBalance()).to.equal("0");

    await vending.purchaseGama(600, {
      value: ethers.utils.parseEther("600"),
    });

    console.log(await vending.getVendingMachingBalanceEth());


    await vending.sellingGama(100);

    console.log(await vending.getVendingMachingBalanceEth());

    expect("400000000000000000000").to.equal(await vending.getVendingMachingBalanceEth());

    expect(500).to.equal(await vending.getBuyerBalanceGama());

    expect(await vending.getVendingMachineBalanceGama()).to.equal(500);
    


    

  });

});
