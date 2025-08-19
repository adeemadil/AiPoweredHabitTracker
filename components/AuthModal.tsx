// This component has been replaced by AuthScreen.tsx
// Keeping this file for backward compatibility but marking as deprecated

import { AuthScreen } from './AuthScreen';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (session: any) => void;
}

/**
 * @deprecated Use AuthScreen component instead
 */
export function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50">
      <AuthScreen 
        onSuccess={onSuccess}
        onBack={onClose}
      />
    </div>
  );
}