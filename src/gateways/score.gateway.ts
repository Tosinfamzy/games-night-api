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
import { Inject, forwardRef } from '@nestjs/common';

@WebSocketGateway({ cors: true })
export class ScoreGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    @Inject(forwardRef(() => ScoringService))
    private readonly scoringService: ScoringService,
  ) {}

  handleConnection(client: any) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: any) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('getLeaderboard')
  async handleGetLeaderboard(@MessageBody() data: { sessionId: number; gameId: number }) {
    const leaderboard = await this.scoringService.getGameLeaderboard(data.sessionId, data.gameId);
    this.server
      .to(`session_${data.sessionId}`)
      .emit('leaderboardUpdate', leaderboard);
  }

  notifyScoreUpdate(sessionId: number) {
    this.server.to(`session_${sessionId}`).emit('scoreUpdated');
  }
}
