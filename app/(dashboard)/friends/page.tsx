"use client";

import { trpc } from "@/lib/trpc/client";
import { useState } from "react";

// Helper to generate avatar initials and color
function getAvatar(email: string) {
  const initials = email
    .split("@")[0]
    .split(/[._-]/)
    .map((s) => s[0]?.toUpperCase() || "")
    .join("")
    .slice(0, 2);
  // Simple color hash
  const color = `hsl(${email.length * 37 % 360}, 70%, 60%)`;
  return { initials, color };
}

export default function FriendsPage() {
  const [friendEmail, setFriendEmail] = useState("");

  // Fetch current friends
  const { data: friends, isLoading: isLoadingFriends, refetch: refetchFriends } = trpc.friends.listFriends.useQuery();

  // Fetch pending friend requests
  const { data: pendingRequests, isLoading: isLoadingRequests, refetch: refetchRequests } = trpc.friends.listPendingRequests.useQuery();

  // Mutations (send, accept, decline, remove)
  const sendFriendRequestMutation = trpc.friends.sendRequest.useMutation({
    onSuccess: () => {
      alert("Friend request sent!");
      setFriendEmail("");
      refetchRequests();
    },
    onError: (error) => {
      alert(`Error sending request: ${error.message}`);
    },
  });
  const acceptFriendRequestMutation = trpc.friends.acceptRequest.useMutation({
    onSuccess: () => {
      alert("Friend request accepted!");
      refetchFriends();
      refetchRequests();
    },
    onError: (error) => {
      alert(`Error accepting request: ${error.message}`);
    },
  });
  const declineFriendRequestMutation = trpc.friends.declineRequest.useMutation({
    onSuccess: () => {
      alert("Friend request declined.");
      refetchRequests();
    },
    onError: (error) => {
      alert(`Error declining request: ${error.message}`);
    }
  });
  const removeFriendMutation = trpc.friends.removeFriend.useMutation({
    onSuccess: () => {
      alert("Friend removed.");
      refetchFriends();
    },
    onError: (error) => {
      alert(`Error removing friend: ${error.message}`);
    }
  });

  // Handlers
  const handleSendRequest = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    alert("Sending friend request functionality needs backend adjustment for email or a user search feature.");
  };
  const handleAcceptRequest = (friendshipId: string) => {
    acceptFriendRequestMutation.mutate({ friendshipId });
  };
  const handleDeclineRequest = (friendshipId: string) => {
    declineFriendRequestMutation.mutate({ friendshipId });
  };
  const handleRemoveFriend = (friendshipId: string) => {
    removeFriendMutation.mutate({ friendshipId });
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-2">Friends & Social</h1>
      <p className="text-gray-500 mb-8">Manage your friends, requests, and social motivation.</p>

      {/* Add Friend Form */}
      <form onSubmit={handleSendRequest} className="mb-8 p-4 border rounded shadow bg-white dark:bg-gray-800">
        <h2 className="text-xl font-semibold mb-4">Add a Friend</h2>
        <div className="flex gap-2 items-center">
          <input
            type="email"
            value={friendEmail}
            onChange={(e) => setFriendEmail(e.target.value)}
            placeholder="Enter friend's email"
            className="border p-2 rounded flex-1"
            aria-label="Friend's email"
          />
          <button type="submit" className="btn-primary">Send Request</button>
        </div>
      </form>

      {/* Pending Friend Requests */}
      <div className="mb-8 p-4 border rounded shadow bg-white dark:bg-gray-800">
        <h2 className="text-xl font-semibold mb-4">Pending Requests</h2>
        {isLoadingRequests ? (
          <p>Loading requests...</p>
        ) : pendingRequests && pendingRequests.length > 0 ? (
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {pendingRequests.map((req: { id: string; user: { id: string; email: string } }) => {
              const { initials, color } = getAvatar(req.user.email);
              return (
                <li key={req.id} className="flex justify-between items-center py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                  <div className="flex items-center gap-3">
                    <span className="w-9 h-9 rounded-full flex items-center justify-center text-lg font-bold" style={{ background: color, color: '#fff' }} aria-label={`Avatar for ${req.user.email}`}>{initials}</span>
                    <span className="text-gray-800 dark:text-gray-200">{req.user.email} wants to be your friend.</span>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleAcceptRequest(req.id)} className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-3 rounded transition">Accept</button>
                    <button onClick={() => handleDeclineRequest(req.id)} className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded transition">Decline</button>
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="text-gray-500 text-center py-4">No pending friend requests. You're all caught up!</div>
        )}
      </div>

      {/* Friends List */}
      <div className="p-4 border rounded shadow bg-white dark:bg-gray-800">
        <h2 className="text-xl font-semibold mb-4">Your Friends</h2>
        {isLoadingFriends ? (
          <p>Loading friends...</p>
        ) : friends && friends.length > 0 ? (
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {friends.map((friend: { friendshipId: string; friendEmail: string }) => {
              const { initials, color } = getAvatar(friend.friendEmail);
              return (
                <li key={friend.friendshipId} className="flex justify-between items-center py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                  <div className="flex items-center gap-3">
                    <span className="w-9 h-9 rounded-full flex items-center justify-center text-lg font-bold" style={{ background: color, color: '#fff' }} aria-label={`Avatar for ${friend.friendEmail}`}>{initials}</span>
                    <span className="text-gray-800 dark:text-gray-200">{friend.friendEmail}</span>
                  </div>
                  <button onClick={() => handleRemoveFriend(friend.friendshipId)} className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-1 px-3 rounded transition">Remove</button>
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="text-gray-500 text-center py-4">You have no friends yet. Add some!</div>
        )}
      </div>
    </div>
  );
}
