import React from 'react';
import './DelModal.css'
import { useInfoContext } from '../../context/Context';

const DeleteModal = ({ onDelete, chatDelete, delChat }) => {
    const {setShowModal, showModal} = useInfoContext()

  const handleDelete = () => {
    setShowModal(false);
    if(delChat){
      chatDelete();
    } else {
      onDelete();
    }
  };

  return (
    <div>
      {showModal && (
        <div className="modal">
          <div className="modal-content delete-modal">
            <h2>Confirm Deletion</h2>
            <p>Are you sure you want to delete?</p>
            <div className='del-button'>
              <button style={{color: 'red'}} onClick={handleDelete}>Delete</button>
              <button onClick={() => setShowModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeleteModal;
