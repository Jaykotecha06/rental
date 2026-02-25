import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';

const DocumentForm = ({ onSubmit, initialData = null, tenants = [] }) => {
  const [formData, setFormData] = useState({
    floor: '',
    name: '',
    pancard: '',
    aadhar: ''
  });

  const [files, setFiles] = useState({
    pancard: null,
    aadhar: null
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        floor: initialData.floor || '',
        name: initialData.name || '',
        pancard: initialData.pancard || '',
        aadhar: initialData.aadhar || ''
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
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
    const selectedTenant = tenants.find(t => t.name === e.target.value);
    if (selectedTenant) {
      setFormData({
        ...formData,
        name: selectedTenant.name,
        floor: selectedTenant.floor
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData, files);
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
            <Form.Label>Pan Card Number</Form.Label>
            <Form.Control
              type="text"
              name="pancard"
              value={formData.pancard}
              onChange={handleChange}
              placeholder="Enter PAN card number"
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Pan Card File</Form.Label>
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
              onChange={handleChange}
              placeholder="Enter Aadhar card number"
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

      <div className="text-end">
        <Button variant="primary" type="submit">
          {initialData ? 'Update' : 'Save'}
        </Button>
      </div>
    </Form>
  );
};

export default DocumentForm;