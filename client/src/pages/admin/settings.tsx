import { useState, useEffect } from "react";
import { Route, Switch, Link, useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { usersApi, departmentsApi, positionsApi, jobsApi } from "@/lib/mockApi";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { 
  Plus, 
  Pencil, 
  Trash2, 
  Loader2,
  Users,
  Building2,
  Briefcase,
  ClipboardList,
  ArrowLeft
} from "lucide-react";
import type { User, Department, Position, Job, JobWithDetails } from "@shared/schema";

// Schemas
const userSchema = z.object({
  fullName: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email required"),
  phone: z.string().optional(),
  role: z.enum(["candidate", "admin", "manager"]),
  password: z.string().min(6, "Password must be at least 6 characters")
});

const departmentSchema = z.object({
  name: z.string().min(2, "Department name is required")
});

const positionSchema = z.object({
  name: z.string().min(2, "Position name is required"),
  departmentId: z.string().min(1, "Department is required")
});

type UserForm = z.infer<typeof userSchema>;
type DepartmentForm = z.infer<typeof departmentSchema>;
type PositionForm = z.infer<typeof positionSchema>;

// Users Tab Component
function UsersTab() {
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const form = useForm<UserForm>({
    resolver: zodResolver(userSchema),
    defaultValues: { fullName: "", email: "", phone: "", role: "candidate", password: "" }
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const data = await usersApi.getAll();
    setUsers(data);
    setIsLoading(false);
  };

  const handleSubmit = async (data: UserForm) => {
    setIsSaving(true);
    try {
      await usersApi.create({ ...data, id: "" });
      await loadData();
      setDialogOpen(false);
      form.reset();
      toast({ title: "User created", description: "New user has been added." });
    } catch (error) {
      toast({ title: "Error", description: "Failed to create user", variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await usersApi.delete(id);
      await loadData();
      toast({ title: "User deleted", description: "User has been removed." });
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete user", variant: "destructive" });
    }
  };

  if (isLoading) return <Skeleton className="h-64 w-full" />;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold">System Users</h3>
        <Button onClick={() => setDialogOpen(true)} data-testid="button-add-user">
          <Plus className="w-4 h-4 mr-2" />
          Add User
        </Button>
      </div>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.fullName}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{user.role}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(user.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name *</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email *</FormLabel>
                    <FormControl><Input type="email" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="candidate">Candidate</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="manager">Manager</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password *</FormLabel>
                    <FormControl><Input type="password" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={isSaving}>
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Add User"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Departments Tab Component
function DepartmentsTab() {
  const { toast } = useToast();
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const form = useForm<DepartmentForm>({
    resolver: zodResolver(departmentSchema),
    defaultValues: { name: "" }
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const data = await departmentsApi.getAll();
    setDepartments(data);
    setIsLoading(false);
  };

  const handleSubmit = async (data: DepartmentForm) => {
    setIsSaving(true);
    try {
      await departmentsApi.create(data);
      await loadData();
      setDialogOpen(false);
      form.reset();
      toast({ title: "Department created", description: "New department has been added." });
    } catch (error) {
      toast({ title: "Error", description: "Failed to create department", variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await departmentsApi.delete(id);
      await loadData();
      toast({ title: "Department deleted", description: "Department has been removed." });
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete department", variant: "destructive" });
    }
  };

  if (isLoading) return <Skeleton className="h-64 w-full" />;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold">Departments</h3>
        <Button onClick={() => setDialogOpen(true)} data-testid="button-add-department">
          <Plus className="w-4 h-4 mr-2" />
          Add Department
        </Button>
      </div>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Department Name</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {departments.map((dept) => (
                <TableRow key={dept.id}>
                  <TableCell className="font-medium">{dept.name}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(dept.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Department</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Department Name *</FormLabel>
                    <FormControl><Input placeholder="e.g., Engineering" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={isSaving}>
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Add Department"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Positions Tab Component
function PositionsTab() {
  const { toast } = useToast();
  const [positions, setPositions] = useState<Position[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const form = useForm<PositionForm>({
    resolver: zodResolver(positionSchema),
    defaultValues: { name: "", departmentId: "" }
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [posData, deptData] = await Promise.all([
      positionsApi.getAll(),
      departmentsApi.getAll()
    ]);
    setPositions(posData);
    setDepartments(deptData);
    setIsLoading(false);
  };

  const getDepartmentName = (id: string | null) => {
    return departments.find(d => d.id === id)?.name || "N/A";
  };

  const handleSubmit = async (data: PositionForm) => {
    setIsSaving(true);
    try {
      await positionsApi.create(data);
      await loadData();
      setDialogOpen(false);
      form.reset();
      toast({ title: "Position created", description: "New position has been added." });
    } catch (error) {
      toast({ title: "Error", description: "Failed to create position", variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await positionsApi.delete(id);
      await loadData();
      toast({ title: "Position deleted", description: "Position has been removed." });
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete position", variant: "destructive" });
    }
  };

  if (isLoading) return <Skeleton className="h-64 w-full" />;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold">Positions</h3>
        <Button onClick={() => setDialogOpen(true)} data-testid="button-add-position">
          <Plus className="w-4 h-4 mr-2" />
          Add Position
        </Button>
      </div>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Position Name</TableHead>
                <TableHead>Department</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {positions.map((pos) => (
                <TableRow key={pos.id}>
                  <TableCell className="font-medium">{pos.name}</TableCell>
                  <TableCell>{getDepartmentName(pos.departmentId)}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(pos.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Position</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Position Name *</FormLabel>
                    <FormControl><Input placeholder="e.g., Software Engineer" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="departmentId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Department *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger><SelectValue placeholder="Select department" /></SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {departments.map((dept) => (
                          <SelectItem key={dept.id} value={dept.id}>{dept.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={isSaving}>
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Add Position"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Jobs Tab Component
function JobsTab() {
  const { toast } = useToast();
  const [jobs, setJobs] = useState<JobWithDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const data = await jobsApi.getAll();
    setJobs(data);
    setIsLoading(false);
  };

  const handleDelete = async (id: string) => {
    try {
      await jobsApi.delete(id);
      await loadData();
      toast({ title: "Job deleted", description: "Job posting has been removed." });
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete job", variant: "destructive" });
    }
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleDateString();
  };

  if (isLoading) return <Skeleton className="h-64 w-full" />;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold">Job Postings</h3>
        <Link href="/admin/settings/jobs/new">
          <Button data-testid="button-add-job">
            <Plus className="w-4 h-4 mr-2" />
            Add Job
          </Button>
        </Link>
      </div>
      <Card>
        <CardContent className="p-0">
          <ScrollArea className="w-full">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>No</TableHead>
                  <TableHead>Job Title</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Min Education</TableHead>
                  <TableHead>Close Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {jobs.map((job, index) => (
                  <TableRow key={job.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell className="font-medium">{job.title}</TableCell>
                    <TableCell>{job.department?.name || "N/A"}</TableCell>
                    <TableCell>{job.position?.name || "N/A"}</TableCell>
                    <TableCell>{job.minEducation || "N/A"}</TableCell>
                    <TableCell>{formatDate(job.closeDate)}</TableCell>
                    <TableCell>
                      <Badge className={job.status === "Active" 
                        ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300" 
                        : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                      }>
                        {job.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(job.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}

// Main Settings Page
export default function AdminSettingsPage() {
  const [location] = useLocation();
  
  const getActiveTab = () => {
    if (location.includes("/users")) return "users";
    if (location.includes("/departments")) return "departments";
    if (location.includes("/positions")) return "positions";
    if (location.includes("/jobs")) return "jobs";
    return "users";
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Settings</h1>
        <p className="text-muted-foreground">
          Manage users, departments, positions, and jobs
        </p>
      </div>

      <Tabs value={getActiveTab()} className="w-full">
        <TabsList className="mb-6">
          <Link href="/admin/settings/users">
            <TabsTrigger value="users" className="gap-2" data-testid="tab-users">
              <Users className="w-4 h-4" />
              Users
            </TabsTrigger>
          </Link>
          <Link href="/admin/settings/departments">
            <TabsTrigger value="departments" className="gap-2" data-testid="tab-departments">
              <Building2 className="w-4 h-4" />
              Departments
            </TabsTrigger>
          </Link>
          <Link href="/admin/settings/positions">
            <TabsTrigger value="positions" className="gap-2" data-testid="tab-positions">
              <ClipboardList className="w-4 h-4" />
              Positions
            </TabsTrigger>
          </Link>
          <Link href="/admin/settings/jobs">
            <TabsTrigger value="jobs" className="gap-2" data-testid="tab-jobs">
              <Briefcase className="w-4 h-4" />
              Jobs
            </TabsTrigger>
          </Link>
        </TabsList>

        <TabsContent value="users"><UsersTab /></TabsContent>
        <TabsContent value="departments"><DepartmentsTab /></TabsContent>
        <TabsContent value="positions"><PositionsTab /></TabsContent>
        <TabsContent value="jobs"><JobsTab /></TabsContent>
      </Tabs>
    </div>
  );
}
