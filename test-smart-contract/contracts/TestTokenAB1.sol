pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract TestTokenAB1 is ERC20, Ownable {
    uint8 private constant DECIMALS = 18;
    uint256 private constant INITIAL_SUPPLY = 1_000_000 * (10 ** DECIMALS);

    constructor() ERC20("Test Token AB1", "TTAB1") Ownable(msg.sender) {
        _mint(msg.sender, INITIAL_SUPPLY);
    }

    function decimals() public pure override returns (uint8) {
        return DECIMALS;
    }
}