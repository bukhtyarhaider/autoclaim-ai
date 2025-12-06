import React from 'react';
import Profile from '../features/profile/components/Profile';
import { useAuth } from '../context/AuthContext';

const ProfilePage: React.FC = () => {
  const { user, updateUser } = useAuth();

  if (!user) return null; // Should be protected anyway

  return (
    <div className="animate-in fade-in duration-500">
      <Profile user={user} onUpdate={updateUser} />
    </div>
  );
};

export default ProfilePage;
