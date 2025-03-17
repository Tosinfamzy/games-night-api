import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { ScoringService } from 'src/scoring/scoring.service';

@WebSocketGateway({ cors: true })
export class ScoreGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private readonly scoringService: ScoringService) {}

  handleConnection(client: any) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: any) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('getLeaderboard')
  async handleGetLeaderboard(@MessageBody() sessionId: number) {
    const leaderboard = await this.scoringService.getLeaderboard(sessionId);
    this.server
      .to(`session_${sessionId}`)
      .emit('leaderboardUpdate', leaderboard);
  }

  notifyScoreUpdate(sessionId: number) {
    this.server.to(`session_${sessionId}`).emit('scoreUpdated');
  }
}
