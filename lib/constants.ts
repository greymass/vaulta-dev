import 'dotenv/config'
import { Name, PermissionLevel, PrivateKey } from '@wharfkit/antelope'

// The URL of the nodeos API endpoint
if (!process.env.NODEOS_API_URL) {
    throw new Error('Missing NODEOS_API_URL in environment variables')
}
export const NODEOS_API_URL = process.env.NODEOS_API_URL

// The account that will propose the transaction
if (!process.env.PROPOSER_PERMISSION) {
    throw new Error('Missing PROPOSER_PERMISSION in environment variables')
}
export const PROPOSER_PERMISSION = PermissionLevel.from(process.env.PROPOSER_PERMISSION)

// The private key of the account proposing the transaction
if (!process.env.PROPOSER_PRIVATE_KEY) {
    throw new Error('Missing PROPOSER_PRIVATE_KEY in environment variables')
}
export const PROPOSER_PRIVATE_KEY = PrivateKey.from(process.env.PROPOSER_PRIVATE_KEY)

// The name of the system contract
export const SYSTEM_ACCOUNT = Name.from('eosio')

// 15-of-21 permission of network
export const NETWORK_AUTHORITY = {
    threshold: 1,
    keys: [],
    accounts: [
        {
            weight: 1,
            permission: {
                actor: 'eosio', // Top 21 BPs
                permission: 'active',
            },
        },
    ],
    waits: [],
}
