import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';

const DepositForm = ({ onSubmit, initialData = null, tenants = [] }) => {
  const [formData, setFormData] = useState({
    floor: '',
    name: '',
    joiningDate: '',
    depositAmount: '',
    amountType: 'cash'
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

  const handleTenantSelect = (e) => {
    const selectedTenant = tenants.find(t => t.name === e.target.value);
    if (selectedTenant) {
      setFormData({
        ...formData,
        name: selectedTenant.name,
        floor: selectedTenant.floor,
        joiningDate: selectedTenant.joiningDate || ''
      });
    }
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
            <Form.Label>Select Tenant</Form.Label>
            <Form.Select onChange={handleTenantSelect}>
              <option value="">Select a tenant</option>
              {tenants.map((tenant, index) => (
                <option key={index} value={tenant.name}>{tenant.name} - {tenant.floor}</option>
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
              onChange={handleChange}
              required
              placeholder="Enter floor"
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
              placeholder="Enter name"
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
              onChange={handleChange}
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
              onChange={handleChange}
              required
              placeholder="Enter deposit amount"
            />
          </Form.Group>
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Amount Type</Form.Label>
            <Form.Select name="amountType" value={formData.amountType} onChange={handleChange}>
              <option value="cash">Cash</option>
              <option value="cheque">Cheque</option>
              <option value="online">Online</option>
            </Form.Select>
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

export default DepositForm;