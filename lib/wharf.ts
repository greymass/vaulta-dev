import { APIClient } from '@wharfkit/antelope'
import { Chains, Session } from '@wharfkit/session'
import { WalletPluginPrivateKey } from '@wharfkit/wallet-plugin-privatekey'
import { NODEOS_API_URL, PROPOSER_PERMISSION, PROPOSER_PRIVATE_KEY } from './constants'
import { WalletPluginMultiSig } from './plugins/multisig'

export const client = new APIClient({ url: NODEOS_API_URL })

export const walletPlugin = new WalletPluginPrivateKey(PROPOSER_PRIVATE_KEY)

export const chain = Chains.Vaulta

export const proposerSession = new Session({
    chain,
    permissionLevel: PROPOSER_PERMISSION,
    walletPlugin: walletPlugin,
})

export function makeSession(permissionLevel: string): Session {
    const session = new Session({
        chain,
        permissionLevel,
        walletPlugin: new WalletPluginMultiSig({
            walletPlugins: [walletPlugin],
        }),
    })
    session.walletPlugin.data.session = proposerSession // Inject proposer session
    return session
}
