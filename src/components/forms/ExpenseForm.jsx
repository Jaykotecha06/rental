import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';

const ExpenseForm = ({ onSubmit, initialData = null, properties = [] }) => {
  const [formData, setFormData] = useState({
    type: 'homeexpense',
    expenseType: '',
    property: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    takenPerson: ''
  });

  const expenseTypes = [
    'Maintenance',
    'Repair',
    'Electricity',
    'Water',
    'Cleaning',
    'Security',
    'Other'
  ];

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Expense Type</Form.Label>
            <Form.Select name="type" value={formData.type} onChange={handleChange} required>
              <option value="homeexpense">Home Expense</option>
              <option value="property">Property Expense</option>
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>

      {formData.type === 'homeexpense' && (
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Select Expense Type</Form.Label>
              <Form.Select name="expenseType" value={formData.expenseType} onChange={handleChange} required>
                <option value="">Select type</option>
                {expenseTypes.map((type, index) => (
                  <option key={index} value={type}>{type}</option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>
      )}

      {formData.type === 'property' && (
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Select Property</Form.Label>
              <Form.Select name="property" value={formData.property} onChange={handleChange} required>
                <option value="">Select property</option>
                {properties.map((property, index) => (
                  <option key={index} value={property.floor}>{property.floor} - {property.name}</option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>
      )}

      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Amount</Form.Label>
            <Form.Control
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              required
              placeholder="Enter amount"
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
              onChange={handleChange}
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
              onChange={handleChange}
              required
              placeholder="Enter person name"
            />
          </Form.Group>
        </Col>
      </Row>

      <div className="text-end">
        <Button variant="primary" type="submit">
          {initialData ? 'Update' : 'Save'}
        </Button>
      </div>
    </Form>
  );
};

export default ExpenseForm;