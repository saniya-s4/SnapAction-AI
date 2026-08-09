import React, { useEffect, useState } from 'react';
import { TopAppBar } from './components/TopAppBar';
import { BottomNavBar } from './components/BottomNavBar';
import { HomeUploadView } from './components/HomeUploadView';
import { ProcessingView } from './components/ProcessingView';
import { ResultsView } from './components/ResultsView';
import { ErrorView } from './components/ErrorView';
import { HistoryView } from './components/HistoryView';
import { TasksView } from './components/TasksView';
import { SettingsView } from './components/SettingsView';
import { EditActionModal } from './components/EditActionModal';
import { AppState, ExtractedAction, ScanRecord, TabType } from './types';
import { DEMO_RESULTS_SCAN, INITIAL_RECENT_SCANS } from './sampleData';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('upload');
  const [appState, setAppState] = useState<AppState>('idle');
  const [scans, setScans] = useState<ScanRecord[]>(INITIAL_RECENT_SCANS);
  const [activeScan, setActiveScan] = useState<ScanRecord | null>(null);
  const [previewImageUrl, setPreviewImageUrl] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [editingAction, setEditingAction] = useState<ExtractedAction | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // Sync dark mode class
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleSelectTab = (tab: TabType) => {
    setActiveTab(tab);
    if (tab === 'upload' && appState === 'error') {
      setAppState('idle');
    }
  };

  const handleResetHome = () => {
    setActiveTab('upload');
    setAppState('idle');
    setActiveScan(null);
  };

  // Process uploaded image file
  const handleUploadImage = async (file: File) => {
    setActiveTab('upload');
    setAppState('processing');
    const localUrl = URL.createObjectURL(file);
    setPreviewImageUrl(localUrl);

    // Read base64
    const reader = new FileReader();
    reader.onload = async () => {
      const base64Data = reader.result as string;
      try {
        const response = await fetch('/api/analyze-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            imageBase64: base64Data,
            fileName: file.name,
            mimeType: file.type || 'image/png',
          }),
        });

        if (!response.ok) {
          const errJson = await response.json().catch(() => ({}));
          throw new Error(errJson.message || 'Processing Failed');
        }

        const data: ScanRecord = await response.json();
        // Artificial small pause to display pulsing loader state cleanly as shown in mockup
        setTimeout(() => {
          setScans((prev) => [data, ...prev]);
          setActiveScan(data);
          setAppState('results');
        }, 1200);
      } catch (err: any) {
        console.error('Image processing error:', err);
        setTimeout(() => {
          setErrorMessage(err?.message || 'Could not process the image. Please ensure the image is clear and try again.');
          setAppState('error');
        }, 800);
      }
    };

    reader.onerror = () => {
      setErrorMessage('Failed to read image file.');
      setAppState('error');
    };

    reader.readAsDataURL(file);
  };

  // Sample Scan Presets
  const handleSelectSampleScan = (scan: ScanRecord) => {
    setActiveTab('upload');
    setAppState('processing');
    setPreviewImageUrl(scan.imageUrl);

    setTimeout(() => {
      setActiveScan(scan);
      setAppState('results');
    }, 1000);
  };

  // Trigger Action Items Desk scan demo directly matching Screen 3
  const handleTriggerDeskActionsScan = () => {
    setActiveTab('upload');
    setAppState('processing');
    setPreviewImageUrl(DEMO_RESULTS_SCAN.imageUrl);

    setTimeout(() => {
      // Ensure DEMO_RESULTS_SCAN is in history
      setScans((prev) => {
        if (!prev.some((s) => s.id === DEMO_RESULTS_SCAN.id)) {
          return [DEMO_RESULTS_SCAN, ...prev];
        }
        return prev;
      });
      setActiveScan(DEMO_RESULTS_SCAN);
      setAppState('results');
    }, 1100);
  };

  // Select card from History
  const handleSelectHistoryCard = (scan: ScanRecord) => {
    setActiveScan(scan);
    setActiveTab('upload');
    setAppState('results');
  };

  // Trigger Screen 4 error state demo
  const handleTriggerErrorDemo = () => {
    setActiveTab('upload');
    setAppState('processing');
    setPreviewImageUrl(
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDZu9FgAs1YU9TW-o2MZAJVC3OtS9GVhJMRja1hQq11hxgrl-DcRDYBTWvay_nvjY-zwuy8e-4rb3ygj9KiGHbqEBhEYvLbYDAxwsVt6Pw1IWNa_HsQj7TJplDbZJaD_jOZetCKYffJIsAsp5ArtiSSN-mvDo6ghJV2imc-j6-7aM3VmlxvlofIrTdAscPryfelvpHgLXr-Cll5PtbzOAPn21Opq2LL7By8n_TwtR4FDRUfGVy7xbGB7w'
    );

    setTimeout(() => {
      setErrorMessage(
        'Could not process the image. Please ensure the image is clear and try again, or select a different file.'
      );
      setAppState('error');
    }, 1200);
  };

  // Edit Action handlers
  const handleOpenEditAction = (action: ExtractedAction) => {
    setEditingAction(action);
    setIsModalOpen(true);
  };

  const handleSaveAction = (updatedAction: ExtractedAction) => {
    // Update in active scan
    if (activeScan) {
      const updatedActions = activeScan.actions.map((act) =>
        act.id === updatedAction.id ? updatedAction : act
      );
      const updatedScan = { ...activeScan, actions: updatedActions };
      setActiveScan(updatedScan);
      setScans((prev) => prev.map((s) => (s.id === updatedScan.id ? updatedScan : s)));
    } else {
      // Update globally across scans
      setScans((prev) =>
        prev.map((s) => ({
          ...s,
          actions: s.actions.map((act) => (act.id === updatedAction.id ? updatedAction : act)),
        }))
      );
    }
  };

  const handleDeleteAction = (actionId: string) => {
    if (activeScan) {
      const updatedActions = activeScan.actions.filter((a) => a.id !== actionId);
      const updatedScan = { ...activeScan, actions: updatedActions };
      setActiveScan(updatedScan);
      setScans((prev) => prev.map((s) => (s.id === updatedScan.id ? updatedScan : s)));
    }
  };

  const handleToggleCompleteAction = (actionId: string) => {
    setScans((prevScans) =>
      prevScans.map((scan) => {
        const hasAction = scan.actions.some((a) => a.id === actionId);
        if (!hasAction) return scan;
        const newActions = scan.actions.map((a) =>
          a.id === actionId ? { ...a, completed: !a.completed } : a
        );
        const updatedScan = { ...scan, actions: newActions };
        if (activeScan && activeScan.id === scan.id) {
          setActiveScan(updatedScan);
        }
        return updatedScan;
      })
    );
  };

  const handleAddActionToActiveScan = () => {
    if (!activeScan) return;
    const newAction: ExtractedAction = {
      id: `act-new-${Date.now()}`,
      type: 'task',
      title: 'New Action Task',
      subtitle: 'Manual Entry',
      statusBadge: 'ACTION ITEM',
      primaryActionLabel: 'Mark Done',
      completed: false,
      details: {
        priority: 'medium',
      },
    };

    const updatedScan = {
      ...activeScan,
      actions: [...activeScan.actions, newAction],
      extractedItemsCount: activeScan.extractedItemsCount + 1,
    };
    setActiveScan(updatedScan);
    setScans((prev) => prev.map((s) => (s.id === updatedScan.id ? updatedScan : s)));
    handleOpenEditAction(newAction);
  };

  return (
    <div className="bg-background text-on-background min-h-screen pt-12">
      {/* Top Header App Bar */}
      <TopAppBar
        activeTab={activeTab}
        onSelectTab={handleSelectTab}
        onResetHome={handleResetHome}
      />

      {/* Main Screen Content */}
      <main>
        {activeTab === 'upload' && (
          <>
            {appState === 'idle' && (
              <HomeUploadView
                recentScans={scans}
                onUploadImage={handleUploadImage}
                onSelectSampleScan={handleSelectSampleScan}
                onSelectHistoryCard={handleSelectHistoryCard}
                onViewAllHistory={() => setActiveTab('history')}
                onTriggerErrorDemo={handleTriggerErrorDemo}
              />
            )}

            {appState === 'processing' && (
              <ProcessingView previewImageUrl={previewImageUrl} />
            )}

            {appState === 'results' && (
              <ResultsView
                scanRecord={activeScan || DEMO_RESULTS_SCAN}
                onNewScan={handleResetHome}
                onEditAction={handleOpenEditAction}
                onToggleCompleteAction={handleToggleCompleteAction}
                onAddAction={handleAddActionToActiveScan}
              />
            )}

            {appState === 'error' && (
              <ErrorView
                errorMessage={errorMessage}
                onRetry={() => handleTriggerDeskActionsScan()}
                onUploadDifferent={handleResetHome}
              />
            )}
          </>
        )}

        {activeTab === 'history' && (
          <HistoryView
            scans={scans}
            onSelectScan={handleSelectHistoryCard}
            onClearHistory={() => setScans([])}
            onNewScan={handleResetHome}
          />
        )}

        {activeTab === 'tasks' && (
          <TasksView
            scans={scans}
            onToggleTaskComplete={handleToggleCompleteAction}
            onEditAction={handleOpenEditAction}
            onNewScan={handleResetHome}
          />
        )}

        {activeTab === 'settings' && (
          <SettingsView
            darkMode={darkMode}
            onToggleDarkMode={() => setDarkMode(!darkMode)}
            onResetSampleData={() => setScans(INITIAL_RECENT_SCANS)}
          />
        )}
      </main>

      {/* Bottom Mobile Navigation Bar */}
      <BottomNavBar activeTab={activeTab} onSelectTab={handleSelectTab} />

      {/* Edit Action Modal */}
      <EditActionModal
        isOpen={isModalOpen}
        action={editingAction}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveAction}
        onDelete={handleDeleteAction}
      />
    </div>
  );
}
