/**
 * Circle room feed (PRD §12.9): chat + system events fused into one thread.
 * - text   : human messages (mine = lime right bubble, others = paper left bubble)
 * - system : projection of on-chain activity, centered subtle row
 * - vote_prompt : inline tappable vote card (links a StrategyVote)
 * - milestone   : celebratory centered chip
 * Thin by design — not a full messenger (guardrail, PRD §21.4.1).
 */
import { useEffect, useRef, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { Message } from '@lindi/shared';
import { color } from '@lindi/tokens';
import { data } from '../lib/datasource';
import { Avatar } from './ui/Avatar';
import { IconButton } from './ui/IconButton';
import { Input } from './ui/Input';
import { Text } from './ui/Text';

const MY_ID = 'u_sri';

function Bubble({ m }: { m: Message }) {
  const mine = m.authorUserId === MY_ID;
  if (mine) {
    return (
      <View className="items-end mb-2">
        <View className="bg-lime-500 rounded-lg rounded-tr-sm px-3.5 py-2.5 max-w-[80%]">
          <Text variant="body" className="text-ink-900">
            {m.body}
          </Text>
        </View>
      </View>
    );
  }
  return (
    <View className="flex-row items-end gap-2 mb-2">
      <Avatar name={m.authorUsername} size="sm" />
      <View className="max-w-[78%]">
        <Text variant="caption" className="text-ink-500 ml-1 mb-0.5">
          {m.authorUsername}
        </Text>
        <View className="bg-paper-raised border border-border-hair rounded-lg rounded-tl-sm px-3.5 py-2.5">
          <Text variant="body" className="text-ink-900">
            {m.body}
          </Text>
        </View>
      </View>
    </View>
  );
}

function SystemRow({ m }: { m: Message }) {
  return (
    <View className="flex-row items-center justify-center gap-1.5 my-2">
      <Ionicons name="ellipse" size={5} color={color.ink[400]} />
      <Text variant="caption" className="text-ink-500 text-center">
        {m.body}
      </Text>
    </View>
  );
}

function MilestoneRow({ m }: { m: Message }) {
  return (
    <View className="items-center my-3">
      <View className="bg-lime-200 rounded-pill px-4 py-2">
        <Text variant="bodyStrong" className="text-ink-900 text-center">
          {m.body}
        </Text>
      </View>
    </View>
  );
}

function VotePromptRow({ m }: { m: Message }) {
  return (
    <View className="my-2 bg-paper-raised border border-lime-500 rounded-md p-3.5">
      <View className="flex-row items-center gap-2 mb-1">
        <Ionicons name="git-branch" size={16} color={color.lime[700]} />
        <Text variant="caption" className="text-lime-700 font-body-strong">
          VOTING STRATEGI
        </Text>
      </View>
      <Text variant="body" className="text-ink-900 mb-2">
        {m.body}
      </Text>
      <View className="flex-row gap-2">
        <View className="flex-1 bg-lime-500 rounded-pill h-9 items-center justify-center">
          <Text variant="bodyStrong" className="text-ink-900">
            Setuju
          </Text>
        </View>
        <View className="flex-1 bg-paper-sunken rounded-pill h-9 items-center justify-center">
          <Text variant="bodyStrong" className="text-ink-700">
            Tolak
          </Text>
        </View>
      </View>
    </View>
  );
}

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
          if (m.kind === 'system') return <SystemRow key={m.id} m={m} />;
          if (m.kind === 'milestone') return <MilestoneRow key={m.id} m={m} />;
          if (m.kind === 'vote_prompt') return <VotePromptRow key={m.id} m={m} />;
          return <Bubble key={m.id} m={m} />;
        })}
      </ScrollView>

      <View className="flex-row items-center gap-2 pt-2 pb-1">
        <View className="flex-1">
          <Input value={text} onChangeText={setText} placeholder="Tulis pesan…" onSubmitEditing={send} />
        </View>
        <IconButton name="send" onPress={send} />
      </View>
    </View>
  );
}
