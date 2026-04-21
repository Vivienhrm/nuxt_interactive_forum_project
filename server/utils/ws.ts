import type { Peer } from 'crossws'

// Stockage global des clients connectés
export const peers = new Set<Peer>()

export const broadcast = (message: any) => {
  const data = typeof message === 'string' ? message : JSON.stringify(message)
  peers.forEach(peer => {
    try {
      peer.send(data)
    } catch (e) {
      peers.delete(peer)
    }
  })
}
