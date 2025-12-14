import React, { useMemo, useState } from "react";
import { useApp } from "../context/AppContext";
import type { ResourceItem, ResourceCategory } from "../types";
import {
  Plus,
  FileText,
  ExternalLink,
  X,
  Tag,
  Pencil,
  Trash2,
  Search,
} from "lucide-react";

const PRESET_CATEGORIES: ResourceCategory[] = [
  "Seguretat",
  "Formació",
  "Protocols",
  "Equip",
  "Medi ambient",
  "Altres",
];

type ModalMode = "create" | "edit";

export const ResourcesPage: React.FC = () => {
  const { resources, canManageTrips, createResource, updateResource, deleteResource } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [q, setQ] = useState("");

  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<ModalMode>("create");
  const [editing, setEditing] = useState<ResourceItem | null>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");
  const [category, setCategory] = useState<ResourceCategory>("Seguretat");
  const [customCategory, setCustomCategory] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const categories = useMemo(() => {
    const cats = resources.map((r) => r.category).filter(Boolean);
    const unique = Array.from(new Set(cats)).sort((a, b) =>
      (a || "").toString().localeCompare((b || "").toString())
    );
    return ["all", ...unique];
  }, [resources]);

  const filteredResources = useMemo(() => {
    const needle = q.trim().toLowerCase();

    const list = [...resources].sort((a, b) => {
      const ca = (a.category || "").toString().localeCompare((b.category || "").toString());
      if (ca !== 0) return ca;
      return (a.title || "").localeCompare(b.title || "");
    });

    return list.filter((r) => {
      if (selectedCategory !== "all" && r.category !== selectedCategory) return false;
      if (!needle) return true;

      return (
        (r.title || "").toLowerCase().includes(needle) ||
        (r.description || "").toLowerCase().includes(needle) ||
        (r.category || "").toString().toLowerCase().includes(needle)
      );
    });
  }, [resources, selectedCategory, q]);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setUrl("");
    setCategory("Seguretat");
    setCustomCategory("");
    setError("");
    setEditing(null);
    setMode("create");
  };

  const openCreate = () => {
    resetForm();
    setMode("create");
    setOpen(true);
  };

  const openEdit = (res: ResourceItem) => {
    setError("");
    setMode("edit");
    setEditing(res);

    setTitle(res.title || "");
    setDescription(res.description || "");
    setUrl(res.url || "");

    // si la categoria està dins presets -> select, si no -> custom
    const isPreset = PRESET_CATEGORIES.includes(res.category);
    setCategory(isPreset ? res.category : "Altres");
    setCustomCategory(isPreset ? "" : (res.category || ""));

    setOpen(true);
  };

  const closeModal = () => {
    if (saving) return;
    setOpen(false);
    resetForm();
  };

  const validate = () => {
    const t = title.trim();
    const d = description.trim();
    const u = url.trim();
    const cat = (customCategory.trim() || category).trim();

    if (!t) return "Falta el títol.";
    if (!u) return "Falta l’enllaç (URL).";
    if (!/^https?:\/\//i.test(u)) return "L’URL ha de començar per http:// o https://";
    if (!cat) return "Falta la categoria.";

    return "";
  };

  const onSave = async () => {
    setError("");
    const err = validate();
    if (err) return setError(err);

    const payload = {
      title: title.trim(),
      description: description.trim(),
      url: url.trim(),
      category: (customCategory.trim() || category).trim(),
    };

    setSaving(true);
    try {
      if (mode === "create") {
        await createResource(payload);
      } else {
        if (!editing) throw new Error("No editing item");
        await updateResource(editing.id, payload);
      }

      setOpen(false);
      resetForm();
    } catch {
      setError(mode === "create" ? "No s’ha pogut guardar el material." : "No s’ha pogut actualitzar el material.");
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async (res: ResourceItem) => {
    const ok = confirm(`Segur que vols eliminar:\n\n"${res.title}"`);
    if (!ok) return;

    try {
      await deleteResource(res.id);
    } catch {
      alert("No s’ha pogut eliminar.");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="flex justify-between items-start flex-wrap gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">Material del club</h1>
          <p className="text-gray-600 mt-1">
            Documents, protocols, enllaços i recursos útils per a socis/es.
          </p>
        </div>

        {canManageTrips() && (
          <button
            onClick={openCreate}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-yellow-400 font-extrabold hover:bg-yellow-300"
          >
            <Plus size={18} /> Afegir material
          </button>
        )}
      </div>

      {/* Barra de cerca + categories */}
      <div className="bg-white border rounded-2xl shadow-sm p-4 mb-8">
        <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
          <div className="w-full lg:w-[420px]">
            <label className="text-sm font-extrabold text-slate-700">Cercar</label>
            <div className="mt-1 flex items-center gap-2 rounded-xl border px-3 py-2">
              <Search className="text-gray-400" size={18} />
              <input
                className="w-full outline-none"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Títol, descripció o categoria…"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`px-4 py-2 rounded-full text-sm font-extrabold transition ${
                selectedCategory === "all"
                  ? "bg-black text-white"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              Totes
            </button>

            {categories
              .filter((c) => c !== "all")
              .map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-extrabold transition ${
                    selectedCategory === cat
                      ? "bg-black text-white"
                      : "bg-gray-100 hover:bg-gray-200"
                  }`}
                >
                  {cat}
                </button>
              ))}
          </div>
        </div>
      </div>

      {/* Llistat */}
      {filteredResources.length === 0 ? (
        <div className="bg-white border rounded-2xl p-8 text-center text-gray-500 shadow-sm">
          No hi ha material amb aquests filtres.
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map((res) => (
            <ResourceCard
              key={res.id}
              res={res}
              canManage={canManageTrips()}
              onEdit={() => openEdit(res)}
              onDelete={() => onDelete(res)}
            />
          ))}
        </div>
      )}

      {/* MODAL */}
      {open && (
        <div className="fixed inset-0 z-[999]">
          <div className="absolute inset-0 bg-black/40" onClick={closeModal} />
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <div className="w-full max-w-xl bg-white rounded-2xl shadow-xl border overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b">
                <div>
                  <div className="text-lg font-extrabold text-slate-900">
                    {mode === "create" ? "Afegir material" : "Editar material"}
                  </div>
                  <div className="text-sm text-gray-600">
                    {mode === "create"
                      ? "Apareixerà al material del club."
                      : "Actualitza el contingut i guarda els canvis."}
                  </div>
                </div>
                <button
                  onClick={closeModal}
                  className="p-2 rounded-xl hover:bg-gray-100"
                  title="Tancar"
                >
                  <X />
                </button>
              </div>

              <div className="px-6 py-5 space-y-4">
                <div>
                  <label className="text-sm font-bold text-slate-700">Títol</label>
                  <input
                    className="mt-1 w-full rounded-xl border px-3 py-2"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Ex: Protocol de seguretat a l’embarcació"
                  />
                </div>

                <div>
                  <label className="text-sm font-bold text-slate-700">Descripció (opcional)</label>
                  <textarea
                    className="mt-1 w-full rounded-xl border px-3 py-2 min-h-[90px]"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Una breu explicació del contingut..."
                  />
                </div>

                <div>
                  <label className="text-sm font-bold text-slate-700">Enllaç (URL)</label>
                  <input
                    className="mt-1 w-full rounded-xl border px-3 py-2"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://..."
                  />
                  <div className="text-xs text-gray-500 mt-1">
                    Pot ser un PDF, Google Drive, web, vídeo, etc.
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                      <Tag size={16} /> Categoria
                    </label>
                    <select
                      className="mt-1 w-full rounded-xl border px-3 py-2"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                    >
                      {PRESET_CATEGORIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-bold text-slate-700">
                      Categoria personalitzada (opcional)
                    </label>
                    <input
                      className="mt-1 w-full rounded-xl border px-3 py-2"
                      value={customCategory}
                      onChange={(e) => setCustomCategory(e.target.value)}
                      placeholder="Ex: Navegació"
                    />
                  </div>
                </div>

                {error && <div className="text-sm text-red-600 font-bold">{error}</div>}
              </div>

              <div className="px-6 py-4 border-t flex items-center justify-end gap-3">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 rounded-xl border font-extrabold hover:bg-gray-50"
                  disabled={saving}
                >
                  Cancel·lar
                </button>

                <button
                  onClick={onSave}
                  disabled={saving}
                  className={`px-5 py-2 rounded-xl font-extrabold ${
                    saving
                      ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                      : "bg-yellow-400 hover:bg-yellow-300 text-black"
                  }`}
                >
                  {saving ? "Guardant..." : mode === "create" ? "Guardar material" : "Guardar canvis"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const ResourceCard = ({
  res,
  canManage,
  onEdit,
  onDelete,
}: {
  res: ResourceItem;
  canManage: boolean;
  onEdit: () => void;
  onDelete: () => void;
}) => {
  return (
    <div className="bg-white border rounded-2xl shadow-sm p-6 flex flex-col justify-between relative">
      {canManage && (
        <div className="absolute top-3 right-3 flex gap-2">
          <button
            onClick={onEdit}
            className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200"
            title="Editar"
          >
            <Pencil size={16} />
          </button>
          <button
            onClick={onDelete}
            className="p-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-700"
            title="Eliminar"
          >
            <Trash2 size={16} />
          </button>
        </div>
      )}

      <div>
        <div className="flex items-center gap-2 text-yellow-500 mb-2">
          <FileText />
          <span className="text-sm font-bold text-slate-700">{res.category}</span>
        </div>

        <h2 className="font-extrabold text-lg text-slate-900 pr-20">{res.title}</h2>

        {res.description ? (
          <p className="text-sm text-gray-600 mt-2">{res.description}</p>
        ) : (
          <p className="text-sm text-gray-400 mt-2">Sense descripció.</p>
        )}
      </div>

      <a
        href={res.url}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 inline-flex items-center gap-2 text-blue-600 font-extrabold hover:underline"
      >
        Obrir material <ExternalLink size={16} />
      </a>
    </div>
  );
};
