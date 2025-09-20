import React, { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Upload, 
  FileText, 
  Download, 
  CheckCircle, 
  AlertCircle,
  X,
  Eye,
  Trash2
} from 'lucide-react';

interface ImportBatch {
  id: string;
  filename: string;
  totalRows: number;
  processedRows: number;
  successCount: number;
  errorCount: number;
  status: 'processing' | 'completed' | 'failed';
  createdAt: string;
  completedAt?: string;
}

interface ImportError {
  row: number;
  field: string;
  message: string;
}

const AdminImport = () => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [importBatches, setImportBatches] = useState<ImportBatch[]>([]);
  const [importErrors, setImportErrors] = useState<ImportError[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Mock data for recent imports
  React.useEffect(() => {
    setImportBatches([
      {
        id: '1',
        filename: 'influencers_batch_1.csv',
        totalRows: 25,
        processedRows: 25,
        successCount: 23,
        errorCount: 2,
        status: 'completed',
        createdAt: '2024-01-15T10:30:00Z',
        completedAt: '2024-01-15T10:32:00Z'
      },
      {
        id: '2',
        filename: 'influencers_batch_2.csv',
        totalRows: 50,
        processedRows: 50,
        successCount: 48,
        errorCount: 2,
        status: 'completed',
        createdAt: '2024-01-14T14:20:00Z',
        completedAt: '2024-01-14T14:25:00Z'
      },
      {
        id: '3',
        filename: 'influencers_batch_3.csv',
        totalRows: 30,
        processedRows: 15,
        successCount: 12,
        errorCount: 3,
        status: 'processing',
        createdAt: '2024-01-15T16:45:00Z'
      }
    ]);
  }, []);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFile = (file: File) => {
    if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
      setSelectedFile(file);
    } else {
      // Please select a CSV file
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const downloadTemplate = () => {
    const csvContent = `name,platform,handle,bio,website_url,email,linkedin_url,twitter_url,industry,audience_size,engagement_rate,location,expertise_tags
John Doe,LinkedIn,@johndoe,B2B Marketing Expert,https://johndoe.com,john@example.com,https://linkedin.com/in/johndoe,https://twitter.com/johndoe,Technology,10000,4.5,San Francisco,"marketing,saas,growth"`;
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'influencer_template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    
    setIsUploading(true);
    
    // Simulate upload process
    setTimeout(() => {
      const newBatch: ImportBatch = {
        id: Date.now().toString(),
        filename: selectedFile.name,
        totalRows: 20,
        processedRows: 20,
        successCount: 18,
        errorCount: 2,
        status: 'completed',
        createdAt: new Date().toISOString(),
        completedAt: new Date().toISOString()
      };
      
      setImportBatches(prev => [newBatch, ...prev]);
      setSelectedFile(null);
      setIsUploading(false);
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }, 3000);
  };

  const removeFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-3 w-3" />;
      case 'processing':
        return <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600" />;
      case 'failed':
        return <AlertCircle className="h-3 w-3" />;
      default:
        return null;
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Bulk Import</h1>
        <p className="text-gray-600">Upload CSV files to add multiple influencers at once</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upload Section */}
        <div className="space-y-6">
          {/* Template Download */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                CSV Template
              </CardTitle>
              <CardDescription>
                Download our template to ensure proper formatting
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={downloadTemplate} variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Download Template
              </Button>
            </CardContent>
          </Card>

          {/* File Upload */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Upload className="h-5 w-5 mr-2" />
                Upload CSV
              </CardTitle>
              <CardDescription>
                Select a CSV file to import influencers
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!selectedFile ? (
                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                    dragActive 
                      ? 'border-blue-400 bg-blue-50' 
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-lg font-medium text-gray-900 mb-2">
                    Drop your CSV file here
                  </p>
                  <p className="text-gray-500 mb-4">
                    or click to browse files
                  </p>
                  <Button 
                    onClick={() => fileInputRef.current?.click()}
                    variant="outline"
                  >
                    Select File
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv"
                    onChange={handleFileInput}
                    className="hidden"
                  />
                </div>
              ) : (
                <div className="border rounded-lg p-4 bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <FileText className="h-8 w-8 text-blue-600" />
                      <div>
                        <p className="font-medium">{selectedFile.name}</p>
                        <p className="text-sm text-gray-500">
                          {(selectedFile.size / 1024).toFixed(1)} KB
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={removeFile}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="mt-4 flex space-x-2">
                    <Button 
                      onClick={handleUpload}
                      disabled={isUploading}
                      className="flex-1"
                    >
                      {isUploading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Upload className="h-4 w-4 mr-2" />
                          Upload & Process
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Import History */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Recent Imports</CardTitle>
              <CardDescription>
                Track your import history and status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {importBatches.map((batch) => (
                  <div key={batch.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <FileText className="h-4 w-4 text-gray-500" />
                        <span className="font-medium text-sm">{batch.filename}</span>
                      </div>
                      <Badge className={getStatusColor(batch.status)}>
                        <span className="flex items-center">
                          {getStatusIcon(batch.status)}
                          <span className="ml-1 capitalize">{batch.status}</span>
                        </span>
                      </Badge>
                    </div>
                    
                    <div className="text-sm text-gray-600 mb-2">
                      {batch.processedRows} of {batch.totalRows} rows processed
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex space-x-4">
                        <span className="text-green-600">
                          ✓ {batch.successCount} successful
                        </span>
                        {batch.errorCount > 0 && (
                          <span className="text-red-600">
                            ✗ {batch.errorCount} errors
                          </span>
                        )}
                      </div>
                      <div className="text-gray-500">
                        {new Date(batch.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    
                    {batch.status === 'processing' && (
                      <div className="mt-2">
                        <Progress 
                          value={(batch.processedRows / batch.totalRows) * 100} 
                          className="h-2"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminImport;
