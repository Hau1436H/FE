import { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import axiosClient from '../../api/axiosClient';

function CodeAssessment({ roleId, onComplete }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [loadingProblem, setLoadingProblem] = useState(true);
  
  const [output, setOutput] = useState('');
  const [exerciseData, setExerciseData] = useState(null);
  const [code, setCode] = useState('');
  
  // Khai báo state cho ngôn ngữ, tab console và dữ liệu input
  const [currentLanguage, setCurrentLanguage] = useState('csharp');
  const [activeConsoleTab, setActiveConsoleTab] = useState('output');
  const [userStdin, setUserStdin] = useState('');

  useEffect(() => {
    const fetchOrGenerateExercise = async () => {
      try {
        setLoadingProblem(true);
        const response = await axiosClient.post(`/api/assessments/generate-exercise/role/${roleId}`);
        const exercise = response.data?.Data || response.data?.data; 
        
        if (exercise) {
          setExerciseData(exercise);
          
          const template = exercise.DefaultCodeTemplate || exercise.defaultCodeTemplate || '// Viết code...';
          setCode(template);
          
          // Nạp sẵn testStdin của đề bài vào ô Input để user có thể test ngay hoặc sửa
          setUserStdin(exercise.TestStdin || exercise.testStdin || "");

          // TỰ ĐỘNG NHẬN DIỆN NGÔN NGỮ TỪ TEMPLATE CODE
          const templateLower = template.toLowerCase();
          if (templateLower.includes('def solve') || templateLower.includes('def ')) {
            setCurrentLanguage('python');
          } else if (templateLower.includes('function ') || templateLower.includes('console.log')) {
            setCurrentLanguage('javascript');
          } else if (templateLower.includes('import java.')) {
            setCurrentLanguage('java');
          } else if (templateLower.includes('select ') || templateLower.includes('--') || templateLower.includes('insert ')) {
            setCurrentLanguage('sql');
          } else if (templateLower.includes('#!/bin/bash')) {
            setCurrentLanguage('bash');
          } else if (templateLower.includes('#include <iostream>')) {
            setCurrentLanguage('cpp');  
          } else {
            setCurrentLanguage('csharp');
          }
        }
      } catch (error) {
        setOutput("Không thể tải đề bài. Vui lòng kiểm tra lại kết nối.");
        console.error("Lỗi tải đề:", error);
      } finally {
        setLoadingProblem(false);
      }
    };
    if (roleId) fetchOrGenerateExercise();
  }, [roleId]);

  const handleRunCode = async () => {
    setIsRunning(true);
    setActiveConsoleTab('output'); // Tự động chuyển sang tab Output khi bấm Run
    setOutput('Đang biên dịch code...\n');
    try {
      const payload = { 
        language: currentLanguage, 
        sourceCode: code, 
        stdin: userStdin, // Lấy dữ liệu từ text area do user nhập
        expectedOutput: exerciseData?.ExpectedOutput || exerciseData?.expectedOutput || ""
      };
      const response = await axiosClient.post('/api/v1/PracticeWorkspace/run-code', payload);
      setOutput(response.data?.data?.output || response.data?.data?.stdout || "Biên dịch thành công.");
    } catch (error) {
      setOutput("Lỗi hệ thống khi kết nối Server biên dịch.");
    } finally {
      setIsRunning(false);
    }
  };

  const handleSubmitFinal = async () => {
    setIsSubmitting(true);
    try {
      await onComplete({
        language: currentLanguage,
        sourceCode: code,
        problemDescription: exerciseData?.ProblemDescription || exerciseData?.problemDescription || "Yêu cầu bài toán",
        // Khi nộp bài cuối cùng, ưu tiên dùng TestStdin gốc của đề bài để chấm điểm chuẩn xác
        stdin: exerciseData?.TestStdin || exerciseData?.testStdin || "",
        expectedOutput: exerciseData?.ExpectedOutput || exerciseData?.expectedOutput || ""
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loadingProblem) return <div className="text-white text-center p-5"><div className="spinner-border text-warning"></div></div>;

  return (
    <div className="row g-3 text-white">
      <div className="col-lg-8">
        <div className="card border-secondary border-opacity-25 p-0 overflow-hidden h-100" style={{ backgroundColor: '#0b0c16', minHeight: '600px' }}>
          <div className="bg-dark p-2 d-flex justify-content-between align-items-center">
            <span className="fw-bold text-warning">💻 Code: {exerciseData?.Title || exerciseData?.title}</span>
            <span className="badge bg-secondary">{currentLanguage.toUpperCase()}</span>
          </div>
          
          <div className="p-3 bg-secondary bg-opacity-10 border-bottom" style={{ maxHeight: '200px', overflowY: 'auto' }}>
            <p className="mb-0 text-white" style={{ whiteSpace: 'pre-wrap', fontSize: '0.95rem' }}>
              {exerciseData?.ProblemDescription || exerciseData?.problemDescription}
            </p>
          </div>

          <div style={{ height: '400px' }}>
            <Editor 
              height="100%" 
              language={currentLanguage} 
              theme="vs-dark" 
              value={code} 
              onChange={(val) => setCode(val)} 
              options={{ minimap: { enabled: false }, fontSize: 14 }} 
            />
          </div>

          <div className="p-3 d-flex justify-content-between bg-dark border-top border-secondary border-opacity-25">
            <button className="btn btn-secondary px-4" onClick={handleRunCode} disabled={isRunning}>
              {isRunning ? 'Đang chạy...' : '▶ Chạy thử Code'}
            </button>
            <button className="btn btn-success px-4" onClick={handleSubmitFinal} disabled={isSubmitting}>
              {isSubmitting ? <span className="spinner-border spinner-border-sm"></span> : 'Nộp Toàn Bộ Phiên Đánh Giá'}
            </button>
          </div>
        </div>
      </div>

      <div className="col-lg-4">
        <div className="card border-secondary border-opacity-25 p-0 h-100 d-flex flex-column" style={{ backgroundColor: '#0b0c16' }}>
          
          {/* Header với Tabs */}
          <div className="px-3 py-3 border-bottom border-secondary border-opacity-25 d-flex gap-3 text-white-50 font-monospace" style={{ fontSize: '0.85rem' }}>
            <span 
              className={`${activeConsoleTab === 'output' ? 'text-success border-bottom border-success pb-1 fw-bold' : 'fw-medium'}`} 
              style={{ cursor: 'pointer' }} 
              onClick={() => setActiveConsoleTab('output')}
            >
              Terminal Output
            </span>
            <span 
              className={`${activeConsoleTab === 'input' ? 'text-success border-bottom border-success pb-1 fw-bold' : 'fw-medium'}`} 
              style={{ cursor: 'pointer' }} 
              onClick={() => setActiveConsoleTab('input')}
            >
              Input (stdin)
            </span>
          </div>

          {/* Khu vực nội dung dựa theo Tab được chọn */}
          <div className="p-3 flex-grow-1 overflow-auto d-flex flex-column">
            {activeConsoleTab === 'output' ? (
              <pre className="text-white-50 small mb-0 custom-scrollbar flex-grow-1" style={{ whiteSpace: 'pre-wrap' }}>
                {output}
              </pre>
            ) : (
              <textarea
                className="form-control bg-dark text-white border-secondary border-opacity-25 w-100 flex-grow-1 custom-scrollbar"
                placeholder="Nhập các giá trị đầu vào (mỗi giá trị 1 dòng hoặc cách nhau bằng dấu cách)..."
                value={userStdin}
                onChange={(e) => setUserStdin(e.target.value)}
                style={{ resize: 'none', fontSize: '0.85rem' }}
              ></textarea>
            )}
          </div>
          
        </div>
      </div>
    </div>
  );
}

export default CodeAssessment;