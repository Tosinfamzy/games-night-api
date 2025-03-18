import {
  WebSocketGateway,
  SubscribeMessage,
  WebSocketServer,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Injectable } from '@nestjs/common';

@Injectable()
@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class SessionsGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('joinSession')
  handleJoinSession(
    @MessageBody() sessionId: number,
    @ConnectedSocket() client: Socket,
  ) {
    client.join(`session_${sessionId}`);
    return { event: 'joinedSession', data: sessionId };
  }

  @SubscribeMessage('leaveSession')
  handleLeaveSession(
    @MessageBody() sessionId: number,
    @ConnectedSocket() client: Socket,
  ) {
    client.leave(`session_${sessionId}`);
    return { event: 'leftSession', data: sessionId };
  }

  notifySessionUpdate(sessionId: number, updateType: string, data: any) {
    this.server.to(`session_${sessionId}`).emit('sessionUpdate', {
      type: updateType,
      data,
    });
  }
}
