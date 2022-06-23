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
    bool public isAwaitingReveal = false;

    uint256 internal rarityRandomness = 0;

    function onReveal() virtual internal {}

    constructor(address _vrfCoordinator, address _linkToken, string memory name, string memory symbol)
    VRFConsumerBase(_vrfCoordinator, _linkToken)
    ERC721(name, symbol) {

//        console.log('requesting randomness from coordinator address: %s', _vrfCoordinator);
    }

    function fulfillRandomness(bytes32 /*requestId*/, uint256 randomness) internal override {
//        reqId = requestId;


        console.log('fulfillRandomness: %s', randomness);

        rarityRandomness = randomness;

        isRevealed = true;

        onReveal();
    }

    function reveal() public onlyOwner {
        require(!isRevealed, "Already revealed");
        require(!isAwaitingReveal, "Reveal already in progress");

//        console.log('revealing');

        uint256 fee = 0.1 * 10 ** 18; //0.1 LINK
        bytes32 keyHash = 0x6c3699283bda56ad74f6b855546325b68d482e983852a7a82979cc4807b641f4;


        requestRandomness(keyHash, fee);

        isAwaitingReveal = true;

//        console.log('reveal check: nextTokenId=%s, totalSupply=%s', nextTokenId, totalSupply);
//        require(nextTokenId > totalSupply, "Cannot reveal until all tokens are minted");

        // generate a random number
        // for each NFT ID in the set, randomly assign it a slot in the rarityRankings

    }




}
