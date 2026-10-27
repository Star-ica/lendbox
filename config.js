// Edit address to point this front end at an existing deployment.
window.APP_CONFIG = {
  "address": "",
  "slug": "lendbox",
  "name": "LendBox",
  "accent": "#b4570a",
  "tagline": "Deposit collateral, borrow a stablecoin, stay above the line.",
  "about": "Lenders supply the stablecoin and share the 2% borrow fee. Borrowers lock collateral (max 66% LTV). Positions below the 80% threshold can be liquidated. The owner sets the collateral price (testnet oracle).",
  "tokens": [
    "collateralToken",
    "borrowToken"
  ],
  "deploy": {
    "tokens": [
      {
        "name": "Collateral Token",
        "symbol": "COL"
      },
      {
        "name": "Mock USD",
        "symbol": "mUSD"
      }
    ],
    "args": [
      "$t0",
      "$t1"
    ]
  },
  "stats": [
    {
      "label": "Collateral price",
      "fn": "price",
      "fmt": "token"
    },
    {
      "label": "Pool assets",
      "fn": "poolAssets",
      "fmt": "token"
    },
    {
      "label": "Total debt",
      "fn": "totalDebt",
      "fmt": "token"
    },
    {
      "label": "Your collateral",
      "fn": "collateral",
      "fmt": "token",
      "args": [
        "me"
      ]
    },
    {
      "label": "Your debt",
      "fn": "debt",
      "fmt": "token",
      "args": [
        "me"
      ]
    },
    {
      "label": "Health factor",
      "fn": "healthFactor",
      "fmt": "ratio",
      "args": [
        "me"
      ]
    },
    {
      "label": "Your supplied value",
      "fn": "supplyValueOf",
      "fmt": "token",
      "args": [
        "me"
      ]
    },
    {
      "label": "Your supply shares",
      "fn": "shares",
      "fmt": "token",
      "args": [
        "me"
      ]
    }
  ],
  "actions": [
    {
      "title": "Supply stablecoin",
      "fn": "supply",
      "inputs": [
        {
          "id": "amount",
          "label": "Amount",
          "type": "amount",
          "default": "500"
        }
      ]
    },
    {
      "title": "Withdraw supply",
      "fn": "withdrawSupply",
      "inputs": [
        {
          "id": "s",
          "label": "Shares",
          "type": "amount",
          "default": "100"
        }
      ]
    },
    {
      "title": "Deposit collateral",
      "fn": "depositCollateral",
      "inputs": [
        {
          "id": "amount",
          "label": "Amount",
          "type": "amount",
          "default": "100"
        }
      ]
    },
    {
      "title": "Withdraw collateral",
      "fn": "withdrawCollateral",
      "inputs": [
        {
          "id": "amount",
          "label": "Amount",
          "type": "amount",
          "default": "10"
        }
      ]
    },
    {
      "title": "Borrow",
      "fn": "borrow",
      "inputs": [
        {
          "id": "amount",
          "label": "Amount",
          "type": "amount",
          "default": "50"
        }
      ]
    },
    {
      "title": "Repay",
      "fn": "repay",
      "inputs": [
        {
          "id": "amount",
          "label": "Amount",
          "type": "amount",
          "default": "50"
        }
      ]
    },
    {
      "title": "Liquidate",
      "fn": "liquidate",
      "desc": "Works only when the borrower's health factor is below 1.",
      "inputs": [
        {
          "id": "u",
          "label": "Borrower",
          "type": "address",
          "meDefault": false
        }
      ]
    },
    {
      "title": "Set collateral price (owner)",
      "fn": "setPrice",
      "inputs": [
        {
          "id": "p",
          "label": "Price in stablecoin",
          "type": "amount",
          "default": "1"
        }
      ]
    }
  ],
  "views": [
    {
      "title": "Health of an address",
      "fn": "healthFactor",
      "inputs": [
        {
          "id": "u",
          "label": "Address",
          "type": "address",
          "meDefault": true
        }
      ]
    },
    {
      "title": "Remaining borrow room",
      "fn": "maxBorrow",
      "inputs": [
        {
          "id": "u",
          "label": "Address",
          "type": "address",
          "meDefault": true
        }
      ]
    }
  ]
};
