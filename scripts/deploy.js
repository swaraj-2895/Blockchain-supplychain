const { ADDRCONFIG } = require("dns");
const { ethers, Contract } = require("ethers");
const hre = require("hardhat");

async function main() {
  const deployers = await hre.ethers.getSigners();
  
  const first_payment = ethers.utils.parseEther("0.0000000000000012");

  console.log('Deploying contracts with the account: ' + deployers[0].address);

  const SupplyChain = await hre.ethers.getContractFactory("SupplyChain");
  const Item = await hre.ethers.getContractFactory("Item_o");

  const supplychain = await SupplyChain.deploy();

  var item_cont = await supplychain.CreateItem(1, 1200);
  
  var cont_addr = await supplychain.view_address();

  console.log("Successfully deployed SupplyChain contract");

  supplychain.on("SupplyChainStep", (index, step, addr)=>{
    console.log(index, step, addr);
  });

  tx = { to: cont_addr,
         value: ethers.utils.parseEther("0.0000000000000012")
  };

  const transact = await deployers[0].sendTransaction(tx);

  console.log("Payment sent");

  var get_bal = await supplychain.get_balance();

  console.log(get_bal);



}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

