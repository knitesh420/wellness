'use client'

import React from 'react'
import { Upload, Edit, Save, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'

interface SeoData {
  siteTitle: string
  siteDescription: string
  siteKeywords: string
  ogImage: string
  twitterHandle: string
  googleAnalytics: string
  facebookPixel: string
  sitemapUrl: string
  robotsTxt: string
  thirdPartyScripts: {
    googleTagManager: string
    hotjar: string
    intercom: string
    zendesk: string
    customScripts: string
  }
  metaTags: {
    author: string
    robots: string
    viewport: string
    themeColor: string
    customMetaTags: string
  }
}

interface SEOSettingsProps {
  seoData: SeoData
  setSeoData: React.Dispatch<React.SetStateAction<SeoData>>
  editStates: { seo: boolean }
  isLoading: boolean
  onEdit: (section: string) => void
  onCancel: (section: string) => void
  onSave: (section: string) => void
}

const SEOSettings: React.FC<SEOSettingsProps> = ({
  seoData,
  setSeoData,
  editStates,
  isLoading,
  onEdit,
  onCancel,
  onSave
}) => {
  return (
    <Card className="border-slate-200 shadow-sm rounded-2xl overflow-hidden">
      <CardHeader className="border-b border-slate-50 bg-slate-50/30 px-8 py-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <CardTitle className="text-xl font-bold text-slate-900 tracking-tight">SEO optimization</CardTitle>
            <CardDescription className="text-sm text-slate-500">Configure how your website appears in search engines and social media</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            {!editStates.seo ? (
              <Button
                onClick={() => onEdit('seo')}
                className="h-10 px-6 rounded-xl font-bold shadow-sm"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit SEO
              </Button>
            ) : (
              <>
                <Button
                  onClick={() => onCancel('seo')}
                  variant="outline"
                  disabled={isLoading}
                  className="h-10 px-4 rounded-xl border-slate-200 font-bold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => onSave('seo')}
                  disabled={isLoading}
                  className="h-10 px-6 rounded-xl font-bold shadow-lg shadow-indigo-100 bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save changes
                    </>
                  )}
                </Button>
              </>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-8 space-y-8">
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="siteTitle" className="text-sm font-semibold text-slate-700 ml-1">Site title</Label>
            <Input
              id="siteTitle"
              value={seoData.siteTitle}
              onChange={(e) => setSeoData({ ...seoData, siteTitle: e.target.value })}
              placeholder="Your website title"
              disabled={!editStates.seo}
              className="h-11 rounded-xl border-slate-200 focus:border-indigo-500/30 font-medium disabled:opacity-60"
            />
            <p className="text-[11px] text-slate-400 ml-1 font-medium">Recommended: 50–60 characters for optimal display</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="siteDescription" className="text-sm font-semibold text-slate-700 ml-1">Meta description</Label>
            <Textarea
              id="siteDescription"
              value={seoData.siteDescription}
              onChange={(e) => setSeoData({ ...seoData, siteDescription: e.target.value })}
              rows={3}
              placeholder="Brief description of your website"
              disabled={!editStates.seo}
              className="rounded-2xl border-slate-200 focus:border-indigo-500/30 p-4 leading-relaxed font-medium disabled:opacity-60"
            />
            <p className="text-[11px] text-slate-400 ml-1 font-medium">Recommended: 150–160 characters for search snippets</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="siteKeywords" className="text-sm font-semibold text-slate-700 ml-1">Search keywords</Label>
            <Input
              id="siteKeywords"
              value={seoData.siteKeywords}
              onChange={(e) => setSeoData({ ...seoData, siteKeywords: e.target.value })}
              placeholder="keyword1, keyword2, keyword3"
              disabled={!editStates.seo}
              className="h-11 rounded-xl border-slate-200 focus:border-indigo-500/30 font-medium disabled:opacity-60"
            />
            <p className="text-[11px] text-slate-400 ml-1 font-medium">Separate keywords with commas</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="ogImage" className="text-sm font-semibold text-slate-700 ml-1">Open graph image</Label>
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <Input
                id="ogImage"
                value={seoData.ogImage}
                onChange={(e) => setSeoData({ ...seoData, ogImage: e.target.value })}
                placeholder="https://example.com/og-image.jpg"
                disabled={!editStates.seo}
                className="h-11 rounded-xl border-slate-200 focus:border-indigo-500/30 font-medium disabled:opacity-60 sm:flex-1"
              />
              <Button
                variant="outline"
                size="sm"
                disabled={!editStates.seo}
                className="h-11 px-4 rounded-xl border-slate-200 font-bold text-xs uppercase tracking-wider hover:bg-slate-50 w-full sm:w-auto"
              >
                <Upload className="w-3.5 h-3.5 mr-2" />
                Upload
              </Button>
            </div>
            <p className="text-[11px] text-slate-400 ml-1 font-medium">Recommended: 1200x630px for social media sharing</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            <div className="space-y-2">
              <Label htmlFor="twitterHandle" className="text-sm font-semibold text-slate-700 ml-1">Twitter handle</Label>
              <Input
                id="twitterHandle"
                value={seoData.twitterHandle}
                onChange={(e) => setSeoData({ ...seoData, twitterHandle: e.target.value })}
                placeholder="@yourhandle"
                disabled={!editStates.seo}
                className="h-11 rounded-xl border-slate-200 focus:border-indigo-500/30 font-medium disabled:opacity-60"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="googleAnalytics" className="text-sm font-semibold text-slate-700 ml-1">Google analytics ID</Label>
              <Input
                id="googleAnalytics"
                value={seoData.googleAnalytics}
                onChange={(e) => setSeoData({ ...seoData, googleAnalytics: e.target.value })}
                placeholder="GA-XXXXXXXXX-X"
                disabled={!editStates.seo}
                className="h-11 rounded-xl border-slate-200 focus:border-indigo-500/30 font-medium disabled:opacity-60"
              />
            </div>
          </div>
        </div>

        <Separator className="bg-slate-100" />

        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-50 rounded-lg">
              <Save className="w-4 h-4 text-indigo-600" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 tracking-tight">Third-party scripts</h3>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              <div className="space-y-2">
                <Label htmlFor="googleTagManager" className="text-sm font-semibold text-slate-700 ml-1">Google tag manager ID</Label>
                <Input
                  id="googleTagManager"
                  value={seoData.thirdPartyScripts.googleTagManager}
                  onChange={(e) => setSeoData({
                    ...seoData,
                    thirdPartyScripts: {
                      ...seoData.thirdPartyScripts,
                      googleTagManager: e.target.value
                    }
                  })}
                  placeholder="GTM-XXXXXXX"
                  disabled={!editStates.seo}
                  className="h-11 rounded-xl border-slate-200 focus:border-indigo-500/30 font-medium disabled:opacity-60"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hotjar" className="text-sm font-semibold text-slate-700 ml-1">Hotjar site ID</Label>
                <Input
                  id="hotjar"
                  value={seoData.thirdPartyScripts.hotjar}
                  onChange={(e) => setSeoData({
                    ...seoData,
                    thirdPartyScripts: {
                      ...seoData.thirdPartyScripts,
                      hotjar: e.target.value
                    }
                  })}
                  placeholder="1234567"
                  disabled={!editStates.seo}
                  className="h-11 rounded-xl border-slate-200 focus:border-indigo-500/30 font-medium disabled:opacity-60"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="intercom" className="text-sm font-semibold text-slate-700 ml-1">Intercom app ID</Label>
                <Input
                  id="intercom"
                  value={seoData.thirdPartyScripts.intercom}
                  onChange={(e) => setSeoData({
                    ...seoData,
                    thirdPartyScripts: {
                      ...seoData.thirdPartyScripts,
                      intercom: e.target.value
                    }
                  })}
                  placeholder="xxxxxxxx"
                  disabled={!editStates.seo}
                  className="h-11 rounded-xl border-slate-200 focus:border-indigo-500/30 font-medium disabled:opacity-60"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="zendesk" className="text-sm font-semibold text-slate-700 ml-1">Zendesk widget key</Label>
                <Input
                  id="zendesk"
                  value={seoData.thirdPartyScripts.zendesk}
                  onChange={(e) => setSeoData({
                    ...seoData,
                    thirdPartyScripts: {
                      ...seoData.thirdPartyScripts,
                      zendesk: e.target.value
                    }
                  })}
                  placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                  disabled={!editStates.seo}
                  className="h-11 rounded-xl border-slate-200 focus:border-indigo-500/30 font-medium disabled:opacity-60"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="customScripts" className="text-sm font-semibold text-slate-700 ml-1">Custom scripts</Label>
              <Textarea
                id="customScripts"
                value={seoData.thirdPartyScripts.customScripts}
                onChange={(e) => setSeoData({
                  ...seoData,
                  thirdPartyScripts: {
                    ...seoData.thirdPartyScripts,
                    customScripts: e.target.value
                  }
                })}
                placeholder="<!-- Custom tracking scripts -->&#10;&lt;script&gt;&#10;  // Your custom JavaScript code here&#10;&lt;/script&gt;"
                rows={6}
                disabled={!editStates.seo}
                className="rounded-2xl border-slate-200 focus:border-indigo-500/30 p-4 leading-relaxed font-mono text-xs disabled:opacity-60"
              />
              <p className="text-[11px] text-slate-400 ml-1 font-medium">Add custom JavaScript code for tracking or analytics</p>
            </div>
          </div>
        </div>

        <Separator className="bg-slate-100" />

        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-50 rounded-lg">
              <Edit className="w-4 h-4 text-emerald-600" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 tracking-tight">Meta tags configuration</h3>
          </div>

          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              <div className="space-y-2">
                <Label htmlFor="metaAuthor" className="text-sm font-semibold text-slate-700 ml-1">Author name</Label>
                <Input
                  id="metaAuthor"
                  value={seoData.metaTags.author}
                  onChange={(e) => setSeoData({
                    ...seoData,
                    metaTags: {
                      ...seoData.metaTags,
                      author: e.target.value
                    }
                  })}
                  placeholder="Author Name"
                  disabled={!editStates.seo}
                  className="h-11 rounded-xl border-slate-200 focus:border-indigo-500/30 font-medium disabled:opacity-60"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="metaRobots" className="text-sm font-semibold text-slate-700 ml-1">Search robots policy</Label>
                <Select
                  value={seoData.metaTags.robots}
                  onValueChange={(value) => setSeoData({
                    ...seoData,
                    metaTags: {
                      ...seoData.metaTags,
                      robots: value
                    }
                  })}
                  disabled={!editStates.seo}
                >
                  <SelectTrigger className="h-11 rounded-xl border-slate-200 focus:border-indigo-500/30 font-medium disabled:opacity-60">
                    <SelectValue placeholder="Select robots directive" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="index, follow">Index, Follow</SelectItem>
                    <SelectItem value="index, nofollow">Index, No Follow</SelectItem>
                    <SelectItem value="noindex, follow">No Index, Follow</SelectItem>
                    <SelectItem value="noindex, nofollow">No Index, No Follow</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="metaViewport" className="text-sm font-semibold text-slate-700 ml-1">Display viewport</Label>
                <Input
                  id="metaViewport"
                  value={seoData.metaTags.viewport}
                  onChange={(e) => setSeoData({
                    ...seoData,
                    metaTags: {
                      ...seoData.metaTags,
                      viewport: e.target.value
                    }
                  })}
                  placeholder="width=device-width, initial-scale=1"
                  disabled={!editStates.seo}
                  className="h-11 rounded-xl border-slate-200 focus:border-indigo-500/30 font-medium disabled:opacity-60"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="metaThemeColor" className="text-sm font-semibold text-slate-700 ml-1">Browser theme color</Label>
                <div className="flex items-center gap-3">
                  <div
                    className="w-11 h-11 rounded-xl border border-slate-200 shadow-sm"
                    style={{ backgroundColor: seoData.metaTags.themeColor }}
                  />
                  <Input
                    id="metaThemeColor"
                    value={seoData.metaTags.themeColor}
                    onChange={(e) => setSeoData({
                      ...seoData,
                      metaTags: {
                        ...seoData.metaTags,
                        themeColor: e.target.value
                      }
                    })}
                    placeholder="#10b981"
                    disabled={!editStates.seo}
                    className="h-11 rounded-xl border-slate-200 focus:border-indigo-500/30 font-mono disabled:opacity-60 flex-1"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="customMetaTags" className="text-sm font-semibold text-slate-700 ml-1">Custom meta tags</Label>
              <Textarea
                id="customMetaTags"
                value={seoData.metaTags.customMetaTags}
                onChange={(e) => setSeoData({
                  ...seoData,
                  metaTags: {
                    ...seoData.metaTags,
                    customMetaTags: e.target.value
                  }
                })}
                placeholder="&lt;meta name=&quot;custom&quot; content=&quot;value&quot;&gt;&#10;&lt;meta property=&quot;og:type&quot; content=&quot;website&quot;&gt;&#10;&lt;meta name=&quot;twitter:card&quot; content=&quot;summary_large_image&quot;&gt;"
                rows={6}
                disabled={!editStates.seo}
                className="rounded-2xl border-slate-200 focus:border-indigo-500/30 p-4 leading-relaxed font-mono text-xs disabled:opacity-60"
              />
              <p className="text-[11px] text-slate-400 ml-1 font-medium">Add specific meta tags for advanced platform requirements</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default SEOSettings
