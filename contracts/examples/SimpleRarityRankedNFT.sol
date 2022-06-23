//SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import "../base/VRNFT.sol";

/**
 * @title SimpleRarityRankedNFT
 * @author @AndrewAarestad
 */
contract SimpleRarityRankedNFT is VRNFT {

    uint256 public totalSupply;
    bool public publicSaleActive = false;
    uint256 public nextTokenId = 1;

    uint256[] public tokenIds;
    bool private isShuffled = false;

    mapping(uint256 => uint256) private rarityRankings;

    constructor(address _vrfCoordinator, address _link, uint256 _totalSupply) VRNFT(_vrfCoordinator, _link, "Simple Rarity Ranked NFT", "SRRNFT") {
        totalSupply = _totalSupply;
    }

    function togglePublicSale() public onlyOwner {
        publicSaleActive = !publicSaleActive;
    }

    function mint(address _to, uint256 _amount) public virtual nonReentrant {
        require(publicSaleActive, "Public sale is not active");
        uint256 _nextTokenId = nextTokenId;
        require(_nextTokenId + _amount <= totalSupply + 1, 'not enough tokens available');
        for (uint256 i; i < _amount; i++) {
            _safeMint(_to, _nextTokenId);
            tokenIds.push(_nextTokenId);
            _nextTokenId++;
        }
        nextTokenId = _nextTokenId;
    }

    function getRarityRank(uint256 tokenId) public view returns (uint256) {

        if (!isRevealed) {
            return 0;
        } else if (tokenId > totalSupply) {
            return 0;
        } else {
            return tokenIds[tokenId];
        }
    }

    function onReveal() internal override {
        shuffle(rarityRandomness);
    }

    // Fisher-Yates shuffle
    function shuffle(uint256 seed) private {
        if (!isShuffled) {
            isShuffled = true;

            uint256[] memory randomValues = expand(seed, totalSupply);

            uint temp;
            for (uint ii=0; ii<tokenIds.length; ii++) {
                //        for (uint ii = tokenIds.length - 1; ii > 0; ii--) {
                uint j = randomValues[ii] % (tokenIds.length - ii);
                temp = tokenIds[ii];
                tokenIds[ii] = tokenIds[j];
                tokenIds[j] = temp;
            }
        }

    }

    function expand(uint256 randomValue, uint256 n) public pure returns (uint256[] memory expandedValues) {
        expandedValues = new uint256[](n);
        for (uint256 i = 0; i < n; i++) {
            expandedValues[i] = uint256(keccak256(abi.encode(randomValue, i)));
        }
        return expandedValues;
    }

    function getRarityLevel(uint256 tokenId) public view returns (string memory) {
        uint256 rank = getRarityRank(tokenId);
        if (rank == 0) {
            return "Unrevealed";
        } else if (rank < 11) {
            return "Legendary";
        } else if (rank < 101) {
            return "Rare";
        } else if (rank < 1001) {
            return "Uncommon";
        } else {
            return "Common";
        }
    }

}
