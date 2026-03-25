import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Mail, Shield } from "lucide-react";

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
  onLogin: () => void;
}

function GoogleIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Google"
    >
      <title>Google</title>
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}

export function AuthModal({ open, onClose, onLogin }: AuthModalProps) {
  const handleLogin = () => {
    onClose();
    onLogin();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent
        className="sm:max-w-[400px] rounded-2xl p-8"
        data-ocid="auth.modal"
      >
        <DialogHeader className="text-center pb-2">
          <div className="flex justify-center mb-3">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-2xl">🐾</span>
            </div>
          </div>
          <DialogTitle className="text-xl font-extrabold text-center">
            Sign in to <span className="text-primary">Richie</span>Story
          </DialogTitle>
          <p className="text-sm text-muted-foreground text-center mt-1">
            Choose how you&apos;d like to continue
          </p>
        </DialogHeader>

        <div className="flex flex-col gap-3 mt-2">
          {/* Google */}
          <button
            type="button"
            onClick={handleLogin}
            className="flex items-center gap-3 w-full px-4 py-3 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md hover:bg-gray-50 transition-all font-medium text-gray-700 text-sm"
            data-ocid="auth.google.button"
          >
            <GoogleIcon />
            <span>Continue with Google</span>
          </button>

          {/* Mail */}
          <button
            type="button"
            onClick={handleLogin}
            className="flex items-center gap-3 w-full px-4 py-3 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md hover:bg-gray-50 transition-all font-medium text-gray-700 text-sm"
            data-ocid="auth.mail.button"
          >
            <div className="w-5 h-5 flex items-center justify-center text-blue-500">
              <Mail className="w-5 h-5" />
            </div>
            <span>Continue with Mail</span>
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 my-1">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted-foreground">or</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* Internet Identity */}
          <Button
            variant="ghost"
            onClick={handleLogin}
            className="w-full rounded-xl gap-2 text-muted-foreground hover:text-foreground text-sm font-medium"
            data-ocid="auth.ii.button"
          >
            <Shield className="w-4 h-4" />
            Continue with Internet Identity
          </Button>
        </div>

        <p className="text-xs text-muted-foreground text-center mt-4 leading-relaxed">
          All options use Internet Identity for secure sign-in
        </p>
      </DialogContent>
    </Dialog>
  );
}
