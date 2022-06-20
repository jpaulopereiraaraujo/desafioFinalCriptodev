# Projeto Final - CriptoDev
<!-- Este projeto demonstra um caso de uso básico do Hardhat. Ele vem com um contrato de amostra, um teste para esse contrato, um script de amostra que implanta esse contrato e um exemplo de implementação de tarefa, que simplesmente lista as contas disponíveis. -->
Nesse projeto nós construimos uma espécie de vending machine, como se fosse um caixa eletrônico, nessa máquina você pode comprar e vender ether, e comprar e vender "Gama Token".
Nesse projeto nós usamos o Solidity para construir o smart contract e o token, e foram feito testes unitários em todas as funções, utilizando o hardhat e o chai.

Instruções do desafio [link](https://github.com/jcbombardelli/gamacoin-cryptodev)

<!-- ## Como Rodar -->

<!-- ### Pré-requisitos
- [Hardhat](https://hardhat.org/) (v2 ou superior) -->

## Abrir e rodar o projeto

```bash
# Clonando o projeto
$ git clone https://github.com/jpaulopereiraaraujo/desafioFinalCriptodev.git

# Instalando dependências
$ npm install 

# Compilando os arquivos
$ npx hardhat start

# Rodando os testes
$ npx hardhat test
```

## Dependências utilizadas

- Hardhat
- Chai
- Mocha
- Ethereum Waffle
- Ethers

## Funcionalidades Publicas

- PurchaseGama: Nessa funcionalidade é possível comprar o "Gama Token", a relação padrão do Gama Token para o Ether é de 1 pra 1, para comprar 10 gama tokens é preciso de 10 ethers, nessa funcionalidade você compra o token direto da maquina.

- SellingGama: Nessa funcionalidade é possível vender o "Gama Token", nesse caso você vende seus Gama Tokens para a máquina.

- GetVendingMachineBalanceGama: Nessa funcionalidade é possível veficicar o balanço de Gama Token da máquina.

- GetVendingMachingBalanceEth: Nessa funcionalidade é possível verificar o balanço de Ethers da máquina.

- GetBuyerBalanceGama: Nessa funcionalidade é possível verificar o balanço de Gama Token que foi comprado pela máquina.

## Funcionalidades de manutenção/Owner

- SetGamaBuyValue: Nessa funcionalidade é possível definir o valor de compra do Gama Token.

- SetGamaSellValue: Nessa funcionalidade é possível definir o valor de venda do Gama Token.

- RestockGama: Essa funcionalidade foi feita pra dar o mint no token, quando o balanço de Gama Token da máquina tiver abaixo de 50, é possível reabastece-lá com mais 1000 tokens, que serão transferidos do contrato do token para o da máquina.

- RestockEth: Essa funcionalidade foi feita para estocar mais Ethers na máquina, nesse caso o Ether vem da carteira do Owner.

- ToWithdraw: Nessa funcionalidade é possível sacar os tokens da máquina.

## Desenvolvedores

Jefferson Luiz [Github](https://github.com/devworlds)

Guilherme Boaventura [Github](https://github.com/guilhermeboaventurarodrigues)

João Paulo [Github](https://github.com/jpaulopereiraaraujo)

Kaio Machado [Github](https://github.com/kaiobmachado)
