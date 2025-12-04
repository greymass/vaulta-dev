import type { Action } from '@wharfkit/antelope'
import { logProposalLink } from '$lib/utils'
import { makeSession, systemContract } from '$lib/wharf'
import { NETWORK_AUTHORITY, SYSTEM_ACCOUNT } from '../../lib/constants'

const DEV_ACCOUNT = 'dev.vaulta'
const DIST_ACCOUNT = 'dist.vaulta'
const FUND_ACCOUNT = 'fund.vaulta'

const actions: Action[] = [
    // 1. Create the new distribution contract
    systemContract.action('newaccount', {
        active: NETWORK_AUTHORITY,
        creator: SYSTEM_ACCOUNT,
        name: DIST_ACCOUNT,
        owner: NETWORK_AUTHORITY,
    }),
    systemContract.action('buyrambytes', {
        bytes: 8192,
        payer: SYSTEM_ACCOUNT,
        receiver: DIST_ACCOUNT,
    }),

    // 2. Create the development team account
    systemContract.action('newaccount', {
        active: NETWORK_AUTHORITY,
        creator: SYSTEM_ACCOUNT,
        name: DEV_ACCOUNT,
        owner: NETWORK_AUTHORITY,
    }),
    systemContract.action('buyrambytes', {
        bytes: 8192,
        payer: SYSTEM_ACCOUNT,
        receiver: DEV_ACCOUNT,
    }),

    // 3. Create the unallocated funds account
    systemContract.action('newaccount', {
        active: NETWORK_AUTHORITY,
        creator: SYSTEM_ACCOUNT,
        name: FUND_ACCOUNT,
        owner: NETWORK_AUTHORITY,
    }),
    systemContract.action('buyrambytes', {
        bytes: 8192,
        payer: SYSTEM_ACCOUNT,
        receiver: FUND_ACCOUNT,
    }),
]

const session = makeSession('eosio@active', 'stage1msig1')
const result = await session.transact({ actions }, { broadcast: true })
logProposalLink(result, session)
