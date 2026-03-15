import React from 'react';
import Card from '../components/common/Card';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { User, Mail, Lock, Save } from 'lucide-react';

const Settings = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Settings</h1>
      
      <div className="grid gap-6 max-w-2xl">
        <Card title="Profile Settings" subtitle="Update your account information">
          <Input 
            label="Full Name" 
            placeholder="Enter your name"
            icon={User}
          />
          <Input 
            label="Email Address" 
            type="email"
            placeholder="Enter your email"
            icon={Mail}
          />
          <Input 
            label="Phone Number" 
            placeholder="Enter your phone"
          />
          <Button icon={Save}>Save Changes</Button>
        </Card>
        
        <Card title="Change Password" subtitle="Update your password">
          <Input 
            label="Current Password" 
            type="password"
            placeholder="Enter current password"
            icon={Lock}
          />
          <Input 
            label="New Password" 
            type="password"
            placeholder="Enter new password"
            icon={Lock}
          />
          <Input 
            label="Confirm Password" 
            type="password"
            placeholder="Confirm new password"
            icon={Lock}
          />
          <Button icon={Save}>Update Password</Button>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
