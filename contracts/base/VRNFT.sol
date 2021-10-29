//SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBase.sol";
import "hardhat/console.sol";

/**
 * @title VRNFT
 * @author @AndrewAarestad
 */
contract VRNFT is ERC721, ReentrancyGuard, Ownable, VRFConsumerBase {

    bool public isRevealed = false;

    uint256 private rarityRandomness = 0;

    constructor(address _vrfCoordinator, address _linkToken, string memory name, string memory symbol)
    VRFConsumerBase(_vrfCoordinator, _linkToken)
    ERC721(name, symbol) {

    }

    function fulfillRandomness(bytes32 /*requestId*/, uint256 randomness) internal override {
//        reqId = requestId;
        rarityRandomness = randomness;
    }

    function reveal() public onlyOwner {
        require(!isRevealed, "Already revealed");
        isRevealed = true;
//        console.log('reveal check: nextTokenId=%s, totalSupply=%s', nextTokenId, totalSupply);
//        require(nextTokenId > totalSupply, "Cannot reveal until all tokens are minted");

        // generate a random number
        // for each NFT ID in the set, randomly assign it a slot in the rarityRankings

    }




}
