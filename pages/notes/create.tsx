import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Navbar from '@/components/Navbar';
import UploadPhoto from '@/components/UploadPhoto';
import { notesAPI } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import toast from 'react-hot-toast';

export default function CreateNotePage() {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    image_url: '',
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error('Please login to create notes');
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageUpload = (imageUrl: string) => {
    setFormData({
      ...formData,
      image_url: imageUrl,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.error('Please enter a title');
      return;
    }

    if (!formData.content.trim()) {
      toast.error('Please enter some content');
      return;
    }

    setLoading(true);

    try {
      await notesAPI.create(formData);
      toast.success('Note created successfully!');
      router.push('/notes');
    } catch (error: any) {
      console.error('Error creating note:', error);
      toast.error(error.response?.data?.error || 'Failed to create note');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Create New Note</h1>
          <p className="text-gray-600">Share your thoughts and ideas with the community</p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-xl shadow-sm p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                id="title"
                name="title"
                type="text"
                required
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition text-lg"
                placeholder="Enter a catchy title..."
              />
            </div>

            {/* Content */}
            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                Content <span className="text-red-500">*</span>
              </label>
              <textarea
                id="content"
                name="content"
                required
                rows={12}
                value={formData.content}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition resize-none"
                placeholder="Write your note content here..."
              />
              <p className="mt-2 text-sm text-gray-500">
                {formData.content.length} characters
              </p>
            </div>

            {/* Image Upload */}
            <UploadPhoto
              onUploadComplete={handleImageUpload}
              currentImage={formData.image_url}
            />

            {/* Preview Section */}
            {(formData.title || formData.content) && (
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Preview</h3>
                <div className="bg-gray-50 rounded-lg p-6">
                  {formData.image_url && (
                    <div className="mb-4 rounded-lg overflow-hidden">
                      <img
                        src={formData.image_url}
                        alt="Preview"
                        className="w-full h-64 object-cover"
                      />
                    </div>
                  )}
                  <h2 className="text-2xl font-bold text-gray-900 mb-3">
                    {formData.title || 'Your title here'}
                  </h2>
                  <p className="text-gray-700 whitespace-pre-wrap">
                    {formData.content || 'Your content will appear here...'}
                  </p>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-between pt-6 border-t">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-6 py-3 text-gray-700 bg-gray-100 rounded-lg font-medium hover:bg-gray-200 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating...
                  </span>
                ) : (
                  'Create Note'
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Tips */}
        <div className="mt-8 bg-primary-50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-primary-900 mb-3">💡 Tips for great notes:</h3>
          <ul className="space-y-2 text-primary-800">
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Use a descriptive title that captures the main idea</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Break up long text with paragraphs for better readability</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Add an image to make your note more engaging</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Keep your content clear and concise</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}