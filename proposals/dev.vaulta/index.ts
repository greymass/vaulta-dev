import type { Action } from '@wharfkit/antelope'
import * as DistributionContract from '$lib/contracts/eosio.saving'
import { logProposalLink } from '$lib/utils'
import {
    client,
    getContractAbi,
    getContractWasm,
    makeSession,
    savingContract,
    systemContract,
} from '$lib/wharf'
import { NETWORK_AUTHORITY, SYSTEM_ACCOUNT } from '../../lib/constants'

const DEV_ACCOUNT = 'dev.vaulta'
const DIST_ACCOUNT = 'dist.vaulta'

export const distContract = new DistributionContract.Contract({ client, account: DIST_ACCOUNT })

// 2-of-2 permission of development team
export const DEV_AUTHORITY = {
    threshold: 2,
    keys: [],
    accounts: [
        {
            weight: 1,
            permission: {
                actor: 'ahayrapetian', // Areg
                permission: 'active',
            },
        },
        {
            weight: 1,
            permission: {
                actor: 'aaron', // Aaron
                permission: 'active',
            },
        },
    ],
    waits: [],
}

const actions: Action[] = [
    // 1. Create the development team account
    systemContract.action('newaccount', {
        active: DEV_AUTHORITY,
        creator: SYSTEM_ACCOUNT,
        name: DEV_ACCOUNT,
        owner: NETWORK_AUTHORITY,
    }),
    // 2. Create the distribution contract account
    systemContract.action('newaccount', {
        active: NETWORK_AUTHORITY,
        creator: SYSTEM_ACCOUNT,
        name: DIST_ACCOUNT,
        owner: NETWORK_AUTHORITY,
    }),
    // 3. Set the code and ABI for the distribution contract
    systemContract.action('setcode', {
        account: DIST_ACCOUNT,
        code: await getContractWasm('build/contracts/eosio.saving/eosio.saving.wasm'),
        vmtype: 0,
        vmversion: 0,
    }),
    systemContract.action('setabi', {
        account: DIST_ACCOUNT,
        abi: await getContractAbi('build/contracts/eosio.saving/eosio.saving.abi'),
    }),
    // 4. Initialize the distribution contract
    distContract.action('setdistrib', {
        accounts: [
            {
                account: DEV_ACCOUNT,
                percent: 10000,
            },
        ],
    }),
    // 5. Update eosio.saving parameters
    savingContract.action('setdistrib', {
        accounts: [
            {
                account: 'eosio.reward',
                percent: 5371,
            },
            {
                account: DIST_ACCOUNT,
                percent: 2955,
            },
            {
                account: 'eoslabs.io',
                percent: 1674,
            },
        ],
    }),
    // 6. Update fund.wram active permission, replace eosio.grants@active with eosio@active
    systemContract.action('updateauth', {
        account: 'fund.wram',
        auth: NETWORK_AUTHORITY,
        permission: 'active',
        parent: 'owner',
    }),
    // 7. Update eosio.mware active permission, set to dev.vaulta account (remove msig, confirm with Labs)
    systemContract.action('updateauth', {
        account: 'eosio.mware',
        auth: {
            threshold: 1,
            keys: [],
            accounts: [
                {
                    weight: 1,
                    permission: {
                        actor: DEV_ACCOUNT,
                        permission: 'active',
                    },
                },
            ],
            waits: [],
        },
        permission: 'active',
        parent: 'owner',
    }),
]

const session = makeSession('eosio@active')
const result = await session.transact({ actions }, { broadcast: false })
logProposalLink(result, session)
