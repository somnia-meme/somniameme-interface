import api from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { FiSend, FiMessageCircle, FiUser } from "react-icons/fi";
import { useState } from "react";
import { formatAddress } from "@/lib/utils/format-address";
import { useUserStore } from "@/store/user-store";

export function CommentForm({ address }: { address: string }) {
  const [comment, setComment] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!comment.trim()) {
      return;
    }

    try {
      await api.post("/comments/" + address, {
        comment: comment.trim(),
      });

      setComment("");
    } catch (error) {
      console.error("Error posting comment:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="relative">
        <div className="flex items-center rounded-lg overflow-hidden border border-[var(--primary)]/30 bg-[var(--primary-darker)]/30 backdrop-blur-sm">
          <input
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            type="text"
            placeholder="Share your thoughts about this cosmic token..."
            className="w-full bg-transparent px-4 py-3 text-white focus:outline-none placeholder:text-[var(--primary-lighter)]/50"
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="p-3 mr-1 bg-gradient-to-r from-[var(--primary-dark)] to-[var(--secondary)] rounded-lg flex items-center justify-center"
          >
            <FiSend className="h-5 w-5 text-white" />
          </motion.button>
        </div>
      </div>
    </form>
  );
}

export function Comment({ comment }: { comment: any }) {
  return (
    <motion.div
      key={comment.id}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-[var(--primary-darker)]/20 backdrop-blur-sm rounded-lg p-4 border border-[var(--primary)]/20 relative overflow-hidden group"
    >
      <div className="flex items-center gap-2 mb-2">
        <div className="flex items-center gap-2">
          <div className="rounded-lg bg-[var(--primary)]/20 p-1.5">
            <FiUser className="h-3.5 w-3.5 text-[var(--primary-lighter)]" />
          </div>
          <span className="font-medium text-xs text-[var(--primary-lighter)]">
            {formatAddress(comment.address)}
          </span>
        </div>
        <span className="text-[var(--primary-lighter)]/60 text-xs ml-auto">
          {new Date(comment.created_at).toLocaleDateString()} •{" "}
          {new Date(comment.created_at).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>

      <div className="pl-7 mt-1">
        <p className="text-[var(--primary-light)] text-sm">{comment.comment}</p>
      </div>
    </motion.div>
  );
}

export function CommentsSection({ address }: { address: string }) {
  const user = useUserStore();

  const commentsQuery = useQuery({
    queryKey: ["comments", address],
    queryFn: async () =>
      await api.get(`/comments/${address}`).then((res) => res.data),
    initialData: [],
    enabled: !!address,
    refetchInterval: 5000,
  });

  if (commentsQuery.isLoading) {
    return (
      <div className="flex justify-center items-center py-10">
        <div className="relative h-16 w-16">
          <div className="absolute inset-0 rounded-full border-t-2 border-b-2 border-[var(--primary)] animate-spin"></div>
          <div className="absolute inset-2 rounded-full border-r-2 border-l-2 border-[var(--secondary)] animate-spin animate-delay-150"></div>
          <div className="absolute inset-4 rounded-full border-t-2 border-b-2 border-[var(--primary-lighter)] animate-spin animate-delay-300"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {user.isLoggedIn && <CommentForm address={address} />}

      {commentsQuery.data?.length === 0 ? (
        <div className="text-center py-8">
          <div className="inline-flex rounded-full bg-[var(--primary-darker)]/30 p-3 mb-4">
            <div className="rounded-full bg-[var(--primary)]/20 p-2">
              <FiMessageCircle className="h-5 w-5 text-[var(--primary-light)]" />
            </div>
          </div>
          <h3 className="text-xl font-medium text-white mb-2">
            No Comments Yet
          </h3>
          <p className="text-[var(--primary-lighter)] max-w-md mx-auto">
            Be the first to leave your mark on this cosmic token!
          </p>
        </div>
      ) : (
        <motion.div
          className="space-y-3"
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1,
              },
            },
          }}
          initial="hidden"
          animate="show"
        >
          {commentsQuery.data?.map((comment: any) => (
            <Comment key={comment.id} comment={comment} />
          ))}
        </motion.div>
      )}
    </div>
  );
}

export function TokenComments({ token }: { token: Token }) {
  return <CommentsSection address={token.token_address} />;
}
