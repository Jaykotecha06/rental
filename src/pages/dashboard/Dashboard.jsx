import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  FaHome, 
  FaLightbulb, 
  FaMoneyBill, 
  FaWallet, 
  FaFileAlt,
  FaArrowRight,
  FaUsers,
  FaRupeeSign,
  FaBuilding,
  FaCalendarCheck,
  FaChartLine,
  FaBell,
  FaUserCircle,
  FaBars,
  FaCoins,
  FaCreditCard
} from 'react-icons/fa';
import Sidebar from '../../components/common/Sidebar';
import firebaseService from '../../services/firebaseService';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useSelector(state => state.auth);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [stats, setStats] = useState({
    totalRents: 0,
    totalLightBills: 0,
    totalDeposits: 0,
    totalExpenses: 0,
    totalDocuments: 0,
    totalRentAmount: 0,
    totalDepositAmount: 0,
    totalExpenseAmount: 0,
    totalLightBillAmount: 0,
    activeTenants: 0,
    paidRents: 0,
    pendingRents: 0,
    recentActivities: []
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) return;
      
      setLoading(true);
      try {
        const [rents, lightBills, deposits, expenses, documents] = await Promise.all([
          firebaseService.getAll('rents', user.uid),
          firebaseService.getAll('lightbills', user.uid),
          firebaseService.getAll('deposits', user.uid),
          firebaseService.getAll('expenses', user.uid),
          firebaseService.getAll('documents', user.uid)
        ]);

        // Calculate totals
        const totalRentAmount = rents.reduce((sum, rent) => sum + (parseFloat(rent.rentAmount) || 0), 0);
        const totalDepositAmount = deposits.reduce((sum, dep) => sum + (parseFloat(dep.depositAmount) || 0), 0);
        const totalExpenseAmount = expenses.reduce((sum, exp) => sum + (parseFloat(exp.amount) || 0), 0);
        const totalLightBillAmount = lightBills.reduce((sum, bill) => sum + (parseFloat(bill.amount) || 0), 0);
        
        const uniqueTenants = new Set(rents.map(rent => rent.name));
        
        // Recent activities
        const allActivities = [
          ...rents.slice(0, 3).map(rent => ({
            id: `rent-${rent.id}`,
            action: `💰 Rent collected from ${rent.name}`,
            amount: `₹${rent.rentAmount}`,
            time: new Date(rent.createdAt).toLocaleDateString(),
            type: 'rent',
            icon: '💰'
          })),
          ...lightBills.slice(0, 3).map(bill => ({
            id: `bill-${bill.id}`,
            action: `⚡ Light bill paid by ${bill.name}`,
            amount: `₹${bill.amount}`,
            time: new Date(bill.createdAt).toLocaleDateString(),
            type: 'bill',
            icon: '⚡'
          })),
          ...deposits.slice(0, 3).map(dep => ({
            id: `dep-${dep.id}`,
            action: `🏦 Deposit from ${dep.name}`,
            amount: `₹${dep.depositAmount}`,
            time: new Date(dep.createdAt).toLocaleDateString(),
            type: 'deposit',
            icon: '🏦'
          }))
        ].sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, 6);

        setStats({
          totalRents: rents.length,
          totalLightBills: lightBills.length,
          totalDeposits: deposits.length,
          totalExpenses: expenses.length,
          totalDocuments: documents.length,
          totalRentAmount,
          totalDepositAmount,
          totalExpenseAmount,
          totalLightBillAmount,
          activeTenants: uniqueTenants.size,
          paidRents: rents.length,
          pendingRents: Math.floor(rents.length * 0.2),
          recentActivities: allActivities
        });

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading-screen">
          <div className="spinner"></div>
          <h3>Loading Dashboard...</h3>
          <p>Please wait while we fetch your data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Mobile Menu Button */}
      <button className="mobile-menu-btn" onClick={toggleSidebar}>
        <FaBars />
      </button>

      {/* Sidebar */}
      <div className={`sidebar-wrapper ${sidebarOpen ? 'open' : ''}`}>
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Header */}
        <header className="dashboard-header">
          <div className="header-left">
            <h1>Dashboard</h1>
            <p>Welcome back, {user?.name || 'User'}! Here's your property overview.</p>
          </div>
          <div className="header-right">
            <div className="notification-badge">
              <FaBell />
              <span className="badge">3</span>
            </div>
            <div className="user-profile">
              <FaUserCircle className="user-avatar" />
              <div className="user-info">
                <span className="user-name">{user?.name || 'User'}</span>
                <span className="user-role">Property Manager</span>
              </div>
            </div>
          </div>
        </header>

        {/* Stats Cards - 5 Cards as requested */}
        <div className="stats-grid">
          {/* Card 1: Active Tenants */}
          <div className="stat-card tenants">
            <div className="stat-icon">
              <FaUsers />
            </div>
            <div className="stat-content">
              <h3>Active Tenants</h3>
              <div className="stat-numbers">
                <span className="stat-value">{stats.activeTenants}</span>
                <span className="stat-label">Living</span>
              </div>
            </div>
          </div>

          {/* Card 2: Total Rent (सिर्फ rent) */}
          <div className="stat-card rent">
            <div className="stat-icon">
              <FaHome />
            </div>
            <div className="stat-content">
              <h3>Total Rent</h3>
              <div className="stat-numbers">
                <span className="stat-value">₹{stats.totalRentAmount.toLocaleString()}</span>
                <span className="stat-label">Collected</span>
              </div>
            </div>
          </div>

          {/* Card 3: Total Deposits (सिर्फ deposits) */}
          <div className="stat-card deposit">
            <div className="stat-icon">
              <FaMoneyBill />
            </div>
            <div className="stat-content">
              <h3>Total Deposits</h3>
              <div className="stat-numbers">
                <span className="stat-value">₹{stats.totalDepositAmount.toLocaleString()}</span>
                <span className="stat-label">Security</span>
              </div>
            </div>
          </div>

          {/* Card 4: Total Amount (Rent + Deposits) */}
          <div className="stat-card total-amount">
            <div className="stat-icon">
              <FaCoins />
            </div>
            <div className="stat-content">
              <h3>Total Amount</h3>
              <div className="stat-numbers">
                <span className="stat-value">₹{(stats.totalRentAmount + stats.totalDepositAmount).toLocaleString()}</span>
                <span className="stat-label">Rent + Deposit</span>
              </div>
            </div>
          </div>

          {/* Card 5: Total Expenses (सिर्फ expenses) */}
          <div className="stat-card expense">
            <div className="stat-icon">
              <FaWallet />
            </div>
            <div className="stat-content">
              <h3>Total Expenses</h3>
              <div className="stat-numbers">
                <span className="stat-value">₹{stats.totalExpenseAmount.toLocaleString()}</span>
                <span className="stat-label">Spent</span>
              </div>
            </div>
          </div>
        </div>

        {/* Financial Overview */}
        <div className="financial-overview">
          <div className="overview-card balance">
            <h3>Current Balance</h3>
            <div className="balance-amount">
              ₹{((stats.totalRentAmount + stats.totalDepositAmount) - stats.totalExpenseAmount).toLocaleString()}
            </div>
            <div className="balance-details">
              <span>Income: ₹{(stats.totalRentAmount + stats.totalDepositAmount).toLocaleString()}</span>
              <span>Expenses: ₹{stats.totalExpenseAmount.toLocaleString()}</span>
            </div>
          </div>

          <div className="overview-card rent-status">
            <h3>Rent Collection</h3>
            <div className="progress-circle">
              <svg viewBox="0 0 36 36" className="circular-chart">
                <path className="circle-bg"
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path className="circle"
                  strokeDasharray={`${(stats.paidRents / (stats.totalRents || 1)) * 100}, 100`}
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <text x="18" y="20.35" className="percentage">{Math.round((stats.paidRents / (stats.totalRents || 1)) * 100)}%</text>
              </svg>
            </div>
            <div className="rent-stats">
              <div className="rent-stat-item">
                <span className="label">Paid</span>
                <span className="value">{stats.paidRents}</span>
              </div>
              <div className="rent-stat-item">
                <span className="label">Pending</span>
                <span className="value">{stats.pendingRents}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modules Grid
        <h2 className="section-title">Quick Access Modules</h2>
        <div className="modules-grid">
          <div className="module-card rent" onClick={() => navigate('/rent')}>
            <div className="module-icon">
              <FaHome />
            </div>
            <div className="module-info">
              <h3>Rent Management</h3>
              <p>Manage rent collections and tenant details</p>
              <div className="module-stats">
                <span className="count">{stats.totalRents} Properties</span>
                <span className="amount">₹{stats.totalRentAmount.toLocaleString()}</span>
              </div>
            </div>
            <FaArrowRight className="module-arrow" />
          </div>

          <div className="module-card light" onClick={() => navigate('/lightbill')}>
            <div className="module-icon">
              <FaLightbulb />
            </div>
            <div className="module-info">
              <h3>Light Bills</h3>
              <p>Track electricity bills and unit consumption</p>
              <div className="module-stats">
                <span className="count">{stats.totalLightBills} Bills</span>
                <span className="amount">₹{stats.totalLightBillAmount.toLocaleString()}</span>
              </div>
            </div>
            <FaArrowRight className="module-arrow" />
          </div>

          <div className="module-card deposit" onClick={() => navigate('/deposit')}>
            <div className="module-icon">
              <FaMoneyBill />
            </div>
            <div className="module-info">
              <h3>Deposits</h3>
              <p>Manage security deposits and payments</p>
              <div className="module-stats">
                <span className="count">{stats.totalDeposits} Deposits</span>
                <span className="amount">₹{stats.totalDepositAmount.toLocaleString()}</span>
              </div>
            </div>
            <FaArrowRight className="module-arrow" />
          </div>

          <div className="module-card expense" onClick={() => navigate('/expense')}>
            <div className="module-icon">
              <FaWallet />
            </div>
            <div className="module-info">
              <h3>Expenses</h3>
              <p>Track property maintenance and other expenses</p>
              <div className="module-stats">
                <span className="count">{stats.totalExpenses} Expenses</span>
                <span className="amount">₹{stats.totalExpenseAmount.toLocaleString()}</span>
              </div>
            </div>
            <FaArrowRight className="module-arrow" />
          </div>

          <div className="module-card document" onClick={() => navigate('/document')}>
            <div className="module-icon">
              <FaFileAlt />
            </div>
            <div className="module-info">
              <h3>Documents</h3>
              <p>Store and manage tenant documents</p>
              <div className="module-stats">
                <span className="count">{stats.totalDocuments} Documents</span>
              </div>
            </div>
            <FaArrowRight className="module-arrow" />
          </div>
        </div> */}

        {/* Recent Activities */}
        {/* <div className="recent-activities">
          <h2 className="section-title">Recent Activities</h2>
          <div className="activities-list">
            {stats.recentActivities.length > 0 ? (
              stats.recentActivities.map((activity) => (
                <div key={activity.id} className="activity-item">
                  <div className="activity-icon" data-type={activity.type}>
                    {activity.icon}
                  </div>
                  <div className="activity-details">
                    <p className="activity-action">{activity.action}</p>
                    <span className="activity-time">{activity.time}</span>
                  </div>
                  <span className="activity-amount">{activity.amount}</span>
                </div>
              ))
            ) : (
              <div className="no-activities">
                <p>No recent activities found</p>
              </div>
            )}
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default Dashboard;