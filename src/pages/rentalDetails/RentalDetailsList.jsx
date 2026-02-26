import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Table, Button, Modal, Form, Row, Col } from 'react-bootstrap';
import { FaEdit, FaTrash, FaPlus, FaEye } from 'react-icons/fa';
import Sidebar from '../../components/common/Sidebar';
import Header from '../../components/common/Header';
import { getRentalDetails, addRentalDetail, updateRentalDetail, deleteRentalDetail } from '../../redux/actions/rentalDetailsActions';

const RentalDetailsList = () => {
    const [showModal, setShowModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [selectedDetail, setSelectedDetail] = useState(null);
    const [formData, setFormData] = useState({
        floor: '',
        rentalName: '',
        referenceName: '',
        mobileNo: '',
        depositAmount: '',
        monthlyRent: ''
    });

    const dispatch = useDispatch();
    const { rentalDetails } = useSelector(state => state.rentalDetails);
    const { user } = useSelector(state => state.auth);

    useEffect(() => {
        if (user) {
            dispatch(getRentalDetails(user.uid));
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

        if (selectedDetail) {
            await dispatch(updateRentalDetail(selectedDetail.id, formData));
        } else {
            await dispatch(addRentalDetail(formData, user.uid));
        }

        setShowModal(false);
        resetForm();
    };

    const handleEdit = (detail) => {
        setSelectedDetail(detail);
        setFormData({
            floor: detail.floor || '',
            rentalName: detail.rentalName || '',
            referenceName: detail.referenceName || '',
            mobileNo: detail.mobileNo || '',
            depositAmount: detail.depositAmount || '',
            monthlyRent: detail.monthlyRent || ''
        });
        setShowModal(true);
    };

    const handleView = (detail) => {
        setSelectedDetail(detail);
        setShowViewModal(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this rental detail?')) {
            await dispatch(deleteRentalDetail(id));
        }
    };

    const resetForm = () => {
        setFormData({
            floor: '',
            rentalName: '',
            referenceName: '',
            mobileNo: '',
            depositAmount: '',
            monthlyRent: ''
        });
        setSelectedDetail(null);
    };

    return (
        <div className="d-flex">
            <Sidebar />
            <div className="flex-grow-1" style={{ marginLeft: '250px', padding: '20px' }}>
                <Header />
                <div className="p-4">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h3>Rental Details</h3>
                        <Button variant="primary" onClick={() => { resetForm(); setShowModal(true); }}>
                            <FaPlus className="me-2" /> Add Rental Detail
                        </Button>
                    </div>

                    <div className="table-responsive">
                        <Table striped bordered hover>
                            <thead className="bg-dark text-white">
                                <tr>
                                    <th>Floor</th>
                                    <th>Rental Name</th>
                                    <th>Reference Name</th>
                                    <th>Mobile No</th>
                                    <th>Deposit Amount</th>
                                    <th>Monthly Rent</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rentalDetails.map((detail) => (
                                    <tr key={detail.id}>
                                        <td>{detail.floor}</td>
                                        <td>{detail.rentalName}</td>
                                        <td>{detail.referenceName}</td>
                                        <td>{detail.mobileNo}</td>
                                        <td>₹{detail.depositAmount}</td>
                                        <td>₹{detail.monthlyRent}</td>
                                        <td>
                                            <Button
                                                variant="info" size="sm" className="me-2"
                                                onClick={() => handleView(detail)}
                                            >
                                                <FaEye />
                                            </Button>
                                            <Button
                                                variant="warning" size="sm" className="me-2"
                                                onClick={() => handleEdit(detail)}
                                            >
                                                <FaEdit />
                                            </Button>
                                            <Button
                                                variant="danger" size="sm"
                                                onClick={() => handleDelete(detail.id)}
                                            >
                                                <FaTrash />
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                                {rentalDetails.length === 0 && (
                                    <tr>
                                        <td colSpan="7" className="text-center">No rental details found</td>
                                    </tr>
                                )}
                            </tbody>
                        </Table>
                    </div>

                    {/* Add/Edit Modal */}
                    <Modal show={showModal} onHide={() => { setShowModal(false); resetForm(); }} size="lg">
                        <Modal.Header closeButton>
                            <Modal.Title>{selectedDetail ? 'Edit Rental Detail' : 'Add Rental Detail'}</Modal.Title>
                        </Modal.Header>
                        <Form onSubmit={handleSubmit}>
                            <Modal.Body>
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
                                            <Form.Label>Rental Name</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="rentalName"
                                                value={formData.rentalName}
                                                onChange={handleInputChange}
                                                placeholder="Enter rental name"
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Reference Name</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="referenceName"
                                                value={formData.referenceName}
                                                onChange={handleInputChange}
                                                placeholder="Enter reference name"
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Mobile No</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="mobileNo"
                                                value={formData.mobileNo}
                                                onChange={handleInputChange}
                                                placeholder="Enter mobile number"
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Deposit Amount (₹)</Form.Label>
                                            <Form.Control
                                                type="number"
                                                name="depositAmount"
                                                value={formData.depositAmount}
                                                onChange={handleInputChange}
                                                placeholder="Enter deposit amount"
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Monthly Rent (₹)</Form.Label>
                                            <Form.Control
                                                type="number"
                                                name="monthlyRent"
                                                value={formData.monthlyRent}
                                                onChange={handleInputChange}
                                                placeholder="Enter monthly rent"
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
                                    {selectedDetail ? 'Update' : 'Save'}
                                </Button>
                            </Modal.Footer>
                        </Form>
                    </Modal>

                    {/* View Modal */}
                    <Modal show={showViewModal} onHide={() => setShowViewModal(false)}>
                        <Modal.Header closeButton>
                            <Modal.Title>Rental Detail Details</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            {selectedDetail && (
                                <>
                                    <p><strong>Floor:</strong> {selectedDetail.floor}</p>
                                    <p><strong>Rental Name:</strong> {selectedDetail.rentalName}</p>
                                    <p><strong>Reference Name:</strong> {selectedDetail.referenceName}</p>
                                    <p><strong>Mobile No:</strong> {selectedDetail.mobileNo}</p>
                                    <p><strong>Deposit Amount:</strong> ₹{selectedDetail.depositAmount}</p>
                                    <p><strong>Monthly Rent:</strong> ₹{selectedDetail.monthlyRent}</p>
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

export default RentalDetailsList;