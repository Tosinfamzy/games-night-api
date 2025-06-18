import {
  WebSocketGateway,
  SubscribeMessage,
  WebSocketServer,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { TeamsService } from '../teams/teams.service';
import { PlayersService } from '../players/players.service';

@Injectable()
@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class TeamsGateway {
  @WebSocketServer()
  server: Server;

  constructor(
    @Inject(forwardRef(() => TeamsService))
    private readonly teamsService: TeamsService,
    private readonly playersService: PlayersService, // Remove forwardRef for PlayersService
  ) {}

  @SubscribeMessage('joinTeam')
  async handleJoinTeam(
    @MessageBody() data: { teamId: number; playerId: number },
    @ConnectedSocket() client: Socket,
  ) {
    try {
      // Verify the player belongs to this team before joining the room
      const player = await this.playersService.findOne(data.playerId);
      if (!player || player.team?.id !== data.teamId) {
        return {
          success: false,
          message: 'Player is not a member of this team',
        };
      }

      // Join the team room
      client.join(`team_${data.teamId}`);

      // Notify everyone in the team room that a new member joined
      this.server.to(`team_${data.teamId}`).emit('teamMemberJoined', {
        playerId: data.playerId,
        playerName: player.name,
      });

      return {
        event: 'joinedTeam',
        data: {
          teamId: data.teamId,
          success: true,
        },
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to join team room',
        error: error.message,
      };
    }
  }

  @SubscribeMessage('leaveTeam')
  async handleLeaveTeam(
    @MessageBody() data: { teamId: number; playerId: number },
    @ConnectedSocket() client: Socket,
  ) {
    try {
      // Get player info before leaving
      const player = await this.playersService.findOne(data.playerId);

      // Leave the team room
      client.leave(`team_${data.teamId}`);

      // Notify everyone in the team that a member left
      if (player) {
        this.server.to(`team_${data.teamId}`).emit('teamMemberLeft', {
          playerId: data.playerId,
          playerName: player.name,
        });
      }

      return {
        event: 'leftTeam',
        data: {
          teamId: data.teamId,
          success: true,
        },
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to leave team room',
        error: error.message,
      };
    }
  }

  @SubscribeMessage('teamMessage')
  async handleTeamMessage(
    @MessageBody() data: { teamId: number; playerId: number; message: string },
    @ConnectedSocket() client: Socket,
  ) {
    try {
      // Verify the player belongs to this team
      const player = await this.playersService.findOne(data.playerId);
      if (!player || player.team?.id !== data.teamId) {
        return {
          success: false,
          message: 'Player is not a member of this team',
        };
      }

      // Broadcast the message to the team
      this.server.to(`team_${data.teamId}`).emit('teamChatMessage', {
        playerId: data.playerId,
        playerName: player.name,
        message: data.message,
        timestamp: new Date(),
      });

      return {
        success: true,
        message: 'Message sent to team',
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to send team message',
        error: error.message,
      };
    }
  }

  // Method to broadcast team-specific updates from other parts of the application
  notifyTeamUpdate(teamId: number, updateType: string, data: any) {
    this.server.to(`team_${teamId}`).emit('teamUpdate', {
      type: updateType,
      data,
    });
  }
}
