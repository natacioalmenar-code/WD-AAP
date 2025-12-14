import React, { useMemo, useState } from "react";
import { useApp } from "../context/AppContext";
import {
  Heart,
  MessageCircle,
  Trash2,
  Send,
  Image as ImageIcon,
  X,
  Expand,
} from "lucide-react";
import type { SocialPost } from "../types";

function timeAgo(input: any): string {
  try {
    const d =
      input?.toDate?.() instanceof Date
        ? input.toDate()
        : input instanceof Date
        ? input
        : null;

    if (!d) return "fa un moment";

    const diff = Date.now() - d.getTime();
    const s = Math.floor(diff / 1000);
    if (s < 10) return "ara mateix";
    if (s < 60) return `fa ${s}s`;
    const m = Math.floor(s / 60);
    if (m < 60) return `fa ${m} min`;
    const h = Math.floor(m / 60);
    if (h < 24) return `fa ${h} h`;
    const days = Math.floor(h / 24);
    if (days < 7) return `fa ${days} dies`;
    const w = Math.floor(days / 7);
    if (w < 5) return `fa ${w} setmanes`;
    const mo = Math.floor(days / 30);
    if (mo < 12) return `fa ${mo} mesos`;
    const y = Math.floor(days / 365);
    return `fa ${y} anys`;
  } catch {
    return "fa un moment";
  }
}

