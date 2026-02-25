// src/components/common/RealTimeStats.jsx
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Row, Col, Card } from 'react-bootstrap';
import { 
  FaHome, 
  FaLightbulb, 
  FaMoneyBill, 
  FaWallet, 
  FaFileAlt 
} from 'react-icons/fa';
import { realtimeService } from '../../services/realtimeService';

const RealTimeStats = () => {
  const { user } = useSelector(state => state.auth);
  const [stats, setStats] = useState({
    totalRents: 0,
    totalLightBills: 0,
    totalDeposits: 0,
    totalExpenses: 0,
    totalDocuments: 0,
    totalRentAmount: 0,
    totalExpenseAmount: 0
  });

  useEffect(() => {
    if (!user) return;

    // Listen to rents
    const unsubscribeRents = realtimeService.listenToUserCollection('rents', user.uid, (rents) => {
      const totalAmount = rents.reduce((sum, rent) => sum + Number(rent.rentAmount || 0), 0);
      setStats(prev => ({
        ...prev,
        totalRents: rents.length,
        totalRentAmount: totalAmount
      }));
    });

    // Listen to light bills
    const unsubscribeLightBills = realtimeService.listenToUserCollection('lightbills', user.uid, (bills) => {
      setStats(prev => ({
        ...prev,
        totalLightBills: bills.length
      }));
    });

    // Listen to deposits
    const unsubscribeDeposits = realtimeService.listenToUserCollection('deposits', user.uid, (deposits) => {
      setStats(prev => ({
        ...prev,
        totalDeposits: deposits.length
      }));
    });

    // Listen to expenses
    const unsubscribeExpenses = realtimeService.listenToUserCollection('expenses', user.uid, (expenses) => {
      const totalAmount = expenses.reduce((sum, exp) => sum + Number(exp.amount || 0), 0);
      setStats(prev => ({
        ...prev,
        totalExpenses: expenses.length,
        totalExpenseAmount: totalAmount
      }));
    });

    // Listen to documents
    const unsubscribeDocuments = realtimeService.listenToUserCollection('documents', user.uid, (docs) => {
      setStats(prev => ({
        ...prev,
        totalDocuments: docs.length
      }));
    });

    // Cleanup listeners
    return () => {
      unsubscribeRents();
      unsubscribeLightBills();
      unsubscribeDeposits();
      unsubscribeExpenses();
      unsubscribeDocuments();
    };
  }, [user]);

  const StatCard = ({ title, count, icon: Icon, color, amount }) => (
    <Col md={4} lg={2} className="mb-4">
      <Card className="shadow-sm h-100">
        <Card.Body className="text-center">
          <Icon size={40} color={color} />
          <h5 className="mt-2">{title}</h5>
          <h3>{count}</h3>
          {amount && <p className="text-success">₹{amount.toLocaleString()}</p>}
        </Card.Body>
      </Card>
    </Col>
  );

  return (
    <Row>
      <StatCard 
        title="Rent" 
        count={stats.totalRents} 
        icon={FaHome} 
        color="#007bff"
        amount={stats.totalRentAmount}
      />
      <StatCard 
        title="Light Bills" 
        count={stats.totalLightBills} 
        icon={FaLightbulb} 
        color="#ffc107"
      />
      <StatCard 
        title="Deposits" 
        count={stats.totalDeposits} 
        icon={FaMoneyBill} 
        color="#28a745"
      />
      <StatCard 
        title="Expenses" 
        count={stats.totalExpenses} 
        icon={FaWallet} 
        color="#dc3545"
        amount={stats.totalExpenseAmount}
      />
      <StatCard 
        title="Documents" 
        count={stats.totalDocuments} 
        icon={FaFileAlt} 
        color="#17a2b8"
      />
    </Row>
  );
};

export default RealTimeStats;