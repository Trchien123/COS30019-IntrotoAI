import React from 'react';
import { FileText, Download, ExternalLink } from 'lucide-react';

const Report = () => {
    const pdfUrl = "/assets/report.pdf";
    
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-12">
            <div className="max-w-6xl mx-auto px-6">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-3 bg-white px-8 py-4 rounded-2xl shadow-lg border border-gray-100 mb-6">
                        <h1 className="text-4xl font-bold text-blue-500">
                            📄 Report
                        </h1>
                    </div>
                    <p className="text-md text-gray-600 max-w-3xl mx-auto mb-1">
                        ℹ️ Comprehensive project report with detailed analysis and findings.
                    </p>
                    <p className="text-md text-gray-600 max-w-3xl mx-auto mb-1">
                        ℹ️ This document contains the complete pathfinding algorithms research and implementation details.
                    </p>
                    <p className="text-md text-gray-600 max-w-3xl mx-auto mb-1">
                        ℹ️ You can view the report directly below or download it for offline reading.
                    </p>
                </div>

                {/* Report Section */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-xl">
                    {/* Header with controls */}
                    <div className="px-8 py-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-100">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <h2 className="text-2xl font-bold text-gray-800">
                                    <span className="mr-2 text-2xl">📋</span> Project Report Document
                                </h2>
                            </div>
                            
                            <div className="flex items-center space-x-3">
                                <button
                                    onClick={() => window.open(pdfUrl, '_blank')}
                                    className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl transition-all duration-200 hover:scale-[1.02] shadow-sm"
                                >
                                    <ExternalLink className="h-4 w-4" />
                                    <span>Open in New Tab</span>
                                </button>
                                <a
                                    href={pdfUrl}
                                    download
                                    className="flex items-center space-x-2 bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-xl transition-all duration-200 hover:scale-[1.02] shadow-sm"
                                >
                                    <Download className="h-4 w-4" />
                                    <span>Download PDF</span>
                                </a>
                            </div>
                        </div>
                    </div>
                    
                    {/* PDF Viewer */}
                    <div className="relative bg-gray-50">
                        <iframe
                            src={pdfUrl}
                            className="w-full border-0"
                            style={{ height: '900px', minHeight: '700px' }}
                            title="Project Report PDF"
                        />
                    </div>
                    
                    {/* Fallback section */}
                    <div className="px-8 py-6 bg-gray-50 border-t border-gray-200">
                        <div className="bg-blue-50 rounded-xl p-6 border-l-4 border-blue-400">
                            <h4 className="font-semibold text-blue-800 mb-2">📖 Having trouble viewing the PDF?</h4>
                            <p className="text-blue-700 mb-3">
                                If the PDF doesn't display properly in your browser, you can use the alternative options below:
                            </p>
                            <div className="flex gap-4 flex-wrap">
                                <a 
                                    href={pdfUrl} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl transition-all duration-200 hover:scale-[1.02] shadow-sm"
                                >
                                    <ExternalLink className="h-4 w-4" />
                                    Open in new tab
                                </a>
                                <a 
                                    href={pdfUrl} 
                                    download
                                    className="inline-flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-xl transition-all duration-200 hover:scale-[1.02] shadow-sm"
                                >
                                    <Download className="h-4 w-4" />
                                    Download to device
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Additional Info Section */}
                <div className="mt-8 bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                    <div className="px-8 py-6">
                        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <span className="text-xl">💡</span> Report Contents
                        </h3>
                        <div className="grid gap-4">
                            <div className="flex gap-4 p-4 rounded-xl hover:bg-gray-50 transition-all duration-200">
                                <div className="w-2 h-2 bg-blue-500 rounded-full mt-3 flex-shrink-0"></div>
                                <div>
                                    <span className="font-semibold text-gray-800">Algorithm Analysis:</span>
                                    <span className="text-gray-600 ml-2">Detailed comparison of all implemented pathfinding algorithms</span>
                                </div>
                            </div>
                            <div className="flex gap-4 p-4 rounded-xl hover:bg-gray-50 transition-all duration-200">
                                <div className="w-2 h-2 bg-blue-500 rounded-full mt-3 flex-shrink-0"></div>
                                <div>
                                    <span className="font-semibold text-gray-800">Implementation Details:</span>
                                    <span className="text-gray-600 ml-2">Technical specifications and code structure explanation</span>
                                </div>
                            </div>
                            <div className="flex gap-4 p-4 rounded-xl hover:bg-gray-50 transition-all duration-200">
                                <div className="w-2 h-2 bg-blue-500 rounded-full mt-3 flex-shrink-0"></div>
                                <div>
                                    <span className="font-semibold text-gray-800">Research Initiatives:</span>
                                    <span className="text-gray-600 ml-2">Researching about iteresting problems in maze searching algorithms</span>
                                </div>
                            </div>
                            <div className="flex gap-4 p-4 rounded-xl hover:bg-gray-50 transition-all duration-200">
                                <div className="w-2 h-2 bg-blue-500 rounded-full mt-3 flex-shrink-0"></div>
                                <div>
                                    <span className="font-semibold text-gray-800">Future Improvements:</span>
                                    <span className="text-gray-600 ml-2">Planned enhancements and potential research directions</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-16 text-center">
                    <div className="inline-flex items-center gap-2 text-gray-500 bg-white px-6 py-3 rounded-full shadow-sm border border-gray-100">
                        <span className="text-sm">📄 Comprehensive pathfinding research documentation 🚀</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Report;