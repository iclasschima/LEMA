import React from "react";

interface ConfirmPostDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting: boolean;
}

const ConfirmPostDeleteModal: React.FC<ConfirmPostDeleteModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  isDeleting,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center p-4 z-50"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
    >
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Confirm Deletion
        </h2>
        <p className="text-gray-600 mb-6">
          Are you sure you want to delete this post? This action cannot be
          undone.
        </p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-6 py-3 border cursor-pointer border-gray-300 text-gray-700 rounded-lg shadow-sm hover:bg-gray-50 transition duration-200"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="pl-4 pr-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            Delete
            {isDeleting && (
              <div className="lds-ring">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
              </div>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmPostDeleteModal;
