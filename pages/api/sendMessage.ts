import { NextApiRequest, NextApiResponse } from 'next';
import { getMatrixClient } from '../../utils/matrixClient';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { content } = req.body;
      console.log('API: Sending message:', content);
      
      const client = await getMatrixClient();
      console.log('API: Matrix client obtained');

      const rooms = client.getRooms();
      console.log(`API: Found ${rooms.length} rooms`);
      
      if (rooms.length === 0) {
        throw new Error('No rooms available');
      }
      
      const roomId = rooms[0].roomId;
      console.log(`API: Sending message to room: ${roomId}`);

      await client.sendTextMessage(roomId, content);
      console.log('API: Message sent successfully');
      
      res.status(200).json({ success: true });
    } catch (error) {
      console.error('API Error sending message:', error);
      res.status(500).json({ error: 'Failed to send message', details: (error as Error).message });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}