import { useState, useEffect, useMemo } from 'react';
import Editor from '@monaco-editor/react';
import axiosClient from '../../api/axiosClient';

function CodeAssessment({ roleId, onComplete }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [loadingProblem, setLoadingProblem] = useState(true);
  
  const [output, setOutput] = useState('');
  const [exerciseData, setExerciseData] = useState(null);
  const [code, setCode] = useState('');

  // SỬ DỤNG USEMEMO ĐỂ XÁC ĐỊNH NGÔN NGỮ DỰA VÀO ROLE ID
  // Giả sử Role Frontend có ID là 2 hoặc 3 (theo DB của bạn)
  const currentLanguage = useMemo(() => {
    if (roleId === 2 || roleId === 3) return 'javascript';
    if (roleId === 6) return 'python'; // Ví dụ Data Engineer
    return 'csharp'; // Mặc định Backend .NET
  }, [roleId]);

  useEffect(() => {
    const fetchOrGenerateExercise = async () => {
      try {
        setLoadingProblem(true);
        const response = await axiosClient.post(`/api/assessments/generate-exercise/role/${roleId}`);
        const exercise = response.data?.Data || response.data?.data; 
        
        if (exercise) {
          setExerciseData(exercise);
          setCode(exercise.DefaultCodeTemplate || exercise.defaultCodeTemplate || '// Viết code...');
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
    setOutput('Đang biên dịch code...\n');
    try {
      const payload = { 
        language: currentLanguage, // ✅ ĐÃ SỬA THÀNH NGÔN NGỮ ĐỘNG
        sourceCode: code, 
        stdin: exerciseData?.TestStdin || exerciseData?.testStdin || "",
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
        language: currentLanguage, // ✅ ĐÃ SỬA THÀNH NGÔN NGỮ ĐỘNG
        sourceCode: code,
        problemDescription: exerciseData?.ProblemDescription || exerciseData?.problemDescription || "Yêu cầu bài toán",
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
              defaultLanguage={currentLanguage} // ✅ ĐỔI HIGHLIGHT MÀU CODE CỦA EDITOR LUÔN
              theme="vs-dark" 
              value={code} 
              onChange={(val) => setCode(val)} 
              options={{ minimap: { enabled: false }, fontSize: 14 }} 
            />
          </div>

          <div className="p-3 d-flex justify-content-between bg-dark">
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
        <div className="card border-secondary border-opacity-25 p-0 h-100" style={{ backgroundColor: '#0b0c16' }}>
          <div className="p-3 d-flex flex-column h-100">
            <h6 className="text-success fw-bold font-monospace mb-3 border-bottom border-secondary pb-2">
              Terminal Output
            </h6>
            <div className="flex-grow-1" style={{ overflowY: 'auto' }}>
              <pre className="text-white-50 small mb-0" style={{ whiteSpace: 'pre-wrap' }}>
                {output}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CodeAssessment;