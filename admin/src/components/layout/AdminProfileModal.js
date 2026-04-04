import React from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import { Download, User } from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { downloadAdminProfilePdf } from '../../utils/pdfExport';

const ORG = 'Delvonza Exim';

const AdminProfileModal = ({ isOpen, onClose }) => {
  const { adminEmail } = useAdminAuth();

  const handlePdf = () => {
    downloadAdminProfilePdf({ email: adminEmail, organization: ORG });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Admin profile" size="md">
      <div className="flex flex-col items-center text-center sm:flex-row sm:items-start sm:text-left gap-6">
        <div className="w-16 h-16 shrink-0 bg-primary-600 rounded-full flex items-center justify-center">
          <User className="w-8 h-8 text-white" aria-hidden />
        </div>
        <div className="flex-1 space-y-2 text-sm text-gray-700">
          <p>
            <span className="font-semibold text-gray-900">Organization:</span> {ORG}
          </p>
          <p>
            <span className="font-semibold text-gray-900">Role:</span> Administrator
          </p>
          <p>
            <span className="font-semibold text-gray-900">Email:</span> {adminEmail}
          </p>
          <p className="text-xs text-gray-500 pt-2">
            This panel uses a secure session. Log out from the sidebar when finished on a shared device.
          </p>
        </div>
      </div>
      <div className="flex flex-wrap gap-3 justify-end mt-8 pt-4 border-t">
        <Button type="button" variant="secondary" onClick={onClose}>
          Close
        </Button>
        <Button type="button" icon={Download} onClick={handlePdf}>
          Download PDF
        </Button>
      </div>
    </Modal>
  );
};

export default AdminProfileModal;