export const SocialWall: React.FC = () => {
  const {
    socialPosts,
    currentUser,
    createSocialPost,
    togglePostLike,
    addPostComment,
  } = useApp();

  const [text, setText] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [publishing, setPublishing] = useState(false);

  const [lightboxUrl, setLightboxUrl] = useState<string>("");

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
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900">
          Mur social
        </h1>
        <p className="text-gray-600 mt-2">
          Comparteix fotos, avisos i moments del club 🫧
        </p>
      </div>

      {/* Crear post */}
      <div className="bg-white border rounded-2xl shadow-sm p-5 md:p-6 mb-8">
        <div className="flex items-center justify-between gap-3 mb-3">
          <div className="font-extrabold text-slate-900">Nova publicació</div>
          <div className="text-xs text-gray-500">
            {currentUser?.name ? `Connectat/da com ${currentUser.name}` : ""}
          </div>
        </div>

        <textarea
          className="w-full border rounded-2xl p-4 min-h-[110px] focus:outline-none focus:ring-2 focus:ring-yellow-300"
          placeholder="Què vols compartir?"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <div className="mt-4 flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
          <div className="flex items-center gap-2 w-full">
            <div className="h-10 w-10 rounded-2xl border bg-gray-50 flex items-center justify-center">
              <ImageIcon className="text-gray-400" />
            </div>
            <input
              className="w-full border rounded-2xl p-3 focus:outline-none focus:ring-2 focus:ring-yellow-300"
              placeholder="URL d’imatge (opcional) https://..."
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
            />
          </div>

          <button
            onClick={onPublish}
            disabled={publishing}
            className={`px-5 py-3 rounded-2xl font-extrabold ${
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
          <div className="bg-white border rounded-2xl shadow-sm p-10 text-center text-gray-500">
            Encara no hi ha publicacions.
          </div>
        ) : (
          posts.map((p) => (
            <PostCard
              key={p.id}
              post={p}
              myUid={currentUser?.id || ""}
              onOpenImage={(url) => setLightboxUrl(url)}
            />
          ))
        )}
      </div>

      {/* Lightbox */}
      {lightboxUrl && (
        <div className="fixed inset-0 z-[9999]">
          <div
            className="absolute inset-0 bg-black/70"
            onClick={() => setLightboxUrl("")}
          />
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <div className="relative w-full max-w-4xl">
              <button
                className="absolute -top-12 right-0 px-4 py-2 rounded-2xl bg-white/90 hover:bg-white font-extrabold flex items-center gap-2"
                onClick={() => setLightboxUrl("")}
              >
                <X size={18} /> Tancar
              </button>
              <img
                src={lightboxUrl}
                className="w-full max-h-[80vh] object-contain rounded-2xl border bg-black"
                alt="imatge"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

function PostCard({
  post,
  myUid,
  onOpenImage,
}: {
  post: SocialPost;
  myUid: string;
  onOpenImage: (url: string) => void;
}) {
  const { togglePostLike, addPostComment, deleteSocialPost, canManageTrips } =
    useApp();

  const [showComments, setShowComments] = useState(false);
  const [comment, setComment] = useState("");
  const [sending, setSending] = useState(false);

  const liked = post.likes?.includes(myUid);
  const likesCount = post.likes?.length || 0;
  const commentsCount = post.comments?.length || 0;

  const canDelete = !!myUid && (canManageTrips() || post.createdBy === myUid);

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
    const ok = confirm(
      `Eliminar aquesta publicació?\n\n"${(post.text || "").slice(0, 120)}"`
    );
    if (!ok) return;
    await deleteSocialPost(post.id);
  };

  return (
    <div className="bg-white border rounded-2xl shadow-sm overflow-hidden">
      <div className="p-5 md:p-6">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-full bg-gray-100 overflow-hidden border">
              {post.createdByAvatarUrl ? (
                <img
                  src={post.createdByAvatarUrl}
                  className="h-full w-full object-cover"
                  alt="avatar"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center text-gray-400 font-extrabold">
                  {post.createdByName?.slice(0, 1)?.toUpperCase() || "W"}
                </div>
              )}
            </div>

            <div>
              <div className="font-extrabold text-slate-900 leading-tight">
                {post.createdByName}
              </div>
              <div className="text-xs text-gray-500">
                {timeAgo(post.createdAt)}
              </div>
            </div>
          </div>

          {canDelete && (
            <button
              onClick={onDelete}
              className="p-2 rounded-2xl bg-red-50 hover:bg-red-100 text-red-700"
              title="Eliminar"
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>

        <div className="mt-4 text-slate-800 whitespace-pre-wrap leading-relaxed">
          {post.text}
        </div>

        {post.imageUrl ? (
          <div className="mt-4 relative group">
            <img
              src={post.imageUrl}
              className="w-full max-h-[520px] object-cover rounded-2xl border bg-gray-50"
              alt="post"
            />
            <button
              onClick={() => onOpenImage(post.imageUrl!)}
              className="absolute top-3 right-3 px-3 py-2 rounded-2xl bg-white/90 hover:bg-white font-extrabold flex items-center gap-2 opacity-0 group-hover:opacity-100 transition"
              title="Veure gran"
            >
              <Expand size={16} /> Veure
            </button>
          </div>
        ) : null}

        <div className="mt-5 flex items-center gap-3">
          <button
            onClick={onLike}
            className={`flex items-center gap-2 px-4 py-2 rounded-2xl font-extrabold ${
              liked
                ? "bg-red-50 text-red-700"
                : "bg-gray-100 hover:bg-gray-200 text-slate-700"
            }`}
          >
            <Heart size={16} />
            {likesCount}
          </button>

          <button
            onClick={() => setShowComments((v) => !v)}
            className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-gray-100 hover:bg-gray-200 font-extrabold text-slate-700"
          >
            <MessageCircle size={16} />
            {commentsCount}
          </button>
        </div>

        {/* Escriure comentari */}
        <div className="mt-4 flex gap-2">
          <input
            className="w-full border rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-300"
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
            className={`px-4 py-3 rounded-2xl font-extrabold ${
              sending
                ? "bg-gray-200 text-gray-500"
                : "bg-yellow-400 hover:bg-yellow-300 text-black"
            }`}
            title="Enviar"
          >
            <Send size={16} />
          </button>
        </div>
      </div>

      {/* Comentaris */}
      {showComments && (
        <div className="border-t bg-gray-50 p-4 md:p-5 space-y-3">
          {post.comments?.length ? (
            post.comments.map((c) => (
              <div key={c.id} className="flex items-start gap-3">
                <div className="h-9 w-9 rounded-full bg-white overflow-hidden border">
                  {c.userAvatarUrl ? (
                    <img
                      src={c.userAvatarUrl}
                      className="h-full w-full object-cover"
                      alt="avatar"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-gray-400 font-extrabold">
                      {c.userName?.slice(0, 1)?.toUpperCase() || "W"}
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-extrabold text-slate-900 leading-tight">
                    {c.userName}
                  </div>
                  <div className="text-sm text-slate-700 leading-relaxed">
                    {c.text}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-sm text-gray-500">
              Encara no hi ha comentaris.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
