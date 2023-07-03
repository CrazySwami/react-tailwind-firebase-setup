import React, { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '/Users/Alfonso/Documents/Work/AZ-Creates/Github-Projects/react-tailwind-firebase-setup/src/Helpers/Firebase.tsx';
import { collection, query, where, getDocs, addDoc, doc, updateDoc, getDoc } from 'firebase/firestore';
import BlogOrderForm from '../../Layout/Forms/BlogOrderForm';
import BlogOrderTable from '../../Layout/Tables/Blog-Orders-Listing';

const Dashboard = () => {
  // Access the current user's information from Firebase
  const [user] = useAuthState(auth);
  const { displayName, photoURL } = user || {};

  const [userRole, setUserRole] = useState('');
 
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          setUserRole(userDoc.data().role);
        } else {
          console.error('User document not found:', user.uid);
        }
      } else {
        setUserRole('');
      }
    });
    return unsubscribe;
  }, []);

  // Add a state variable to store the blog orders
  const [blogOrders, setBlogOrders] = useState([]);

  const fetchBlogOrders = async () => {
    const blogOrdersRef = collection(db, 'blogOrders');
    const q = query(blogOrdersRef, where('userId', '==', user.uid));
    const querySnapshot = await getDocs(q);

    const fetchedBlogOrders = [];
    querySnapshot.forEach((doc) => {
      fetchedBlogOrders.push({ id: doc.id, ...doc.data() });
    });

    setBlogOrders(fetchedBlogOrders);
  };

  useEffect(() => {
    if (user) {
      fetchBlogOrders();
    }
  }, [user]);

  const handleBlogOrderSubmit = async (newOrder) => {
    try {
      const docRef = await addDoc(collection(db, "blogOrders"), {
        ...newOrder,
        userId: user.uid,
      });
      console.log("Document written with ID: ", docRef.id);
      const uniqueUrl = `/generated-page/${docRef.id}`;
      await updateDoc(doc(db, "blogOrders", docRef.id), { url: uniqueUrl });
      setBlogOrders([...blogOrders, { id: docRef.id, url: uniqueUrl, ...newOrder }]);
      fetchBlogOrders(); // Fetch the updated blog orders
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };


  return (
    <div className="dashboard">
      {user && (
        <div className="user-info">
          {/* Display user's name and profile picture */}
          <h2>Welcome back <b>{displayName}</b>!</h2>
          <p>User role: {userRole}</p>
        </div>
      )}

      {/* Add the BlogOrderForm, BlogOrderTable, and GeneratedPage components */}
      <BlogOrderForm onSubmit={handleBlogOrderSubmit} />
      <BlogOrderTable blogOrders={blogOrders} />
    </div>
  );
};

export default Dashboard;