import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Table, Button, Modal, Form, Badge, Row, Col } from 'react-bootstrap';
import { FaEdit, FaTrash, FaPlus, FaEye } from 'react-icons/fa';
import Sidebar from '../../components/common/Sidebar';
import Header from '../../components/common/Header';
import { getLightBills, addLightBill, updateLightBill, deleteLightBill } from '../../redux/actions/lightBillActions';
import { getRents } from '../../redux/actions/rentActions';

const LightBillList = () => {
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedBill, setSelectedBill] = useState(null);
  const [calculatedAmount, setCalculatedAmount] = useState(0);
  const [formData, setFormData] = useState({
    floor: '',
    name: '',
    lastUnit: '',
    currentUnit: '',
    lastUnitDate: '',
    currentUnitDate: '',
    depositAmount: '',
    amountType: 'cash'
  });

  const dispatch = useDispatch();
  const { lightBills } = useSelector(state => state.lightBill);
  const { rents } = useSelector(state => state.rent);
  const { user } = useSelector(state => state.auth);

  useEffect(() => {
    if (user) {
      dispatch(getLightBills(user.uid));
      dispatch(getRents(user.uid));
    }
  }, [dispatch, user]);

  useEffect(() => {
    if (formData.lastUnit && formData.currentUnit) {
      const units = parseFloat(formData.currentUnit) - parseFloat(formData.lastUnit);
      if (units > 0) {
        setCalculatedAmount(units * 9.5);
      }
    }
  }, [formData.lastUnit, formData.currentUnit]);

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
    
    if (selectedBill) {
      await dispatch(updateLightBill(selectedBill.id, formData));
    } else {
      await dispatch(addLightBill(formData, user.uid));
    }
    
    setShowModal(false);
    resetForm();
  };

  const handleEdit = (bill) => {
    setSelectedBill(bill);
    setFormData(bill);
    setShowModal(true);
  };

  const handleView = (bill) => {
    setSelectedBill(bill);
    setShowViewModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this light bill?')) {
      await dispatch(deleteLightBill(id));
    }
  };

  const resetForm = () => {
    setFormData({
      floor: '',
      name: '',
      lastUnit: '',
      currentUnit: '',
      lastUnitDate: '',
      currentUnitDate: '',
      depositAmount: '',
      amountType: 'cash'
    });
    setSelectedBill(null);
    setCalculatedAmount(0);
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
      <div className="flex-grow-1" style={{ marginLeft: '250px' }}>
        <Header />
        <div className="p-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h3>Light Bill Management</h3>
            <Button variant="primary" onClick={() => { resetForm(); setShowModal(true); }}>
              <FaPlus className="me-2" /> Add Light Bill
            </Button>
          </div>

          <div className="table-responsive">
            <Table striped bordered hover>
              <thead className="bg-dark text-white">
                <tr>
                  <th>Floor</th>
                  <th>Name</th>
                  <th>Last Unit</th>
                  <th>Current Unit</th>
                  <th>Units Used</th>
                  <th>Amount</th>
                  <th>Deposit</th>
                  <th>Type</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {lightBills.map((bill) => {
                  const unitsUsed = parseFloat(bill.currentUnit) - parseFloat(bill.lastUnit);
                  return (
                    <tr key={bill.id}>
                      <td>{bill.floor}</td>
                      <td>{bill.name}</td>
                      <td>{bill.lastUnit}</td>
                      <td>{bill.currentUnit}</td>
                      <td>{unitsUsed}</td>
                      <td>₹{bill.amount}</td>
                      <td>₹{bill.depositAmount}</td>
                      <td>{getAmountTypeBadge(bill.amountType)}</td>
                      <td>
                        <Button 
                          variant="info" size="sm" className="me-2"
                          onClick={() => handleView(bill)}
                        >
                          <FaEye />
                        </Button>
                        <Button 
                          variant="warning" size="sm" className="me-2"
                          onClick={() => handleEdit(bill)}
                        >
                          <FaEdit />
                        </Button>
                        <Button 
                          variant="danger" size="sm"
                          onClick={() => handleDelete(bill.id)}
                        >
                          <FaTrash />
                        </Button>
                      </td>
                    </tr>
                  );
                })}
                {lightBills.length === 0 && (
                  <tr>
                    <td colSpan="9" className="text-center">No light bill records found</td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>

          {/* Add/Edit Modal */}
          <Modal show={showModal} onHide={() => { setShowModal(false); resetForm(); }} size="lg">
            <Modal.Header closeButton>
              <Modal.Title>{selectedBill ? 'Edit Light Bill' : 'Add Light Bill'}</Modal.Title>
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
                      <Form.Label>Last Unit</Form.Label>
                      <Form.Control
                        type="number"
                        name="lastUnit"
                        value={formData.lastUnit}
                        onChange={handleInputChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Last Unit Date</Form.Label>
                      <Form.Control
                        type="date"
                        name="lastUnitDate"
                        value={formData.lastUnitDate}
                        onChange={handleInputChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Current Unit</Form.Label>
                      <Form.Control
                        type="number"
                        name="currentUnit"
                        value={formData.currentUnit}
                        onChange={handleInputChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Current Unit Date</Form.Label>
                      <Form.Control
                        type="date"
                        name="currentUnitDate"
                        value={formData.currentUnitDate}
                        onChange={handleInputChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>

                {calculatedAmount > 0 && (
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Calculated Amount (₹9.5/unit)</Form.Label>
                        <Form.Control
                          type="text"
                          value={`₹${calculatedAmount.toFixed(2)}`}
                          disabled
                          className="bg-light"
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                )}

                <Row>
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
                  {selectedBill ? 'Update' : 'Save'}
                </Button>
              </Modal.Footer>
            </Form>
          </Modal>

          {/* View Modal */}
          <Modal show={showViewModal} onHide={() => setShowViewModal(false)}>
            <Modal.Header closeButton>
              <Modal.Title>Light Bill Details</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {selectedBill && (
                <>
                  <p><strong>Floor:</strong> {selectedBill.floor}</p>
                  <p><strong>Name:</strong> {selectedBill.name}</p>
                  <p><strong>Last Unit:</strong> {selectedBill.lastUnit} ({selectedBill.lastUnitDate})</p>
                  <p><strong>Current Unit:</strong> {selectedBill.currentUnit} ({selectedBill.currentUnitDate})</p>
                  <p><strong>Units Used:</strong> {parseFloat(selectedBill.currentUnit) - parseFloat(selectedBill.lastUnit)}</p>
                  <p><strong>Amount:</strong> ₹{selectedBill.amount}</p>
                  <p><strong>Deposit Amount:</strong> ₹{selectedBill.depositAmount}</p>
                  <p><strong>Amount Type:</strong> {getAmountTypeBadge(selectedBill.amountType)}</p>
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

export default LightBillList;