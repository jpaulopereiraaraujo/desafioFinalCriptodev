const { messagePrefix } = require("@ethersproject/hash");
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("vending", async () => {

    it("restock gama-Test", async function () {
        const [owner, wallet1] = await ethers.getSigners();

        const token = await ethers.getContractFactory("VendingMachine", {
            signer: owner

        });

        const tokenTest = await token.deploy();

        await tokenTest.deployed();



        await tokenTest.restockGama(100);

        console.log(await tokenTest.getVendingMachineBalanceGama())

        expect(100).to.equal(await tokenTest.getVendingMachineBalanceGama())



    });

    it("restock Test-ether-exchange and withdraw", async function () {
        const [owner, wallet1] = await ethers.getSigners();

        const token = await ethers.getContractFactory("VendingMachine", {
            signer: owner

        });

        const tokenTest = await token.deploy();

        await tokenTest.deployed();
        //console.log(taxchange)
        //await tokenTest.connect(wallet1); modifica a carteira de ethers da transação

        const restockEth = await tokenTest.restockEth({
            value: ethers.utils.parseEther("50.0")
        }); //juntamente com o restockEth() passa o valor em ethers para o contrato

        await restockEth.wait()

        expect(await tokenTest.contractBalance()).to.equal("50000000000000000000");

    });

    it("withdraw-test", async function () {
        const [owner, wallet1] = await ethers.getSigners();

        const token = await ethers.getContractFactory("VendingMachine", {
            signer: owner

        });

        const tokenTest = await token.deploy();
        await tokenTest.deployed();

        const firstBalance = await tokenTest.ownerBalance();
        
        const restockEth = await tokenTest.restockEth({
            value: ethers.utils.parseEther("50.0")
        }); 
        await restockEth.wait()

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

    });

    it("conversion weiEther test", async function () {
        const [owner, wallet1] = await ethers.getSigners();

        const token = await ethers.getContractFactory("VendingMachine", {
            signer: owner

        });

        const tokenTest = await token.deploy();
        await tokenTest.deployed();

        const oneEtherTest = "1000000000000000000";
        const twoEtherTest = "2000000000000000000";

        expect(await tokenTest.weiToEther(1)).to.equal(oneEtherTest);
        expect(await tokenTest.weiToEther(2)).to.equal(twoEtherTest);

        console.log(oneEtherTest);
        console.log(twoEtherTest);

    });




});