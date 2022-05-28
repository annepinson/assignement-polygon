import { Server as ServerIO } from 'socket.io';
import { Server as NetServer } from 'http';

export default async (req, res) => {
  if (!res.socket.server.io) {
    const httpServer: NetServer = res.socket.server as any;
    const io = new ServerIO(httpServer, {
      path: '/api/socketio',
    });

    res.socket.server.io = io;

    io.on('connection', (socket) => {
      socket.on('event', (arg) => {
        io.sockets.emit('event', arg);
      });
    });
  }

  res.end();
};
