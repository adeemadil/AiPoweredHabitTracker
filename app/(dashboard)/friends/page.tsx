"use client";

import { trpc } from "@/lib/trpc/client";
import { useState } from "react";

export default function FriendsPage() {
  const [friendEmail, setFriendEmail] = useState(""); // Assuming adding friends by email for simplicity

  // Fetch current friends
  const { data: friends, isLoading: isLoadingFriends, refetch: refetchFriends } = trpc.friends.listFriends.useQuery();

  // Fetch pending friend requests
  const { data: pendingRequests, isLoading: isLoadingRequests, refetch: refetchRequests } = trpc.friends.listPendingRequests.useQuery();

  // Mutation for sending a friend request
  // This is a simplified version; typically, you'd get friendId from a search or user profile
  // For now, we'll assume a backend adjustment or a different method to get friendId might be needed
  // Or, we adjust `sendRequest` to accept email and the backend resolves it to userId.
  // For this example, let's assume `sendRequest` is updated to accept email or we have a way to get friendId.
  const sendFriendRequestMutation = trpc.friends.sendRequest.useMutation({
    onSuccess: () => {
      alert("Friend request sent!");
      setFriendEmail("");
      refetchRequests(); // Refetch pending requests or friends list
    },
    onError: (error) => {
      alert(`Error sending request: ${error.message}`);
    },
  });

  // Mutation for accepting a friend request
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

  // Mutation for declining a friend request
  const declineFriendRequestMutation = trpc.friends.declineRequest.useMutation({
    onSuccess: () => {
      alert("Friend request declined.");
      refetchRequests();
    },
    onError: (error) => {
      alert(`Error declining request: ${error.message}`);
    }
  });

  // Mutation for removing a friend
  const removeFriendMutation = trpc.friends.removeFriend.useMutation({
    onSuccess: () => {
      alert("Friend removed.");
      refetchFriends();
    },
    onError: (error) => {
      alert(`Error removing friend: ${error.message}`);
    }
  });


  const handleSendRequest = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // This is a placeholder. In a real app, you'd need to resolve email to a userId.
    // sendFriendRequestMutation.mutate({ friendId: "some-user-id-from-email" });
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
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Manage Friends</h1>

      {/* Send Friend Request Form - Simplified */}
      <form onSubmit={handleSendRequest} className="mb-8 p-4 border rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Add a Friend</h2>
        <input
          type="email"
          value={friendEmail}
          onChange={(e) => setFriendEmail(e.target.value)}
          placeholder="Enter friend's email"
          className="border p-2 rounded w-full mb-4"
        />
        <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Send Request
        </button>
      </form>

      {/* Pending Friend Requests List */}
      <div className="mb-8 p-4 border rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Pending Requests</h2>
        {isLoadingRequests ? (
          <p>Loading requests...</p>
        ) : pendingRequests && pendingRequests.length > 0 ? (
          <ul>
            {pendingRequests.map((req) => (
              <li key={req.id} className="flex justify-between items-center mb-2 p-2 border-b">
                <span>{req.user.email} wants to be your friend.</span>
                <div>
                  <button onClick={() => handleAcceptRequest(req.id)} className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-3 rounded mr-2">
                    Accept
                  </button>
                  <button onClick={() => handleDeclineRequest(req.id)} className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded">
                    Decline
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>No pending friend requests.</p>
        )}
      </div>

      {/* Friends List */}
      <div className="p-4 border rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Your Friends</h2>
        {isLoadingFriends ? (
          <p>Loading friends...</p>
        ) : friends && friends.length > 0 ? (
          <ul>
            {friends.map((friend) => (
              <li key={friend.friendshipId} className="flex justify-between items-center mb-2 p-2 border-b">
                <span>{friend.friendEmail}</span>
                <button onClick={() => handleRemoveFriend(friend.friendshipId)} className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-1 px-3 rounded">
                  Remove
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>You have no friends yet. Add some!</p>
        )}
      </div>
    </div>
  );
}
