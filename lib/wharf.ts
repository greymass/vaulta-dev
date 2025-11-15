import { APIClient } from '@wharfkit/antelope'
import { NODEOS_API_URL } from './constants'

export const client = new APIClient({ url: NODEOS_API_URL })
