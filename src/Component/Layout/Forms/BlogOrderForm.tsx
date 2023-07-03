import React, { useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '/Users/Alfonso/Documents/Work/AZ-Creates/Github-Projects/react-tailwind-firebase-setup/src/Helpers/Firebase.tsx';
import { collection, addDoc, updateDoc, serverTimestamp } from 'firebase/firestore';

const BlogOrderForm = () => {
  const [user] = useAuthState(auth);
  const [show, setShow] = useState(false);
  const [formData, setFormData] = useState({
    blogCount: 1,
    blogs: [
      {
        keywords: [""],
      },
    ],
  });

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);


  const handleChange = (event) => {
    const { name, value } = event.target;
  
    if (name === "blogCount") {
      const newBlogCount = parseInt(value, 10);
      setFormData((prevFormData) => {
        const newBlogs = new Array(newBlogCount)
          .fill(null)
          .map((_, index) => prevFormData.blogs[index] || { keywords: [""] });
        return { ...prevFormData, blogCount: newBlogCount, blogs: newBlogs };
      });
    } else {
      const [blogIndex, keywordIndex] = name.split("_").slice(1).map(Number);
      setFormData((prevFormData) => {
        const newBlogs = prevFormData.blogs.slice();
        newBlogs[blogIndex].keywords[keywordIndex] = value;
        return { ...prevFormData, blogs: newBlogs };
      });
    }
  };

    const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const currentDate = new Date();
      const timestamp = currentDate.getTime();
           // First, add the document without the uniqueUrl field for each blog
           const docRefs = await Promise.all(
            formData.blogs.map((blog) =>
              addDoc(collection(db, "blogOrders"), {
                keywords: blog.keywords,
                userId: user.uid,
                approvalStatus: false,
                paymentStatus: false,
                date: serverTimestamp(),
                timestamp: timestamp,
                blogtitle: 'Blog title coming soon...',
                metadescription: 'Metadescription coming soon...',
              })
            )
          );
    
          console.log("Documents written with IDs: ", docRefs.map((docRef) => docRef.id));
    
          // Then, update each document with the uniqueUrl field
          await Promise.all(
            docRefs.map((docRef) =>
              updateDoc(docRef, {
                uniqueUrl: `uniqueUrl/${docRef.id}`,
              })
            )
          );
    
          handleClose();

      window.location.reload();
    } catch (error) {
      console.error("Error adding documents: ", error);
    }
  };

  
  const blogCountOptions = Array.from({ length: 5 }, (_, i) => i + 1);

  return (
    <>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={handleShow}
      >
        Create a Page
      </button>

      {show && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center">
            <div
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              onClick={handleClose}
            ></div>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  Order a Blog
                </h3>
                {/* FORM */}
                <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label htmlFor="blogCount" className="block text-gray-700 text-sm font-bold mb-2">Number of Blogs:</label>
                  <select
                    name="blogCount"
                    value={formData.blogCount}
                    onChange={handleChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  >
                    {blogCountOptions.map((count) => (
                      <option key={count} value={count}>
                        {count}
                      </option>
                    ))}
                  </select>
                </div>
                {formData.blogs.map((blog, blogIndex) =>
                  blog.keywords.map((keyword, keywordIndex) => (
                    <div key={`${blogIndex}_${keywordIndex}`} className="mb-4">
                      <label
                        htmlFor={`keyword_${blogIndex}_${keywordIndex}`}
                        className="block text-gray-700 text-sm font-bold mb-2"
                      >
                        Blog {blogIndex + 1} - Keyword {blogIndex + 1} :
                      </label>
                      <input
                        type="text"
                        name={`keyword_${blogIndex}_${keywordIndex}`}
                        value={keyword}
                        onChange={handleChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      />
                    </div>
                  ))
                )}
                <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                  Submit
                </button>
              </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BlogOrderForm;