"use client";
import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/src/components/ui/dialog";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { db, auth } from "@/src/lib/firebase";
import { doc, deleteDoc } from "firebase/firestore";
import { deleteUser, EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function DeleteAccountSection() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [password, setPassword] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const router = useRouter();
  const handleDeleteAccount = async () => {
    if (confirmText !== "delete") return;
    if (!password.trim()) {
      toast.error("Please enter your password to confirm.");
      return;
    }

    setIsDeleting(true);
    try {
      if (!auth.currentUser) {
        throw new Error("No user is currently authenticated.");
      }

      const user = auth.currentUser;

      // Re-authenticate user before deletion
      if (user.email) {
        const credential = EmailAuthProvider.credential(user.email, password);
        await reauthenticateWithCredential(user, credential);
      }

      // Delete user data from Firestore
      const userDocRef = doc(db, "users", user.uid);
      await deleteDoc(userDocRef);

      // Delete the user from Firebase Authentication
      await deleteUser(user);

      // Show a success message and close the dialog
      setIsDialogOpen(false);
      toast.success("Your account has been successfully deleted.");

      // Redirect user to home page
      setTimeout(() => {
        router.push("/");
      }, 100);
    } catch (error: unknown) {
      console.error("Error deleting account:", error);

      // Handle specific Firebase errors
      const firebaseError = error as { code?: string; message?: string };

      if (firebaseError.code === "auth/wrong-password") {
        toast.error("Incorrect password. Please try again.");
      } else if (firebaseError.code === "auth/requires-recent-login") {
        toast.error("Please log out and log back in, then try again.");
      } else if (firebaseError.code === "auth/invalid-credential") {
        toast.error("Invalid credentials. Please check your password.");
      } else {
        toast.error("There was an error deleting your account. Please try again.");
      }
    } finally {
      setIsDeleting(false);
      setConfirmText("");
      setPassword("");
    }
  };
  return (
    <>
      <Card className="border-destructive/20 bg-white dark:bg-gray-800 shadow">
        <CardHeader className="border-b border-border/40 px-4 md:px-6">
          <CardTitle className="text-lg md:text-xl text-destructive flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 md:h-5 md:w-5" />
            Delete Account
          </CardTitle>
          <CardDescription className="text-sm text-gray-600 dark:text-gray-400">Once you delete your account, there is no going back. Please be certain.</CardDescription>
        </CardHeader>
        <CardContent className="pt-6 px-4 md:px-6">
          <p className="text-sm text-muted-foreground mb-4">Deleting your account will:</p>
          <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 mb-6">
            <li>Permanently remove all your personal information</li>
            <li>Delete all your service history and records</li>
            <li>Cancel any pending service requests</li>
            <li>Remove access to all PUSCOM services</li>
          </ul>
        </CardContent>
        <CardFooter className="border-t border-border/40 pt-6 px-4 md:px-6">
          <Button variant="destructive" onClick={() => setIsDialogOpen(true)} className="w-full sm:w-auto">
            Delete Account
          </Button>
        </CardFooter>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-[95vw] sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-destructive text-lg md:text-xl">Are you absolutely sure?</DialogTitle>
            <DialogDescription className="text-sm">This action cannot be undone. This will permanently delete your account and remove all your data from our servers.</DialogDescription>
          </DialogHeader>{" "}
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">
                Enter your password to confirm
              </Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Your password" className="w-full text-sm md:text-base" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm" className="text-sm font-medium">
                To confirm, type <span className="font-semibold">delete</span> in the field below
              </Label>
              <Input id="confirm" value={confirmText} onChange={(e) => setConfirmText(e.target.value)} placeholder="delete" className="w-full text-sm md:text-base" />
            </div>
          </div>
          <DialogFooter className="flex-col-reverse sm:flex-row gap-2">
            {" "}
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsDialogOpen(false);
                setConfirmText("");
                setPassword("");
              }}
              className="w-full sm:w-auto">
              Cancel
            </Button>
            <Button type="button" variant="destructive" disabled={confirmText !== "delete" || !password.trim() || isDeleting} onClick={handleDeleteAccount} className="w-full sm:w-auto">
              {isDeleting ? "Deleting..." : "Delete Account"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
