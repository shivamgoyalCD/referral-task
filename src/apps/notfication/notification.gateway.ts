import {
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
  SubscribeMessage,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway()
export class NotificationsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private connectedUsers = {};

  handleConnection(client: Socket): void {
    console.log('Client connected:', client.id);
  }

  handleDisconnect(client: Socket): void {
    console.log('Client disconnected:', client.id);

    for (const userId in this.connectedUsers) {
      if (this.connectedUsers[userId] === client.id) {
        delete this.connectedUsers[userId];
        console.log(
          `User with socket ID ${client.id} disconnected and removed.`,
        );
        break;
      }
    }
  }

  @SubscribeMessage('register')
  async handleRegister(client: Socket, userId: string) {
    this.connectedUsers[userId] = client.id;
    console.log(`User ${userId} registered with socket ID ${client.id}`);
  }

  sendNotification(userId: string, notification: any): void {
    const socketId = this.connectedUsers[String(userId)];
    if (socketId) {
      this.server.to(socketId).emit('notification', notification);
      console.log(`Notification sent to user ${userId}:`, notification);
    } else {
      console.log(`User ${userId} is not connected.`);
    }
  }
}
