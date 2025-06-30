import React from "react";

export interface Friend {
  friendshipId: string;
  friendEmail: string;
}

interface FriendsListProps {
  friends: Friend[];
  onRemove: (friendshipId: string) => void;
}

function getAvatar(email: string) {
  const initials = email
    .split("@")[0]
    .split(/[._-]/)
    .map((s) => s[0]?.toUpperCase() || "")
    .join("")
    .slice(0, 2);
  const color = `hsl(${email.length * 37 % 360}, 70%, 60%)`;
  return { initials, color };
}

export default function FriendsList({ friends, onRemove }: FriendsListProps) {
  if (!friends.length) {
    return <div className="text-gray-500 text-center py-4">You have no friends yet. Add some!</div>;
  }
  return (
    <ul className="divide-y divide-gray-200 dark:divide-gray-700">
      {friends.map((friend) => {
        const { initials, color } = getAvatar(friend.friendEmail);
        return (
          <li key={friend.friendshipId} className="flex justify-between items-center py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition">
            <div className="flex items-center gap-3">
              <span className="w-9 h-9 rounded-full flex items-center justify-center text-lg font-bold" style={{ background: color, color: '#fff' }} aria-label={`Avatar for ${friend.friendEmail}`}>{initials}</span>
              <span className="text-gray-800 dark:text-gray-200">{friend.friendEmail}</span>
            </div>
            <button onClick={() => onRemove(friend.friendshipId)} className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-1 px-3 rounded transition">Remove</button>
          </li>
        );
      })}
    </ul>
  );
} 