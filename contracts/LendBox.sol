// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
import "./Token.sol";

/// @title LendBox - over-collateralised lending pool. Price is set by the owner (testnet "oracle").
contract LendBox {
    IERC20 public immutable collateralToken;
    IERC20 public immutable borrowToken;
    address public owner;
    uint256 public price = 1e18; // borrow tokens per 1 collateral token (1e18 scale)
    uint256 public constant LTV = 66;            // max borrow, % of collateral value
    uint256 public constant LIQ_THRESHOLD = 80;  // liquidation threshold, % of collateral value
    uint256 public constant FEE_BPS = 200;       // 2% borrow fee, paid to lenders
    uint256 public constant LIQ_BONUS = 5;       // 5% liquidator bonus
    uint256 public totalShares;
    uint256 public totalDebt;
    mapping(address => uint256) public shares;
    mapping(address => uint256) public collateral;
    mapping(address => uint256) public debt;

    event Supplied(address indexed user, uint256 amount, uint256 shares);
    event SupplyWithdrawn(address indexed user, uint256 amount, uint256 shares);
    event CollateralChanged(address indexed user, uint256 total);
    event Borrowed(address indexed user, uint256 amount, uint256 fee);
    event Repaid(address indexed user, uint256 amount);
    event Liquidated(address indexed user, address indexed liquidator, uint256 debtRepaid, uint256 collateralSeized);

    modifier onlyOwner() { require(msg.sender == owner, "owner only"); _; }

    constructor(address _collateral, address _borrow) {
        collateralToken = IERC20(_collateral);
        borrowToken = IERC20(_borrow);
        owner = msg.sender;
    }

    function setPrice(uint256 p) external onlyOwner { require(p > 0, "zero"); price = p; }

    function poolAssets() public view returns (uint256) { return borrowToken.balanceOf(address(this)) + totalDebt; }
    function supplyValueOf(address u) external view returns (uint256) {
        return totalShares == 0 ? 0 : (shares[u] * poolAssets()) / totalShares;
    }
    function collateralValue(address u) public view returns (uint256) { return (collateral[u] * price) / 1e18; }
    function healthFactor(address u) public view returns (uint256) {
        if (debt[u] == 0) return type(uint256).max;
        return (collateralValue(u) * LIQ_THRESHOLD * 1e18) / (debt[u] * 100);
    }
    function maxBorrow(address u) public view returns (uint256) {
        uint256 cap = (collateralValue(u) * LTV) / 100;
        return cap > debt[u] ? cap - debt[u] : 0;
    }

    function supply(uint256 amount) external {
        require(amount > 0, "zero");
        uint256 s = totalShares == 0 ? amount : (amount * totalShares) / poolAssets();
        require(s > 0, "no shares");
        totalShares += s; shares[msg.sender] += s;
        require(borrowToken.transferFrom(msg.sender, address(this), amount), "transfer");
        emit Supplied(msg.sender, amount, s);
    }
    function withdrawSupply(uint256 s) external {
        require(s > 0 && shares[msg.sender] >= s, "shares");
        uint256 amount = (s * poolAssets()) / totalShares;
        require(borrowToken.balanceOf(address(this)) >= amount, "pool illiquid");
        shares[msg.sender] -= s; totalShares -= s;
        require(borrowToken.transfer(msg.sender, amount), "transfer");
        emit SupplyWithdrawn(msg.sender, amount, s);
    }

    function depositCollateral(uint256 amount) external {
        require(amount > 0, "zero");
        collateral[msg.sender] += amount;
        require(collateralToken.transferFrom(msg.sender, address(this), amount), "transfer");
        emit CollateralChanged(msg.sender, collateral[msg.sender]);
    }
    function withdrawCollateral(uint256 amount) external {
        require(amount > 0 && collateral[msg.sender] >= amount, "amount");
        collateral[msg.sender] -= amount;
        require(debt[msg.sender] * 100 <= collateralValue(msg.sender) * LTV, "undercollateralised");
        require(collateralToken.transfer(msg.sender, amount), "transfer");
        emit CollateralChanged(msg.sender, collateral[msg.sender]);
    }

    function borrow(uint256 amount) external {
        require(amount > 0, "zero");
        uint256 fee = (amount * FEE_BPS) / 10000;
        uint256 newDebt = debt[msg.sender] + amount + fee;
        require(newDebt * 100 <= collateralValue(msg.sender) * LTV, "exceeds LTV");
        require(borrowToken.balanceOf(address(this)) >= amount, "pool illiquid");
        debt[msg.sender] = newDebt; totalDebt += amount + fee;
        require(borrowToken.transfer(msg.sender, amount), "transfer");
        emit Borrowed(msg.sender, amount, fee);
    }
    function repay(uint256 amount) external {
        uint256 pay = amount > debt[msg.sender] ? debt[msg.sender] : amount;
        require(pay > 0, "nothing to repay");
        debt[msg.sender] -= pay; totalDebt -= pay;
        require(borrowToken.transferFrom(msg.sender, address(this), pay), "transfer");
        emit Repaid(msg.sender, pay);
    }

    function liquidate(address u) external {
        uint256 d = debt[u];
        require(d > 0, "no debt");
        require(healthFactor(u) < 1e18, "position healthy");
        uint256 seized = (d * (100 + LIQ_BONUS) * 1e18) / (100 * price);
        if (seized > collateral[u]) seized = collateral[u];
        debt[u] = 0; totalDebt -= d; collateral[u] -= seized;
        require(borrowToken.transferFrom(msg.sender, address(this), d), "pay");
        require(collateralToken.transfer(msg.sender, seized), "seize");
        emit Liquidated(u, msg.sender, d, seized);
    }
}
