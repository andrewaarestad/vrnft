const {TestCommon} = require("./test-common.js");
const {expect} = require("chai");

describe('VRNFT Functionality', () => {

  it('should only allow owner to reveal', async() => {
    const contract = await TestCommon.deploy();
    await contract.togglePublicSale();
    const [owner, rando, _] = await ethers.getSigners();
    // for (let ii=0; ii<1000; ii++) {
    //   await contract.connect(rando).mint(rando.address, 10);
    // }
    await expect(contract.connect(rando).reveal()).to.be.reverted;
    await contract.reveal();
  });

  it('should only allow revealing once', async() => {
    const contract = await TestCommon.deploy();
    await contract.reveal();
    await expect(contract.reveal()).to.be.reverted;
  });

  it('should get rarity rank', async() => {
    const contract = await TestCommon.deploy();
    const result = await contract.getRarityRank(1);
    // console.log('result: ', result);
  });

  it('should get rarity level', async() => {
    const contract = await TestCommon.deploy();
    const result = await contract.getRarityLevel(1);
    // console.log('result: ', result);
  });

})
