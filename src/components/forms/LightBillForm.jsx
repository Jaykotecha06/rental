import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';

const LightBillForm = ({ onSubmit, initialData = null, tenants = [] }) => {
  const [formData, setFormData] = useState({
    floor: '',
    name: '',
    currentUnit: '',
    lastUnit: '',
    currentUnitDate: '',
    lastUnitDate: '',
    depositAmount: '',
    amountType: 'cash'
  });

  const [calculatedAmount, setCalculatedAmount] = useState(0);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
      calculateAmount(initialData.currentUnit, initialData.lastUnit);
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    if (name === 'currentUnit' || name === 'lastUnit') {
      const current = name === 'currentUnit' ? value : formData.currentUnit;
      const last = name === 'lastUnit' ? value : formData.lastUnit;
      calculateAmount(current, last);
    }
  };

  const handleTenantSelect = (e) => {
    const selectedTenant = tenants.find(t => t.name === e.target.value);
    if (selectedTenant) {
      setFormData({
        ...formData,
        name: selectedTenant.name,
        floor: selectedTenant.floor,
        lastUnit: selectedTenant.lastUnit || '',
        lastUnitDate: selectedTenant.lastUnitDate || ''
      });
    }
  };

  const calculateAmount = (current, last) => {
    if (current && last) {
      const units = parseFloat(current) - parseFloat(last);
      if (units > 0) {
        setCalculatedAmount(units * 9.5);
      }
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
            <Form.Label>Last Unit</Form.Label>
            <Form.Control
              type="number"
              name="lastUnit"
              value={formData.lastUnit}
              onChange={handleChange}
              required
              placeholder="Enter last unit"
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
              onChange={handleChange}
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
              onChange={handleChange}
              required
              placeholder="Enter current unit"
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
              onChange={handleChange}
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
              onChange={handleChange}
              required
              placeholder="Enter deposit amount"
            />
          </Form.Group>
        </Col>
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

export default LightBillForm;