'use client'

import Swal from 'sweetalert2'
import React, { useState, useMemo, useEffect } from 'react'
import Image from 'next/image'
import {
  Plus,
  Search,
  Grid3X3,
  List,
  Edit,
  Trash2,
  FileText,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Calendar,
  User,
  TrendingUp,
  CheckCircle,
  Clock,
  Sparkles,
  Upload,
  X,
  Filter,
  LayoutGrid,
  Table as TableIcon,
  FileX,
  Layout
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Label } from '@/components/ui/label'
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks'
import { fetchBlogsData, selectBlogsData, selectBlogsError, selectBlogsLoading, setBlogsData, Blog } from '@/lib/redux/features/blogsSlice'
import Loader from '@/components/common/dashboard/Loader'
import Error from '@/components/common/dashboard/Error'
import NoData from '@/components/common/dashboard/NoData'

import { FormSteps } from '@/components/ui/form-steps'

// Types
interface BlogEditorImages {
  id: string;
  url: string;
  alt: string;
  caption?: string;
}

// Extend the slice Blog interface with the local editable properties
type BlogWithEditableTags = Blog & {
  blogImages?: BlogEditorImages[];
};

const blogStatuses = ["All", "published", "draft", "archived"]
const blogCategories = ["All", "Nutrition", "Fitness", "Wellness", "Supplements", "Lifestyle"]

