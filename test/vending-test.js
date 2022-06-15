const { messagePrefix } = require("@ethersproject/hash");
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("vending", async () => {
  it("1 restock gama-Test", async function () {
    const [owner, wallet1] = await ethers.getSigners();

    const token = await ethers.getContractFactory("VendingMachine", {
      signer: owner,
    });

    const tokenTest = await token.deploy();

    await tokenTest.deployed();

    await tokenTest.restockGama(100);

    console.log(await tokenTest.getVendingMachineBalanceGama());

    expect(100).to.equal(await tokenTest.getVendingMachineBalanceGama());
  });

  it("2 restock gama-Test - negative", async function () {
    const [owner, wallet1] = await ethers.getSigners();

    const token = await ethers.getContractFactory("VendingMachine", {
      signer: owner,
    });

    const tokenTest = await token.deploy();

    await tokenTest.deployed();

    console.log(await tokenTest.getVendingMachineBalanceGama());

    await expect(tokenTest.restockGama(0)).to.be.revertedWith(
      "You can't restock 0 or less Gamas."
    );
  });

  it("3 restock Test-ether-exchange", async function () {
    const [owner, wallet1] = await ethers.getSigners();

    const token = await ethers.getContractFactory("VendingMachine", {
      signer: owner,
    });

    const tokenTest = await token.deploy();

    await tokenTest.deployed();
    //console.log(taxchange)
    //await tokenTest.connect(wallet1); modifica a carteira de ethers da transação

    const restockEth = await tokenTest.restockEth({
      value: ethers.utils.parseEther("50.0"),
    }); //juntamente com o restockEth() passa o valor em ethers para o contrato

    await restockEth.wait();

    expect(await tokenTest.contractBalance()).to.equal("50000000000000000000");
  });

  it("4 restock Test-ether-exchange -negative", async function () {
    const [owner, wallet1] = await ethers.getSigners();

    const token = await ethers.getContractFactory("VendingMachine", {
      signer: owner,
    });

    const tokenTest = await token.deploy();

    await tokenTest.deployed();
    //console.log(taxchange)
    //await tokenTest.connect(wallet1); modifica a carteira de ethers da transação

    /* const restockEth = await tokenTest.restockEth({
            value: ethers.utils.parseEther("0")
        }); //juntamente com o restockEth() passa o valor em ethers para o contrato

        await restockEth.wait(); */

    await expect(
      tokenTest.restockEth({
        value: ethers.utils.parseEther("0"),
      })
    ).to.be.revertedWith("You can't restock 0 or less Ethers.");
  });

  it("5 withdraw-test", async function () {
    const [owner, wallet1] = await ethers.getSigners();

    const token = await ethers.getContractFactory("VendingMachine", {
      signer: owner,
    });

    const tokenTest = await token.deploy();
    await tokenTest.deployed();

    const firstBalance = await tokenTest.ownerBalance();

    const restockEth = await tokenTest.restockEth({
      value: ethers.utils.parseEther("50.0"),
    });
    await restockEth.wait();

    const valueToWithdraw = 50;
    await tokenTest.toWithdraw(valueToWithdraw);

    // doc das operações com BigNumber>>"https://docs.ethers.io/v5/api/utils/bignumber/"
    const newBalance = await tokenTest.ownerBalance();

    //Primeiro calcula o tax exchange, subtraindo o valor anterior do posterior
    const taxchange = firstBalance.sub(newBalance);

    //Depois soma-se com o valor do saldo apos o withdraw
    const balanceAfterWithdrawPlusTax = newBalance.add(taxchange);

    //assim >>>> novo saldo + transferência = saldo anterior<<< tem q ser verdadeiro
    expect(balanceAfterWithdrawPlusTax).to.equal(firstBalance);

    expect(await tokenTest.contractBalance()).to.equal("0");
  });

  it("6 conversion weiEther test", async function () {
    const [owner, wallet1] = await ethers.getSigners();

    const token = await ethers.getContractFactory("VendingMachine", {
      signer: owner,
    });

    const tokenTest = await token.deploy();
    await tokenTest.deployed();

    const oneEtherTest = "1000000000000000000";
    const twoEtherTest = "2000000000000000000";

    expect(await tokenTest.weiToEther(1)).to.equal(oneEtherTest);
    expect(await tokenTest.weiToEther(2)).to.equal(twoEtherTest);
  });

  it("7 purchase test", async function () {
    const [owner, wallet1] = await ethers.getSigners();

    const token = await ethers.getContractFactory("VendingMachine", {
      signer: wallet1,
    });

    const tokenTest = await token.deploy();
    await tokenTest.deployed();

    await tokenTest.restockGama(400);

    await tokenTest.setGamaBuyValue(1);

    await tokenTest.setGamaSellValue(2);

    /* expect(await tokenTest.contractBalance()).to.equal("52000000000000000000"); */

    await tokenTest.purchaseGama(320, {
      value: ethers.utils.parseEther("160"),
    });

    //Teste do valor em ethers no caixa da máquina
    expect("160000000000000000000").to.equal(
      await tokenTest.getVendingMachingBalanceEth()
    );

    //Teste do valor em gamas no caixa
    expect(80).to.equal(await tokenTest.getVendingMachineBalanceGama());

    //Teste do valor em gamas no comprador
    expect(await tokenTest.getBuyerBalanceGama()).to.equal(320);
  });
});
