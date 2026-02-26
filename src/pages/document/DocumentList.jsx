import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Table, Button, Modal, Form, Row, Col } from 'react-bootstrap';
import { FaEdit, FaTrash, FaPlus, FaEye, FaDownload } from 'react-icons/fa';
import Sidebar from '../../components/common/Sidebar';
import Header from '../../components/common/Header';
import { getDocuments, addDocument, updateDocument, deleteDocument } from '../../redux/actions/documentActions';
import { getRents } from '../../redux/actions/rentActions';

const DocumentList = () => {
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [files, setFiles] = useState({
    pancard: null,
    aadhar: null
  });
  const [formData, setFormData] = useState({
    floor: '',
    name: '',
    pancard: '',
    aadhar: ''
  });

  const dispatch = useDispatch();
  const { documents } = useSelector(state => state.document);
  const { rents } = useSelector(state => state.rent);
  const { user } = useSelector(state => state.auth);

  useEffect(() => {
    if (user) {
      dispatch(getDocuments(user.uid));
      dispatch(getRents(user.uid));
    }
  }, [dispatch, user]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e) => {
    setFiles({
      ...files,
      [e.target.name]: e.target.files[0]
    });
  };

  const handleTenantSelect = (e) => {
    const selectedTenant = rents.find(r => r.name === e.target.value);
    if (selectedTenant) {
      setFormData({
        ...formData,
        name: selectedTenant.name,
        floor: selectedTenant.floor
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (selectedDocument) {
      await dispatch(updateDocument(selectedDocument.id, formData, files));
    } else {
      await dispatch(addDocument(formData, user.uid, files));
    }

    setShowModal(false);
    resetForm();
  };

  const handleEdit = (doc) => {
    setSelectedDocument(doc);
    setFormData({
      floor: doc.floor,
      name: doc.name,
      pancard: doc.pancard,
      aadhar: doc.aadhar
    });
    setShowModal(true);
  };

  const handleView = (doc) => {
    setSelectedDocument(doc);
    setShowViewModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this document?')) {
      await dispatch(deleteDocument(id));
    }
  };

  const resetForm = () => {
    setFormData({
      floor: '',
      name: '',
      pancard: '',
      aadhar: ''
    });
    setFiles({
      pancard: null,
      aadhar: null
    });
    setSelectedDocument(null);
  };

  const openDocument = (url) => {
    window.open(url, '_blank');
  };

  return (
    <div className="d-flex">
      <Sidebar />
      <div className="flex-grow-1" style={{ marginLeft: '260px', padding: '20px' }}>
        <Header />
        <div className="p-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h3>Document Management</h3>
            <Button variant="primary" onClick={() => { resetForm(); setShowModal(true); }}>
              <FaPlus className="me-2" /> Add Document
            </Button>
          </div>

          <div className="table-responsive">
            <Table striped bordered hover>
              <thead className="bg-dark text-white">
                <tr>
                  <th>Floor</th>
                  <th>Name</th>
                  <th>PAN Card</th>
                  <th>Aadhar Card</th>
                  <th>Documents</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {documents.map((doc) => (
                  <tr key={doc.id}>
                    <td>{doc.floor}</td>
                    <td>{doc.name}</td>
                    <td>{doc.pancard || 'N/A'}</td>
                    <td>{doc.aadhar || 'N/A'}</td>
                    <td>
                      {doc.pancardUrl && (
                        <Button
                          variant="link"
                          size="sm"
                          className="me-2 text-primary"
                          onClick={() => openDocument(doc.pancardUrl)}
                        >
                          <FaDownload /> PAN
                        </Button>
                      )}
                      {doc.aadharUrl && (
                        <Button
                          variant="link"
                          size="sm"
                          className="text-success"
                          onClick={() => openDocument(doc.aadharUrl)}
                        >
                          <FaDownload /> Aadhar
                        </Button>
                      )}
                    </td>
                    <td>
                      <Button
                        variant="info" size="sm" className="me-2"
                        onClick={() => handleView(doc)}
                      >
                        <FaEye />
                      </Button>
                      <Button
                        variant="warning" size="sm" className="me-2"
                        onClick={() => handleEdit(doc)}
                      >
                        <FaEdit />
                      </Button>
                      <Button
                        variant="danger" size="sm"
                        onClick={() => handleDelete(doc.id)}
                      >
                        <FaTrash />
                      </Button>
                    </td>
                  </tr>
                ))}
                {documents.length === 0 && (
                  <tr>
                    <td colSpan="6" className="text-center">No document records found</td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>

          {/* Add/Edit Modal */}
          <Modal show={showModal} onHide={() => { setShowModal(false); resetForm(); }} size="lg">
            <Modal.Header closeButton>
              <Modal.Title>{selectedDocument ? 'Edit Document' : 'Add Document'}</Modal.Title>
            </Modal.Header>
            <Form onSubmit={handleSubmit}>
              <Modal.Body>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Select Tenant</Form.Label>
                      <Form.Select onChange={handleTenantSelect}>
                        <option value="">Select tenant</option>
                        {rents.map((rent, index) => (
                          <option key={index} value={rent.name}>{rent.name} - {rent.floor}</option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Floor</Form.Label>
                      <Form.Control
                        type="text"
                        name="floor"
                        value={formData.floor}
                        onChange={handleInputChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Name</Form.Label>
                      <Form.Control
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>PAN Card Number</Form.Label>
                      <Form.Control
                        type="text"
                        name="pancard"
                        value={formData.pancard}
                        onChange={handleInputChange}
                        placeholder="Enter PAN number"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>PAN Card File</Form.Label>
                      <Form.Control
                        type="file"
                        name="pancard"
                        onChange={handleFileChange}
                        accept=".pdf,.jpg,.jpeg,.png"
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Aadhar Card Number</Form.Label>
                      <Form.Control
                        type="text"
                        name="aadhar"
                        value={formData.aadhar}
                        onChange={handleInputChange}
                        placeholder="Enter Aadhar number"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Aadhar Card File</Form.Label>
                      <Form.Control
                        type="file"
                        name="aadhar"
                        onChange={handleFileChange}
                        accept=".pdf,.jpg,.jpeg,.png"
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={12}>
                    <Form.Text className="text-muted">
                      Supported formats: PDF, JPG, JPEG, PNG (Max size: 5MB)
                    </Form.Text>
                  </Col>
                </Row>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={() => { setShowModal(false); resetForm(); }}>
                  Cancel
                </Button>
                <Button variant="primary" type="submit">
                  {selectedDocument ? 'Update' : 'Save'}
                </Button>
              </Modal.Footer>
            </Form>
          </Modal>

          {/* View Modal */}
          <Modal show={showViewModal} onHide={() => setShowViewModal(false)} size="lg">
            <Modal.Header closeButton>
              <Modal.Title>Document Details</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {selectedDocument && (
                <>
                  <Row>
                    <Col md={6}>
                      <p><strong>Floor:</strong> {selectedDocument.floor}</p>
                    </Col>
                    <Col md={6}>
                      <p><strong>Name:</strong> {selectedDocument.name}</p>
                    </Col>
                  </Row>

                  <Row className="mt-3">
                    <Col md={6}>
                      <div className="border p-3 rounded">
                        <h5>PAN Card Details</h5>
                        <p><strong>Number:</strong> {selectedDocument.pancard || 'N/A'}</p>
                        {selectedDocument.pancardUrl && (
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => openDocument(selectedDocument.pancardUrl)}
                          >
                            <FaDownload /> View PAN Card
                          </Button>
                        )}
                      </div>
                    </Col>
                    <Col md={6}>
                      <div className="border p-3 rounded">
                        <h5>Aadhar Card Details</h5>
                        <p><strong>Number:</strong> {selectedDocument.aadhar || 'N/A'}</p>
                        {selectedDocument.aadharUrl && (
                          <Button
                            variant="success"
                            size="sm"
                            onClick={() => openDocument(selectedDocument.aadharUrl)}
                          >
                            <FaDownload /> View Aadhar Card
                          </Button>
                        )}
                      </div>
                    </Col>
                  </Row>
                </>
              )}
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowViewModal(false)}>
                Close
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default DocumentList;