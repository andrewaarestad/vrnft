const {TestCommon} = require("./test-common.js");
const {expect} = require("chai");

describe('ERC721 Basics', () => {

  it('should deploy the contract', async() => {
    await TestCommon.deploy();
  });

  it('should toggle public sale', async() => {
    const contract = await TestCommon.deploy();
    await contract.togglePublicSale();
  });

  it('should not toggle public sale if not owner', async() => {
    const contract = await TestCommon.deploy();
    const [owner, rando, _] = await ethers.getSigners();
    await expect(contract.connect(rando).togglePublicSale()).to.be.reverted;
  });

  it('should not allow minting if public sale not toggled', async() => {
    const contract = await TestCommon.deploy();
    const [owner, rando, _] = await ethers.getSigners();
    await expect(contract.connect(rando).mint(rando, 1)).to.be.reverted;
  });

  it('should allow minting if public sale is toggled', async() => {
    const contract = await TestCommon.deploy();
    await contract.togglePublicSale();
    const [owner, rando, _] = await ethers.getSigners();
    await contract.connect(rando).mint(rando.address, 1);
  });
})
