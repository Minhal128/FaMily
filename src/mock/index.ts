import { Message } from '../types';

// Money, profiles and the code word all live in the backend now — only chat is still
// local, because the backend deliberately has no messages.
export const messages: Message[] = [
  { id: 'm1', sender: 'partner', text: 'Added the rent for this month, check the amount?', time: '09:14' },
  { id: 'm2', sender: 'you', text: 'Saw it — landlord raised it by 3k, so 68 is right.', time: '09:16' },
  { id: 'm3', sender: 'partner', text: 'Got it. Also the headphones were on sale, 21k not 26k.', time: '09:18' },
  { id: 'm4', sender: 'you', text: 'Nice. I fixed the entry.', time: '09:20' },
  { id: 'm5', sender: 'partner', text: "Let's keep eating out under 10k this month 🙂", time: '09:22' },
];
