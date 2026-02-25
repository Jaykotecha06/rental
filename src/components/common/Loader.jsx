import React from 'react';
import { Spinner } from 'react-bootstrap';

const Loader = () => {
  return (
    <div className="text-center p-5">
      <Spinner animation="border" variant="primary" />
    </div>
  );
};

export default Loader;