import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '/Users/Alfonso/Documents/Work/AZ-Creates/Github-Projects/react-tailwind-firebase-setup/src/Helpers/Firebase.tsx';
import BlogOrderTable from './Blog-Orders-Listing';

const UserBlogOrders = () => {
  const { userId } = useParams();
  const [blogOrders, setBlogOrders] = useState([]);

  const fetchBlogOrders = async () => {
    const blogOrdersRef = collection(db, 'blogOrders');
    const q = query(blogOrdersRef, where('userId', '==', userId));
    const querySnapshot = await getDocs(q);

    const fetchedBlogOrders = [];
    querySnapshot.forEach((doc) => {
      fetchedBlogOrders.push({ id: doc.id, ...doc.data() });
    });

    setBlogOrders(fetchedBlogOrders);
  };

  useEffect(() => {
    fetchBlogOrders();
  }, [userId]);

  return (
    <div>
      <h1>User Blog </h1>
      <BlogOrderTable blogOrders={blogOrders} />
    </div>
  );
};

export default UserBlogOrders;