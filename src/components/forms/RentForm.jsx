import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';

const RentForm = ({ onSubmit, initialData = null }) => {
  const [formData, setFormData] = useState({
    floor: '',
    name: '',
    mobile: '',
    fromMonth: '',
    toMonth: '',
    rentAmount: '',
    paymentType: 'cash'
  });

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
            <Form.Label>Floor</Form.Label>
            <Form.Control
              type="text"
              name="floor"
              value={formData.floor}
              onChange={handleChange}
              required
              placeholder="Enter floor number"
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
              onChange={handleChange}
              required
              placeholder="Enter tenant name"
            />
          </Form.Group>
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Mobile Number</Form.Label>
            <Form.Control
              type="tel"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              required
              placeholder="Enter mobile number"
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Payment Type</Form.Label>
            <Form.Select name="paymentType" value={formData.paymentType} onChange={handleChange}>
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
            <Form.Label>From Month</Form.Label>
            <Form.Control
              type="month"
              name="fromMonth"
              value={formData.fromMonth}
              onChange={handleChange}
              required
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>To Month</Form.Label>
            <Form.Control
              type="month"
              name="toMonth"
              value={formData.toMonth}
              onChange={handleChange}
              required
            />
          </Form.Group>
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Rent Amount</Form.Label>
            <Form.Control
              type="number"
              name="rentAmount"
              value={formData.rentAmount}
              onChange={handleChange}
              required
              placeholder="Enter rent amount"
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

export default RentForm;