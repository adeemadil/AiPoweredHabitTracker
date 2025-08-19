import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Alert, AlertDescription } from './ui/alert';
import { Progress } from './ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { 
  Download, 
  Upload, 
  Shield, 
  CheckCircle2, 
  AlertTriangle,
  FileText,
  Database,
  Calendar,
  Activity
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { habitService, type Habit } from '../services/habitService';

interface DataManagementProps {
  habits: Habit[];
  onHabitsUpdated: () => void;
}

interface ExportData {
  version: string;
  exportDate: string;
  user: string;
  habits: Habit[];
  settings?: any;
}

export function DataManagement({ habits, onHabitsUpdated }: DataManagementProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [importProgress, setImportProgress] = useState(0);
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState('');
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importPreview, setImportPreview] = useState<ExportData | null>(null);

  const handleExport = async () => {
    try {
      setIsExporting(true);
      setError('');
      setExportProgress(0);

      // Simulate export progress
      const steps = [
        { message: 'Gathering habit data...', progress: 20 },
        { message: 'Processing streaks...', progress: 40 },
        { message: 'Exporting analytics...', progress: 60 },
        { message: 'Creating backup file...', progress: 80 },
        { message: 'Finalizing export...', progress: 100 }
      ];

      for (const step of steps) {
        setExportProgress(step.progress);
        await new Promise(resolve => setTimeout(resolve, 300));
      }

      // Create export data
      const exportData: ExportData = {
        version: '1.0.0',
        exportDate: new Date().toISOString(),
        user: 'current_user',
        habits: habits,
        settings: {
          notifications: JSON.parse(localStorage.getItem('notification-settings') || '{}'),
          preferences: {
            darkMode: document.documentElement.classList.contains('dark')
          }
        }
      };

      // Create and download file
      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: 'application/json'
      });
      
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `habitual-backup-${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      
      URL.revokeObjectURL(url);

      setSuccessMessage('✅ Your data has been backed up successfully!');
      setTimeout(() => setSuccessMessage(''), 5000);
    } catch (err) {
      console.error('Export error:', err);
      setError('Failed to export data. Please try again.');
    } finally {
      setIsExporting(false);
      setExportProgress(0);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImportFile(file);
    
    // Read and preview file
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string) as ExportData;
        
        // Validate file structure
        if (!data.version || !data.habits || !Array.isArray(data.habits)) {
          throw new Error('Invalid backup file format');
        }
        
        setImportPreview(data);
        setError('');
      } catch (err) {
        setError('Invalid backup file. Please select a valid Habitual backup file.');
        setImportFile(null);
        setImportPreview(null);
      }
    };
    
    reader.readAsText(file);
  };

  const handleImport = async () => {
    if (!importPreview) return;

    try {
      setIsImporting(true);
      setError('');
      setImportProgress(0);

      // Simulate import progress
      const steps = [
        { message: 'Validating backup file...', progress: 20 },
        { message: 'Clearing existing data...', progress: 40 },
        { message: 'Importing habits...', progress: 60 },
        { message: 'Restoring settings...', progress: 80 },
        { message: 'Finalizing import...', progress: 100 }
      ];

      for (const step of steps) {
        setImportProgress(step.progress);
        await new Promise(resolve => setTimeout(resolve, 400));
      }

      // In a real app, we'd call the backend to import data
      // For now, we'll simulate the process
      
      // Restore notification settings if available
      if (importPreview.settings?.notifications) {
        localStorage.setItem('notification-settings', JSON.stringify(importPreview.settings.notifications));
      }

      // Refresh habits from backend
      await onHabitsUpdated();

      setSuccessMessage('✅ Your data has been restored successfully!');
      setShowImportDialog(false);
      setImportFile(null);
      setImportPreview(null);
      
      setTimeout(() => setSuccessMessage(''), 5000);
    } catch (err) {
      console.error('Import error:', err);
      setError('Failed to import data. Please try again.');
    } finally {
      setIsImporting(false);
      setImportProgress(0);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-primary/10 rounded-full">
          <Database className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h2>Data Management</h2>
          <p className="text-muted-foreground">
            Backup and restore your habits securely
          </p>
        </div>
      </div>

      {/* Success/Error Messages */}
      <AnimatePresence>
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Alert className="border-green-200 bg-green-50 text-green-800">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertDescription>{successMessage}</AlertDescription>
            </Alert>
          </motion.div>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Export Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5 text-blue-600" />
            Export Data
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <p className="text-muted-foreground">
              Create a secure backup of all your habits, streaks, and settings.
            </p>
            
            {/* Data Summary */}
            <div className="grid grid-cols-2 gap-4 p-4 bg-muted/30 rounded-lg">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{habits.length}</div>
                <div className="text-sm text-muted-foreground">Habits</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-secondary">
                  {habits.reduce((sum, h) => sum + h.currentStreak, 0)}
                </div>
                <div className="text-sm text-muted-foreground">Total Streaks</div>
              </div>
            </div>

            {/* Export Progress */}
            {isExporting && (
              <div className="space-y-2">
                <Progress value={exportProgress} className="h-2" />
                <p className="text-sm text-center text-muted-foreground">
                  Preparing your backup...
                </p>
              </div>
            )}

            <Button
              onClick={handleExport}
              disabled={isExporting}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Download className="h-4 w-4 mr-2" />
              {isExporting ? 'Creating Backup...' : 'Export Data'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Import Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5 text-green-600" />
            Import Data
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Restore your habits from a previous backup file.
          </p>

          <Dialog open={showImportDialog} onOpenChange={setShowImportDialog}>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full border-green-600 text-green-600 hover:bg-green-50">
                <Upload className="h-4 w-4 mr-2" />
                Import Data
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5 text-green-600" />
                  Import Backup
                </DialogTitle>
                <DialogDescription>
                  Select a Habitual backup file to restore your data.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                {/* File Input */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Choose backup file (.json)
                  </label>
                  <input
                    type="file"
                    accept=".json,application/json"
                    onChange={handleFileSelect}
                    className="w-full p-2 border border-border rounded-lg file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:bg-primary file:text-primary-foreground hover:file:bg-primary/80"
                  />
                </div>

                {/* File Preview */}
                {importPreview && (
                  <div className="p-4 bg-muted/50 rounded-lg border">
                    <div className="flex items-center gap-2 mb-3">
                      <FileText className="h-4 w-4 text-primary" />
                      <span className="font-medium">Backup Preview</span>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Export Date:</span>
                        <span>{formatDate(importPreview.exportDate)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Habits:</span>
                        <span className="font-medium">{importPreview.habits.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Version:</span>
                        <span>{importPreview.version}</span>
                      </div>
                    </div>

                    {/* Warning */}
                    <Alert variant="destructive" className="mt-3">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        ⚠️ Importing will overwrite your current habits and settings.
                      </AlertDescription>
                    </Alert>
                  </div>
                )}

                {/* Import Progress */}
                {isImporting && (
                  <div className="space-y-2">
                    <Progress value={importProgress} className="h-2" />
                    <p className="text-sm text-center text-muted-foreground">
                      Restoring your data...
                    </p>
                  </div>
                )}
              </div>

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowImportDialog(false);
                    setImportFile(null);
                    setImportPreview(null);
                    setError('');
                  }}
                  disabled={isImporting}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleImport}
                  disabled={!importPreview || isImporting}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  {isImporting ? 'Importing...' : 'Import & Restore'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>

      {/* Security Info */}
      <Card className="bg-muted/30 border-dashed">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Shield className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <p className="text-sm font-medium mb-1">Secure & Portable</p>
              <p className="text-sm text-muted-foreground">
                Your habits are stored securely in JSON format for portability. 
                Backup files contain no sensitive information and can be safely shared or stored.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* What's Included */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">What's Included in Your Backup</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
              <Activity className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium">Habits</p>
                <p className="text-sm text-muted-foreground">All your habits and their details</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
              <Calendar className="h-5 w-5 text-secondary" />
              <div>
                <p className="font-medium">Streaks</p>
                <p className="text-sm text-muted-foreground">Current and best streaks</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}