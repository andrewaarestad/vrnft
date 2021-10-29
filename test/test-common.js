
const {ethers} = require("hardhat");

// Ethereum mainnet
const vrfCoordinator = "0xf0d54349aDdcf704F77AE15b96510dEA15cb7952";
const linkToken = "0x514910771AF9Ca656af840dff83E8264EcF986CA";

class TestCommon {
  static async deployVRNFT() {
    const contractFactory = await ethers.getContractFactory("VRNFT");
    const contract = await contractFactory.deploy(vrfCoordinator, linkToken, "VRNFT", "VRNFT");
    await contract.deployed();
    return contract;
  }
  static async deploySRRNFT() {
    const contractFactory = await ethers.getContractFactory("SimpleRarityRankedNFT");
    const contract = await contractFactory.deploy(vrfCoordinator, linkToken, 1000);
    await contract.deployed();
    return contract;
  }
}

module.exports = {TestCommon}
