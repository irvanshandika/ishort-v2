"use client";
import React, { useEffect, useState, useMemo } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/navigation";
import { auth, db } from "@/src/lib/firebase";
import { doc, getDoc, collection, getDocs, updateDoc, addDoc, deleteDoc, query, where, Timestamp } from "firebase/firestore";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/src/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/src/components/ui/avatar";
import { User, Shield, Ban, Search, Trash2 } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { format } from "date-fns";
import toast from "react-hot-toast";

type AllowedRole = "admin";

interface UserData {
  uid: string;
  displayName: string;
  email: string;
  photoUrl?: string;
  role: "admin" | "user";
  plan: "free" | "pro";
  status: "active" | "banned";
  signType: "credential" | "google";
  createdAt: Timestamp | Date | string;
  bannedUntil?: Timestamp | Date | string;
  bannedReason?: string;
}

// Helper function to safely convert dates
const formatDate = (dateInput: Timestamp | Date | string | undefined): string => {
  if (!dateInput) return "-";

  try {
    let date: Date;

    if (typeof dateInput === "string") {
      date = new Date(dateInput);
    } else if (dateInput instanceof Date) {
      date = dateInput;
    } else if (dateInput && typeof dateInput === "object" && "toDate" in dateInput) {
      // Firestore Timestamp
      date = (dateInput as Timestamp).toDate();
    } else {
      return "-";
    }

    return format(date, "dd MMM yyyy");
  } catch {
    return "-";
  }
};

