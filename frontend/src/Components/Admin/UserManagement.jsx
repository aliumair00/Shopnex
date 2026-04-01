import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers, deleteUser, addUser, updateUser } from "../../redux/slice/adminSlice";

const UserManagement = () => {
  const dispatch = useDispatch();
  const { users, loading } = useSelector((state) => state.admin);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "customer", //default role
  });

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      password: "",
      role: "customer",
    });
    setIsEditing(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await dispatch(updateUser({
          id: formData._id,
          name: formData.name,
          email: formData.email,
          role: formData.role
        }));
      } else {
        await dispatch(addUser(formData));
      }
      // Fetch updated user list
      dispatch(fetchUsers());
      // Reset form
      resetForm();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleEdit = (user) => {
    setIsEditing(true);
    setFormData({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      password: "" // Clear password field for security
    });
  };

  const handleRoleChange = (userId, newRole) => {
    console.log({ userId, newRole });
  };

  const openDeleteModal = (user) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (userToDelete) {
      try {
        await dispatch(deleteUser(userToDelete._id));
        // Fetch updated user list after deletion
        dispatch(fetchUsers());
        setShowDeleteModal(false);
        setUserToDelete(null);
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    }
  };

  // Delete Modal Component
  const DeleteModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-4 sm:p-6 rounded-lg max-w-sm w-full">
        <h3 className="text-base sm:text-lg font-bold mb-3 sm:mb-4">Confirm Deletion</h3>
        <p className="mb-4 text-sm sm:text-base">Are you sure you want to delete this user?</p>
        <div className="flex justify-end gap-2 sm:gap-4">
          <button
            onClick={() => setShowDeleteModal(false)}
            className="px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm bg-gray-200 rounded hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleDeleteConfirm}
            className="px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto p-2 sm:p-4 md:p-6">
      <h1 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-center sm:text-left text-gray-800">User Management</h1>

      {/* Add/Edit User form */}
      <div className="mb-4 sm:mb-6 p-3 sm:p-4 md:p-6 bg-white rounded-lg shadow-sm">
        <h2 className="text-base sm:text-lg font-bold mb-3 sm:mb-4 text-gray-800">
          {isEditing ? "Edit User" : "Add New User"}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            <div className="mb-3 sm:mb-4">
              <label htmlFor="name" className="block text-gray-700 text-sm font-medium mb-1">
                Name
              </label>
              <input
                type="text"
                name="name"
                id="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter Name"
                className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500 text-sm"
                required
              />
            </div>
            <div className="mb-3 sm:mb-4">
              <label htmlFor="email" className="block text-gray-700 text-sm font-medium mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter Email"
                className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500 text-sm"
                required
              />
            </div>
            {!isEditing && (
              <div className="mb-3 sm:mb-4">
                <label htmlFor="password" className="block text-gray-700 text-sm font-medium mb-1">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter Password"
                  className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500 text-sm"
                  required
                />
              </div>
            )}
            <div className="mb-3 sm:mb-4">
              <label htmlFor="role" className="block text-gray-700 text-sm font-medium mb-1">
                Role
              </label>
              <select
                name="role"
                id="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500 text-sm"
                required
              >
                <option value="customer">Customer</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 sm:gap-4 mt-2">
            <button
              type="submit"
              className="bg-green-500 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded text-xs sm:text-sm hover:bg-green-600 transition-colors"
            >
              {isEditing ? "Update User" : "Add User"}
            </button>
            {isEditing && (
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-500 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded text-xs sm:text-sm hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* User List Management */}
      {loading ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          {/* Mobile view - card layout */}
          <div className="block sm:hidden">
            {users.map((user) => (
              <div key={user._id} className="bg-white rounded-lg shadow-sm mb-3 p-3 border-l-4 border-blue-500">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium text-gray-900">{user.name}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>
                    {user.role}
                  </span>
                </div>
                <p className="text-xs text-gray-600 mb-3 truncate">{user.email}</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  <button
                    onClick={() => handleEdit(user)}
                    className="bg-blue-500 text-white px-2 py-1 rounded text-xs hover:bg-blue-600 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => openDeleteModal(user)}
                    className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          {/* Desktop view - table layout */}
          <div className="hidden sm:block overflow-x-auto shadow-md rounded-lg">
            <table className="min-w-full text-left text-gray-500">
              <thead className="bg-gray-100 text-xs uppercase text-gray-700">
                <tr>
                  <th className="py-2 px-3 sm:py-3 sm:px-4">Name</th>
                  <th className="py-2 px-3 sm:py-3 sm:px-4">Email</th>
                  <th className="py-2 px-3 sm:py-3 sm:px-4">Role</th>
                  <th className="py-2 px-3 sm:py-3 sm:px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id} className="border-b hover:bg-gray-50 transition-colors">
                    <td className="py-2 px-3 sm:py-3 sm:px-4 font-medium text-gray-900">
                      {user.name}
                    </td>
                    <td className="py-2 px-3 sm:py-3 sm:px-4 text-sm truncate max-w-[150px] md:max-w-none">{user.email}</td>
                    <td className="py-2 px-3 sm:py-3 sm:px-4">
                      <select
                        value={user.role}
                        onChange={(e) => handleRoleChange(user._id, e.target.value)}
                        className="p-1.5 text-xs sm:text-sm border rounded focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="customer">Customer</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td className="py-2 px-3 sm:py-3 sm:px-4">
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => handleEdit(user)}
                          className="bg-blue-500 text-white px-2 py-1 sm:px-3 sm:py-1.5 rounded text-xs hover:bg-blue-600 transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => openDeleteModal(user)}
                          className="bg-red-500 text-white px-2 py-1 sm:px-3 sm:py-1.5 rounded text-xs hover:bg-red-600 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && <DeleteModal />}
    </div>
  );
};

export default UserManagement;
