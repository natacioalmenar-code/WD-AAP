import React, { useMemo, useState } from "react";
import { useApp } from "../context/AppContext";
import { Heart, MessageCircle, Trash2, Send, Image as ImageIcon } from "lucide-react";
import type { SocialPost } from "../types";

export const SocialWall: React.FC = () => {
  const { socialPosts, currentUser, createSocialPost, togglePostLike, addPostComment } = useApp();

  const [text, setText] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [publishing, setPublishing] = useState(false);

  const posts = useMemo(() => socialPosts, [socialPosts]);

  const onPublish = async () => {
    setPublishing(true);
    try {
      await createSocialPost({ text, imageUrl });
      setText("");
      setImageUrl("");
    } finally {
      setPublishing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold text-slate-900">Mur social</h1>
        <p className="text-gray-600 mt-1">
          Comparteix fotos, avisos i moments del club 🫧
        </p>
      </div>

      {/* Crear post */}
      <div className="bg-white border rounded-2xl shadow-sm p-5 mb-8">
        <div className="font-extrabold text-slate-900 mb-2">Nova publicació</div>

        <textarea
          className="w-full border rounded-xl p-3 min-h-[90px]"
          placeholder="Què vols compartir?"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <div className="mt-3 flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
          <div className="flex items-center gap-2 w-full">
            <ImageIcon className="text-gray-400" />
            <input
              className="w-full border rounded-xl p-2"
              placeholder="URL d’imatge (opcional) https://..."
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
            />
          </div>

          <button
            onClick={onPublish}
            disabled={publishing}
            className={`px-4 py-2 rounded-xl font-extrabold ${
              publishing
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-yellow-400 hover:bg-yellow-300 text-black"
            }`}
          >
            {publishing ? "Publicant..." : "Publicar"}
          </button>
        </div>
      </div>

      {/* Posts */}
      <div className="space-y-6">
        {posts.length === 0 ? (
          <div className="bg-white border rounded-2xl shadow-sm p-8 text-center text-gray-500">
            Encara no hi ha publicacions.
          </div>
        ) : (
          posts.map((p) => <PostCard key={p.id} post={p} myUid={currentUser?.id || ""} />)
        )}
      </div>

      {/* component local */}
      {/**/}
      <div className="hidden" />
    </div>
  );

  function PostCard({ post, myUid }: { post: SocialPost; myUid: string }) {
    const { deleteSocialPost } = useApp();
    const [showComments, setShowComments] = useState(false);
    const [comment, setComment] = useState("");
    const [sending, setSending] = useState(false);

    const liked = post.likes?.includes(myUid);
    const likesCount = post.likes?.length || 0;
    const commentsCount = post.comments?.length || 0;

    const canDelete = myUid && (post.createdBy === myUid);

    const onLike = async () => {
      await togglePostLike(post.id);
    };

    const onSendComment = async () => {
      const t = comment.trim();
      if (!t) return;
      setSending(true);
      try {
        await addPostComment(post.id, t);
        setComment("");
        setShowComments(true);
      } finally {
        setSending(false);
      }
    };

    const onDelete = async () => {
      const ok = confirm(`Eliminar aquesta publicació?\n\n"${post.text.slice(0, 80)}"`);
      if (!ok) return;
      await deleteSocialPost(post.id);
    };

    return (
      <div className="bg-white border rounded-2xl shadow-sm overflow-hidden">
        <div className="p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-gray-100 overflow-hidden border">
                {post.createdByAvatarUrl ? (
                  <img src={post.createdByAvatarUrl} className="h-full w-full object-cover" />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-gray-400 font-extrabold">
                    {post.createdByName?.slice(0, 1)?.toUpperCase() || "W"}
                  </div>
                )}
              </div>

              <div>
                <div className="font-extrabold text-slate-900">{post.createdByName}</div>
                <div className="text-xs text-gray-500">Publicació del club</div>
              </div>
            </div>

            {(canDelete) && (
              <button
                onClick={onDelete}
                className="p-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-700"
                title="Eliminar"
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>

          <div className="mt-4 text-slate-800 whitespace-pre-wrap">{post.text}</div>

          {post.imageUrl ? (
            <div className="mt-4">
              <img
                src={post.imageUrl}
                className="w-full max-h-[420px] object-cover rounded-2xl border"
                alt="post"
              />
            </div>
          ) : null}

          <div className="mt-4 flex items-center gap-3">
            <button
              onClick={onLike}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl font-extrabold ${
                liked ? "bg-red-50 text-red-700" : "bg-gray-100 hover:bg-gray-200 text-slate-700"
              }`}
            >
              <Heart size={16} />
              {likesCount}
            </button>

            <button
              onClick={() => setShowComments((v) => !v)}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 font-extrabold text-slate-700"
            >
              <MessageCircle size={16} />
              {commentsCount}
            </button>
          </div>

          {/* Escriure comentari */}
          <div className="mt-4 flex gap-2">
            <input
              className="w-full border rounded-xl px-3 py-2"
              placeholder="Escriu un comentari..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") onSendComment();
              }}
            />
            <button
              onClick={onSendComment}
              disabled={sending}
              className={`px-3 py-2 rounded-xl font-extrabold ${
                sending ? "bg-gray-200 text-gray-500" : "bg-yellow-400 hover:bg-yellow-300 text-black"
              }`}
              title="Enviar"
            >
              <Send size={16} />
            </button>
          </div>
        </div>

        {/* Comentaris */}
        {showComments && (
          <div className="border-t bg-gray-50 p-4 space-y-3">
            {post.comments?.length ? (
              post.comments.map((c) => (
                <div key={c.id} className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-full bg-white overflow-hidden border">
                    {c.userAvatarUrl ? (
                      <img src={c.userAvatarUrl} className="h-full w-full object-cover" />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-gray-400 font-extrabold">
                        {c.userName?.slice(0, 1)?.toUpperCase() || "W"}
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-extrabold text-slate-900">{c.userName}</div>
                    <div className="text-sm text-slate-700">{c.text}</div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-sm text-gray-500">Encara no hi ha comentaris.</div>
            )}
          </div>
        )}
      </div>
    );
  }
};