const BlogsPage = () => {
  const dispatch = useAppDispatch()
  const blogs = useAppSelector(selectBlogsData)
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('All')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedBlog, setSelectedBlog] = useState<BlogWithEditableTags | null>(null)
  const isLoading = useAppSelector(selectBlogsLoading)
  const error = useAppSelector(selectBlogsError)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 12
  const [isLocalLoading, setIsLocalLoading] = useState(false)

  // New blog state
  const [newBlog, setNewBlog] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    featuredImage: '',
    author: '',
    category: '',
    tags: '',
    status: 'draft',
    readTime: '',
    metaTitle: '',
    metaDescription: '',
    metaKeywords: '',
    canonicalUrl: '',
    ogTitle: '',
    ogDescription: '',
    ogImage: '',
    blogImages: [] as Array<{ id: string, url: string, alt: string, caption?: string }>
  })

  // Image URL input state
  const [urlInput, setUrlInput] = useState('')

  const [addStep, setAddStep] = useState(1)
  const [editStep, setEditStep] = useState(1)

  const blogSteps = [
    { id: 1, name: 'Content' },
    { id: 2, name: 'Media' },
    { id: 3, name: 'SEO' }
  ]

  useEffect(() => {
    dispatch(fetchBlogsData())
  }, [dispatch])

  // Reset steps when modals open/close
  useEffect(() => {
    if (!showAddModal) setAddStep(1)
  }, [showAddModal])

  useEffect(() => {
    if (!showEditModal) setEditStep(1)
  }, [showEditModal])

  // Filter blogs
  const filteredBlogs = useMemo(() => {
    if (!blogs || !Array.isArray(blogs)) return []

    return blogs.filter(blog => {
      const title = blog.title || ''
      const excerpt = blog.excerpt || ''
      const author = blog.author || ''

      const blogTags = Array.isArray(blog.tags) ? blog.tags : (typeof blog.tags === 'string' ? [blog.tags] : [])
      const searchLower = searchTerm.toLowerCase()

      const matchesSearch =
        title.toLowerCase().includes(searchLower) ||
        excerpt.toLowerCase().includes(searchLower) ||
        author.toLowerCase().includes(searchLower) ||
        blogTags.some((tag: string) => tag && tag.toLowerCase().includes(searchLower))

      const matchesStatus = selectedStatus === 'All' || blog.status === selectedStatus
      const matchesCategory = selectedCategory === 'All' || blog.category === selectedCategory

      return matchesSearch && matchesStatus && matchesCategory
    })
  }, [blogs, searchTerm, selectedStatus, selectedCategory])

  // Pagination logic
  const totalPages = Math.ceil(filteredBlogs.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedBlogs = filteredBlogs.slice(startIndex, endIndex)

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, selectedStatus, selectedCategory])

  const handleAddBlog = async () => {
    setIsLocalLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 800))

      const blog = {
        _id: `blog_${Date.now()}`,
        title: newBlog.title,
        slug: newBlog.slug,
        excerpt: newBlog.excerpt,
        content: newBlog.content,
        featuredImage: newBlog.featuredImage,
        author: newBlog.author,
        category: newBlog.category,
        tags: newBlog.tags.split(',').map((tag: string) => tag.trim()).filter((tag: string) => tag),
        status: newBlog.status,
        views: 0,
        likes: 0,
        readTime: newBlog.readTime,
        metaTitle: newBlog.metaTitle,
        metaDescription: newBlog.metaDescription,
        metaKeywords: newBlog.metaKeywords,
        canonicalUrl: newBlog.canonicalUrl,
        ogTitle: newBlog.ogTitle,
        ogDescription: newBlog.ogDescription,
        ogImage: newBlog.ogImage,
        blogImages: newBlog.blogImages,
        publishedAt: newBlog.status === 'published' ? new Date().toISOString().split('T')[0] : null,
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0]
      }

      dispatch(setBlogsData({ data: [...(blogs || []), blog as unknown as BlogWithEditableTags], total: (blogs?.length || 0) + 1 }))
      setShowAddModal(false)
      setNewBlog({
        title: '',
        slug: '',
        excerpt: '',
        content: '',
        featuredImage: '',
        author: '',
        category: '',
        tags: '',
        status: 'draft',
        readTime: '',
        metaTitle: '',
        metaDescription: '',
        metaKeywords: '',
        canonicalUrl: '',
        ogTitle: '',
        ogDescription: '',
        ogImage: '',
        blogImages: []
      })
      setUrlInput('')
      Swal.fire({ icon: 'success', title: 'Blog Created', text: 'Post has been added to dashboard', timer: 1500, showConfirmButton: false })
    } finally {
      setIsLocalLoading(false)
    }
  }

  const handleEditBlog = async () => {
    if (!selectedBlog) return
    setIsLocalLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 800))

      const updatedBlogs = (blogs || []).map(blog => {
        if (blog._id === selectedBlog._id) {
          return {
            ...blog,
            ...selectedBlog,
            tags: typeof selectedBlog.tags === 'string'
              ? selectedBlog.tags.split(',').map((tag: string) => tag.trim()).filter(Boolean)
              : selectedBlog.tags as string[],
            publishedAt: selectedBlog.status === 'published' && !blog.publishedAt
              ? new Date().toISOString().split('T')[0]
              : blog.publishedAt,
            updatedAt: new Date().toISOString().split('T')[0]
          }
        }
        return blog;
      })
      dispatch(setBlogsData({ data: updatedBlogs, total: updatedBlogs.length }))
      setShowEditModal(false)
      setSelectedBlog(null)
      Swal.fire({ icon: 'success', title: 'Blog Updated', timer: 1500, showConfirmButton: false })
    } finally {
      setIsLocalLoading(false)
    }
  }

  const handleDeleteBlog = async () => {
    if (!selectedBlog) return
    setIsLocalLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 800))

      const newFilteredBlogs = (blogs || []).filter(blog => blog._id !== selectedBlog._id)
      dispatch(setBlogsData({ data: newFilteredBlogs, total: newFilteredBlogs.length }))
      setShowDeleteModal(false)
      setSelectedBlog(null)
      Swal.fire({ icon: 'success', title: 'Blog Deleted', timer: 1500, showConfirmButton: false })
    } finally {
      setIsLocalLoading(false)
    }
  }

  const openEditModal = (blog: BlogWithEditableTags) => {
    setSelectedBlog({
      ...blog,
      tags: Array.isArray(blog.tags) ? blog.tags.join(', ') : (blog.tags as string)
    })
    setShowEditModal(true)
  }

  const openDeleteModal = (blog: BlogWithEditableTags) => {
    setSelectedBlog(blog)
    setShowDeleteModal(true)
  }

  // Image management functions
  const handleFeaturedImageUpload = (isEdit: boolean) => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = () => {
          if (isEdit) {
            setSelectedBlog(prev => prev ? { ...prev, featuredImage: reader.result as string } : prev)
          } else {
            setNewBlog(prev => ({ ...prev, featuredImage: reader.result as string }))
          }
        }
        reader.readAsDataURL(file)
      }
    }
    input.click()
  }

  const addImageFromFile = () => {
    if (newBlog.blogImages.length >= 5) {
      Swal.fire({ icon: 'warning', text: 'You can add a maximum of 5 images' })
      return
    }

    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.multiple = true
    input.onchange = (e) => {
      const files = Array.from((e.target as HTMLInputElement).files || [])
      const availableSlots = 5 - newBlog.blogImages.length
      const newFiles = files.slice(0, availableSlots)

      newFiles.forEach((file) => {
        const reader = new FileReader()
        reader.onload = () => {
          const newImage = {
            id: `img_${Date.now()}_${Math.random()}`,
            url: reader.result as string,
            alt: file.name,
            caption: ''
          }
          setNewBlog(prev => ({
            ...prev,
            blogImages: [...prev.blogImages, newImage]
          }))
        }
        reader.readAsDataURL(file)
      })
    }
    input.click()
  }

  const addImageFromUrl = () => {
    if (newBlog.blogImages.length >= 5) {
      Swal.fire({ icon: 'warning', text: 'You can add a maximum of 5 images' })
      return
    }

    if (urlInput.trim()) {
      const newImage = {
        id: `img_${Date.now()}`,
        url: urlInput.trim(),
        alt: '',
        caption: ''
      }
      setNewBlog(prev => ({
        ...prev,
        blogImages: [...prev.blogImages, newImage]
      }))
      setUrlInput('')
    }
  }

  const removeImage = (imageId: string) => {
    setNewBlog(prev => ({
      ...prev,
      blogImages: prev.blogImages.filter(img => img.id !== imageId)
    }))
  }

  const updateImage = (imageId: string, field: string, value: string) => {
    setNewBlog(prev => ({
      ...prev,
      blogImages: prev.blogImages.map(img =>
        img.id === imageId ? { ...img, [field]: value } : img
      )
    }))
  }

  // Edit modal image functions
  const addImageToEdit = () => {
    if (!selectedBlog || (selectedBlog.blogImages?.length || 0) >= 5) {
      Swal.fire({ icon: 'warning', text: 'You can add a maximum of 5 images' })
      return
    }

    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.multiple = true
    input.onchange = (e) => {
      const files = Array.from((e.target as HTMLInputElement).files || [])
      const availableSlots = 5 - (selectedBlog.blogImages?.length || 0)
      const newFiles = files.slice(0, availableSlots)

      newFiles.forEach((file) => {
        const reader = new FileReader()
        reader.onload = () => {
          const newImage = {
            id: `img_${Date.now()}_${Math.random()}`,
            url: reader.result as string,
            alt: file.name,
            caption: ''
          }
          setSelectedBlog(prev => prev ? {
            ...prev,
            blogImages: [...(prev.blogImages || []), newImage]
          } : prev)
        }
        reader.readAsDataURL(file)
      })
    }
    input.click()
  }

  const removeImageFromEdit = (imageId: string) => {
    setSelectedBlog(prev => prev ? {
      ...prev,
      blogImages: (prev.blogImages || []).filter((img: BlogEditorImages) => img.id !== imageId)
    } : prev)
  }

  const updateImageInEdit = (imageId: string, field: string, value: string) => {
    setSelectedBlog(prev => prev ? {
      ...prev,
      blogImages: (prev.blogImages || []).map((img: BlogEditorImages) =>
        img.id === imageId ? { ...img, [field]: value } : img
      )
    } : prev)
  }

  const getStatusColor = (status: string): "default" | "secondary" | "destructive" | "outline" | null | undefined => {
    switch (status) {
      case 'published': return 'default'
      case 'draft': return 'outline'
      case 'archived': return 'destructive'
      default: return 'secondary'
    }
  }

  return (
    <TooltipProvider>
      <div className="space-y-8 p-1">
        {error ? (
          <Error title="Error loading blogs" message={error} />
        ) : (
          <>
            {/* Header section with refined typography */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                  Content repository
                </h1>
                <p className="text-slate-500 text-sm mt-1">
                  Orchestrate your narrative strategy and monitor digital resonance
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  onClick={() => setShowAddModal(true)}
                  className="h-10 px-5 rounded-xl font-bold text-xs uppercase tracking-widest bg-slate-900 text-white hover:bg-slate-800 shadow-lg shadow-slate-200 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  New narrative
                </Button>
                <Button
                  onClick={() => window.location.href = '/dashboard/blogs/addBlogs'}
                  className="h-10 px-5 rounded-xl font-bold text-xs uppercase tracking-widest bg-white border-indigo-100 text-indigo-600 hover:bg-indigo-50 shadow-sm transition-all"
                  variant="outline"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  AI Intelligence
                </Button>
              </div>
            </div>

            {/* Premium Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: "Total resonance", value: blogs?.length || 0, icon: FileText, color: "text-blue-600", bg: "bg-blue-50" },
                { label: "Live narratives", value: (blogs || []).filter(b => b.status === 'published').length, icon: CheckCircle, color: "text-emerald-600", bg: "bg-emerald-50" },
                { label: "Drafted nodes", value: (blogs || []).filter(b => b.status === 'draft').length, icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
                { label: "Total engagement", value: (blogs || []).reduce((sum, b) => sum + (b.views || 0), 0).toLocaleString(), icon: TrendingUp, color: "text-purple-600", bg: "bg-purple-50" },
              ].map((stat, i) => (
                <Card key={i} className="border-none shadow-sm rounded-2xl bg-white overflow-hidden group hover:shadow-md transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          {stat.label}
                        </p>
                        <p className="text-3xl font-black text-slate-900 tracking-tight">
                          {stat.value}
                        </p>
                      </div>
                      <div className={`p-3 ${stat.bg} ${stat.color} rounded-xl group-hover:scale-110 transition-transform duration-500`}>
                        <stat.icon className="w-6 h-6" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Refined Filter & Search Bar */}
            <Card className="border-none shadow-sm rounded-2xl bg-white/80 backdrop-blur-md overflow-hidden">
              <CardContent className="p-4">
                <div className="flex flex-col lg:flex-row gap-4">
                  <div className="flex-1 relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                    <Input
                      placeholder="Search narrative repository by title, excerpt, tags..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="h-11 pl-11 rounded-xl bg-slate-50 border-transparent focus:border-indigo-500/30 focus:bg-white transition-all text-sm font-medium"
                    />
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                      <SelectTrigger className="w-[140px] h-11 rounded-xl border-slate-100 bg-slate-50 font-bold text-xs uppercase tracking-widest text-slate-600 focus:ring-indigo-500/20">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl border-slate-100 shadow-2xl">
                        <SelectItem value="All" className="text-xs font-bold uppercase tracking-wider">All status</SelectItem>
                        <SelectItem value="published" className="text-xs font-bold uppercase tracking-wider">Published</SelectItem>
                        <SelectItem value="draft" className="text-xs font-bold uppercase tracking-wider">Draft</SelectItem>
                        <SelectItem value="archived" className="text-xs font-bold uppercase tracking-wider">Archived</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger className="w-[160px] h-11 rounded-xl border-slate-100 bg-slate-50 font-bold text-xs uppercase tracking-widest text-slate-600 focus:ring-indigo-500/20">
                        <SelectValue placeholder="Category" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl border-slate-100 shadow-2xl">
                        {blogCategories.map(category => (
                          <SelectItem key={category} value={category} className="text-xs font-bold uppercase tracking-wider">
                            {category === 'All' ? 'All categories' : category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl ml-2">
                      <Button
                        variant={viewMode === 'grid' ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => setViewMode('grid')}
                        className={`h-9 px-4 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}
                      >
                        <LayoutGrid className="w-4 h-4 mr-2" />
                        <span className="text-xs font-bold uppercase tracking-wider">Grid</span>
                      </Button>
                      <Button
                        variant={viewMode === 'table' ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => setViewMode('table')}
                        className={`h-9 px-4 rounded-lg transition-all ${viewMode === 'table' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}
                      >
                        <TableIcon className="w-4 h-4 mr-2" />
                        <span className="text-xs font-bold uppercase tracking-wider">Table</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Content Display */}
            {isLoading ? (
              <div className="py-24 flex flex-col items-center justify-center space-y-4">
                <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
                <p className="text-slate-400 font-bold text-xs uppercase tracking-[0.2em]">Synchronizing narrative database...</p>
              </div>
            ) : filteredBlogs.length === 0 ? (
              <NoData
                message="No narratives detected"
                description="The search parameters did not yield any blog profiles from the current repository."
                icon={<FileX className="w-full h-full text-slate-200" />}
                size="lg"
              />
            ) : (
              <>
                {viewMode === 'grid' ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {paginatedBlogs.map((blog) => (
                      <Card
                        key={blog._id}
                        className="group border-none shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 rounded-[24px] bg-white overflow-hidden flex flex-col h-full"
                      >
                        <div className="relative h-56 w-full overflow-hidden">
                          <Image
                            src={blog.featuredImage || '/placeholder-product.svg'}
                            alt={blog.title || 'Blog post'}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                          <div className="absolute top-4 right-4 z-10">
                            <Badge variant={getStatusColor(blog.status)} className="h-6 rounded-lg px-2 text-[10px] font-bold uppercase tracking-wider shadow-lg">
                              {blog.status}
                            </Badge>
                          </div>
                        </div>
                        <CardHeader className="p-6 pb-2">
                          <div className="flex items-center gap-3 mb-3">
                            <Badge variant="secondary" className="bg-indigo-50 text-indigo-600 border-none rounded-lg h-5 text-[9px] font-black uppercase tracking-widest">{blog.category}</Badge>
                            <span className="text-[9px] font-black text-slate-400 flex items-center gap-1 uppercase tracking-widest leading-none">
                              <Calendar className="w-3 h-3 text-indigo-400" />
                              {new Date(blog.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                            </span>
                          </div>
                          <CardTitle className="text-xl font-bold text-slate-900 leading-tight tracking-tight line-clamp-2 min-h-[3rem] group-hover:text-indigo-600 transition-colors">
                            {blog.title}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 pt-0 flex-1 flex flex-col">
                          <p className="text-sm font-medium text-slate-500 line-clamp-2 mb-6 flex-1">{blog.excerpt}</p>
                          <div className="flex items-center justify-between pt-5 border-t border-slate-50">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center border-2 border-white shadow-sm ring-4 ring-slate-50">
                                <User className="w-4 h-4 text-slate-500" />
                              </div>
                              <span className="text-[10px] font-black text-slate-700 uppercase tracking-widest">{blog.author}</span>
                            </div>
                            <div className="flex gap-2">
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    className="h-9 w-9 rounded-xl text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all"
                                    onClick={() => openEditModal(blog as BlogWithEditableTags)}
                                  >
                                    <Edit className="w-4 h-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>Calibrate Node</TooltipContent>
                              </Tooltip>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    className="h-9 w-9 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all"
                                    onClick={() => openDeleteModal(blog as BlogWithEditableTags)}
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>Decommission Node</TooltipContent>
                              </Tooltip>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card className="border-none shadow-sm rounded-[24px] bg-white overflow-hidden">
                    <Table>
                      <TableHeader className="bg-slate-50/50">
                        <TableRow className="border-slate-100/50 hover:bg-transparent">
                          <TableHead className="py-5 px-6 font-bold text-slate-400 text-[10px] uppercase tracking-widest w-[45%]">Narrative details</TableHead>
                          <TableHead className="py-5 px-6 font-bold text-slate-400 text-[10px] uppercase tracking-widest">Architect</TableHead>
                          <TableHead className="py-5 px-6 font-bold text-slate-400 text-[10px] uppercase tracking-widest">Intelligence</TableHead>
                          <TableHead className="py-5 px-6 font-bold text-slate-400 text-[10px] uppercase tracking-widest">Status</TableHead>
                          <TableHead className="py-5 px-6 font-bold text-slate-400 text-[10px] uppercase tracking-widest text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {paginatedBlogs.map(blog => (
                          <TableRow key={blog._id} className="border-slate-100/50 group transition-colors hover:bg-slate-50/50">
                            <TableCell className="py-4 px-6">
                              <div className="flex items-center gap-4">
                                <div className="relative w-20 h-14 rounded-xl overflow-hidden border-2 border-slate-50 shadow-sm flex-shrink-0 group-hover:scale-105 transition-transform">
                                  <Image
                                    src={blog.featuredImage || '/placeholder-product.svg'}
                                    alt={blog.title || 'Blog post'}
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                                <div className="min-w-0">
                                  <p className="font-bold text-slate-900 truncate">{blog.title || 'Untitled'}</p>
                                  <p className="text-[10px] font-bold text-slate-400 truncate uppercase mt-0.5">{blog.excerpt || 'No excerpt available...'}</p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="py-4 px-6">
                              <span className="text-[10px] font-black text-slate-700 uppercase tracking-widest">{blog.author}</span>
                            </TableCell>
                            <TableCell className="py-4 px-6">
                              <div className="flex flex-col gap-1.5">
                                <Badge variant="outline" className="w-fit rounded-lg border-slate-100 text-slate-500 text-[9px] font-black uppercase tracking-widest">
                                  {blog.category}
                                </Badge>
                                <div className="flex items-center gap-1 text-emerald-600">
                                  <TrendingUp className="w-3 h-3" />
                                  <span className="text-[10px] font-black">{blog.views.toLocaleString()}</span>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="py-4 px-6">
                              <Badge variant={getStatusColor(blog.status)} className="rounded-lg text-[10px] font-bold uppercase tracking-wider px-2.5">
                                {blog.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="py-4 px-6 text-right">
                              <div className="flex justify-end gap-1">
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-9 w-9 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50"
                                      onClick={() => openEditModal(blog as BlogWithEditableTags)}
                                    >
                                      <Edit className="w-4 h-4" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>Modify Record</TooltipContent>
                                </Tooltip>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-9 w-9 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                                      onClick={() => openDeleteModal(blog as BlogWithEditableTags)}
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>Erase Record</TooltipContent>
                                </Tooltip>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </Card>
                )}

                {/* Refined Pagination */}
                {!isLoading && filteredBlogs.length > 0 && totalPages > 1 && (
                  <div className="flex items-center justify-between px-2 pt-4">
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">
                      Page {currentPage} of {totalPages}
                    </p>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="h-10 px-4 rounded-xl border-slate-200 font-bold text-xs uppercase tracking-widest transition-all"
                      >
                        <ChevronLeft className="w-4 h-4 mr-1" />
                        Previous
                      </Button>
                      <div className="flex items-center gap-1 mx-2">
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                          const pageNum = i + 1;
                          return (
                            <Button
                              key={pageNum}
                              variant={currentPage === pageNum ? "default" : "outline"}
                              size="sm"
                              onClick={() => setCurrentPage(pageNum)}
                              className={`w-10 h-10 rounded-xl text-xs font-black transition-all ${currentPage === pageNum ? 'bg-slate-900 shadow-lg scale-110' : 'border-slate-200'}`}
                            >
                              {pageNum}
                            </Button>
                          );
                        })}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="h-10 px-4 rounded-xl border-slate-200 font-bold text-xs uppercase tracking-widest transition-all"
                      >
                        Next
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}   {/* Add Blog Modal */}
            <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
              <DialogContent className="max-w-3xl p-0 gap-0 rounded-2xl border-slate-200 shadow-2xl overflow-hidden bg-white">
                <div className="bg-slate-50/50 px-8 py-6 border-b border-slate-100">
                  <DialogHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Plus className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <DialogTitle className="text-xl font-bold text-slate-900">Compose Narrative</DialogTitle>
                        <DialogDescription className="text-slate-500 font-medium">Create and publish a new blog post</DialogDescription>
                      </div>
                    </div>
                  </DialogHeader>

                  <div className="mt-8">
                    <FormSteps currentStep={addStep} steps={blogSteps} />
                  </div>
                </div>

                <div className="p-8 max-h-[60vh] overflow-y-auto">
                  {addStep === 1 && (
                    <div className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-300">
                      <div className="form-grid gap-4">
                        <div className="form-field col-span-2">
                          <Label className="form-label text-sm font-semibold text-slate-700">Article Title <span className="text-destructive">*</span></Label>
                          <Input
                            placeholder="Enter a compelling article title..."
                            value={newBlog.title}
                            onChange={(e) => setNewBlog({ ...newBlog, title: e.target.value })}
                            className="h-11 border-slate-200 rounded-lg focus:ring-primary/5 focus:border-primary transition-all font-semibold"
                          />
                        </div>
                        <div className="form-field col-span-2">
                          <Label className="form-label text-sm font-semibold text-slate-700">URL Slug</Label>
                          <Input
                            placeholder="url-friendly-slug (e.g. how-to-stay-healthy)"
                            value={newBlog.slug}
                            onChange={(e) => setNewBlog({ ...newBlog, slug: e.target.value })}
                            className="h-11 border-slate-200 rounded-lg focus:ring-primary/5 focus:border-primary transition-all font-mono text-xs"
                          />
                        </div>
                        <div className="form-field col-span-2">
                          <Label className="form-label text-sm font-semibold text-slate-700">Excerpt</Label>
                          <Textarea
                            placeholder="Write a brief summary for previews..."
                            value={newBlog.excerpt}
                            onChange={(e) => setNewBlog({ ...newBlog, excerpt: e.target.value })}
                            rows={3}
                            className="border-slate-200 rounded-lg focus:ring-primary/5 focus:border-primary transition-all min-h-[80px]"
                          />
                        </div>
                        <div className="form-field col-span-2">
                          <Label className="form-label text-sm font-semibold text-slate-700">Full Content <span className="text-destructive">*</span></Label>
                          <Textarea
                            placeholder="Write your article content here..."
                            value={newBlog.content}
                            onChange={(e) => setNewBlog({ ...newBlog, content: e.target.value })}
                            rows={8}
                            className="border-slate-200 rounded-lg focus:ring-primary/5 focus:border-primary transition-all min-h-[200px]"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {addStep === 2 && (
                    <div className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-300">
                      <div className="form-grid gap-4">
                        <div className="form-field col-span-2 sm:col-span-1">
                          <Label className="form-label text-sm font-semibold text-slate-700">Author Name</Label>
                          <Input
                            placeholder="e.g. Dr. Sarah Wilson"
                            value={newBlog.author}
                            onChange={(e) => setNewBlog({ ...newBlog, author: e.target.value })}
                            className="h-11 border-slate-200 rounded-lg focus:ring-primary/5 focus:border-primary transition-all"
                          />
                        </div>
                        <div className="form-field col-span-2 sm:col-span-1">
                          <Label className="form-label text-sm font-semibold text-slate-700">Category</Label>
                          <Select
                            value={newBlog.category}
                            onValueChange={(val) => setNewBlog({ ...newBlog, category: val })}
                          >
                            <SelectTrigger className="h-11 border-slate-200 rounded-lg focus:ring-primary/5 focus:border-primary transition-all">
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                              {blogCategories.filter(c => c !== 'All').map(c => (
                                <SelectItem key={c} value={c}>{c}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="form-field col-span-2 sm:col-span-1">
                          <Label className="form-label text-sm font-semibold text-slate-700">Status</Label>
                          <Select
                            value={newBlog.status}
                            onValueChange={(val) => setNewBlog({ ...newBlog, status: val })}
                          >
                            <SelectTrigger className="h-11 border-slate-200 rounded-lg focus:ring-primary/5 focus:border-primary transition-all">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="draft">Draft</SelectItem>
                              <SelectItem value="published">Published</SelectItem>
                              <SelectItem value="archived">Archived</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="form-field col-span-2 sm:col-span-1">
                          <Label className="form-label text-sm font-semibold text-slate-700">Read Time</Label>
                          <Input
                            placeholder="e.g. 5 min read"
                            value={newBlog.readTime}
                            onChange={(e) => setNewBlog({ ...newBlog, readTime: e.target.value })}
                            className="h-11 border-slate-200 rounded-lg focus:ring-primary/5 focus:border-primary transition-all"
                          />
                        </div>
                        <div className="form-field col-span-2">
                          <Label className="form-label text-sm font-semibold text-slate-700">Featured Image URL</Label>
                          <div className="flex gap-2">
                            <Input
                              placeholder="https://example.com/image.jpg"
                              value={newBlog.featuredImage}
                              onChange={(e) => setNewBlog({ ...newBlog, featuredImage: e.target.value })}
                              className="h-11 border-slate-200 rounded-lg focus:ring-primary/5 focus:border-primary transition-all flex-1"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => handleFeaturedImageUpload(false)}
                              className="h-11 border-slate-200 rounded-lg bg-slate-50 hover:bg-slate-100"
                            >
                              <Upload className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>

                        <div className="form-field col-span-2">
                          <Label className="form-label text-sm font-semibold text-slate-700">Gallery Images</Label>
                          <div
                            className="mt-2 border-2 border-dashed border-slate-200 rounded-xl p-6 flex flex-col items-center justify-center bg-slate-50/50 hover:bg-slate-50 hover:border-primary/30 cursor-pointer transition-all"
                            onClick={addImageFromFile}
                          >
                            <Upload className="w-8 h-8 text-slate-400 mb-2" />
                            <p className="text-sm font-semibold text-slate-600">Click to upload assets</p>
                            <p className="text-xs text-slate-400 mt-1">Add up to 5 supporting images</p>
                          </div>

                          {newBlog.blogImages.length > 0 && (
                            <div className="grid grid-cols-5 gap-3 mt-4">
                              {newBlog.blogImages.map((img) => (
                                <div key={img.id} className="relative aspect-square rounded-lg overflow-hidden border border-slate-200 group">
                                  <Image src={img.url} alt={img.alt} fill className="object-cover" />
                                  <button
                                    onClick={(e) => { e.stopPropagation(); removeImage(img.id); }}
                                    className="absolute top-1 right-1 p-1 bg-white/90 rounded-full shadow-sm hover:bg-red-50 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                  >
                                    <X className="w-3 h-3" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        <div className="form-field col-span-2">
                          <Label className="form-label text-sm font-semibold text-slate-700">Tags (comma separated)</Label>
                          <Input
                            placeholder="e.g. Wellness, Health, Nutrition"
                            value={newBlog.tags}
                            onChange={(e) => setNewBlog({ ...newBlog, tags: e.target.value })}
                            className="h-11 border-slate-200 rounded-lg focus:ring-primary/5 focus:border-primary transition-all"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {addStep === 3 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                      <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-100 flex gap-3">
                        <Sparkles className="w-5 h-5 text-blue-500 shrink-0" />
                        <div>
                          <p className="text-sm font-semibold text-blue-900">SEO Optimization</p>
                          <p className="text-xs text-blue-700 mt-0.5">Define how your article appears in search engines and social media platforms.</p>
                        </div>
                      </div>

                      <div className="form-grid gap-4">
                        <div className="form-field col-span-2">
                          <Label className="form-label text-sm font-semibold text-slate-700">Meta Title</Label>
                          <Input
                            placeholder="SEO title for search results"
                            value={newBlog.metaTitle}
                            onChange={(e) => setNewBlog({ ...newBlog, metaTitle: e.target.value })}
                            className="h-11 border-slate-200 rounded-lg focus:ring-primary/5 focus:border-primary transition-all"
                          />
                        </div>
                        <div className="form-field col-span-2">
                          <Label className="form-label text-sm font-semibold text-slate-700">Meta Description</Label>
                          <Textarea
                            placeholder="Search engine description (max 160 chars)"
                            value={newBlog.metaDescription}
                            onChange={(e) => setNewBlog({ ...newBlog, metaDescription: e.target.value })}
                            rows={3}
                            className="border-slate-200 rounded-lg focus:ring-primary/5 focus:border-primary transition-all min-h-[80px]"
                          />
                        </div>
                        <div className="form-field col-span-2">
                          <Label className="form-label text-sm font-semibold text-slate-700">OG Title (Social)</Label>
                          <Input
                            placeholder="Title when shared on Facebook/Twitter"
                            value={newBlog.ogTitle}
                            onChange={(e) => setNewBlog({ ...newBlog, ogTitle: e.target.value })}
                            className="h-11 border-slate-200 rounded-lg focus:ring-primary/5 focus:border-primary transition-all"
                          />
                        </div>
                        <div className="form-field col-span-2">
                          <Label className="form-label text-sm font-semibold text-slate-700">OG Description (Social)</Label>
                          <Textarea
                            placeholder="Description when shared on social media"
                            value={newBlog.ogDescription}
                            onChange={(e) => setNewBlog({ ...newBlog, ogDescription: e.target.value })}
                            rows={3}
                            className="border-slate-200 rounded-lg focus:ring-primary/5 focus:border-primary transition-all min-h-[80px]"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="bg-slate-50 p-6 border-t border-slate-100 flex items-center justify-between">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setShowAddModal(false)}
                    className="text-slate-500 font-medium hover:bg-slate-200 rounded-lg"
                  >
                    Cancel
                  </Button>

                  <div className="flex gap-3">
                    {addStep > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setAddStep(prev => prev - 1)}
                        className="h-11 border-slate-200 rounded-lg font-semibold px-4"
                      >
                        <ChevronLeft className="w-4 h-4 mr-1.5" />
                        Previous
                      </Button>
                    )}

                    {addStep < 3 ? (
                      <Button
                        type="button"
                        onClick={() => setAddStep(prev => prev + 1)}
                        className="h-11 !bg-blue-600 hover:!bg-blue-700 !text-white font-bold rounded-lg px-8 shadow-lg shadow-blue-200/50 transition-all active:scale-95 flex items-center gap-2"
                      >
                        Next Step
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    ) : (
                      <Button
                        onClick={handleAddBlog}
                        disabled={isLocalLoading}
                        className="h-11 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-8 rounded-lg shadow-md shadow-emerald-200/50"
                      >
                        {isLocalLoading ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Publishing...
                          </>
                        ) : (
                          "Publish Now"
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            {/* Edit Blog Modal */}
            <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
              <DialogContent className="max-w-3xl p-0 gap-0 rounded-2xl border-slate-200 shadow-2xl overflow-hidden bg-white">
                {selectedBlog && (
                  <>
                    <div className="bg-slate-50/50 px-8 py-6 border-b border-slate-100">
                      <DialogHeader>
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                            <Edit className="w-5 h-5 text-amber-600" />
                          </div>
                          <div>
                            <DialogTitle className="text-xl font-bold text-slate-900">Refine Narrative</DialogTitle>
                            <DialogDescription className="text-slate-500 font-medium truncate max-w-[400px]">
                              Editing: {selectedBlog.title}
                            </DialogDescription>
                          </div>
                        </div>
                      </DialogHeader>

                      <div className="mt-8">
                        <FormSteps currentStep={editStep} steps={blogSteps} />
                      </div>
                    </div>

                    <div className="p-8 max-h-[60vh] overflow-y-auto">
                      {editStep === 1 && (
                        <div className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-300">
                          <div className="form-grid gap-4">
                            <div className="form-field col-span-2">
                              <Label className="form-label text-sm font-semibold text-slate-700">Article Title <span className="text-destructive">*</span></Label>
                              <Input
                                placeholder="Enter a compelling article title..."
                                value={selectedBlog.title}
                                onChange={(e) => setSelectedBlog({ ...selectedBlog, title: e.target.value })}
                                className="h-11 border-slate-200 rounded-lg focus:ring-primary/5 focus:border-primary transition-all font-semibold"
                              />
                            </div>
                            <div className="form-field col-span-2">
                              <Label className="form-label text-sm font-semibold text-slate-700">URL Slug</Label>
                              <Input
                                placeholder="url-friendly-slug"
                                value={selectedBlog.slug}
                                onChange={(e) => setSelectedBlog({ ...selectedBlog, slug: e.target.value })}
                                className="h-11 border-slate-200 rounded-lg focus:ring-primary/5 focus:border-primary transition-all font-mono text-xs"
                              />
                            </div>
                            <div className="form-field col-span-2">
                              <Label className="form-label text-sm font-semibold text-slate-700">Excerpt</Label>
                              <Textarea
                                placeholder="Summary for previews..."
                                value={selectedBlog.excerpt}
                                onChange={(e) => setSelectedBlog({ ...selectedBlog, excerpt: e.target.value })}
                                rows={3}
                                className="border-slate-200 rounded-lg focus:ring-primary/5 focus:border-primary transition-all min-h-[80px]"
                              />
                            </div>
                            <div className="form-field col-span-2">
                              <Label className="form-label text-sm font-semibold text-slate-700">Full Content <span className="text-destructive">*</span></Label>
                              <Textarea
                                placeholder="Write your article content here..."
                                value={selectedBlog.content}
                                onChange={(e) => setSelectedBlog({ ...selectedBlog, content: e.target.value })}
                                rows={8}
                                className="border-slate-200 rounded-lg focus:ring-primary/5 focus:border-primary transition-all min-h-[200px]"
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {editStep === 2 && (
                        <div className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-300">
                          <div className="form-grid gap-4">
                            <div className="form-field col-span-2 sm:col-span-1">
                              <Label className="form-label text-sm font-semibold text-slate-700">Category</Label>
                              <Select
                                value={selectedBlog.category}
                                onValueChange={(val) => setSelectedBlog({ ...selectedBlog, category: val })}
                              >
                                <SelectTrigger className="h-11 border-slate-200 rounded-lg focus:ring-primary/5 focus:border-primary transition-all">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {blogCategories.filter(c => c !== 'All').map(c => (
                                    <SelectItem key={c} value={c}>{c}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="form-field col-span-2 sm:col-span-1">
                              <Label className="form-label text-sm font-semibold text-slate-700">Status</Label>
                              <Select
                                value={selectedBlog.status}
                                onValueChange={(val) => setSelectedBlog({ ...selectedBlog, status: val })}
                              >
                                <SelectTrigger className="h-11 border-slate-200 rounded-lg focus:ring-primary/5 focus:border-primary transition-all">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="draft">Draft</SelectItem>
                                  <SelectItem value="published">Published</SelectItem>
                                  <SelectItem value="archived">Archived</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="form-field col-span-2">
                              <Label className="form-label text-sm font-semibold text-slate-700">Featured Image URL</Label>
                              <div className="flex gap-2">
                                <Input
                                  placeholder="https://example.com/image.jpg"
                                  value={selectedBlog.featuredImage}
                                  onChange={(e) => setSelectedBlog({ ...selectedBlog, featuredImage: e.target.value })}
                                  className="h-11 border-slate-200 rounded-lg focus:ring-primary/5 focus:border-primary transition-all flex-1"
                                />
                                <Button
                                  type="button"
                                  variant="outline"
                                  onClick={() => handleFeaturedImageUpload(true)}
                                  className="h-11 border-slate-200 rounded-lg bg-slate-50 hover:bg-slate-100"
                                >
                                  <Upload className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                            <div className="form-field col-span-2">
                              <Label className="form-label text-sm font-semibold text-slate-700">Gallery Images</Label>
                              <div
                                className="mt-2 border-2 border-dashed border-slate-200 rounded-xl p-6 flex flex-col items-center justify-center bg-slate-50/50 hover:bg-slate-50 hover:border-primary/30 cursor-pointer transition-all"
                                onClick={addImageToEdit}
                              >
                                <Upload className="w-8 h-8 text-slate-400 mb-2" />
                                <p className="text-sm font-semibold text-slate-600">Click to upload assets</p>
                                <p className="text-xs text-slate-400 mt-1">Add up to 5 supporting images</p>
                              </div>

                              {selectedBlog.blogImages && selectedBlog.blogImages.length > 0 && (
                                <div className="grid grid-cols-5 gap-3 mt-4">
                                  {selectedBlog.blogImages.map((img) => (
                                    <div key={img.id} className="relative aspect-square rounded-lg overflow-hidden border border-slate-200 group">
                                      <Image src={img.url} alt={img.alt} fill className="object-cover" />
                                      <button
                                        onClick={(e) => { e.stopPropagation(); removeImageFromEdit(img.id); }}
                                        className="absolute top-1 right-1 p-1 bg-white/90 rounded-full shadow-sm hover:bg-red-50 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                      >
                                        <X className="w-3 h-3" />
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                            <div className="form-field col-span-2">
                              <Label className="form-label text-sm font-semibold text-slate-700">Tags (comma separated)</Label>
                              <Input
                                placeholder="e.g. Wellness, Health"
                                value={Array.isArray(selectedBlog.tags) ? selectedBlog.tags.join(', ') : selectedBlog.tags}
                                onChange={(e) => setSelectedBlog({ ...selectedBlog, tags: e.target.value })}
                                className="h-11 border-slate-200 rounded-lg focus:ring-primary/5 focus:border-primary transition-all"
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {editStep === 3 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                          <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-100 flex gap-3">
                            <Sparkles className="w-5 h-5 text-blue-500 shrink-0" />
                            <div>
                              <p className="text-sm font-semibold text-blue-900">SEO Check</p>
                              <p className="text-xs text-blue-700 mt-0.5">Ensure your content is optimized for better search rankings.</p>
                            </div>
                          </div>

                          <div className="form-grid gap-4">
                            <div className="form-field col-span-2">
                              <Label className="form-label text-sm font-semibold text-slate-700">Meta Title</Label>
                              <Input
                                placeholder="SEO title..."
                                value={selectedBlog.metaTitle}
                                onChange={(e) => setSelectedBlog({ ...selectedBlog, metaTitle: e.target.value })}
                                className="h-11 border-slate-200 rounded-lg focus:ring-primary/5 focus:border-primary transition-all"
                              />
                            </div>
                            <div className="form-field col-span-2">
                              <Label className="form-label text-sm font-semibold text-slate-700">Meta Description</Label>
                              <Textarea
                                placeholder="Search engine description..."
                                value={selectedBlog.metaDescription}
                                onChange={(e) => setSelectedBlog({ ...selectedBlog, metaDescription: e.target.value })}
                                rows={4}
                                className="border-slate-200 rounded-lg focus:ring-primary/5 focus:border-primary transition-all min-h-[120px]"
                              />
                            </div>
                            <div className="form-field col-span-2 sm:col-span-1">
                              <Label className="form-label text-sm font-semibold text-slate-700">OG Title</Label>
                              <Input
                                placeholder="Social title..."
                                value={selectedBlog.ogTitle}
                                onChange={(e) => setSelectedBlog({ ...selectedBlog, ogTitle: e.target.value })}
                                className="h-11 border-slate-200 rounded-lg focus:ring-primary/5 focus:border-primary transition-all"
                              />
                            </div>
                            <div className="form-field col-span-2 sm:col-span-1">
                              <Label className="form-label text-sm font-semibold text-slate-700">OG Image URL</Label>
                              <Input
                                placeholder="Social image..."
                                value={selectedBlog.ogImage}
                                onChange={(e) => setSelectedBlog({ ...selectedBlog, ogImage: e.target.value })}
                                className="h-11 border-slate-200 rounded-lg focus:ring-primary/5 focus:border-primary transition-all"
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="bg-slate-50 p-6 border-t border-slate-100 flex items-center justify-between">
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => setShowEditModal(false)}
                        className="text-slate-500 font-medium hover:bg-slate-200 rounded-lg"
                      >
                        Cancel
                      </Button>

                      <div className="flex gap-3">
                        {editStep > 1 && (
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setEditStep(prev => prev - 1)}
                            className="h-11 border-slate-200 rounded-lg font-semibold px-4"
                          >
                            <ChevronLeft className="w-4 h-4 mr-1.5" />
                            Previous
                          </Button>
                        )}

                        {editStep < 3 ? (
                          <Button
                            type="button"
                            onClick={() => setEditStep(prev => prev + 1)}
                            className="h-11 !bg-blue-600 hover:!bg-blue-700 !text-white font-bold rounded-lg px-8 shadow-lg shadow-blue-200/50 transition-all active:scale-95 flex items-center gap-2"
                          >
                            Next Step
                            <ChevronRight className="w-4 h-4" />
                          </Button>
                        ) : (
                          <Button
                            onClick={handleEditBlog}
                            disabled={isLocalLoading}
                            className="h-11 bg-amber-600 hover:bg-amber-700 text-white font-bold px-8 rounded-lg shadow-md shadow-amber-200/50"
                          >
                            {isLocalLoading ? (
                              <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Updating...
                              </>
                            ) : (
                              "Update Narrative"
                            )}
                          </Button>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </DialogContent>
            </Dialog>

            {/* Delete Modal */}
            <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
              <DialogContent className="max-w-md p-0 overflow-hidden rounded-xl border-none shadow-2xl">
                <div className="p-8 text-center">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Trash2 className="w-8 h-8 text-red-600" />
                  </div>
                  <DialogTitle className="text-2xl font-bold text-slate-900">Purge Article?</DialogTitle>
                  <DialogDescription className="text-slate-500 font-medium mt-2">
                    You are about to permanently delete &quot;{selectedBlog?.title}&quot;. This action will remove the article from the server and cannot be reversed.
                  </DialogDescription>
                </div>
                <div className="flex border-t border-slate-100 h-16">
                  <button onClick={() => setShowDeleteModal(false)} className="flex-1 font-bold text-slate-500 hover:bg-slate-50 transition-colors border-r border-slate-100">Cancel</button>
                  <button onClick={handleDeleteBlog} className="flex-1 font-bold text-red-600 hover:bg-red-50 transition-colors">Destroy narrative</button>
                </div>
              </DialogContent>
            </Dialog>
          </>
        )}
      </div>
    </TooltipProvider>
  )
}

export default BlogsPage
