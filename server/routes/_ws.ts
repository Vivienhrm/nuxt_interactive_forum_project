import type { Peer } from 'crossws'

// Stockage des clients connectés
const peers = new Set<Peer>()

export default defineWebSocketHandler({
  open(peer) {
    console.log("[ws] open", peer);
    peers.add(peer)
  },
  message(peer, message) {
    console.log("[ws] message", peer, message.text());
    if (message.text().includes("ping")) {
      peer.send("pong");
    }
  },
  close(peer, event) {
    console.log("[ws] close", peer, event);
    peers.delete(peer)
  },
  error(peer, error) {
    console.log("[ws] error", peer, error);
    peers.delete(peer)
  },
});

// Exportation pour permettre le broadcast depuis d'autres parties du backend
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
