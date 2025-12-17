import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Plus, Pencil, Trash2, Building2 } from 'lucide-react';

interface Department {
  id: string;
  name: string;
  description: string | null;
  manager_id: string | null;
  created_at: string;
  updated_at: string;
}

export default function DepartmentManagement() {
  const { toast } = useToast();
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });

  const fetchDepartments = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('departments')
        .select('*')
        .order('name');

      if (error) throw error;
      setDepartments(data || []);
    } catch (error) {
      console.error('Error fetching departments:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to fetch departments',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingDepartment) {
        const { error } = await supabase
          .from('departments')
          .update({
            name: formData.name,
            description: formData.description || null,
          })
          .eq('id', editingDepartment.id);

        if (error) throw error;

        toast({
          title: 'Department Updated',
          description: 'Department has been updated successfully.',
        });
      } else {
        const { error } = await supabase
          .from('departments')
          .insert({
            name: formData.name,
            description: formData.description || null,
          });

        if (error) throw error;

        toast({
          title: 'Department Created',
          description: 'New department has been created successfully.',
        });
      }

      setIsDialogOpen(false);
      setEditingDepartment(null);
      setFormData({ name: '', description: '' });
      fetchDepartments();
    } catch (error: any) {
      console.error('Error saving department:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Failed to save department',
      });
    }
  };

  const handleEdit = (department: Department) => {
    setEditingDepartment(department);
    setFormData({
      name: department.name,
      description: department.description || '',
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this department?')) return;

    try {
      const { error } = await supabase
        .from('departments')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Department Deleted',
        description: 'Department has been deleted successfully.',
      });
      fetchDepartments();
    } catch (error) {
      console.error('Error deleting department:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to delete department',
      });
    }
  };

  const openNewDialog = () => {
    setEditingDepartment(null);
    setFormData({ name: '', description: '' });
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Department Management</h1>
          <p className="text-muted-foreground">Manage organizational departments</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openNewDialog}>
              <Plus className="mr-2 h-4 w-4" />
              Add Department
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingDepartment ? 'Edit Department' : 'Create Department'}
              </DialogTitle>
              <DialogDescription>
                {editingDepartment
                  ? 'Update the department details below.'
                  : 'Fill in the details to create a new department.'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Department Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, name: e.target.value }))
                    }
                    placeholder="e.g., Operations"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, description: e.target.value }))
                    }
                    placeholder="Brief description of the department..."
                    rows={3}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingDepartment ? 'Update' : 'Create'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Departments</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{departments.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Departments Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Departments</CardTitle>
          <CardDescription>
            View and manage all departments in the organization
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Updated</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      Loading departments...
                    </TableCell>
                  </TableRow>
                ) : departments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      No departments found. Create your first department.
                    </TableCell>
                  </TableRow>
                ) : (
                  departments.map((dept) => (
                    <TableRow key={dept.id}>
                      <TableCell className="font-medium">{dept.name}</TableCell>
                      <TableCell className="max-w-xs truncate">
                        {dept.description || '-'}
                      </TableCell>
                      <TableCell>
                        {new Date(dept.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {new Date(dept.updated_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(dept)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(dept.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
