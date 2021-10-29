require('dotenv/config');
require("@nomiclabs/hardhat-waffle");
require("hardhat-tracer");
require('hardhat-etherscan-abi');

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.8.4",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200
          }
        }
      }
    ]
  },
  networks: {
    hardhat: {
      chainId: 1,
      forking: {
        enabled: true,
        url: process.env.ALCHEMY_URL,
        blockNumber: 12943483
      }
    }
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY
  }
};

