import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Table, Button, Modal, Form, Badge, Row, Col } from 'react-bootstrap';
import { FaEdit, FaTrash, FaPlus, FaEye } from 'react-icons/fa';
import Sidebar from '../../components/common/Sidebar';
import Header from '../../components/common/Header';
import { getExpenses, addExpense, updateExpense, deleteExpense } from '../../redux/actions/expenseActions';
import { getRents } from '../../redux/actions/rentActions';

const ExpenseList = () => {
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [formData, setFormData] = useState({
    type: 'homeexpense',
    expenseType: '',
    property: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    takenPerson: ''
  });

  const dispatch = useDispatch();
  const { expenses } = useSelector(state => state.expense);
  const { rents } = useSelector(state => state.rent);
  const { user } = useSelector(state => state.auth);

  const expenseCategories = [
    'Maintenance',
    'Repair',
    'Electricity',
    'Water Bill',
    'Cleaning',
    'Security',
    'Tax',
    'Insurance',
    'Furniture',
    'Other'
  ];

  useEffect(() => {
    if (user) {
      dispatch(getExpenses(user.uid));
      dispatch(getRents(user.uid));
    }
  }, [dispatch, user]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (selectedExpense) {
      await dispatch(updateExpense(selectedExpense.id, formData));
    } else {
      await dispatch(addExpense(formData, user.uid));
    }
    
    setShowModal(false);
    resetForm();
  };

  const handleEdit = (expense) => {
    setSelectedExpense(expense);
    setFormData(expense);
    setShowModal(true);
  };

  const handleView = (expense) => {
    setSelectedExpense(expense);
    setShowViewModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      await dispatch(deleteExpense(id));
    }
  };

  const resetForm = () => {
    setFormData({
      type: 'homeexpense',
      expenseType: '',
      property: '',
      amount: '',
      date: new Date().toISOString().split('T')[0],
      takenPerson: ''
    });
    setSelectedExpense(null);
  };

  const getExpenseTypeBadge = (type) => {
    return type === 'homeexpense' 
      ? <Badge bg="primary">Home Expense</Badge>
      : <Badge bg="success">Property Expense</Badge>;
  };

  return (
    <div className="d-flex">
      <Sidebar />
      <div className="flex-grow-1" style={{ marginLeft: '260px', padding: '20px' }}>
        <Header />
        <div className="p-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h3>Expense Management</h3>
            <Button variant="primary" onClick={() => { resetForm(); setShowModal(true); }}>
              <FaPlus className="me-2" /> Add Expense
            </Button>
          </div>

          <div className="table-responsive">
            <Table striped bordered hover>
              <thead className="bg-dark text-white">
                <tr>
                  <th>Type</th>
                  <th>Category/Property</th>
                  <th>Amount</th>
                  <th>Date</th>
                  <th>Taken By</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {expenses.map((expense) => (
                  <tr key={expense.id}>
                    <td>{getExpenseTypeBadge(expense.type)}</td>
                    <td>
                      {expense.type === 'homeexpense' 
                        ? expense.expenseType 
                        : `Property: ${expense.property}`}
                    </td>
                    <td>₹{expense.amount}</td>
                    <td>{expense.date}</td>
                    <td>{expense.takenPerson}</td>
                    <td>
                      <Button 
                        variant="info" size="sm" className="me-2"
                        onClick={() => handleView(expense)}
                      >
                        <FaEye />
                      </Button>
                      <Button 
                        variant="warning" size="sm" className="me-2"
                        onClick={() => handleEdit(expense)}
                      >
                        <FaEdit />
                      </Button>
                      <Button 
                        variant="danger" size="sm"
                        onClick={() => handleDelete(expense.id)}
                      >
                        <FaTrash />
                      </Button>
                    </td>
                  </tr>
                ))}
                {expenses.length === 0 && (
                  <tr>
                    <td colSpan="6" className="text-center">No expense records found</td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>

          {/* Add/Edit Modal */}
          <Modal show={showModal} onHide={() => { setShowModal(false); resetForm(); }} size="lg">
            <Modal.Header closeButton>
              <Modal.Title>{selectedExpense ? 'Edit Expense' : 'Add Expense'}</Modal.Title>
            </Modal.Header>
            <Form onSubmit={handleSubmit}>
              <Modal.Body>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Expense Type</Form.Label>
                      <Form.Select
                        name="type"
                        value={formData.type}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="homeexpense">Home Expense</option>
                        <option value="property">Property Expense</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>

                {formData.type === 'homeexpense' ? (
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Expense Category</Form.Label>
                        <Form.Select
                          name="expenseType"
                          value={formData.expenseType}
                          onChange={handleInputChange}
                          required
                        >
                          <option value="">Select category</option>
                          {expenseCategories.map((cat, index) => (
                            <option key={index} value={cat}>{cat}</option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  </Row>
                ) : (
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Select Property</Form.Label>
                        <Form.Select
                          name="property"
                          value={formData.property}
                          onChange={handleInputChange}
                          required
                        >
                          <option value="">Select property</option>
                          {rents.map((rent, index) => (
                            <option key={index} value={rent.floor}>
                              {rent.floor} - {rent.name}
                            </option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  </Row>
                )}

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Amount (₹)</Form.Label>
                      <Form.Control
                        type="number"
                        name="amount"
                        value={formData.amount}
                        onChange={handleInputChange}
                        placeholder="Enter amount"
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Date</Form.Label>
                      <Form.Control
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleInputChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Taken By</Form.Label>
                      <Form.Control
                        type="text"
                        name="takenPerson"
                        value={formData.takenPerson}
                        onChange={handleInputChange}
                        placeholder="Enter person name"
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
                  {selectedExpense ? 'Update' : 'Save'}
                </Button>
              </Modal.Footer>
            </Form>
          </Modal>

          {/* View Modal */}
          <Modal show={showViewModal} onHide={() => setShowViewModal(false)}>
            <Modal.Header closeButton>
              <Modal.Title>Expense Details</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {selectedExpense && (
                <>
                  <p><strong>Expense Type:</strong> {selectedExpense.type === 'homeexpense' ? 'Home Expense' : 'Property Expense'}</p>
                  <p><strong>Category/Property:</strong> {
                    selectedExpense.type === 'homeexpense' 
                      ? selectedExpense.expenseType 
                      : `Property: ${selectedExpense.property}`
                  }</p>
                  <p><strong>Amount:</strong> ₹{selectedExpense.amount}</p>
                  <p><strong>Date:</strong> {selectedExpense.date}</p>
                  <p><strong>Taken By:</strong> {selectedExpense.takenPerson}</p>
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

export default ExpenseList;