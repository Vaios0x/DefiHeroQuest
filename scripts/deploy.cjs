const hre = require('hardhat');

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log('Deploying contracts with the account:', deployer.address);
  console.log('Account balance:', (await hre.ethers.provider.getBalance(deployer.address)).toString());

  // Deploy DeFiHeroQuest contract
  const DeFiHeroQuest = await hre.ethers.getContractFactory('DeFiHeroQuest');
  const deFiHeroQuest = await DeFiHeroQuest.deploy();
  await deFiHeroQuest.deployed();
  console.log('DeFiHeroQuest deployed to:', deFiHeroQuest.address);

  // Deploy DeFiHeroNFT
  const DeFiHeroNFT = await hre.ethers.getContractFactory('DeFiHeroNFT');
  const heroNFT = await DeFiHeroNFT.deploy(deployer.address);
  await heroNFT.deployed();
  console.log('DeFiHeroNFT deployed to:', heroNFT.address);

  // Deploy QuestManager
  const QuestManager = await hre.ethers.getContractFactory('QuestManager');
  const questManager = await QuestManager.deploy(deployer.address);
  await questManager.deployed();
  console.log('QuestManager deployed to:', questManager.address);

  // Deploy RewardDistributor
  const RewardDistributor = await hre.ethers.getContractFactory('RewardDistributor');
  const rewardDistributor = await RewardDistributor.deploy(deployer.address);
  await rewardDistributor.deployed();
  console.log('RewardDistributor deployed to:', rewardDistributor.address);

  // Deploy BridgeHelper
  const BridgeHelper = await hre.ethers.getContractFactory('BridgeHelper');
  const bridgeHelper = await BridgeHelper.deploy(deployer.address);
  await bridgeHelper.deployed();
  console.log('BridgeHelper deployed to:', bridgeHelper.address);

  console.log('Deployment completed!');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 