import React, { useState, useEffect } from 'react';
import { Folder, FileText, FileSpreadsheet, File, ChevronRight, ChevronDown, RefreshCw, HardDrive, Search } from 'lucide-react';
import { getFileSystem, findNodeById } from '../services/cloudService';
import { FileSystemItem } from '../types';
import { ExcelPreviewModal } from './ExcelPreviewModal';

export const RepositoryView: React.FC = () => {
  const [fileSystem, setFileSystem] = useState<FileSystemItem[]>([]);
  const [currentFolderId, setCurrentFolderId] = useState<string>('root');
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['root']));
  const [excelModalOpen, setExcelModalOpen] = useState(false);

  useEffect(() => {
    // Load initial structure
    setFileSystem(getFileSystem());
  }, []);

  const toggleFolder = (folderId: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folderId)) {
      newExpanded.delete(folderId);
    } else {
      newExpanded.add(folderId);
    }
    setExpandedFolders(newExpanded);
  };

  const handleFileClick = (item: FileSystemItem) => {
      if (item.type === 'folder') {
          setCurrentFolderId(item.id);
          const newExpanded = new Set(expandedFolders);
          newExpanded.add(item.id);
          setExpandedFolders(newExpanded);
      } else if (item.name.endsWith('.xlsx')) {
          setExcelModalOpen(true);
      } else {
          // Placeholder for file preview
          console.log("Opening file:", item.name);
      }
  };

  const renderTree = (items: FileSystemItem[], level = 0) => {
    return items.map((item) => {
      if (item.type !== 'folder') return null;
      
      const isExpanded = expandedFolders.has(item.id);
      const isSelected = currentFolderId === item.id;

      return (
        <div key={item.id}>
          <div 
            className={`flex items-center py-1 px-2 cursor-pointer hover:bg-gray-100 rounded text-sm ${isSelected ? 'bg-blue-100 text-blue-700' : 'text-gray-700'}`}
            style={{ paddingLeft: `${level * 16 + 8}px` }}
            onClick={() => {
                toggleFolder(item.id);
                setCurrentFolderId(item.id);
            }}
          >
            {item.children && item.children.length > 0 ? (
                isExpanded ? <ChevronDown className="w-4 h-4 mr-1 text-gray-400" /> : <ChevronRight className="w-4 h-4 mr-1 text-gray-400" />
            ) : <span className="w-4 mr-1"></span>}
            
            <Folder className={`w-4 h-4 mr-2 ${isSelected ? 'fill-blue-500 text-blue-500' : 'fill-yellow-400 text-yellow-500'}`} />
            <span className="truncate">{item.name}</span>
          </div>
          {isExpanded && item.children && (
            <div>{renderTree(item.children, level + 1)}</div>
          )}
        </div>
      );
    });
  };

  const currentFolder = findNodeById(fileSystem, currentFolderId);

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
      {/* Toolbar */}
      <div className="h-14 border-b bg-gray-50 flex items-center justify-between px-4">
        <div className="flex items-center space-x-2 text-gray-600">
            <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                <HardDrive className="w-5 h-5" />
            </div>
            <span className="font-semibold text-sm">Institución Cloud</span>
            <span className="text-gray-300">|</span>
            <span className="text-xs text-gray-500 font-mono">/sites/CITRO/SolicitudesAcademicas</span>
        </div>
        <div className="flex items-center space-x-3">
             <div className="relative">
                 <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
                 <input type="text" placeholder="Buscar..." className="pl-9 pr-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64" />
             </div>
             <button className="p-2 text-gray-500 hover:bg-gray-200 rounded-lg" onClick={() => setFileSystem([...getFileSystem()])}>
                 <RefreshCw className="w-5 h-5" />
             </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar Tree */}
        <div className="w-64 border-r bg-gray-50 overflow-y-auto p-2">
            {renderTree(fileSystem)}
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto p-4 bg-white">
            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                <Folder className="w-6 h-6 text-yellow-500 mr-2 fill-yellow-400" />
                {currentFolder?.name || 'Root'}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {currentFolder?.children?.map(item => {
                    let Icon = File;
                    let color = 'text-gray-500';
                    let bgColor = 'bg-gray-100';

                    if (item.type === 'folder') {
                        Icon = Folder;
                        color = 'text-yellow-600';
                        bgColor = 'bg-yellow-50';
                    } else if (item.fileType === 'xlsx') {
                        Icon = FileSpreadsheet;
                        color = 'text-green-600';
                        bgColor = 'bg-green-50';
                    } else if (item.fileType === 'docx') {
                        Icon = FileText;
                        color = 'text-blue-600';
                        bgColor = 'bg-blue-50';
                    } else if (item.fileType === 'pdf') {
                        Icon = FileText;
                        color = 'text-red-600';
                        bgColor = 'bg-red-50';
                    }

                    return (
                        <div 
                            key={item.id} 
                            onClick={() => handleFileClick(item)}
                            className={`group border rounded-xl p-4 hover:shadow-md cursor-pointer transition-all flex flex-col items-center justify-center text-center space-y-3
                                ${item.type === 'folder' ? 'hover:border-yellow-400' : 'hover:border-blue-400'}
                            `}
                        >
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${bgColor} ${color} group-hover:scale-110 transition-transform`}>
                                <Icon className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-700 truncate w-full px-2 max-w-[150px]">{item.name}</p>
                                <p className="text-xs text-gray-400 mt-1">{item.updatedAt}</p>
                            </div>
                        </div>
                    )
                })}
                {(!currentFolder?.children || currentFolder.children.length === 0) && (
                    <div className="col-span-full text-center py-20 text-gray-400">
                        Esta carpeta está vacía
                    </div>
                )}
            </div>
        </div>
      </div>
      
      <ExcelPreviewModal isOpen={excelModalOpen} onClose={() => setExcelModalOpen(false)} />
    </div>
  );
};