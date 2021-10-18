
const {ethers} = require("hardhat");

class TestCommon {
  static async deploy() {
    const contractFactory = await ethers.getContractFactory("VRNFT");
    const contract = await contractFactory.deploy(10000);
    await contract.deployed();
    return contract;
  }
}

module.exports = {TestCommon}
