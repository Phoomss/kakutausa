import React, { useEffect, useState } from "react";
import { Edit3, Mail, Phone, MapPin } from "lucide-react";
import authService from "../../services/authService";
const Profile = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await authService.userInfo();
        setUser(res.data.data);
      } catch (err) {
        console.error("Failed to load user info:", err);
      }
    };
    fetchUser();
  }, []);

  if (!user) {
    return (
      <div className="p-6 min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto">
        {/* Profile Card */}
        <div className="bg-white shadow-lg rounded-2xl p-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            {/* Avatar */}
            <img
              src={
                user.avatar ||
                "https://ui-avatars.com/api/?name=" + encodeURIComponent(user.name || "User")
              }
              alt={user.usrename}
              className="w-32 h-32 rounded-full border-4 border-blue-100 object-cover"
            />

            {/* User Info */}
            <div className="flex-1 text-center sm:text-left">
              <h2 className="text-2xl font-bold text-gray-800">{user.name}</h2>
              <p className="text-gray-500 capitalize">{user.role || "User"}</p>

              <div className="mt-4 space-y-2">
                <p className="flex items-center justify-center sm:justify-start text-gray-600">
                  <Mail className="w-5 h-5 mr-2 text-blue-500" />
                  {user.email}
                </p>
              </div>
            </div>
          </div>

          {/* Edit Button */}
          <div className="mt-6 text-center sm:text-right">
            <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition">
              <Edit3 className="w-4 h-4 mr-2" />
              Edit Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
