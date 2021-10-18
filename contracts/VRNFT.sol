//SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "hardhat/console.sol";

/**
 * @title VRNFT
 * @author @AndrewAarestad
 */
contract VRNFT is ERC721, ReentrancyGuard, Ownable {
    using Strings for uint256;

    uint256 public totalSupply;

    bool public isRevealed = false;
    bool public publicSaleActive = false;
    uint256 public nextTokenId = 1;

    mapping(uint256 => uint256) private rarityRankings;

    constructor(uint256 _totalSupply) ERC721("Verifiably-Random NFT", "VRNFT") {
        totalSupply = _totalSupply;
    }

    function togglePublicSale() public onlyOwner {
        publicSaleActive = !publicSaleActive;
    }

    function reveal() public onlyOwner {
        require(!isRevealed, "Already revealed");
        isRevealed = true;
//        console.log('reveal check: nextTokenId=%s, totalSupply=%s', nextTokenId, totalSupply);
//        require(nextTokenId > totalSupply, "Cannot reveal until all tokens are minted");
    }

    function mint(address _to, uint256 _amount) public virtual nonReentrant {
        require(publicSaleActive, "Public sale is not active");
        uint256 _nextTokenId = nextTokenId;
        require(_nextTokenId + _amount <= totalSupply + 1, 'not enough tokens available');
        for (uint256 i; i < _amount; i++) {
            _safeMint(_to, _nextTokenId);
            _nextTokenId++;
        }
        nextTokenId = _nextTokenId;
    }

    function getRarityRank(uint256 tokenId) public view returns (uint256) {
        return rarityRankings[tokenId];
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

/// [MIT License]
/// @title Base64
/// @notice Provides a function for encoding some bytes in base64
/// @author Brecht Devos <brecht@loopring.org>
library Base64 {
    bytes internal constant TABLE = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

    /// @notice Encodes some bytes to the base64 representation
    function encode(bytes memory data) internal pure returns (string memory) {
        uint256 len = data.length;
        if (len == 0) return "";

        // multiply by 4/3 rounded up
        uint256 encodedLen = 4 * ((len + 2) / 3);

        // Add some extra buffer at the end
        bytes memory result = new bytes(encodedLen + 32);

        bytes memory table = TABLE;

        assembly {
            let tablePtr := add(table, 1)
            let resultPtr := add(result, 32)

            for {
                let i := 0
            } lt(i, len) {

            } {
                i := add(i, 3)
                let input := and(mload(add(data, i)), 0xffffff)

                let out := mload(add(tablePtr, and(shr(18, input), 0x3F)))
                out := shl(8, out)
                out := add(out, and(mload(add(tablePtr, and(shr(12, input), 0x3F))), 0xFF))
                out := shl(8, out)
                out := add(out, and(mload(add(tablePtr, and(shr(6, input), 0x3F))), 0xFF))
                out := shl(8, out)
                out := add(out, and(mload(add(tablePtr, and(input, 0x3F))), 0xFF))
                out := shl(224, out)

                mstore(resultPtr, out)

                resultPtr := add(resultPtr, 4)
            }

            switch mod(len, 3)
            case 1 {
                mstore(sub(resultPtr, 2), shl(240, 0x3d3d))
            }
            case 2 {
                mstore(sub(resultPtr, 1), shl(248, 0x3d))
            }

            mstore(result, encodedLen)
        }

        return string(result);
    }
}

