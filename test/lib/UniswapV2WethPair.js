"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UniswapV2WethPair = void 0;
const ethers_1 = require("ethers");
class UniswapV2WethPair {
    constructor(amt0, amt1) {
        this.balance0 = amt0;
        this.balance1 = amt1;
    }
    printReserves() {
        console.log('CFMMPair: ' + this.balance0.toString() + ', ' + this.balance1.toString());
    }
    /*
      // this low-level function should be called from a contract which performs important safety checks
      function swap(uint amount0Out, uint amount1Out, address to, bytes calldata data) external lock {
          require(amount0Out > 0 || amount1Out > 0, 'UniswapV2: INSUFFICIENT_OUTPUT_AMOUNT');
          (uint112 _reserve0, uint112 _reserve1,) = getReserves(); // gas savings
          require(amount0Out < _reserve0 && amount1Out < _reserve1, 'UniswapV2: INSUFFICIENT_LIQUIDITY');
  
          uint balance0;
          uint balance1;
          { // scope for _token{0,1}, avoids stack too deep errors
          address _token0 = token0;
          address _token1 = token1;
          require(to != _token0 && to != _token1, 'UniswapV2: INVALID_TO');
          if (amount0Out > 0) _safeTransfer(_token0, to, amount0Out); // optimistically transfer tokens
          if (amount1Out > 0) _safeTransfer(_token1, to, amount1Out); // optimistically transfer tokens
          if (data.length > 0) IUniswapV2Callee(to).uniswapV2Call(msg.sender, amount0Out, amount1Out, data);
          balance0 = IERC20(_token0).balanceOf(address(this));
          balance1 = IERC20(_token1).balanceOf(address(this));
          }
          uint amount0In = balance0 > _reserve0 - amount0Out ? balance0 - (_reserve0 - amount0Out) : 0;
          uint amount1In = balance1 > _reserve1 - amount1Out ? balance1 - (_reserve1 - amount1Out) : 0;
          require(amount0In > 0 || amount1In > 0, 'UniswapV2: INSUFFICIENT_INPUT_AMOUNT');
          { // scope for reserve{0,1}Adjusted, avoids stack too deep errors
          uint balance0Adjusted = balance0.mul(1000).sub(amount0In.mul(3));
          uint balance1Adjusted = balance1.mul(1000).sub(amount1In.mul(3));
          require(balance0Adjusted.mul(balance1Adjusted) >= uint(_reserve0).mul(_reserve1).mul(1000**2), 'UniswapV2: K');
          }
  
          _update(balance0, balance1, _reserve0, _reserve1);
          emit Swap(msg.sender, amount0In, amount1In, amount0Out, amount1Out, to);
      }
     */
    maxOutputT0(amtIn1) {
        return UniswapV2WethPair.getAmountOut(this.balance1, this.balance0, amtIn1);
    }
    maxOutputT1(amtIn0) {
        return UniswapV2WethPair.getAmountOut(this.balance0, this.balance1, amtIn0);
    }
    static getAmountOut(reserveIn, reserveOut, amountIn) {
        const num = reserveIn.mul(reserveOut).mul(1000);
        const denom = reserveIn.mul(1000).add((amountIn.mul(997)));
        return reserveOut.sub(num.div(denom)).sub(ethers_1.BigNumber.from(1));
    }
}
exports.UniswapV2WethPair = UniswapV2WethPair;
//# sourceMappingURL=UniswapV2WethPair.js.map