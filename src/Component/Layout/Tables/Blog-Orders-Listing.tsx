import React from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { db, auth } from '/Users/Alfonso/Documents/Work/AZ-Creates/Github-Projects/react-tailwind-firebase-setup/src/Helpers/Firebase.tsx';

const BlogOrderTable = ({ blogOrders }) => {
  const [user] = useAuthState(auth);

  const formatDate = (timestamp) => {
    if (timestamp && timestamp.toDate) {
      return timestamp.toDate().toLocaleDateString();
    } else {
      return 'Invalid Date';
    }
  };

  return (
    <div className="overflow-x-auto">
      <div className="mb-4 text-sm text-gray-600">
        Logged in as: {user ? user.uid : 'Loading...'}
      </div>

      <table className="min-w-full bg-white divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Blog Title</th>
            {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th> */}
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Keywords</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">URL</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Approval Status</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {blogOrders.map((order, index) => (
            <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.blogTitle}</td>

              {/* <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.id}</td> */}
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.keywords.join(', ')}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-500">
<a href={`/blogOrder/${order.id}`}>{`/blogOrder/${order.id}`}</a>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(order.date)}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${order.paymentStatus ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {order.paymentStatus ? 'Payment Successful' : 'Payment Unsuccessful'}
              </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm">
              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${order.approvalStatus ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {order.approvalStatus ? 'Approved' : 'Not Approved'}
              </span>
            </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BlogOrderTable;


