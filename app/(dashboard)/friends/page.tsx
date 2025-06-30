"use client";

import { useState } from "react";
import { trpc } from "@/lib/trpc/init";
import FriendsList, { Friend } from "@/components/friends/FriendsList";
import AddFriendForm from "@/components/friends/AddFriendForm";
import PendingRequestsList from "@/components/friends/PendingRequestsList";

export default function FriendsPage() {
  const [friendEmail, setFriendEmail] = useState("");

  // Fetch current friends
  const {
    data: friends,
    isLoading: isLoadingFriends,
    refetch: refetchFriends,
  } = trpc.friends.listFriends.useQuery();

  // Fetch pending friend requests
  const {
    data: pendingRequests,
    isLoading: isLoadingRequests,
    refetch: refetchRequests,
  } = trpc.friends.listPendingRequests.useQuery();

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
    },
  });
  const removeFriendMutation = trpc.friends.removeFriend.useMutation({
    onSuccess: () => {
      alert("Friend removed.");
      refetchFriends();
    },
    onError: (error) => {
      alert(`Error removing friend: ${error.message}`);
    },
  });

  // Handlers
  const handleSendRequest = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    alert(
      "Sending friend request functionality needs backend adjustment for email or a user search feature.",
    );
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
      <p className="text-gray-500 mb-8">
        Manage your friends, requests, and social motivation.
      </p>

      {/* Add Friend Form (atomic) */}
      <AddFriendForm
        value={friendEmail}
        onChange={(e) => setFriendEmail(e.target.value)}
        onSubmit={handleSendRequest}
        loading={sendFriendRequestMutation.isLoading}
      />

      {/* Pending Friend Requests (atomic) */}
      <PendingRequestsList
        requests={pendingRequests || []}
        onAccept={handleAcceptRequest}
        onDecline={handleDeclineRequest}
        loading={isLoadingRequests}
      />

      {/* Friends List */}
      <div className="p-4 border rounded shadow bg-white dark:bg-gray-800">
        <h2 className="text-xl font-semibold mb-4">Your Friends</h2>
        {isLoadingFriends ? (
          <p>Loading friends...</p>
        ) : friends && friends.length > 0 ? (
          <FriendsList
            friends={friends as Friend[]}
            onRemove={handleRemoveFriend}
          />
        ) : (
          <div className="text-gray-500 text-center py-4">
            You have no friends yet. Add some!
          </div>
        )}
      </div>
    </div>
  );
}
