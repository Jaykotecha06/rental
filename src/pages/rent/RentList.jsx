import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Table, Button, Modal, Form, Badge, Row, Col } from 'react-bootstrap';
import { FaEdit, FaTrash, FaPlus, FaEye } from 'react-icons/fa';
import Sidebar from '../../components/common/Sidebar';
import Header from '../../components/common/Header';
import { getRents, addRent, updateRent, deleteRent } from '../../redux/actions/rentActions';
import { getRentalDetails } from '../../redux/actions/rentalDetailsActions'; // नया import

const RentList = () => {
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedRent, setSelectedRent] = useState(null);
  const [formData, setFormData] = useState({
    floor: '',
    name: '',
    mobile: '',
    fromDate: '',
    toDate: '',
    paymentDate: '',
    rentAmount: '',
    paymentType: 'cash'
  });

  const dispatch = useDispatch();
  const { rents } = useSelector(state => state.rent);
  const { rentalDetails } = useSelector(state => state.rentalDetails); // Rental details से data
  const { user } = useSelector(state => state.auth);

  useEffect(() => {
    if (user) {
      dispatch(getRents(user.uid));
      dispatch(getRentalDetails(user.uid)); // Rental details भी fetch करें
    }
  }, [dispatch, user]);

  // जब floor या name select करें तो monthly rent auto-fill हो
  const handleRentalSelect = (e) => {
    const selectedFloor = e.target.value;
    const rental = rentalDetails.find(r => r.floor === selectedFloor);
    
    if (rental) {
      setFormData({
        ...formData,
        floor: rental.floor,
        name: rental.rentalName,
        mobile: rental.mobileNo,
        rentAmount: rental.monthlyRent // Auto-fill monthly rent
      });
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (selectedRent) {
      await dispatch(updateRent(selectedRent.id, formData));
    } else {
      await dispatch(addRent(formData, user.uid));
    }
    
    setShowModal(false);
    resetForm();
  };

  const handleEdit = (rent) => {
    setSelectedRent(rent);
    setFormData({
      floor: rent.floor || '',
      name: rent.name || '',
      mobile: rent.mobile || '',
      fromDate: rent.fromDate || '',
      toDate: rent.toDate || '',
      paymentDate: rent.paymentDate || '',
      rentAmount: rent.rentAmount || '',
      paymentType: rent.paymentType || 'cash'
    });
    setShowModal(true);
  };

  const handleView = (rent) => {
    setSelectedRent(rent);
    setShowViewModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this rent?')) {
      await dispatch(deleteRent(id));
    }
  };

  const resetForm = () => {
    setFormData({
      floor: '',
      name: '',
      mobile: '',
      fromDate: '',
      toDate: '',
      paymentDate: '',
      rentAmount: '',
      paymentType: 'cash'
    });
    setSelectedRent(null);
  };

  const getPaymentTypeBadge = (type) => {
    const colors = {
      cash: 'success',
      cheque: 'warning',
      online: 'info'
    };
    return <Badge bg={colors[type] || 'secondary'}>{type}</Badge>;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const formatMonthYear = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString + '-01');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${month}/${year}`;
  };

  return (
    <div className="d-flex">
      <Sidebar />
      <div className="flex-grow-1" style={{ marginLeft: '250px', padding: '20px' }}>
        <Header />
        <div className="p-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h3>Rent Management</h3>
            <Button variant="primary" onClick={() => { resetForm(); setShowModal(true); }}>
              <FaPlus className="me-2" /> Add Rent
            </Button>
          </div>

          <div className="table-responsive">
            <Table striped bordered hover>
              <thead className="bg-dark text-white">
                <tr>
                  <th>Floor</th>
                  <th>Name</th>
                  <th>Mobile</th>
                  <th>From Date</th>
                  <th>To Date</th>
                  <th>Payment Date</th>
                  <th>Amount</th>
                  <th>Payment Type</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {rents.map((rent) => (
                  <tr key={rent.id}>
                    <td>{rent.floor}</td>
                    <td>{rent.name}</td>
                    <td>{rent.mobile}</td>
                    <td>{formatMonthYear(rent.fromDate)}</td>
                    <td>{formatMonthYear(rent.toDate)}</td>
                    <td>{formatDate(rent.paymentDate)}</td>
                    <td>₹{rent.rentAmount}</td>
                    <td>{getPaymentTypeBadge(rent.paymentType)}</td>
                    <td>
                      <Button 
                        variant="info" size="sm" className="me-2"
                        onClick={() => handleView(rent)}
                      >
                        <FaEye />
                      </Button>
                      <Button 
                        variant="warning" size="sm" className="me-2"
                        onClick={() => handleEdit(rent)}
                      >
                        <FaEdit />
                      </Button>
                      <Button 
                        variant="danger" size="sm"
                        onClick={() => handleDelete(rent.id)}
                      >
                        <FaTrash />
                      </Button>
                    </td>
                  </tr>
                ))}
                {rents.length === 0 && (
                  <tr>
                    <td colSpan="9" className="text-center">No rent records found</td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>

          {/* Add/Edit Modal */}
          <Modal show={showModal} onHide={() => { setShowModal(false); resetForm(); }} size="lg">
            <Modal.Header closeButton>
              <Modal.Title>{selectedRent ? 'Edit Rent' : 'Add Rent'}</Modal.Title>
            </Modal.Header>
            <Form onSubmit={handleSubmit}>
              <Modal.Body>
                <Row>
                  <Col md={12}>
                    <Form.Group className="mb-3">
                      <Form.Label>Select Floor (Auto-fill rent)</Form.Label>
                      <Form.Select
                        onChange={handleRentalSelect}
                        value={formData.floor}
                      >
                        <option value="">Select floor</option>
                        {rentalDetails.map((detail) => (
                          <option key={detail.id} value={detail.floor}>
                            {detail.floor} - {detail.rentalName} (₹{detail.monthlyRent}/month)
                          </option>
                        ))}
                      </Form.Select>
                      <Form.Text className="text-muted">
                        Select floor to auto-fill name, mobile and monthly rent
                      </Form.Text>
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
                        placeholder="Enter floor number"
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
                        placeholder="Enter tenant name"
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Mobile</Form.Label>
                      <Form.Control
                        type="text"
                        name="mobile"
                        value={formData.mobile}
                        onChange={handleInputChange}
                        placeholder="Enter mobile number"
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Payment Type</Form.Label>
                      <Form.Select
                        name="paymentType"
                        value={formData.paymentType}
                        onChange={handleInputChange}
                      >
                        <option value="cash">Cash</option>
                        <option value="cheque">Cheque</option>
                        <option value="online">Online</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>From Date</Form.Label>
                      <Form.Control
                        type="month"
                        name="fromDate"
                        value={formData.fromDate}
                        onChange={handleInputChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>To Date</Form.Label>
                      <Form.Control
                        type="month"
                        name="toDate"
                        value={formData.toDate}
                        onChange={handleInputChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Payment Date</Form.Label>
                      <Form.Control
                        type="date"
                        name="paymentDate"
                        value={formData.paymentDate}
                        onChange={handleInputChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Rent Amount (₹)</Form.Label>
                      <Form.Control
                        type="number"
                        name="rentAmount"
                        value={formData.rentAmount}
                        onChange={handleInputChange}
                        placeholder="Enter rent amount"
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={() => { setShowModal(false); resetForm(); }}>
                  Cancel
                </Button>
                <Button variant="primary" type="submit">
                  {selectedRent ? 'Update' : 'Save'}
                </Button>
              </Modal.Footer>
            </Form>
          </Modal>

          {/* View Modal */}
          <Modal show={showViewModal} onHide={() => setShowViewModal(false)}>
            <Modal.Header closeButton>
              <Modal.Title>Rent Details</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {selectedRent && (
                <>
                  <p><strong>Floor:</strong> {selectedRent.floor}</p>
                  <p><strong>Name:</strong> {selectedRent.name}</p>
                  <p><strong>Mobile:</strong> {selectedRent.mobile}</p>
                  <p><strong>From Date:</strong> {formatMonthYear(selectedRent.fromDate)}</p>
                  <p><strong>To Date:</strong> {formatMonthYear(selectedRent.toDate)}</p>
                  <p><strong>Payment Date:</strong> {formatDate(selectedRent.paymentDate)}</p>
                  <p><strong>Rent Amount:</strong> ₹{selectedRent.rentAmount}</p>
                  <p><strong>Payment Type:</strong> {getPaymentTypeBadge(selectedRent.paymentType)}</p>
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

export default RentList;