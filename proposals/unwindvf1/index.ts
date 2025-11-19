import type { Action } from '@wharfkit/antelope'
import { NETWORK_AUTHORITY } from '$lib/constants'
import { logProposalLink } from '$lib/utils'
import { makeSession, systemContract } from '$lib/wharf'

// Get proposal name from command line arguments
const proposalName = process.argv[2]
if (!proposalName) {
    console.error('Error: Proposal name is required')
    console.error('Usage: bun run proposals/unwindvf1 <proposal-name>')
    process.exit(1)
}

const actions: Action[] = [
    // 1   Update admin.grants permissions
    // 1.1 Unlink rams.eos permission from rams.eos::mint
    systemContract.action(
        'unlinkauth',
        {
            account: 'admin.grants',
            code: 'rams.eos',
            type: 'mint',
        },
        {
            authorization: [{ actor: 'admin.grants', permission: 'owner' }],
        },
    ),
    // 1.2 Remove rams.eos permission
    systemContract.action(
        'deleteauth',
        {
            account: 'admin.grants',
            permission: 'rams.eos',
        },
        {
            authorization: [{ actor: 'admin.grants', permission: 'owner' }],
        },
    ),
    // 1.3 Update active permission and set to eosio@active
    systemContract.action(
        'updateauth',
        {
            account: 'admin.grants',
            auth: NETWORK_AUTHORITY,
            permission: 'active',
            parent: 'owner',
        },
        {
            authorization: [{ actor: 'admin.grants', permission: 'owner' }],
        },
    ),
    // 1.4 Update owner permission and set to eosio@active
    systemContract.action(
        'updateauth',
        {
            account: 'admin.grants',
            auth: NETWORK_AUTHORITY,
            permission: 'owner',
            parent: '',
        },
        {
            authorization: [{ actor: 'admin.grants', permission: 'owner' }],
        },
    ),

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
session.walletPlugin.data.proposalName = proposalName
const result = await session.transact({ actions }, { broadcast: true })
logProposalLink(result, session)
