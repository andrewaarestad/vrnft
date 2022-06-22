const {BigNumber} = require("ethers");

const {ethers} = require("hardhat");
const {UniswapV2WethPair} = require("./lib/UniswapV2WethPair");

// Ethereum mainnet
const vrfCoordinator = "0xf0d54349aDdcf704F77AE15b96510dEA15cb7952";
const LINK_ADDRESS = "0x514910771AF9Ca656af840dff83E8264EcF986CA";

const WETH_ADDRESS = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2';

class TestCommon {
  static async deployVRNFT() {
    const contractFactory = await ethers.getContractFactory("VRNFT");
    const contract = await contractFactory.deploy(vrfCoordinator, LINK_ADDRESS, "VRNFT", "VRNFT");
    await contract.deployed();
    await this.swapEthForLink(contract.address);
    return contract;
  }
  static async deploySRRNFT() {
    const contractFactory = await ethers.getContractFactory("SimpleRarityRankedNFT");
    const contract = await contractFactory.deploy(vrfCoordinator, LINK_ADDRESS, 1000);
    await contract.deployed();
    return contract;
  }

  static async swapEthForLink(contractAddress) {
    const [owner, _] = await ethers.getSigners();

    const WETH = await ethers.getVerifiedContractAt(WETH_ADDRESS);
    const LINK = await ethers.getVerifiedContractAt(LINK_ADDRESS);
    await WETH.connect(owner).deposit({value: ethers.utils.parseEther("10")})

    const linkMarketAddress = '0x8B59bE2fC6Fccc2256Cc4841843A13ce29DA16bd';
    const market = await ethers.getVerifiedContractAt(linkMarketAddress);
    const marketReserves = await market.getReserves();
    const linkReserves = marketReserves[0];
    const wethReserves = marketReserves[1];
    const linkMarket = new UniswapV2WethPair(linkReserves, wethReserves);

    // console.log('swapping with WETH / LINK market reserves: ', ethers.utils.formatEther(wethReserves), ethers.utils.formatEther(linkReserves))

    // Step 1: Transfer WETH to the WETH/LINK pair

    // console.log('WETH / LINK balances pre-transfer1: ', ethers.utils.formatEther(await WETH.balanceOf(owner.address)), ethers.utils.formatEther(await LINK.balanceOf(contractAddress)))
    const firstLegVolume = ethers.utils.parseEther('1');
    await WETH.connect(owner).transfer(linkMarketAddress, firstLegVolume);

    // console.log('WETH / LINK balances post-transfer1: ', ethers.utils.formatEther(await WETH.balanceOf(owner.address)), ethers.utils.formatEther(await LINK.balanceOf(contractAddress)))

    // Step 2: Swap max amount of LINK we can into the contract
    const secondLegVolume = linkMarket.maxOutputT0(BigNumber.from(firstLegVolume));
    // console.log('transferring link to contract: ', ethers.utils.formatEther(secondLegVolume));
    await market.swap(secondLegVolume, BigNumber.from(0), contractAddress, Buffer.from(''));
    // await market.swap(BigNumber.from(0), secondLegVolume, contractAddress, Buffer.from(''));

    // console.log('WETH / LINK balances post-transfer2: ', ethers.utils.formatEther(await WETH.balanceOf(owner.address)), ethers.utils.formatEther(await LINK.balanceOf(contractAddress)))

    const balance = await LINK.balanceOf(contractAddress);
    // console.log('LINK balance in contract: ', balance);

  }
}

module.exports = {TestCommon}
