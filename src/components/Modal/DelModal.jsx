import React, { useState } from 'react';
import './DelModal.css'
import { useInfoContext } from '../../context/Context';

const DeleteModal = ({ onDelete }) => {
    const {setShowModal, showModal, exit} = useInfoContext()

  const handleDelete = () => {
    onDelete(); // Call the delete function passed from the parent component
    setShowModal(false); // Close the modal after deletion
  };

  return (
    <div>
      {showModal && (
        <div className="modal">
          <div className="modal-content delete-modal">
            <h2>Confirm Deletion</h2>
            <p>Are you sure you want to delete?</p>
            <button style={{color: 'red'}} onClick={handleDelete}>Delete</button>
            <button onClick={() => setShowModal(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeleteModal;
