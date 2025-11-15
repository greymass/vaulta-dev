import type { Action } from '@wharfkit/antelope'
import { NETWORK_AUTHORITY } from '$lib/constants'
import * as SystemContract from '$lib/contracts/eosio'
import { logProposalLink } from '$lib/utils'
import { client, makeSession } from '$lib/wharf'

const systemContract = new SystemContract.Contract({ client })

const actions: Action[] = [
    // 1   Update admin.grants permissions
    // 1.1 Unlink rams.eos permission from rams.eos::mint
    systemContract.action('unlinkauth', {
        account: 'eosio.grants',
        code: 'rams.eos',
        type: 'mint',
    }),
    // 1.2 Remove rams.eos permission
    systemContract.action('deleteauth', {
        account: 'eosio.grants',
        permission: 'rams.eos',
    }),
    // 1.3 Update active permission and set to eosio@active
    systemContract.action('updateauth', {
        account: 'eosio.grants',
        auth: NETWORK_AUTHORITY,
        permission: 'active',
        parent: 'owner',
    }),
    // 1.4 Update owner permission and set to eosio@active
    systemContract.action('updateauth', {
        account: 'eosio.grants',
        auth: NETWORK_AUTHORITY,
        permission: 'owner',
        parent: '',
    }),

    // 2   Update eosio.grants permissions
    // 2.1 Unlink claim permission from eosio.saving::claim
    systemContract.action('unlinkauth', {
        account: 'eosio.grants',
        code: 'eosio.saving',
        type: 'claim',
    }),
    // 2.2 Remove claim permission
    systemContract.action('deleteauth', {
        account: 'eosio.grants',
        permission: 'claim',
    }),
    // 2.3 Unlink buyram permission from eosio::buyram
    systemContract.action('unlinkauth', {
        account: 'eosio.grants',
        code: 'eosio',
        type: 'buyram',
    }),
    // 2.4 Remove buyram permission
    systemContract.action('deleteauth', {
        account: 'eosio.grants',
        permission: 'buyram',
    }),
    // 2.5 Update active permission and set to eosio@active
    systemContract.action('updateauth', {
        account: 'eosio.grants',
        auth: NETWORK_AUTHORITY,
        permission: 'active',
        parent: 'owner',
    }),
]

const session = makeSession('eosio.grants@active')
const result = await session.transact({ actions }, { broadcast: false })
logProposalLink(result, session)
