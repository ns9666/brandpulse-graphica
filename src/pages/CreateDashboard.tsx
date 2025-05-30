import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { 
  Hash, 
  Globe, 
  Tag, 
  Image as ImageIcon, 
  Save,
  Plus,
  Trash2,
  ArrowLeft,
  Upload
} from 'lucide-react';

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Checkbox } from '@/components/ui/checkbox';
import Navbar from '@/components/layout/Navbar';
import { dashboardsApi, CreateDashboardPayload } from '@/services/djangoApi';

// Define schema for form validation
const formSchema = z.object({
  dashboardName: z.string().min(2, {
    message: "Dashboard name must be at least 2 characters.",
  }),
  description: z.string().optional(),
  keywords: z.array(z.string()).min(1, {
    message: "Add at least one keyword to track.",
  }),
  hashtags: z.array(z.string()).optional(),
  urls: z.array(z.string().url({ message: "Please enter a valid URL" })).optional(),
  refreshInterval: z.number().min(15).max(120),
  platforms: z.array(z.enum(["twitter", "instagram", "news", "reddit", "linkedin", "all"])).min(1, {
    message: "Select at least one platform.",
  }),
  sentimentAnalysis: z.boolean().default(true),
  alertThreshold: z.number().min(1).max(100),
  imageUrl: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const CreateDashboard = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('edit');
  const isEditMode = !!editId;
  const [isLoadingExistingData, setIsLoadingExistingData] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [uploadedImageFile, setUploadedImageFile] = React.useState<File | null>(null);
  const [imagePreview, setImagePreview] = React.useState<string>('');
  
  // Default form values
  const defaultValues: Partial<FormValues> = {
    keywords: [],
    hashtags: [],
    urls: [],
    refreshInterval: 30,
    platforms: ["twitter", "news"],
    sentimentAnalysis: true,
    alertThreshold: 50
  };

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });
  
  // For handling arrays of tags, keywords, etc.
  const [newKeyword, setNewKeyword] = React.useState('');
  const [newHashtag, setNewHashtag] = React.useState('');
  const [newUrl, setNewUrl] = React.useState('');

  const handleAddKeyword = () => {
    if (newKeyword.trim() === '') return;
    const currentKeywords = form.getValues("keywords") || [];
    form.setValue("keywords", [...currentKeywords, newKeyword.trim()]);
    setNewKeyword('');
  };

  const handleAddHashtag = () => {
    if (newHashtag.trim() === '') return;
    let tag = newHashtag.trim();
    if (!tag.startsWith('#')) tag = `#${tag}`;
    const currentHashtags = form.getValues("hashtags") || [];
    form.setValue("hashtags", [...currentHashtags, tag]);
    setNewHashtag('');
  };

  const handleAddUrl = () => {
    if (newUrl.trim() === '') return;
    try {
      // Simple URL validation
      new URL(newUrl);
      const currentUrls = form.getValues("urls") || [];
      form.setValue("urls", [...currentUrls, newUrl.trim()]);
      setNewUrl('');
    } catch {
      toast.error("Please enter a valid URL");
    }
  };

  const handleRemoveItem = (type: "keywords" | "hashtags" | "urls", index: number) => {
    const currentItems = form.getValues(type) || [];
    form.setValue(
      type, 
      currentItems.filter((_, i) => i !== index)
    );
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setImagePreview(result);
        form.setValue('imageUrl', result);
      };
      reader.readAsDataURL(file);
    }
  };

  /**
   * Load dashboard data for editing
   * Expected API response from POST /api/dashboards/get/:
   * {
   *   success: boolean,
   *   data: {
   *     id: number,
   *     name: string,
   *     description: string,
   *     keywords: string[],
   *     hashtags: string[],
   *     urls: string[],
   *     platforms: string[],
   *     refreshInterval: number,
   *     sentimentAnalysis: boolean,
   *     alertThreshold: number,
   *     imageUrl?: string,
   *     createdAt: string,
   *     lastUpdated: string
   *   }
   * }
   */
  useEffect(() => {
    if (isEditMode && editId) {
      loadDashboardForEdit(parseInt(editId));
    }
  }, [isEditMode, editId]);

  const loadDashboardForEdit = async (id: number) => {
    try {
      setIsLoadingExistingData(true);
      console.log(`Loading dashboard ${id} for editing`);
      
      const dashboard = await dashboardsApi.getDashboard(id);
      console.log('Loaded dashboard data for editing:', dashboard);
      
      // Populate form with existing data
      form.setValue('dashboardName', dashboard.name);
      form.setValue('description', dashboard.description || '');
      form.setValue('keywords', dashboard.keywords || []);
      form.setValue('hashtags', dashboard.hashtags || []);
      form.setValue('urls', dashboard.urls || []);
      form.setValue('refreshInterval', dashboard.refreshInterval);
      form.setValue('platforms', dashboard.platforms as any);
      form.setValue('sentimentAnalysis', dashboard.sentimentAnalysis);
      form.setValue('alertThreshold', dashboard.alertThreshold);
      
      if (dashboard.imageUrl) {
        form.setValue('imageUrl', dashboard.imageUrl);
        setImagePreview(dashboard.imageUrl);
      }
      
      toast.success('Dashboard data loaded for editing');
    } catch (error) {
      console.error('Failed to load dashboard for editing:', error);
      toast.error('Failed to load dashboard data. Using default values.');
    } finally {
      setIsLoadingExistingData(false);
    }
  };

  /**
   * Submit form data to create or update dashboard
   * 
   * CREATE Request: POST /api/dashboards/create/
   * Expected request body:
   * {
   *   dashboardName: string,
   *   description?: string,
   *   keywords: string[],
   *   hashtags?: string[],
   *   urls?: string[],
   *   refreshInterval: number,
   *   platforms: string[],
   *   sentimentAnalysis: boolean,
   *   alertThreshold: number,
   *   imageUrl?: string
   * }
   * 
   * UPDATE Request: POST /api/dashboards/update/
   * Expected request body:
   * {
   *   dashboardId: number,
   *   dashboardName: string,
   *   description?: string,
   *   keywords: string[],
   *   hashtags?: string[],
   *   urls?: string[],
   *   refreshInterval: number,
   *   platforms: string[],
   *   sentimentAnalysis: boolean,
   *   alertThreshold: number,
   *   imageUrl?: string
   * }
   * 
   * Expected success response for both:
   * {
   *   success: boolean,
   *   data: {
   *     id: number,
   *     name: string,
   *     description: string,
   *     keywords: string[],
   *     hashtags: string[],
   *     urls: string[],
   *     platforms: string[],
   *     refreshInterval: number,
   *     sentimentAnalysis: boolean,
   *     alertThreshold: number,
   *     imageUrl?: string,
   *     createdAt: string,
   *     lastUpdated: string,
   *     stats: { totalMentions: number, avgSentiment: number, totalReach: number, activePlatforms: number }
   *   }
   * }
   */
  const onSubmit = async (data: FormValues) => {
    try {
      setIsSubmitting(true);
      console.log('Submitting dashboard data:', data);

      const payload: CreateDashboardPayload = {
        dashboardName: data.dashboardName,
        description: data.description,
        keywords: data.keywords,
        hashtags: data.hashtags,
        urls: data.urls,
        refreshInterval: data.refreshInterval,
        platforms: data.platforms,
        sentimentAnalysis: data.sentimentAnalysis,
        alertThreshold: data.alertThreshold,
        imageUrl: data.imageUrl,
      };

      if (isEditMode && editId) {
        console.log(`Updating dashboard ${editId} with payload:`, payload);
        const updatedDashboard = await dashboardsApi.updateDashboard(parseInt(editId), payload);
        console.log('Dashboard updated successfully:', updatedDashboard);
        toast.success(`Dashboard "${data.dashboardName}" updated successfully!`);
      } else {
        console.log('Creating new dashboard with payload:', payload);
        const createdDashboard = await dashboardsApi.createDashboard(payload);
        console.log('Dashboard created successfully:', createdDashboard);
        toast.success(`Dashboard "${data.dashboardName}" created successfully!`);
      }
      
      navigate('/dashboards');
    } catch (error) {
      console.error('Failed to save dashboard:', error);
      toast.error(isEditMode ? 'Failed to update dashboard' : 'Failed to create dashboard');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show loading state while fetching existing data for edit
  if (isEditMode && isLoadingExistingData) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-blue mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Navbar />
      
      <main className="container pt-28 pb-16">
        <div className="mb-6">
          <Button 
            variant="outline" 
            onClick={() => navigate('/dashboards')}
            className="flex items-center gap-2 mb-4"
          >
            <ArrowLeft size={16} />
            Back to Dashboards
          </Button>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-2xl">
              {isEditMode ? 'Edit Monitoring Dashboard' : 'Create Monitoring Dashboard'}
            </CardTitle>
            <CardDescription>
              {isEditMode 
                ? 'Update your social media monitoring dashboard settings.'
                : 'Set up your social media monitoring dashboard by providing keywords, hashtags, and more.'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                  control={form.control}
                  name="dashboardName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Dashboard Name</FormLabel>
                      <FormControl>
                        <Input placeholder="My Brand Monitoring" {...field} />
                      </FormControl>
                      <FormDescription>
                        Give your monitoring dashboard a descriptive name.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Track brand mentions and sentiment across social media" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-4">
                  <FormLabel>Dashboard Image</FormLabel>
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
                      />
                      <p className="text-sm text-muted-foreground mt-1">
                        Upload an image from your system or enter a URL below
                      </p>
                    </div>
                    {imagePreview && (
                      <div className="h-16 w-16 rounded-lg overflow-hidden border">
                        <img
                          src={imagePreview}
                          alt="Dashboard preview"
                          className="h-full w-full object-cover"
                        />
                      </div>
                    )}
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="imageUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Or enter image URL</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="https://example.com/image.jpg" 
                            {...field} 
                            onChange={(e) => {
                              field.onChange(e);
                              if (e.target.value) {
                                setImagePreview(e.target.value);
                              }
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="space-y-4">
                  <FormLabel>Keywords to Track</FormLabel>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add a keyword"
                      value={newKeyword}
                      onChange={(e) => setNewKeyword(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddKeyword())}
                      className="flex-1"
                    />
                    <Button type="button" onClick={handleAddKeyword}>
                      <Plus className="h-4 w-4" />
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {form.watch("keywords")?.map((keyword, index) => (
                      <div 
                        key={index} 
                        className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full flex items-center gap-2"
                      >
                        <Tag className="h-3 w-3" />
                        {keyword}
                        <button 
                          type="button" 
                          onClick={() => handleRemoveItem("keywords", index)}
                          className="text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                  {form.formState.errors.keywords && (
                    <p className="text-sm font-medium text-destructive">
                      {form.formState.errors.keywords.message}
                    </p>
                  )}
                </div>

                <div className="space-y-4">
                  <FormLabel>Hashtags</FormLabel>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add a hashtag"
                      value={newHashtag}
                      onChange={(e) => setNewHashtag(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddHashtag())}
                      className="flex-1"
                    />
                    <Button type="button" onClick={handleAddHashtag}>
                      <Plus className="h-4 w-4" />
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {form.watch("hashtags")?.map((hashtag, index) => (
                      <div 
                        key={index} 
                        className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-3 py-1 rounded-full flex items-center gap-2"
                      >
                        <Hash className="h-3 w-3" />
                        {hashtag}
                        <button 
                          type="button" 
                          onClick={() => handleRemoveItem("hashtags", index)}
                          className="text-blue-600 dark:text-blue-400 hover:text-destructive"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <FormLabel>URLs to Monitor</FormLabel>
                  <div className="flex gap-2">
                    <Input
                      placeholder="https://example.com"
                      value={newUrl}
                      onChange={(e) => setNewUrl(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddUrl())}
                      className="flex-1"
                    />
                    <Button type="button" onClick={handleAddUrl}>
                      <Plus className="h-4 w-4" />
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {form.watch("urls")?.map((url, index) => (
                      <div 
                        key={index} 
                        className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 px-3 py-1 rounded-full flex items-center gap-2"
                      >
                        <Globe className="h-3 w-3" />
                        {new URL(url).hostname}
                        <button 
                          type="button" 
                          onClick={() => handleRemoveItem("urls", index)}
                          className="text-green-600 dark:text-green-400 hover:text-destructive"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <FormField
                  control={form.control}
                  name="platforms"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Platforms to Monitor</FormLabel>
                      <FormControl>
                        <div className="space-y-4">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="all-platforms"
                              checked={field.value.includes('all')}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  field.onChange(['all']);
                                } else {
                                  field.onChange([]);
                                }
                              }}
                            />
                            <label
                              htmlFor="all-platforms"
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              All Platforms
                            </label>
                          </div>
                          
                          {!field.value.includes('all') && (
                            <ToggleGroup 
                              type="multiple" 
                              className="justify-start"
                              value={field.value}
                              onValueChange={field.onChange}
                            >
                              <ToggleGroupItem value="twitter" aria-label="Toggle Twitter">
                                Twitter
                              </ToggleGroupItem>
                              <ToggleGroupItem value="instagram" aria-label="Toggle Instagram">
                                Instagram
                              </ToggleGroupItem>
                              <ToggleGroupItem value="news" aria-label="Toggle News">
                                News
                              </ToggleGroupItem>
                              <ToggleGroupItem value="reddit" aria-label="Toggle Reddit">
                                Reddit
                              </ToggleGroupItem>
                              <ToggleGroupItem value="linkedin" aria-label="Toggle LinkedIn">
                                LinkedIn
                              </ToggleGroupItem>
                            </ToggleGroup>
                          )}
                        </div>
                      </FormControl>
                      <FormDescription>
                        Select "All Platforms" to monitor across all available platforms, or choose specific ones.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="refreshInterval"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Refresh Interval (minutes): {field.value}</FormLabel>
                      <FormControl>
                        <Slider
                          min={15}
                          max={120}
                          step={5}
                          defaultValue={[field.value]}
                          onValueChange={(value) => field.onChange(value[0])}
                          className="w-full"
                        />
                      </FormControl>
                      <FormDescription>
                        How often should we check for new mentions? (15-120 minutes)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="sentimentAnalysis"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between space-y-0 rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Sentiment Analysis</FormLabel>
                          <FormDescription>
                            Track sentiment of mentions
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch 
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="alertThreshold"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Alert Threshold: {field.value}%</FormLabel>
                        <FormControl>
                          <Slider
                            min={1}
                            max={100}
                            step={1}
                            defaultValue={[field.value]}
                            onValueChange={(value) => field.onChange(value[0])}
                            className="w-full"
                          />
                        </FormControl>
                        <FormDescription>
                          Notify me when negative sentiment exceeds this level
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Button type="submit" className="w-full sm:w-auto" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      {isEditMode ? 'Updating...' : 'Creating...'}
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" /> 
                      {isEditMode ? 'Update Dashboard' : 'Create Dashboard'}
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default CreateDashboard;
