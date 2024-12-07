const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  const DAO = await ethers.getContractFactory("DAO");
  const dao = await DAO.deploy();
  await dao.deployed();
  console.log("DAO contract deployed to:", dao.address);

  const DatasetValidation = await ethers.getContractFactory(
    "DatasetValidation"
  );
  const datasetValidation = await DatasetValidation.deploy();
  await datasetValidation.deployed();
  console.log(
    "DatasetValidation contract deployed to:",
    datasetValidation.address
  );

  const NFTRewards = await ethers.getContractFactory("NFTRewards");
  const nftRewards = await NFTRewards.deploy();
  await nftRewards.deployed();
  console.log("NFTRewards contract deployed to:", nftRewards.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
