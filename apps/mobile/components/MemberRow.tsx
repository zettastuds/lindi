/**
 * Member row for the circle room: avatar, username, contribution, paid/received badge.
 */
import { View } from 'react-native';
import type { Membership } from '@lindi/shared';
import { usd } from '../lib/format';
import { Avatar } from './ui/Avatar';
import { Badge } from './ui/Badge';
import { Text } from './ui/Text';

export function MemberRow({ member }: { member: Membership }) {
  return (
    <View className="flex-row items-center py-3 border-b border-border-hair last:border-0">
      <Avatar name={member.username} size="md" />
      <View className="flex-1 ml-3">
        <Text variant="body">{member.username}</Text>
        <Text variant="caption">Setoran {usd(member.totalContributed)}</Text>
      </View>
      {member.hasReceived ? (
        <Badge tone="info" label="sudah dapat" />
      ) : member.active ? (
        <Badge tone="success" label="lunas" />
      ) : (
        <Badge tone="danger" label="keluar" />
      )}
    </View>
  );
}
