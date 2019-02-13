export default interface GameEngine {
    sendToPlayer: (player: Player, payload: any) => any
    sendGameUpdate: (payload: any) => any
    sendGameEnd: (payload: any) => any
}