const {TestCommon} = require("./test-common.js");
const {expect} = require("chai");

describe('Simple Rarity-Ranked NFT Functionality', () => {

  it('should deploy the SRRNFT contract', async() => {
    await TestCommon.deploySRRNFT();
  });

  it('should toggle public sale', async() => {
    const contract = await TestCommon.deploySRRNFT();
    await contract.togglePublicSale();
  });

  it('should not toggle public sale if not owner', async() => {
    const contract = await TestCommon.deploySRRNFT();
    const [owner, rando, _] = await ethers.getSigners();
    await expect(contract.connect(rando).togglePublicSale()).to.be.reverted;
  });

  it('should not allow minting if public sale not toggled', async() => {
    const contract = await TestCommon.deploySRRNFT();
    const [owner, rando, _] = await ethers.getSigners();
    await expect(contract.connect(rando).mint(rando, 1)).to.be.reverted;
  });

  it('should allow minting if public sale is toggled', async() => {
    const contract = await TestCommon.deploySRRNFT();
    await contract.togglePublicSale();
    const [owner, rando, _] = await ethers.getSigners();
    await contract.connect(rando).mint(rando.address, 1);
  });

  it('should get rarity rank', async() => {
    const contract = await TestCommon.deploySRRNFT();
    const result = await contract.getRarityRank(1);
    // console.log('result: ', result);
  });

  it('should get rarity level', async() => {
    const contract = await TestCommon.deploySRRNFT();
    const result = await contract.getRarityLevel(1);
    // console.log('result: ', result);
  });

})
