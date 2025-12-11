
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Send, ThumbsUp, MessageSquare } from 'lucide-react';

export const SocialWall: React.FC = () => {
  const { posts, currentUser, addPost, likePost, getUserById } = useApp();
  const [newPostContent, setNewPostContent] = useState('');

  if (!currentUser) return null;

  const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (!newPostContent.trim()) return;
      addPost(newPostContent);
      setNewPostContent('');
  };

  const formatDate = (isoString: string) => {
      const date = new Date(isoString);
      return date.toLocaleDateString('ca-ES', { day: 'numeric', month: 'short', hour: '2-digit', minute:'2-digit' });
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
       <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Mur Social</h1>
        <p className="text-gray-600 mt-2">Connecta amb altres socis, organitza sortides informals o ven material.</p>
      </div>

      {/* Input Box */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-8">
          <div className="flex gap-4">
              <img src={currentUser.avatarUrl} alt="" className="w-10 h-10 rounded-full object-cover" />
              <form onSubmit={handleSubmit} className="flex-1">
                  <textarea 
                    value={newPostContent}
                    onChange={(e) => setNewPostContent(e.target.value)}
                    className="w-full border-gray-200 rounded-lg focus:ring-blue-500 focus:border-blue-500 p-3 text-sm resize-none bg-gray-50"
                    placeholder="Què estàs pensant? Busques company per bussejar?"
                    rows={3}
                  />
                  <div className="flex justify-end mt-2">
                      <button 
                        type="submit" 
                        disabled={!newPostContent.trim()}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 hover:bg-blue-700 disabled:opacity-50"
                      >
                          <Send size={16}/> Publicar
                      </button>
                  </div>
              </form>
          </div>
      </div>

      {/* Timeline */}
      <div className="space-y-6">
          {posts.map(post => {
              const author = getUserById(post.authorId);
              const isLiked = post.likes.includes(currentUser.id);
              if (!author) return null;

              return (
                  <div key={post.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-fade-in-up">
                      <div className="flex items-center gap-3 mb-4">
                          <img src={author.avatarUrl} alt={author.name} className="w-10 h-10 rounded-full object-cover border border-gray-200" />
                          <div>
                              <p className="font-bold text-gray-900">{author.name}</p>
                              <p className="text-xs text-gray-500">{formatDate(post.date)}</p>
                          </div>
                          {author.role !== 'Soci' && (
                              <span className="ml-auto bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-1 rounded uppercase">
                                  {author.role}
                              </span>
                          )}
                      </div>
                      
                      <p className="text-gray-800 mb-4 whitespace-pre-wrap">{post.content}</p>

                      <div className="flex items-center gap-6 border-t pt-3 text-sm text-gray-500">
                          <button 
                            onClick={() => likePost(post.id)}
                            className={`flex items-center gap-1 hover:text-blue-600 transition-colors ${isLiked ? 'text-blue-600 font-bold' : ''}`}
                          >
                              <ThumbsUp size={18} /> {post.likes.length} M'agrada
                          </button>
                          {/* Future feature: Comments */}
                          <button className="flex items-center gap-1 hover:text-blue-600 transition-colors">
                              <MessageSquare size={18} /> Comentar
                          </button>
                      </div>
                  </div>
              );
          })}
      </div>
    </div>
  );
};
