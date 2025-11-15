import type { Session, TransactResult } from '@wharfkit/session'
import { PROPOSER_PERMISSION } from './constants'

export function generateRandomName(length = 12) {
    let name = ''
    const characters = 'abcdefghijklmnopqrstuvwxyz12345'

    for (let i = 0; i < length; i += 1) {
        name += characters.charAt(Math.floor(Math.random() * characters.length))
    }

    return name
}

export function logProposalLink(result: TransactResult, session: Session) {
    console.log('Proposed transaction:', JSON.stringify(result.transaction, null, 2))

    console.log('\nView and approve the proposal at the link below:')
    console.log(
        `https://unicove.com/en/vaulta/msig/${PROPOSER_PERMISSION.actor}/${session.walletPlugin.data.lastProposalName}`,
    )
}
