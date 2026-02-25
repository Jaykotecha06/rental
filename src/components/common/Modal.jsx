import React from 'react';
import { Modal as BootstrapModal } from 'react-bootstrap';

const Modal = ({ show, onHide, title, children, size = 'lg' }) => {
  return (
    <BootstrapModal show={show} onHide={onHide} size={size} centered>
      <BootstrapModal.Header closeButton>
        <BootstrapModal.Title>{title}</BootstrapModal.Title>
      </BootstrapModal.Header>
      <BootstrapModal.Body>
        {children}
      </BootstrapModal.Body>
    </BootstrapModal>
  );
};

export default Modal;