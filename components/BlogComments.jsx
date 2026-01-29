'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { formatDistanceToNow } from 'date-fns';
import { MessageCircle, Heart, Reply, Send } from 'lucide-react';

const API_URL = 'https://content.lifereachchurch.org';

export default function BlogComments({ blogId }) {
  const { user, token, isAuthenticated } = useAuth();
  const router = useRouter();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [replyTo, setReplyTo] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchComments();
  }, [blogId]);

  const fetchComments = async () => {
    try {
      const memberId = user?.id || 0;
      const response = await axios.get(
        `${API_URL}/blog/get_comments.php?blog_id=${blogId}&member_id=${memberId}`
      );
      if (response.data.success) {
        setComments(response.data.data.comments);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) return;
    if (!newComment.trim()) return;

    setSubmitting(true);
    try {
      const response = await axios.post(
        `${API_URL}/blog/create_comment.php`,
        {
          blog_id: blogId,
          member_id: user.id,
          comment: newComment
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        setNewComment('');
        fetchComments();
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to post comment');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitReply = async (parentId) => {
    if (!isAuthenticated) return;
    if (!replyText.trim()) return;

    setSubmitting(true);
    try {
      const response = await axios.post(
        `${API_URL}/blog/create_comment.php`,
        {
          blog_id: blogId,
          member_id: user.id,
          parent_id: parentId,
          comment: replyText
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        setReplyText('');
        setReplyTo(null);
        fetchComments();
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to post reply');
    } finally {
      setSubmitting(false);
    }
  };

  const handleLikeComment = async (commentId) => {
    if (!isAuthenticated) return;

    try {
      const response = await axios.post(
        `${API_URL}/blog/like_comment.php`,
        {
          comment_id: commentId,
          member_id: user.id
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        fetchComments();
      }
    } catch (error) {
      console.error('Error liking comment:', error);
    }
  };

  const CommentItem = ({ comment, isReply = false }) => (
    <div className={`${isReply ? 'ml-16 mt-6' : 'mb-8'}`}>
      <div className="flex gap-4">
        <div className="flex-shrink-0">
          <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center text-white font-black text-sm">
            {comment.first_name[0]}{comment.last_name[0]}
          </div>
        </div>

        <div className="flex-1">
          <div className="bg-gray-50 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-2">
              <div>
                <p className="font-black text-gray-900 uppercase text-xs tracking-wider">
                  {comment.first_name} {comment.last_name}
                </p>
                <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mt-1">
                  {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                </p>
              </div>
            </div>
            <p className="text-gray-700 leading-relaxed">{comment.comment}</p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-6 mt-3 ml-2">
            <button
              onClick={() => handleLikeComment(comment.id)}
              className={`flex items-center gap-1.5 text-xs font-black uppercase tracking-wider ${
                comment.user_has_liked ? 'text-orange-600' : 'text-gray-400'
              } hover:text-orange-600 transition-colors`}
            >
              <Heart size={14} fill={comment.user_has_liked ? "currentColor" : "none"} />
              <span>{comment.likes_count || 0}</span>
            </button>

            {!isReply && (
              <button
                onClick={() => setReplyTo(replyTo === comment.id ? null : comment.id)}
                className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-gray-400 hover:text-orange-600 transition-colors"
              >
                <Reply size={14} />
                <span>Reply</span>
              </button>
            )}
          </div>

          {/* Reply Form */}
          {replyTo === comment.id && (
            <div className="mt-4">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Write a reply..."
                  className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 text-gray-900 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm font-medium"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmitReply(comment.id);
                    }
                  }}
                />
                <button
                  onClick={() => handleSubmitReply(comment.id)}
                  disabled={submitting || !replyText.trim()}
                  className="px-5 py-3 bg-orange-600 text-white rounded-xl hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-black uppercase tracking-wider transition-colors"
                >
                  <Send size={16} />
                </button>
                <button
                  onClick={() => {
                    setReplyTo(null);
                    setReplyText('');
                  }}
                  className="px-4 py-3 text-gray-400 hover:text-gray-600 text-xs font-black uppercase tracking-wider"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Replies */}
          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-6">
              {comment.replies.map((reply) => (
                <CommentItem key={reply.id} comment={reply} isReply={true} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto py-16">
      <h2 className="text-4xl font-black uppercase italic mb-2 text-gray-900 flex items-center gap-3">
        <MessageCircle className="text-orange-600" size={32} />
        Comments
      </h2>
      <p className="text-gray-400 text-xs font-black uppercase tracking-widest mb-10">
        {comments.length} {comments.length === 1 ? 'Comment' : 'Comments'}
      </p>

      {/* Comment Form */}
      {isAuthenticated ? (
        <div className="mb-12">
          <form onSubmit={handleSubmitComment}>
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center text-white font-black text-sm">
                  {user.first_name?.[0] || 'U'}{user.last_name?.[0] || 'U'}
                </div>
              </div>
              <div className="flex-1">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Share your thoughts..."
                  rows={4}
                  className="w-full px-5 py-4 bg-gray-50 border border-gray-200 text-gray-900 rounded-2xl focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none font-medium"
                />
                <div className="flex justify-end mt-3">
                  <button
                    type="submit"
                    disabled={submitting || !newComment.trim()}
                    className="px-8 py-3 bg-orange-600 text-white rounded-xl font-black uppercase tracking-wider hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm shadow-lg shadow-orange-600/20"
                  >
                    {submitting ? 'Posting...' : 'Post Comment'}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      ) : (
        <div className="mb-12 p-8 bg-gray-50 rounded-2xl text-center border border-gray-200">
          <p className="text-gray-600 mb-4 font-medium">Join the conversation</p>
          <button
            onClick={() => router.push('/auth?callbackUrl=/blog')}
            className="px-8 py-3 bg-orange-600 text-white rounded-xl font-black uppercase tracking-wider hover:bg-orange-700 transition-colors text-sm"
          >
            Login to Comment
          </button>
        </div>
      )}

      {/* Comments List */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-orange-600 mx-auto"></div>
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-2xl border border-gray-200">
          <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600 text-lg font-bold">No comments yet</p>
          <p className="text-gray-400 text-sm mt-2 font-medium">Be the first to share your thoughts!</p>
        </div>
      ) : (
        <div>
          {comments.map((comment) => (
            <CommentItem key={comment.id} comment={comment} />
          ))}
        </div>
      )}
    </div>
  );
}

