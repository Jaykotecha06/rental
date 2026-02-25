import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Table, Button, Modal, Form, Badge, Row, Col } from 'react-bootstrap';
import { FaEdit, FaTrash, FaPlus, FaEye } from 'react-icons/fa';
import Sidebar from '../../components/common/Sidebar';
import Header from '../../components/common/Header';
import { getDeposits, addDeposit, updateDeposit, deleteDeposit } from '../../redux/actions/depositActions';
import { getRents } from '../../redux/actions/rentActions';

const DepositList = () => {
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedDeposit, setSelectedDeposit] = useState(null);
  const [formData, setFormData] = useState({
    floor: '',
    name: '',
    joiningDate: '',
    depositAmount: '',
    amountType: 'cash'
  });

  const dispatch = useDispatch();
  const { deposits } = useSelector(state => state.deposit);
  const { rents } = useSelector(state => state.rent);
  const { user } = useSelector(state => state.auth);

  useEffect(() => {
    if (user) {
      dispatch(getDeposits(user.uid));
      dispatch(getRents(user.uid));
    }
  }, [dispatch, user]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
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
    
    if (selectedDeposit) {
      await dispatch(updateDeposit(selectedDeposit.id, formData));
    } else {
      await dispatch(addDeposit(formData, user.uid));
    }
    
    setShowModal(false);
    resetForm();
  };

  const handleEdit = (deposit) => {
    setSelectedDeposit(deposit);
    setFormData(deposit);
    setShowModal(true);
  };

  const handleView = (deposit) => {
    setSelectedDeposit(deposit);
    setShowViewModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this deposit?')) {
      await dispatch(deleteDeposit(id));
    }
  };

  const resetForm = () => {
    setFormData({
      floor: '',
      name: '',
      joiningDate: '',
      depositAmount: '',
      amountType: 'cash'
    });
    setSelectedDeposit(null);
  };

  const getAmountTypeBadge = (type) => {
    const colors = {
      cash: 'success',
      cheque: 'warning',
      online: 'info'
    };
    return <Badge bg={colors[type]}>{type}</Badge>;
  };

  return (
    <div className="d-flex">
      <Sidebar />
      <div className="flex-grow-1" style={{ marginLeft: '260px', padding: '20px' }}>
        <Header />
        <div className="p-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h3>Deposit Management</h3>
            <Button variant="primary" onClick={() => { resetForm(); setShowModal(true); }}>
              <FaPlus className="me-2" /> Add Deposit
            </Button>
          </div>

          <div className="table-responsive">
            <Table striped bordered hover>
              <thead className="bg-dark text-white">
                <tr>
                  <th>Floor</th>
                  <th>Name</th>
                  <th>Joining Date</th>
                  <th>Deposit Amount</th>
                  <th>Amount Type</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {deposits.map((deposit) => (
                  <tr key={deposit.id}>
                    <td>{deposit.floor}</td>
                    <td>{deposit.name}</td>
                    <td>{deposit.joiningDate}</td>
                    <td>₹{deposit.depositAmount}</td>
                    <td>{getAmountTypeBadge(deposit.amountType)}</td>
                    <td>
                      <Button 
                        variant="info" size="sm" className="me-2"
                        onClick={() => handleView(deposit)}
                      >
                        <FaEye />
                      </Button>
                      <Button 
                        variant="warning" size="sm" className="me-2"
                        onClick={() => handleEdit(deposit)}
                      >
                        <FaEdit />
                      </Button>
                      <Button 
                        variant="danger" size="sm"
                        onClick={() => handleDelete(deposit.id)}
                      >
                        <FaTrash />
                      </Button>
                    </td>
                  </tr>
                ))}
                {deposits.length === 0 && (
                  <tr>
                    <td colSpan="6" className="text-center">No deposit records found</td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>

          {/* Add/Edit Modal */}
          <Modal show={showModal} onHide={() => { setShowModal(false); resetForm(); }} size="lg">
            <Modal.Header closeButton>
              <Modal.Title>{selectedDeposit ? 'Edit Deposit' : 'Add Deposit'}</Modal.Title>
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
                      <Form.Label>Joining Date</Form.Label>
                      <Form.Control
                        type="date"
                        name="joiningDate"
                        value={formData.joiningDate}
                        onChange={handleInputChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Deposit Amount</Form.Label>
                      <Form.Control
                        type="number"
                        name="depositAmount"
                        value={formData.depositAmount}
                        onChange={handleInputChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Amount Type</Form.Label>
                      <Form.Select
                        name="amountType"
                        value={formData.amountType}
                        onChange={handleInputChange}
                      >
                        <option value="cash">Cash</option>
                        <option value="cheque">Cheque</option>
                        <option value="online">Online</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={() => { setShowModal(false); resetForm(); }}>
                  Cancel
                </Button>
                <Button variant="primary" type="submit">
                  {selectedDeposit ? 'Update' : 'Save'}
                </Button>
              </Modal.Footer>
            </Form>
          </Modal>

          {/* View Modal */}
          <Modal show={showViewModal} onHide={() => setShowViewModal(false)}>
            <Modal.Header closeButton>
              <Modal.Title>Deposit Details</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {selectedDeposit && (
                <>
                  <p><strong>Floor:</strong> {selectedDeposit.floor}</p>
                  <p><strong>Name:</strong> {selectedDeposit.name}</p>
                  <p><strong>Joining Date:</strong> {selectedDeposit.joiningDate}</p>
                  <p><strong>Deposit Amount:</strong> ₹{selectedDeposit.depositAmount}</p>
                  <p><strong>Amount Type:</strong> {getAmountTypeBadge(selectedDeposit.amountType)}</p>
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

export default DepositList;