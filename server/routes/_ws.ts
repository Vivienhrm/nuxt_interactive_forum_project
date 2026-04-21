import { peers, broadcast } from '../utils/ws'

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

