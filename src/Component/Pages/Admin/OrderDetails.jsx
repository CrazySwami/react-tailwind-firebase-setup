import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '/Users/Alfonso/Documents/Work/AZ-Creates/Github-Projects/react-tailwind-firebase-setup/src/Helpers/Firebase.tsx';

const OrderDetails = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);

  // Fetch order details from Firestore
  useEffect(() => {
    const fetchOrder = async () => {
      const orderRef = doc(db, 'blogOrders', orderId);
      const orderDoc = await getDoc(orderRef);
      if (orderDoc.exists()) {
        setOrder({ id: orderDoc.id, ...orderDoc.data() });
      }
    };

    fetchOrder();
  }, [orderId]);

  // Handle change of approval status
  const handleChangeApprovalStatus = async (newStatus) => {
    const orderRef = doc(db, 'blogOrders', orderId);
    await updateDoc(orderRef, { approvalStatus: newStatus });
  };

  // Handle blog content change
  const handleBlogContentChange = (event) => {
    setOrder({ ...order, blogContent: event.target.value });
  };

  // Handle save blog content
  const handleSaveBlogContent = async () => {
    const orderRef = doc(db, 'blogOrders', orderId);
    await updateDoc(orderRef, { blogContent: order.blogContent });
  };

  if (!order) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Order Details</h1>
      <h2>Order ID: {order.id}</h2>
      <p>Approval Status: {order.approvalStatus}</p>
      <button onClick={() => handleChangeApprovalStatus('approved')}>Approve</button>
      <button onClick={() => handleChangeApprovalStatus('not approved')}>Disapprove</button>
      <h3>Blog Content</h3>
      <textarea value={order.blogContent} onChange={handleBlogContentChange} />
      <button onClick={handleSaveBlogContent}>Save Blog Content</button>
    </div>
  );
};

export default OrderDetails;