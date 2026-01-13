import { useState } from 'react';
import { Plus, Search, FileText, Globe, Image, Settings, MoreVertical, Edit, Trash2, Loader2, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useSiteContents, useCreateSiteContent, useUpdateSiteContent, useDeleteSiteContent, type SiteContent } from '@/hooks/useSiteContent';
import { format } from 'date-fns';

const pageOptions = [
  { value: 'home', label: 'Homepage' },
  { value: 'about', label: 'About Us' },
  { value: 'services', label: 'Services' },
  { value: 'contact', label: 'Contact' },
  { value: 'faq', label: 'FAQ' },
  { value: 'privacy', label: 'Privacy Policy' },
  { value: 'terms', label: 'Terms of Service' },
];

const sectionOptions = [
  { value: 'hero', label: 'Hero Section' },
  { value: 'features', label: 'Features' },
  { value: 'cta', label: 'Call to Action' },
  { value: 'testimonials', label: 'Testimonials' },
  { value: 'pricing', label: 'Pricing' },
  { value: 'faq', label: 'FAQ' },
  { value: 'footer', label: 'Footer' },
  { value: 'header', label: 'Header' },
  { value: 'content', label: 'Main Content' },
];

export default function ContentManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingContent, setEditingContent] = useState<SiteContent | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    page_key: '',
    section_key: '',
    title: '',
    subtitle: '',
    body: '',
    button_text: '',
    button_link: '',
    image_url: '',
    is_published: true,
  });

  const { data: contents = [], isLoading } = useSiteContents();
  const createContent = useCreateSiteContent();
  const updateContent = useUpdateSiteContent();
  const deleteContent = useDeleteSiteContent();

  const filteredContents = contents.filter((content) =>
    content.page_key.toLowerCase().includes(searchTerm.toLowerCase()) ||
    content.section_key.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Group contents by page
  const contentsByPage = filteredContents.reduce((acc, content) => {
    if (!acc[content.page_key]) {
      acc[content.page_key] = [];
    }
    acc[content.page_key].push(content);
    return acc;
  }, {} as Record<string, SiteContent[]>);

  const resetForm = () => {
    setFormData({
      page_key: '',
      section_key: '',
      title: '',
      subtitle: '',
      body: '',
      button_text: '',
      button_link: '',
      image_url: '',
      is_published: true,
    });
  };

  const handleCreate = async () => {
    const content = {
      title: formData.title,
      subtitle: formData.subtitle,
      body: formData.body,
      button_text: formData.button_text,
      button_link: formData.button_link,
      image_url: formData.image_url,
    };

    await createContent.mutateAsync({
      page_key: formData.page_key,
      section_key: formData.section_key,
      content: content,
      is_published: formData.is_published,
    });
    setIsCreateOpen(false);
    resetForm();
  };

  const handleEdit = (content: SiteContent) => {
    setEditingContent(content);
    setFormData({
      page_key: content.page_key,
      section_key: content.section_key,
      title: content.content.title || '',
      subtitle: content.content.subtitle || '',
      body: content.content.body || '',
      button_text: content.content.button_text || '',
      button_link: content.content.button_link || '',
      image_url: content.content.image_url || '',
      is_published: content.is_published,
    });
    setIsEditOpen(true);
  };

  const handleUpdate = async () => {
    if (!editingContent) return;
    
    const content = {
      title: formData.title,
      subtitle: formData.subtitle,
      body: formData.body,
      button_text: formData.button_text,
      button_link: formData.button_link,
      image_url: formData.image_url,
    };

    await updateContent.mutateAsync({
      id: editingContent.id,
      page_key: formData.page_key,
      section_key: formData.section_key,
      content: content,
      is_published: formData.is_published,
    });
    setIsEditOpen(false);
    setEditingContent(null);
    resetForm();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this content?')) {
      await deleteContent.mutateAsync(id);
    }
  };

  const handleTogglePublish = async (content: SiteContent) => {
    await updateContent.mutateAsync({
      id: content.id,
      is_published: !content.is_published,
    });
  };

  const ContentForm = ({ onSubmit, isSubmitting }: { onSubmit: () => void; isSubmitting: boolean }) => (
    <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto">
      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="page">Page *</Label>
          <Select value={formData.page_key} onValueChange={(v) => setFormData({ ...formData, page_key: v })}>
            <SelectTrigger>
              <SelectValue placeholder="Select page" />
            </SelectTrigger>
            <SelectContent>
              {pageOptions.map((page) => (
                <SelectItem key={page.value} value={page.value}>{page.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="section">Section *</Label>
          <Select value={formData.section_key} onValueChange={(v) => setFormData({ ...formData, section_key: v })}>
            <SelectTrigger>
              <SelectValue placeholder="Select section" />
            </SelectTrigger>
            <SelectContent>
              {sectionOptions.map((section) => (
                <SelectItem key={section.value} value={section.value}>{section.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="Section title"
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="subtitle">Subtitle</Label>
        <Input
          id="subtitle"
          value={formData.subtitle}
          onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
          placeholder="Section subtitle"
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="body">Body Content</Label>
        <Textarea
          id="body"
          value={formData.body}
          onChange={(e) => setFormData({ ...formData, body: e.target.value })}
          placeholder="Main content text..."
          rows={4}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="button_text">Button Text</Label>
          <Input
            id="button_text"
            value={formData.button_text}
            onChange={(e) => setFormData({ ...formData, button_text: e.target.value })}
            placeholder="Learn More"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="button_link">Button Link</Label>
          <Input
            id="button_link"
            value={formData.button_link}
            onChange={(e) => setFormData({ ...formData, button_link: e.target.value })}
            placeholder="/contact"
          />
        </div>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="image_url">Image URL</Label>
        <Input
          id="image_url"
          value={formData.image_url}
          onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
          placeholder="https://..."
        />
      </div>
      <div className="flex items-center gap-2">
        <Switch
          id="is_published"
          checked={formData.is_published}
          onCheckedChange={(checked) => setFormData({ ...formData, is_published: checked })}
        />
        <Label htmlFor="is_published">Published</Label>
      </div>
      <DialogFooter>
        <Button onClick={onSubmit} disabled={isSubmitting || !formData.page_key || !formData.section_key}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {editingContent ? 'Update Content' : 'Create Content'}
        </Button>
      </DialogFooter>
    </div>
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Content Management</h1>
          <p className="text-muted-foreground">Manage website pages and content blocks</p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="mr-2 h-4 w-4" />
              Add Content
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Add New Content</DialogTitle>
              <DialogDescription>
                Create a new content block for your website.
              </DialogDescription>
            </DialogHeader>
            <ContentForm onSubmit={handleCreate} isSubmitting={createContent.isPending} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Pages</p>
                <p className="text-2xl font-bold">{Object.keys(contentsByPage).length}</p>
              </div>
              <Globe className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Content Blocks</p>
                <p className="text-2xl font-bold">{contents.length}</p>
              </div>
              <FileText className="h-8 w-8 text-accent" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Published</p>
                <p className="text-2xl font-bold">{contents.filter(c => c.is_published).length}</p>
              </div>
              <Eye className="h-8 w-8 text-accent" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Drafts</p>
                <p className="text-2xl font-bold">{contents.filter(c => !c.is_published).length}</p>
              </div>
              <EyeOff className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="pages" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pages">Pages</TabsTrigger>
          <TabsTrigger value="all">All Content</TabsTrigger>
          <TabsTrigger value="settings">Site Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="pages" className="space-y-4">
          {/* Search */}
          <Card>
            <CardContent className="pt-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search pages and sections..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardContent>
          </Card>

          {/* Pages Grid */}
          {Object.keys(contentsByPage).length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8 text-muted-foreground">
                  No content found. Click "Add Content" to create your first content block.
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {Object.entries(contentsByPage).map(([pageKey, pageContents]) => (
                <Card key={pageKey}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 capitalize">
                      <Globe className="h-5 w-5" />
                      {pageOptions.find(p => p.value === pageKey)?.label || pageKey}
                    </CardTitle>
                    <CardDescription>
                      {pageContents.length} section(s)
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {pageContents.map((content) => (
                        <div
                          key={content.id}
                          className="flex items-center justify-between p-2 rounded-lg border hover:bg-muted/50"
                        >
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm capitalize">
                              {sectionOptions.find(s => s.value === content.section_key)?.label || content.section_key}
                            </span>
                            {!content.is_published && (
                              <Badge variant="secondary" className="text-xs">Draft</Badge>
                            )}
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleEdit(content)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleTogglePublish(content)}>
                                {content.is_published ? (
                                  <>
                                    <EyeOff className="mr-2 h-4 w-4" />
                                    Unpublish
                                  </>
                                ) : (
                                  <>
                                    <Eye className="mr-2 h-4 w-4" />
                                    Publish
                                  </>
                                )}
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleDelete(content.id)}
                                className="text-destructive"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>All Content Blocks</CardTitle>
            </CardHeader>
            <CardContent>
              {contents.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No content blocks found.
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Page</TableHead>
                      <TableHead>Section</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Updated</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {contents.map((content) => (
                      <TableRow key={content.id}>
                        <TableCell className="capitalize">
                          {pageOptions.find(p => p.value === content.page_key)?.label || content.page_key}
                        </TableCell>
                        <TableCell className="capitalize">
                          {sectionOptions.find(s => s.value === content.section_key)?.label || content.section_key}
                        </TableCell>
                        <TableCell>{content.content.title || '-'}</TableCell>
                        <TableCell>
                          <Badge variant={content.is_published ? 'default' : 'secondary'}>
                            {content.is_published ? 'Published' : 'Draft'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {format(new Date(content.updated_at), 'MMM dd, yyyy')}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleEdit(content)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleDelete(content.id)}
                                className="text-destructive"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Site Settings
              </CardTitle>
              <CardDescription>
                Configure global site settings and preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Company Name</Label>
                  <Input defaultValue="Citi Klin" />
                </div>
                <div className="space-y-2">
                  <Label>Contact Email</Label>
                  <Input defaultValue="thecitiklin@gmail.com" />
                </div>
                <div className="space-y-2">
                  <Label>Phone Number</Label>
                  <Input defaultValue="+254 XXX XXX XXX" />
                </div>
                <div className="space-y-2">
                  <Label>Address</Label>
                  <Input defaultValue="Nairobi, Kenya" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>About Description</Label>
                <Textarea 
                  rows={3}
                  defaultValue="Citi Klin is a professional cleaning services company providing comprehensive solutions for residential and commercial properties."
                />
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label>Facebook URL</Label>
                  <Input placeholder="https://facebook.com/..." />
                </div>
                <div className="space-y-2">
                  <Label>Twitter URL</Label>
                  <Input placeholder="https://twitter.com/..." />
                </div>
                <div className="space-y-2">
                  <Label>Instagram URL</Label>
                  <Input placeholder="https://instagram.com/..." />
                </div>
              </div>
              <Button>Save Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Content</DialogTitle>
            <DialogDescription>
              Update the content block details.
            </DialogDescription>
          </DialogHeader>
          <ContentForm onSubmit={handleUpdate} isSubmitting={updateContent.isPending} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
