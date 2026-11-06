// ABI for LendBox.sol (native BOT version) on BOT Chain mainnet.
// No bytecode: the contract is already deployed, so there is no deploy button.
// The empty borrow() overload is left out on purpose so ethers can tell the two borrow functions apart.
window.ARTIFACTS = {
  main: {
    abi: [
      "function owner() view returns (address)",
      "function price() view returns (uint256)",
      "function LTV() view returns (uint256)",
      "function LIQ_THRESHOLD() view returns (uint256)",
      "function FEE_BPS() view returns (uint256)",
      "function LIQ_BONUS() view returns (uint256)",
      "function totalShares() view returns (uint256)",
      "function totalDebt() view returns (uint256)",
      "function totalSupplied() view returns (uint256)",
      "function shares(address) view returns (uint256)",
      "function collateral(address) view returns (uint256)",
      "function debt(address) view returns (uint256)",
      "function poolAssets() view returns (uint256)",
      "function supplyValueOf(address u) view returns (uint256)",
      "function collateralValue(address u) view returns (uint256)",
      "function healthFactor(address u) view returns (uint256)",
      "function maxBorrow(address u) view returns (uint256)",
      "function setPrice(uint256 p)",
      "function supply() payable",
      "function withdrawSupply(uint256 s)",
      "function depositCollateral() payable",
      "function withdrawCollateral(uint256 amount)",
      "function borrow(uint256 amount)",
      "function repay() payable",
      "function liquidate(address u) payable",
      "event Supplied(address indexed user, uint256 amount, uint256 shares)",
      "event SupplyWithdrawn(address indexed user, uint256 amount, uint256 shares)",
      "event CollateralChanged(address indexed user, uint256 total)",
      "event Borrowed(address indexed user, uint256 amount, uint256 fee)",
      "event Repaid(address indexed user, uint256 amount)",
      "event Liquidated(address indexed user, address indexed liquidator, uint256 debtRepaid, uint256 collateralSeized)"
    ]
  }
};
