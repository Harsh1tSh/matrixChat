import { NextApiRequest, NextApiResponse } from 'next';
import { getMatrixClient } from '../../utils/matrixClient';
import { MatrixEvent, Room } from 'matrix-js-sdk';

interface Message {
  roomId: string;
  content: string;
  sender: string;
  timestamp: number;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      console.log('API: Fetching messages...');
      const client = await getMatrixClient();
      console.log('API: Matrix client obtained');
      
      const rooms = client.getRooms();
      console.log(`API: Found ${rooms.length} rooms`);

      const messages: Message[] = rooms.flatMap((room: Room) => {
        const timeline = room.timeline || [];
        console.log(`API: Room ${room.roomId} has ${timeline.length} events`);
        return timeline
          .filter((event: MatrixEvent) => event.getType() === 'm.room.message')
          .map((event: MatrixEvent) => ({
            roomId: room.roomId,
            content: event.getContent().body || '',
            sender: event.getSender() || 'Unknown',
            timestamp: event.getTs(),
          }));
      });

      console.log(`API: Total messages: ${messages.length}`);

      const flattenedMessages = messages
        .filter((msg): msg is Message => Boolean(msg.content))
        .sort((a, b) => b.timestamp - a.timestamp);

      console.log(`API: Filtered messages: ${flattenedMessages.length}`);

      res.status(200).json({ messages: flattenedMessages });
    } catch (error) {
      console.error('API Error fetching messages:', error);
      res.status(500).json({ error: 'Failed to fetch messages', details: (error as Error).message });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}