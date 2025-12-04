# Development Accounts Creation

> Initial setup of Vaulta core development team accounts

## Overview

This proposal creates the foundational accounts required for the Vaulta development infrastructure. It establishes three critical accounts: `dist.vaulta` for distribution, `dev.vaulta` for development team access, and `fund.vaulta` for unallocated funds.

This is being done in an independent step since msig proposals cannot create accounts and deploy contracts at the same time.

This simple proposal only creates these new accounts. All accounts are initially owned by the network authority (15 of 21 Block Producers). Future msig proposals will update permissions as needed.

## Account Structure

### dist.vaulta
- **Purpose**: Distribution contract account
- **Owner Permission**: Network authority - 15 of 21 Block Producers (`eosio@active`)
- **Active Permission**: Network authority - 15 of 21 Block Producers (`eosio@active`)
- **RAM Allocation**: 8,192 bytes

### dev.vaulta
- **Purpose**: Development team account
- **Owner Permission**: Network authority - 15 of 21 Block Producers (`eosio@active`)
- **Active Permission**: Network authority - 15 of 21 Block Producers (`eosio@active`)
- **RAM Allocation**: 8,192 bytes
- **Note**: Active permission will be updated to VDT multi-sig in MSIG 2

### fund.vaulta
- **Purpose**: Unallocated funds from distribution
- **Owner Permission**: Network authority - 15 of 21 Block Producers (`eosio@active`)
- **Active Permission**: Network authority - 15 of 21 Block Producers (`eosio@active`)
- **RAM Allocation**: 8,192 bytes

## Actions

### 1. Create dist.vaulta account

- [x] 1.1 Create new account `dist.vaulta`
- [x] 1.2 Purchase 8,192 bytes of RAM for `dist.vaulta`

**eosio::newaccount**
```json
{
    "creator": "eosio",
    "name": "dist.vaulta",
    "owner": {
        "threshold": 1,
        "keys": [],
        "accounts": [
            {
                "weight": 1,
                "permission": {
                    "actor": "eosio",
                    "permission": "active"
                }
            }
        ],
        "waits": []
    },
    "active": {
        "threshold": 1,
        "keys": [],
        "accounts": [
            {
                "weight": 1,
                "permission": {
                    "actor": "eosio",
                    "permission": "active"
                }
            }
        ],
        "waits": []
    }
}
```

**eosio::buyrambytes**
```json
{
    "payer": "eosio",
    "receiver": "dist.vaulta",
    "bytes": 8192
}
```

### 2. Create dev.vaulta account

- [x] 2.1 Create new account `dev.vaulta` with network authority
- [x] 2.2 Purchase 8,192 bytes of RAM for `dev.vaulta`

**eosio::newaccount**
```json
{
    "creator": "eosio",
    "name": "dev.vaulta",
    "owner": {
        "threshold": 1,
        "keys": [],
        "accounts": [
            {
                "weight": 1,
                "permission": {
                    "actor": "eosio",
                    "permission": "active"
                }
            }
        ],
        "waits": []
    },
    "active": {
        "threshold": 1,
        "keys": [],
        "accounts": [
            {
                "weight": 1,
                "permission": {
                    "actor": "eosio",
                    "permission": "active"
                }
            }
        ],
        "waits": []
    }
}
```

**eosio::buyrambytes**
```json
{
    "payer": "eosio",
    "receiver": "dev.vaulta",
    "bytes": 8192
}
```

### 3. Create fund.vaulta account

- [x] 3.1 Create new account `fund.vaulta` with network authority
- [x] 3.2 Purchase 8,192 bytes of RAM for `fund.vaulta`

**eosio::newaccount**
```json
{
    "creator": "eosio",
    "name": "fund.vaulta",
    "owner": {
        "threshold": 1,
        "keys": [],
        "accounts": [
            {
                "weight": 1,
                "permission": {
                    "actor": "eosio",
                    "permission": "active"
                }
            }
        ],
        "waits": []
    },
    "active": {
        "threshold": 1,
        "keys": [],
        "accounts": [
            {
                "weight": 1,
                "permission": {
                    "actor": "eosio",
                    "permission": "active"
                }
            }
        ],
        "waits": []
    }
}
```

**eosio::buyrambytes**
```json
{
    "payer": "eosio",
    "receiver": "fund.vaulta",
    "bytes": 8192
}
```

## Security Considerations

- All three accounts have both **owner** and **active** permissions set to network authority (15 of 21 Block Producers via `eosio@active`) for maximum security
- The `dev.vaulta` active permission will be updated to a VDT multi-sig in MSIG 2
- The `dist.vaulta` account remains fully controlled by network authority (15 of 21 Block Producers), preventing unauthorized modifications to the distribution contract
- The `fund.vaulta` account remains fully controlled by network authority (15 of 21 Block Producers) for future allocation decisions
