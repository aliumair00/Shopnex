// import React, { useEffect, useState } from 'react';
// import { Link } from 'react-router-dom';
// import { useDispatch } from 'react-redux';
// import axios from 'axios';
// import Productgrid from './Productgrid';

// const API_URL = import.meta.env.VITE_BACKEND_URL;

// const CollectionDisplay = ({ collectionName, limit = 4, useGender = false }) => {
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [usingFallback, setUsingFallback] = useState(false);

//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         setLoading(true);
//         setError(null);
        
//         // Use the correct query parameters based on the backend implementation
//         // In productRoutes.js, when 'collection' query param is provided, it maps to 'productCollection' in the DB query
//         let apiUrl;
//         if (useGender) {
//           apiUrl = `${API_URL}/api/products?gender=${collectionName}&limit=${limit}`;
//         } else {
//           apiUrl = `${API_URL}/api/products?collection=${collectionName}&limit=${limit}`;
//         }
        
//         console.log('VITE_BACKEND_URL:', import.meta.env.VITE_BACKEND_URL);
//         console.log('Full API URL:', apiUrl);
//         console.log('Fetching products with:', { 
//           useGender, 
//           collectionName, 
//           limit,
//           paramType: useGender ? 'gender' : 'collection'
//         });
        
//         const response = await axios.get(apiUrl);
//         console.log(`${useGender ? 'Gender' : 'Collection'} '${collectionName}' API response:`, response.data);
//         console.log('Response data length:', response.data.length);
        
//         // If no products found with the filter, try fetching all products as a fallback
//         if (response.data.length === 0) {
//           console.log('No products found with filter, fetching all products as fallback');
//           const allProductsResponse = await axios.get(`${API_URL}/api/products?limit=${limit}`);
//           console.log('All products response:', allProductsResponse.data);
//           setProducts(allProductsResponse.data);
//           setUsingFallback(true);
//         } else {
//           setProducts(response.data);
//           setUsingFallback(false);
//         }
        
//         setLoading(false);
//       } catch (error) {
//         console.error(`Error fetching '${collectionName}' products:`, error);
//         console.error('Error details:', error.response ? error.response.data : 'No response data');
        
//         // Try fetching all products as a fallback if there was an error
//         try {
//           console.log('Error occurred, fetching all products as fallback');
//           const allProductsResponse = await axios.get(`${API_URL}/api/products?limit=${limit}`);
//           console.log('All products response:', allProductsResponse.data);
//           setProducts(allProductsResponse.data);
//           setUsingFallback(true);
//           setLoading(false);
//         } catch (fallbackError) {
//           console.error('Fallback fetch also failed:', fallbackError);
//           setError(error.message || 'Failed to fetch products');
//           setUsingFallback(false);
//           setLoading(false);
//         }
//       }
//     };

//     if (collectionName) {
//       fetchProducts();
//     }
//   }, [collectionName, limit, useGender]);

//   if (!collectionName) {
//     return null;
//   }

//   return (
//     <div className="container mx-auto mb-16">
//       <div className="flex justify-between items-center mb-6">
//         <h2 className="text-2xl font-bold">
//           {useGender ? `${collectionName}'s Collection` : `${collectionName} Collection`}
//         </h2>
//         <Link
//           to={useGender ? `/collections/all?gender=${collectionName}` : `/collections/all?collection=${collectionName}`}
//           className="text-blue-600 hover:underline"
//         >
//           View All
//         </Link>
//       </div>
      
//       {loading ? (
//         <div className="text-center py-8">Loading collection products...</div>
//       ) : error ? (
//         <div className="text-center py-8 text-red-500">
//           Error: {error}. Please try again later.
//         </div>
//       ) : products.length === 0 ? (
//         <div className="text-center py-8 text-gray-600">
//           No products found in the "{collectionName}" collection. 
//           <p className="mt-2">This could be because:</p>
//           <ul className="list-disc list-inside mt-2">
//             <li>No products have been added to this collection yet</li>
//             <li>The collection name might be different in the database</li>
//             <li>There might be a connection issue with the database</li>
//           </ul>
//         </div>
//       ) : (
//         <>
//           <Productgrid products={products} />
//           {usingFallback ? (
//             <div className="text-center text-sm text-yellow-600 mt-4 p-2 bg-yellow-100 rounded">
//               No products found specifically for "{collectionName}". Showing {products.length} product(s) from all available products instead.
//             </div>
//           ) : (
//             <div className="text-center text-sm text-gray-500 mt-4">
//               Showing {products.length} product(s) from the "{collectionName}" collection
//             </div>
//           )}
//         </>
//       )}
//     </div>
//   );
// };

// export default CollectionDisplay;