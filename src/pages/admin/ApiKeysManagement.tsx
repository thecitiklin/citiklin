import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Key, Eye, EyeOff, Save, RefreshCw, Shield, CreditCard, Mail, MessageSquare } from 'lucide-react';

interface ApiKey {
  id: string;
  service_name: string;
  display_name: string;
  key_value: string;
  key_type: string;
  is_active: boolean;
  updated_at: string;
}

const serviceIcons: Record<string, React.ReactNode> = {
  mpesa: <CreditCard className="h-4 w-4" />,
  stripe: <CreditCard className="h-4 w-4" />,
  paypal: <CreditCard className="h-4 w-4" />,
  dpo: <CreditCard className="h-4 w-4" />,
  resend: <Mail className="h-4 w-4" />,
  whatsapp: <MessageSquare className="h-4 w-4" />,
};

const getServiceIcon = (serviceName: string) => {
  const prefix = serviceName.split('_')[0];
  return serviceIcons[prefix] || <Key className="h-4 w-4" />;
};

const keyTypeColors: Record<string, string> = {
  restricted: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200',
  secret: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  publishable: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
};

const maskKey = (key: string): string => {
  if (!key || key.length < 8) return '••••••••';
  return `${key.substring(0, 4)}${'•'.repeat(Math.min(20, key.length - 8))}${key.substring(key.length - 4)}`;
};

export default function ApiKeysManagement() {
  const { toast } = useToast();
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set());
  const [editingKey, setEditingKey] = useState<ApiKey | null>(null);
  const [newKeyValue, setNewKeyValue] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const fetchApiKeys = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('api_keys')
        .select('*')
        .order('display_name');

      if (error) throw error;
      setApiKeys(data || []);
    } catch (error) {
      console.error('Error fetching API keys:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to fetch API keys. Make sure you have admin access.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchApiKeys();
  }, []);

  const toggleKeyVisibility = (keyId: string) => {
    setVisibleKeys((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(keyId)) {
        newSet.delete(keyId);
      } else {
        newSet.add(keyId);
      }
      return newSet;
    });
  };

  const handleEditKey = (key: ApiKey) => {
    setEditingKey(key);
    setNewKeyValue(key.key_value);
  };

  const handleSaveKey = async () => {
    if (!editingKey) return;

    try {
      setIsSaving(true);
      const { error } = await supabase
        .from('api_keys')
        .update({
          key_value: newKeyValue,
          is_active: newKeyValue.length > 0,
        })
        .eq('id', editingKey.id);

      if (error) throw error;

      setApiKeys((prev) =>
        prev.map((key) =>
          key.id === editingKey.id
            ? { ...key, key_value: newKeyValue, is_active: newKeyValue.length > 0 }
            : key
        )
      );

      toast({
        title: 'API Key Updated',
        description: `${editingKey.display_name} has been updated successfully.`,
      });

      setEditingKey(null);
      setNewKeyValue('');
    } catch (error) {
      console.error('Error updating API key:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to update API key',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleActive = async (key: ApiKey) => {
    if (!key.key_value) {
      toast({
        variant: 'destructive',
        title: 'Cannot Activate',
        description: 'Please add a key value before activating.',
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('api_keys')
        .update({ is_active: !key.is_active })
        .eq('id', key.id);

      if (error) throw error;

      setApiKeys((prev) =>
        prev.map((k) =>
          k.id === key.id ? { ...k, is_active: !k.is_active } : k
        )
      );

      toast({
        title: key.is_active ? 'Key Deactivated' : 'Key Activated',
        description: `${key.display_name} is now ${key.is_active ? 'inactive' : 'active'}.`,
      });
    } catch (error) {
      console.error('Error toggling API key:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to update API key status',
      });
    }
  };

  const groupedKeys = apiKeys.reduce((acc, key) => {
    const prefix = key.service_name.split('_')[0];
    const groupName = {
      mpesa: 'M-Pesa (Daraja API)',
      stripe: 'Stripe',
      paypal: 'PayPal',
      dpo: 'DPO Pay',
      resend: 'Email (Resend)',
      whatsapp: 'WhatsApp Business',
    }[prefix] || 'Other';

    if (!acc[groupName]) acc[groupName] = [];
    acc[groupName].push(key);
    return acc;
  }, {} as Record<string, ApiKey[]>);

  const stats = {
    total: apiKeys.length,
    active: apiKeys.filter((k) => k.is_active).length,
    inactive: apiKeys.filter((k) => !k.is_active).length,
    configured: apiKeys.filter((k) => k.key_value).length,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">API Keys Management</h1>
          <p className="text-muted-foreground">Manage integration credentials securely</p>
        </div>
        <Button variant="outline" onClick={fetchApiKeys} disabled={isLoading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Keys</CardTitle>
            <Key className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
            <Shield className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.active}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inactive</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-muted-foreground">{stats.inactive}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Configured</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.configured}</div>
          </CardContent>
        </Card>
      </div>

      {/* API Keys by Service */}
      {Object.entries(groupedKeys).map(([groupName, keys]) => (
        <Card key={groupName}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {getServiceIcon(keys[0].service_name)}
              {groupName}
            </CardTitle>
            <CardDescription>
              Manage {groupName} API credentials
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Key Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Updated</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {keys.map((key) => (
                    <TableRow key={key.id}>
                      <TableCell className="font-medium">{key.display_name}</TableCell>
                      <TableCell>
                        <Badge className={keyTypeColors[key.key_type]}>
                          {key.key_type}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        <div className="flex items-center gap-2">
                          <span>
                            {visibleKeys.has(key.id)
                              ? key.key_value || 'Not configured'
                              : maskKey(key.key_value)}
                          </span>
                          {key.key_value && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleKeyVisibility(key.id)}
                            >
                              {visibleKeys.has(key.id) ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </Button>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Switch
                          checked={key.is_active}
                          onCheckedChange={() => handleToggleActive(key)}
                        />
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(key.updated_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditKey(key)}
                        >
                          {key.key_value ? 'Update' : 'Add Key'}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Edit Key Dialog */}
      <Dialog open={!!editingKey} onOpenChange={() => setEditingKey(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingKey?.key_value ? 'Update' : 'Add'} {editingKey?.display_name}
            </DialogTitle>
            <DialogDescription>
              Enter the API key value. This will be stored securely and only accessible to admins.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="keyValue">API Key Value</Label>
              <Input
                id="keyValue"
                type="password"
                value={newKeyValue}
                onChange={(e) => setNewKeyValue(e.target.value)}
                placeholder="Enter API key..."
              />
            </div>
            <p className="text-sm text-muted-foreground">
              Key type: <Badge className={keyTypeColors[editingKey?.key_type || 'restricted']}>{editingKey?.key_type}</Badge>
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingKey(null)}>
              Cancel
            </Button>
            <Button onClick={handleSaveKey} disabled={isSaving}>
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? 'Saving...' : 'Save Key'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
