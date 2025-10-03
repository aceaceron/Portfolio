"use client";

interface Props {
  onCancel: () => void;
  onConfirm: () => void;
}

export default function ConfirmDeleteModal({ onCancel, onConfirm }: Props) {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-6 rounded-xl shadow-lg max-w-sm w-[90vw]">
        <h2 className="text-lg font-bold mb-3">Confirm Delete</h2>
        <p className="text-sm text-gray-300 mb-6">
          Are you sure you want to delete this message? This action cannot be undone.
        </p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-lg bg-gray-600 hover:bg-gray-500 text-white"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
