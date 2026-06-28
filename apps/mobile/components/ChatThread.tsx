/**
 * Circle room feed (PRD §12.9): chat + system events fused into one thread.
 * Composes ChatBubble (text), SystemEvent (system + milestone), and VotePromptCard
 * (inline vote). Thin by design, not a full messenger (guardrail, PRD §21.4.1).
 */
import { useEffect, useRef, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { Send } from 'lucide-react-native';
import type { Message } from '@lindi/shared';
import { data } from '../lib/datasource';
import { IconButton } from './ui/IconButton';
import { Input } from './ui/Input';
import { ChatBubble } from './chat/ChatBubble';
import { SystemEvent } from './chat/SystemEvent';
import { VotePromptCard } from './chat/VotePromptCard';

const MY_ID = 'u_sri';

export function ChatThread({ circleId }: { circleId: number }) {
  const [msgs, setMsgs] = useState<Message[]>([]);
  const [text, setText] = useState('');
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    data.getMessages(circleId).then(setMsgs);
  }, [circleId]);

  const send = async () => {
    const body = text.trim();
    if (!body) return;
    setText('');
    const m = await data.sendMessage(circleId, body);
    setMsgs((prev) => [...prev, m]);
    requestAnimationFrame(() => scrollRef.current?.scrollToEnd({ animated: true }));
  };

  return (
    <View className="flex-1">
      <ScrollView
        ref={scrollRef}
        className="flex-1"
        contentContainerClassName="py-2"
        onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: false })}
      >
        {msgs.map((m) => {
          if (m.kind === 'system' || m.kind === 'milestone') return <SystemEvent key={m.id} message={m} />;
          if (m.kind === 'vote_prompt') return <VotePromptCard key={m.id} message={m} />;
          return <ChatBubble key={m.id} message={m} mine={m.authorUserId === MY_ID} />;
        })}
      </ScrollView>

      <View className="flex-row items-center gap-2 pt-2 pb-1">
        <View className="flex-1">
          <Input value={text} onChangeText={setText} placeholder="Tulis pesan" onSubmitEditing={send} />
        </View>
        <IconButton icon={Send} variant="lime" onPress={send} />
      </View>
    </View>
  );
}
