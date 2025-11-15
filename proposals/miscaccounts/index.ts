import type { Action } from '@wharfkit/antelope'
import { logProposalLink } from '$lib/utils'
import { makeSession, systemContract } from '$lib/wharf'
import { NETWORK_AUTHORITY, SYSTEM_ACCOUNT } from '../../lib/constants'

// The new accounts to create
const accounts = [
    'api.vaulta', // API Contract
    'open.vaulta', // Account Creation Contract
    'index.vaulta', // Registry Contract
]

export const DEV_AUTHORITY = {
    threshold: 1,
    keys: [],
    accounts: [
        {
            weight: 1,
            permission: {
                actor: 'dev.vaulta',
                permission: 'active',
            },
        },
    ],
    waits: [],
}

const actions: Action[] = []

accounts.forEach((name) => {
    actions.push(
        systemContract.action('buyrambytes', {
            bytes: 8192,
            payer: SYSTEM_ACCOUNT,
            receiver: name,
        }),
        systemContract.action('newaccount', {
            active: DEV_AUTHORITY,
            creator: SYSTEM_ACCOUNT,
            name,
            owner: NETWORK_AUTHORITY,
        }),
    )
})

const session = makeSession('eosio@active')
const result = await session.transact({ actions }, { broadcast: true })
logProposalLink(result, session)
