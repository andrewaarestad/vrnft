# vrnft
NFT Collection with verifiably-random rarity distribution

I got tired of seeing project after NFT project do a big reveal, only to get mired in accusations of insider trading.  With this contract, we'll be able to get rid of those concerns once and for all!

VRNFT is a sample ERC721 contract that demonstrates a one-shot reveal mechanism that locks in the rarity distribution at reveal time.  Once the project is minted out, the developer will call the `reveal` function on the contract, which pulls in a random uint256 from a Chainlink VRF.  This randomness is then unchangeable.

## To do
 * Finish hardhat verification script
