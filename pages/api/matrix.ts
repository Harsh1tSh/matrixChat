import { NextApiRequest, NextApiResponse } from 'next';
import { getMatrixClient } from '../../utils/matrixClient';
import { IEvent } from 'matrix-js-sdk';

interface RoomInitialSyncResponse {
  messages: {
    chunk: IEvent[];
  };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const client = await getMatrixClient();
    const rooms = await client.getRooms();
    const messages = await Promise.all(
      rooms.map(async (room) => {
        const events = await client.roomInitialSync(room.roomId, 20) as RoomInitialSyncResponse;
        return (events.messages?.chunk || [])
          .filter((event: IEvent) => event.content?.body && event.content.body.trim() !== '')
          .map((event: IEvent) => ({
            roomId: room.roomId,
            content: event.content?.body || '',
            sender: event.sender || 'Unknown',
            timestamp: event.origin_server_ts ? new Date(event.origin_server_ts).getTime() : Date.now(),
          }));
      })
    );
    const flattenedMessages = messages.flat().sort((a, b) => b.timestamp - a.timestamp);
    res.status(200).json({ messages: flattenedMessages });
  } catch (error) {
    console.error('Error in Matrix API handler:', error);
    res.status(500).json({ error: 'Failed to fetch messages', details: (error as Error).message });
  }
}