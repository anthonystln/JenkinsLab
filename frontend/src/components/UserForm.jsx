import { X } from "lucide-react";

export default function UserForm({ user, errors, onChange, onCancel, onSubmit, editing }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow mb-6 relative">
      <button
        onClick={onCancel}
        className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
      >
        <X size={20} />
      </button>

      <h2 className="text-lg font-semibold mb-4">
        {editing ? "Modifier un utilisateur" : "Ajouter un utilisateur"}
      </h2>

      <div className="flex flex-col gap-4 mb-4">
        <div>
          <input
            type="text"
            placeholder="Nom"
            value={user.name}
            onChange={(e) => onChange({ ...user, name: e.target.value })}
            className="border rounded px-4 py-2 w-full"
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
        </div>

        <div>
          <input
            type="email"
            placeholder="Email"
            value={user.email}
            onChange={(e) => onChange({ ...user, email: e.target.value })}
            className="border rounded px-4 py-2 w-full"
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <button
          onClick={onCancel}
          className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
        >
          Annuler
        </button>
        <button
          onClick={onSubmit}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          {editing ? "Mettre à jour" : "Enregistrer"}
        </button>
      </div>
    </div>
  );
}