function DashboardUsers() {
  const [user, loading] = useAuthState(auth);
  const [userRole, setUserRole] = useState<string>("");
  const [checkingRole, setCheckingRole] = useState(true);
  const [users, setUsers] = useState<UserData[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserData[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [banDialogOpen, setBanDialogOpen] = useState(false);
  const [banType, setBanType] = useState<"temporary" | "permanent">("temporary");
  const [banDuration, setBanDuration] = useState("1");
  const [banUnit, setBanUnit] = useState<"hours" | "days" | "months" | "years">("days");
  const [banReason, setBanReason] = useState("");
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedUserForDelete, setSelectedUserForDelete] = useState<UserData | null>(null);
  const router = useRouter();

  const allowedRole = useMemo(() => ["admin"] as AllowedRole[], []);

  // Check user role
  useEffect(() => {
    const checkUserRole = async () => {
      if (user) {
        try {
          const userRef = doc(db, "users", user.uid);
          const userSnap = await getDoc(userRef);

          if (userSnap.exists()) {
            const userData = userSnap.data();
            setUserRole(userData.role);

            if (!allowedRole.includes(userData.role as AllowedRole)) {
              router.push("/forbidden");
            }
          } else {
            router.push("/forbidden");
          }
        } catch (error) {
          console.error("Error checking user role:", error);
          router.push("/forbidden");
        } finally {
          setCheckingRole(false);
        }
      }
    };

    if (user) {
      checkUserRole();
    } else if (!loading) {
      router.push("/auth/signin");
    }
  }, [user, loading, router, allowedRole]);

  // Fetch all users
  useEffect(() => {
    if (userRole === "admin") {
      fetchUsers();
    }
  }, [userRole]);
  // Filter users based on search term
  useEffect(() => {
    if (searchTerm) {
      const filtered = users.filter((user) => {
        const displayName = user.displayName || "";
        const email = user.email || "";
        return displayName.toLowerCase().includes(searchTerm.toLowerCase()) || email.toLowerCase().includes(searchTerm.toLowerCase());
      });
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers(users);
    }
  }, [searchTerm, users]);
  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const usersCollection = collection(db, "users");
      const usersSnapshot = await getDocs(usersCollection);

      const usersList: UserData[] = usersSnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          uid: doc.id,
          displayName: data.displayName || data.email || "Unknown User",
          email: data.email || "",
          photoUrl: data.photoUrl || "",
          role: data.role || "user",
          plan: data.plan || "free",
          status: data.status || "active",
          signType: data.signType || "credential",
          createdAt: data.createdAt || new Date(),
          bannedUntil: data.bannedUntil,
          bannedReason: data.bannedReason,
        };
      }) as UserData[];

      setUsers(usersList);
      setFilteredUsers(usersList);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Gagal mengambil data pengguna");
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleRoleChange = async (userId: string, newRole: "admin" | "user") => {
    try {
      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, { role: newRole });

      toast.success(`Role berhasil diubah menjadi ${newRole}`);
      fetchUsers();
    } catch (error) {
      console.error("Error updating role:", error);
      toast.error("Gagal mengubah role");
    }
  };

  const handlePlanChange = async (userId: string, newPlan: "free" | "pro") => {
    try {
      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, { plan: newPlan });

      toast.success(`Plan berhasil diubah menjadi ${newPlan}`);
      fetchUsers();
    } catch (error) {
      console.error("Error updating plan:", error);
      toast.error("Gagal mengubah plan");
    }
  };
  const handleBanUser = async () => {
    if (!selectedUser) return;

    try {
      const userRef = doc(db, "users", selectedUser.uid);
      const updateData: Record<string, string | Date | boolean | null> = {
        status: "banned",
        bannedReason: banReason || "No reason provided",
      };

      if (banType === "permanent") {
        // Add to restricted accounts collection for permanent ban
        await addDoc(collection(db, "restrict_account"), {
          uid: selectedUser.uid,
          email: selectedUser.email,
          displayName: selectedUser.displayName,
          bannedAt: new Date(),
          bannedBy: user?.uid || "system",
          reason: banReason || "No reason provided",
          permanent: true,
        });
      } else {
        // Calculate ban end date for temporary ban
        const now = new Date();
        const duration = parseInt(banDuration);
        const bannedUntil = new Date(now);

        switch (banUnit) {
          case "hours":
            bannedUntil.setHours(now.getHours() + duration);
            break;
          case "days":
            bannedUntil.setDate(now.getDate() + duration);
            break;
          case "months":
            bannedUntil.setMonth(now.getMonth() + duration);
            break;
          case "years":
            bannedUntil.setFullYear(now.getFullYear() + duration);
            break;
        }

        updateData.bannedUntil = bannedUntil;
      }

      await updateDoc(userRef, updateData);

      toast.success(`Pengguna berhasil di-ban ${banType === "permanent" ? "permanen" : "sementara"}`);
      setBanDialogOpen(false);
      setSelectedUser(null);
      setBanReason("");
      fetchUsers();
    } catch (error) {
      console.error("Error banning user:", error);
      toast.error("Gagal mem-ban pengguna");
    }
  };
  const handleUnbanUser = async (userId: string) => {
    try {
      console.log("Starting unban process for user:", userId);

      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, {
        status: "active",
        bannedUntil: null,
        bannedReason: null,
      });
      console.log("User status updated to active");

      // Remove from restricted accounts if exists
      const restrictedQuery = query(collection(db, "restrict_account"), where("uid", "==", userId));
      const restrictedSnapshot = await getDocs(restrictedQuery);

      if (restrictedSnapshot.docs.length > 0) {
        const deletePromises = restrictedSnapshot.docs.map((doc) => deleteDoc(doc.ref));
        await Promise.all(deletePromises);
        console.log(`Removed ${restrictedSnapshot.docs.length} records from restrict_account collection`);
      }

      console.log("Unban process completed successfully");
      toast.success("Pengguna berhasil di-unban");
      fetchUsers();
    } catch (error) {
      console.error("Error unbanning user:", error);
      toast.error(`Gagal meng-unban pengguna: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  };
  const handleDeleteUser = async () => {
    if (!selectedUserForDelete) return;

    try {
      console.log("Starting deletion process for user:", selectedUserForDelete.uid);

      // Delete user from users collection
      const userRef = doc(db, "users", selectedUserForDelete.uid);
      await deleteDoc(userRef);
      console.log("User document deleted from users collection");

      // Also remove from restricted accounts if exists
      const restrictedQuery = query(collection(db, "restrict_account"), where("uid", "==", selectedUserForDelete.uid));
      const restrictedSnapshot = await getDocs(restrictedQuery);

      if (restrictedSnapshot.docs.length > 0) {
        const restrictedDeletePromises = restrictedSnapshot.docs.map((doc) => deleteDoc(doc.ref));
        await Promise.all(restrictedDeletePromises);
        console.log(`Deleted ${restrictedSnapshot.docs.length} records from restrict_account collection`);
      }

      // Delete user's URLs if any
      const urlsQuery = query(collection(db, "shorturls"), where("uid", "==", selectedUserForDelete.uid));
      const urlsSnapshot = await getDocs(urlsQuery);

      if (urlsSnapshot.docs.length > 0) {
        const urlDeletePromises = urlsSnapshot.docs.map((doc) => deleteDoc(doc.ref));
        await Promise.all(urlDeletePromises);
        console.log(`Deleted ${urlsSnapshot.docs.length} URLs from shorturls collection`);
      }

      console.log("User deletion completed successfully");
      toast.success("Pengguna berhasil dihapus secara permanen");
      setDeleteDialogOpen(false);
      setSelectedUserForDelete(null);
      fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error(`Gagal menghapus pengguna: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  };

  const getAccountTypeIcon = (signType: string) => {
    return signType === "google" ? <FcGoogle className="w-4 h-4" /> : <User className="w-4 h-4" />;
  };

  const getStatusBadge = (userData: UserData) => {
    if (userData.status === "banned") {
      return <Badge variant="destructive">Banned</Badge>;
    }
    return (
      <Badge variant="default" className="bg-green-500">
        Active
      </Badge>
    );
  };

  if (loading || checkingRole) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl font-semibold">Memeriksa hak akses...</p>
      </div>
    );
  }

  if (!allowedRole.includes(userRole as AllowedRole)) {
    router.push("/forbidden");
    return null;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Manajemen Pengguna</h1>
          <p className="text-gray-600 dark:text-gray-400">Kelola semua pengguna dan hak akses mereka</p>
        </div>
        <Badge variant="outline" className="flex items-center gap-2">
          <Shield className="w-4 h-4" />
          Admin Panel
        </Badge>
      </div>
      {/* Search Bar */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            Cari Pengguna
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <Input placeholder="Cari berdasarkan nama atau email..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
            <Button onClick={fetchUsers} disabled={loadingUsers}>
              {loadingUsers ? "Memuat..." : "Refresh"}
            </Button>
          </div>
        </CardContent>
      </Card>
      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Daftar Pengguna ({filteredUsers.length})</CardTitle>
          <CardDescription>Kelola role, plan, dan status akun pengguna</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Pengguna</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Jenis Akun</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Bergabung</TableHead>
                  <TableHead>Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((userData) => (
                  <TableRow key={userData.uid}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={userData.photoUrl} />
                          <AvatarFallback>{userData.displayName?.charAt(0)?.toUpperCase() || userData.email?.charAt(0)?.toUpperCase() || "U"}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{userData.displayName || userData.email || "Unknown User"}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{userData.email}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getAccountTypeIcon(userData.signType)}
                        <span className="capitalize">{userData.signType}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Select value={userData.role} onValueChange={(value) => handleRoleChange(userData.uid, value as "admin" | "user")}>
                        <SelectTrigger className="w-24">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="user">User</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Select value={userData.plan} onValueChange={(value) => handlePlanChange(userData.uid, value as "free" | "pro")}>
                        <SelectTrigger className="w-20">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="free">Free</SelectItem>
                          <SelectItem value="pro">Pro</SelectItem>
                        </SelectContent>{" "}
                      </Select>
                    </TableCell>
                    <TableCell>{getStatusBadge(userData)}</TableCell>
                    <TableCell>{formatDate(userData.createdAt)}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        {userData.status === "banned" ? (
                          <Button size="sm" variant="outline" onClick={() => handleUnbanUser(userData.uid)}>
                            Unban
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => {
                              setSelectedUser(userData);
                              setBanDialogOpen(true);
                            }}>
                            <Ban className="w-4 h-4" />
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => {
                            setSelectedUserForDelete(userData);
                            setDeleteDialogOpen(true);
                          }}
                          className="bg-red-600 hover:bg-red-700">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      {/* Ban User Dialog */}
      <Dialog open={banDialogOpen} onOpenChange={setBanDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ban Pengguna</DialogTitle>
            <DialogDescription>Anda akan mem-ban {selectedUser?.displayName}. Pilih jenis ban yang akan diterapkan.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Jenis Ban</Label>
              <Select value={banType} onValueChange={(value) => setBanType(value as "temporary" | "permanent")}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="temporary">Ban Sementara</SelectItem>
                  <SelectItem value="permanent">Ban Permanen</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {banType === "temporary" && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Durasi</Label> <Input type="number" value={banDuration} onChange={(e) => setBanDuration(e.target.value)} min="1" />
                </div>
                <div className="space-y-2">
                  <Label>Satuan</Label>
                  <Select value={banUnit} onValueChange={(value) => setBanUnit(value as "hours" | "days" | "months" | "years")}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hours">Jam</SelectItem>
                      <SelectItem value="days">Hari</SelectItem>
                      <SelectItem value="months">Bulan</SelectItem>
                      <SelectItem value="years">Tahun</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label>Alasan Ban (Opsional)</Label>
              <Input value={banReason} onChange={(e) => setBanReason(e.target.value)} placeholder="Masukkan alasan ban..." />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setBanDialogOpen(false)}>
              Batal
            </Button>{" "}
            <Button variant="destructive" onClick={handleBanUser}>
              Ban Pengguna
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>{" "}
      {/* Delete User Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hapus Pengguna Permanen</DialogTitle>
            <DialogDescription>Anda akan menghapus pengguna {selectedUserForDelete?.displayName} secara permanen. Tindakan ini tidak dapat dibatalkan.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              <p className="mb-2">Data yang akan dihapus:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Data pengguna dari database</li>
                <li>Semua URL yang dibuat pengguna</li>
                <li>Data restricted account (jika ada)</li>
              </ul>
            </div>

            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <div className="flex items-center gap-2 text-red-800 dark:text-red-200">
                <Trash2 className="w-5 h-5" />
                <span className="font-semibold">Peringatan!</span>
              </div>
              <p className="text-red-700 dark:text-red-300 mt-1">Data yang dihapus tidak dapat dikembalikan. Pastikan Anda yakin sebelum melanjutkan.</p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Batal
            </Button>
            <Button variant="destructive" onClick={handleDeleteUser} className="bg-red-600 hover:bg-red-700">
              Hapus Permanen
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default DashboardUsers;
