# Unwind VF1 - Account Permission Reset

> Reset permissions for admin.grants and eosio.grants accounts

## Overview

This proposal resets the permission structures for the `admin.grants` and `eosio.grants` accounts by removing custom permissions and setting all permissions back to the network authority (`eosio@active`).

## Actions

### 1. Update admin.grants permissions

- [x] 1.1 Unlink `rams.eos` permission from `rams.eos::mint`
- [x] 1.2 Remove `rams.eos` permission
- [x] 1.3 Update `active` permission and set to `eosio@active`
- [x] 1.4 Update `owner` permission and set to `eosio@active`

**eosio::unlinkauth**
```json
{
    "account": "eosio.grants",
    "code": "rams.eos",
    "type": "mint"
}
```

**eosio::deleteauth**
```json
{
    "account": "eosio.grants",
    "permission": "rams.eos"
}
```

**eosio::updateauth** (active)
```json
{
    "account": "eosio.grants",
    "auth": {
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
    "permission": "active",
    "parent": "owner"
}
```

**eosio::updateauth** (owner)
```json
{
    "account": "eosio.grants",
    "auth": {
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
    "permission": "owner",
    "parent": ""
}
```

### 2. Update eosio.grants permissions

- [x] 2.1 Unlink `claim` permission from `eosio.saving::claim`
- [x] 2.2 Remove `claim` permission
- [x] 2.3 Unlink `buyram` permission from `eosio::buyram`
- [x] 2.4 Remove `buyram` permission
- [x] 2.5 Update `active` permission and set to `eosio@active`

**eosio::unlinkauth** (claim)
```json
{
    "account": "eosio.grants",
    "code": "eosio.saving",
    "type": "claim"
}
```

**eosio::deleteauth** (claim)
```json
{
    "account": "eosio.grants",
    "permission": "claim"
}
```

**eosio::unlinkauth** (buyram)
```json
{
    "account": "eosio.grants",
    "code": "eosio",
    "type": "buyram"
}
```

**eosio::deleteauth** (buyram)
```json
{
    "account": "eosio.grants",
    "permission": "buyram"
}
```

**eosio::updateauth** (active)
```json
{
    "account": "eosio.grants",
    "auth": {
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
    "permission": "active",
    "parent": "owner"
}
```

