import { ABI, APIClient, Bytes, Serializer } from '@wharfkit/antelope'
import { Chains, Session } from '@wharfkit/session'
import { WalletPluginPrivateKey } from '@wharfkit/wallet-plugin-privatekey'
import * as SystemContract from '$lib/contracts/eosio'
import * as DistributionContract from '$lib/contracts/eosio.saving'
import { NODEOS_API_URL, PROPOSER_PERMISSION, PROPOSER_PRIVATE_KEY } from './constants'
import { WalletPluginMultiSig } from './plugins/multisig'

export const client = new APIClient({ url: NODEOS_API_URL })

export const savingContract = new DistributionContract.Contract({ client, account: 'eosio.saving' })
export const systemContract = new SystemContract.Contract({ client })

export const walletPlugin = new WalletPluginPrivateKey(PROPOSER_PRIVATE_KEY)

export const chain = Chains.Vaulta

export const proposerSession = new Session({
    chain,
    permissionLevel: PROPOSER_PERMISSION,
    walletPlugin: walletPlugin,
})

export function makeSession(permissionLevel: string, proposalName?: string): Session {
    const session = new Session({
        chain,
        permissionLevel,
        walletPlugin: new WalletPluginMultiSig({
            walletPlugins: [walletPlugin],
        }),
    })
    session.walletPlugin.data.session = proposerSession // Inject proposer session
    if (proposalName) {
        session.walletPlugin.data.proposalName = proposalName
    }
    return session
}

export async function getContractWasm(path: string): Promise<Bytes> {
    const file = Bun.file(path)
    const buffer = await file.arrayBuffer()
    return Bytes.from(buffer)
}

export async function getContractAbi(path: string): Promise<Bytes> {
    const file = Bun.file(path)
    const json = await file.json()
    return Serializer.encode({ object: ABI.from(json) })
}
