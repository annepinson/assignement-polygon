import { NextRouter } from 'next/router';
import { listen } from 'polyrhythm';
import { useEffect } from 'react';
import io from 'socket.io-client';

interface WebsocketServiceProps {
  postId: number;
  setTyping: React.Dispatch<React.SetStateAction<boolean>>;
  router: NextRouter;
}

export const WebsocketService = (props: WebsocketServiceProps) => {
  useEffect(() => {
    const socket = io('http://localhost:3000/', {
      path: '/api/socketio/',
    });

    socket.on('event', ({ type, postId, socketId }) => {
      if (
        type.startsWith('message/edit/') &&
        postId == props.postId &&
        socketId != socket.id
      ) {
        props.setTyping(true);
        setTimeout(() => {
          props.setTyping(false);
        }, 5000);
      } else if (
        type.startsWith('message/from/') &&
        postId == props.postId &&
        socketId != socket.id
      ) {
        props.setTyping(false);
        props.router.reload();
      }
    });

    const typingForwarder = listen(
      `message/edit/${props.postId}`,
      () => {
        socket.emit('event', {
          type: `message/edit/`,
          postId: props.postId,
          socketId: socket.id,
        });
      },
      { mode: 'ignore' },
    );

    const forwarder = listen(`message/create/${props.postId}`, () => {
      socket.emit('event', {
        type: `message/from/`,
        postId: props.postId,
        sockerId: socket.id,
      });
    });

    return () => {
      forwarder.unsubscribe();
      typingForwarder.unsubscribe();
      socket.close;
    };
  }, []);

  return null;
};
