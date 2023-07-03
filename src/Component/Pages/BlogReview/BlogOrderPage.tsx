import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db, auth } from '/Users/Alfonso/Documents/Work/AZ-Creates/Github-Projects/react-tailwind-firebase-setup/src/Helpers/Firebase.tsx';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // import styles
import { useAuthState } from 'react-firebase-hooks/auth';
import { useNavigate } from 'react-router-dom';



const BlogOrderPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [content, setContent] = useState('');
  const [blogCount, setBlogCount] = useState(1);
  const [keywords, setKeywords] = useState([]);
  const [approvalStatus, setApprovalStatus] = useState('');
  const [blogTitle, setBlogTitle] = useState('Blog title coming soon...');
  const [metaDescription, setMetaDescription] = useState('Metadescription coming soon...');

  const navigate = useNavigate();
  // Replace this with your own logic for determining admin status
  const [userRole, setUserRole] = useState('');

  const [currentUserId, setCurrentUserId] = useState('');
  const [user] = useAuthState(auth);

  useEffect(() => {
    const fetchOrder = async () => {
      const docRef = doc(db, 'blogOrders', id);
      const docSnap = await getDoc(docRef);
    
      if (docSnap.exists()) {
        setOrder({ id: docSnap.id, ...docSnap.data() });
        setContent(docSnap.data().content || '');
        setBlogCount(docSnap.data().blogCount || 1);
        setKeywords(docSnap.data().keywords || []);
        setApprovalStatus(docSnap.data().approvalStatus || '');
        setBlogTitle(docSnap.data().blogTitle || 'Blog title coming soon...'); // Add this line
        setMetaDescription(docSnap.data().metaDescription || 'Metadescription coming soon...'); // Add this line
      } else {
        console.log('No such document!');
      }
    };
  
    fetchOrder();
  }, [id]);
  
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
  
    fetchUserRole();
  }, [user]);

  
  const [showModal, setShowModal] = useState(false);

  const handleApproveClick = () => {
    setShowModal(true);
  };

  const handleApprove = async () => {
    const docRef = doc(db, "blogOrders", id);
    await updateDoc(docRef, { approvalStatus: true });
    setShowModal(false);
    window.location.reload();
  };

 const handleSave = async () => {
  const docRef = doc(db, "blogOrders", id);
  await updateDoc(docRef, {
    content,
    blogCount,
    keywords,
    approvalStatus,
    blogTitle, // Add this line to update the blog title
    metaDescription, // Add this line to update the meta description
  });
  window.location.reload();
};

  const handleBlogCountChange = (event) => {
    const newBlogCount = parseInt(event.target.value);
    setBlogCount(newBlogCount);
    setKeywords((prevKeywords) => {
      const newKeywords = Array(newBlogCount).fill('');
      return prevKeywords.slice(0, newBlogCount).concat(newKeywords.slice(prevKeywords.length));
    });
  };

  const handleKeywordChange = (event, index) => {
    const newKeywords = [...keywords];
    newKeywords[index] = event.target.value;
    setKeywords(newKeywords);
  };

  const handleApprovalChange = (event) => {
    setApprovalStatus(event.target.value === "true");
  };

  const handleBlogTitleChange = (event) => {
    setBlogTitle(event.target.value);
  };
  
  const handleMetaDescriptionChange = (event) => {
    setMetaDescription(event.target.value);
  };

  const blogCountOptions = Array.from({ length: 5 }, (_, i) => i + 1);

const handleDelete = async () => {
  console.log("Delete button clicked"); // Add this line
  const docRef = doc(db, "blogOrders", id);
  await deleteDoc(docRef);
  navigate("/adminView");
};


  if (!order) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">{order.blogTitle}</h1>


      {!order.approvalStatus && (
  <button
    className="mt-4 bg-green-200 hover:bg-green-500 text-green-700 hover:text-white font-bold py-2 px-4 rounded border border-green-500 float-right"
    onClick={handleApproveClick}
  >
    Approve
  </button>
)}
      {showModal && (
  <div className="fixed z-10 inset-0 overflow-y-auto">
    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      {/* ... */}
      <div className="bg-white rounded-lg px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
        <div className="sm:flex sm:items-start">
          <div className="mt-3 text-center sm:mt-0 sm:text-left">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Confirm Approval</h3>
            <div className="mt-2">
              <p className="text-sm text-gray-500">
                Are you satisfied with your blog? The only way to undo an approval is by contacting support.
              </p>
            </div>
          </div>
        </div>
        <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
          <button
            type="button"
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            onClick={handleApprove}
          >
            Yes I Approve!
          </button>
          <button
            type="button"
            className="mr-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded"
            onClick={() => setShowModal(false)}
          >
            Let me check again...
          </button>
        </div>
      </div>
    </div>
  </div>
)}

<div className='mb-8 pt-'> 
<p>
  <strong>Blog Title:</strong>{' '}
  {userRole === 'admin' ? (
    <input
      type="text"
      value={blogTitle}
      onChange={handleBlogTitleChange}
      className="border rounded px-2 py-1 text-gray-700 mr-2"
    />
  ) : (
    order.blogTitle
  )}
</p>

<p>
  <strong>Meta Description:</strong>{' '}
  {userRole === 'admin' ? (
    <input
      type="text"
      value={metaDescription}
      onChange={handleMetaDescriptionChange}
      className="border rounded px-2 py-1 text-gray-700 mr-2"
    />
  ) : (
    order.metaDescription
  )}
</p>
      <p>
        <strong>Keyword:</strong>{' '}
        {userRole === 'admin' ?  (
          keywords.map((keyword, index) => (
            <input
              key={index}
              type="text"
              value={keyword}
              onChange={(event) => handleKeywordChange(event, index)}
              className="border rounded px-2 py-1 text-gray-700 mr-2"
            />
          ))
        ) : (
          order.keywords.join(', ')
        )}
      </p>
      <p>
  <strong>Approval Status:</strong>{" "}
  {userRole === 'admin' ? (
    <select
      value={approvalStatus.toString()}
      onChange={handleApprovalChange}
      className="border rounded px-2 py-1 text-gray-700"
    >
      <option value="false">Not Approved</option>
      <option value="true">Approved</option>
    </select>
  ) : (
    <span
      className={`inline-block py-1 px-2 rounded ${
        order.approvalStatus ? "bg-green-500 text-white text-xs" : "bg-red-500 text-white text-xs"
      }`}
    >
      {order.approvalStatus ? "APPROVED" : "Not Approved"}
    </span>
  )}
</p>
</div>
      <ReactQuill value={content} onChange={setContent} />

      <button
        className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={handleSave}
      >
        Save
      </button>


      {userRole === 'admin' && (
  <button
    className="mt-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
    onClick={handleDelete}
  >
    Delete
  </button>
)}
    </div>
  );
};

export default BlogOrderPage;