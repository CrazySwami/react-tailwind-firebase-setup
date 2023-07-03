import React, { useEffect, useState } from 'react';
import { collection, onSnapshot, doc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { db } from '/Users/Alfonso/Documents/Work/AZ-Creates/Github-Projects/react-tailwind-firebase-setup/src/Helpers/Firebase.tsx';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '/Users/Alfonso/Documents/Work/AZ-Creates/Github-Projects/react-tailwind-firebase-setup/src/Helpers/Firebase.tsx';
import UserTable from '../../Layout/Tables/UserTable';
import UserBlogOrders from '../../Layout/Tables/Users-Listing-Admin-Only';

const AdminView = () => {
  const [user] = useAuthState(auth);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [userRole, setUserRole] = useState('');
    const navigate = useNavigate();
  
  // Fetch all users, orders, and user role from Firestore
  useEffect(() => {
    const fetchUserRole = async () => {
      if (user) {
        const userRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          setUserRole(userDoc.data().role);
        }
      }
    };

    const usersRef = collection(db, 'users');
    const ordersRef = collection(db, 'blogOrders');

    const unsubscribeUsers = onSnapshot(usersRef, (querySnapshot) => {
      const usersData = [];
      querySnapshot.forEach((doc) => {
        usersData.push({ id: doc.id, ...doc.data() });
      });
      setUsers(usersData);
    });

    const unsubscribeOrders = onSnapshot(ordersRef, (querySnapshot) => {
      const ordersData = [];
      querySnapshot.forEach((doc) => {
        ordersData.push({ id: doc.id, ...doc.data() });
      });
      setOrders(ordersData);
    });

    fetchUserRole();

    return () => {
      unsubscribeUsers();
      unsubscribeOrders();
    };
  }, [user]);

const handleUserClick = (userId) => {
  navigate(`/admin/users/${userId}`);
};

const handleOrderClick = (orderId) => {
  navigate(`/admin/orders/${orderId}`);
};

  const columns = [
    { field: 'id', headerName: 'ID', width: 150 },
    { field: 'email', headerName: 'Email', width: 200 },
    // Add more columns as needed
  ];

  if (userRole === null) {
    return <div>Loading...</div>;
  }

  if (userRole !== 'admin') {
    return <div>You do not have permission to access this page.</div>;
  }

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <UserTable users={users} />
    </div>
  );
};

export default AdminView;