import { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import axiosClient from '../../api/axiosClient';

function CodeAssessment({ skillNodeId, onComplete }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [loadingProblem, setLoadingProblem] = useState(true);
  
  const [output, setOutput] = useState('');
  
  const [exerciseData, setExerciseData] = useState(null);
  const [code, setCode] = useState('');

  useEffect(() => {
    const fetchOrGenerateExercise = async () => {
      try {
        setLoadingProblem(true);
        const response = await axiosClient.post(`/api/assessments/generate-exercise/${skillNodeId}`);
        const exercise = response.data.data || response.data;
        if (exercise) {
          setExerciseData(exercise);
          setCode(exercise.defaultCodeTemplate || exercise.DefaultCodeTemplate || '// Viết code...');
        }
      } catch (error) {
        setOutput("Không thể tải đề bài.");
      } finally {
        setLoadingProblem(false);
      }
    };
    if (skillNodeId) fetchOrGenerateExercise();
  }, [skillNodeId]);

  const handleRunCode = async () => {
    setIsRunning(true);
    setOutput('Đang biên dịch code...');
    try {
      const payload = { 
        language: "csharp", 
        sourceCode: code, 
        stdin: exerciseData?.testStdin || exerciseData?.TestStdin || "",
        expectedOutput: exerciseData?.expectedOutput || exerciseData?.ExpectedOutput || ""
      };
      const response = await axiosClient.post('/api/v1/PracticeWorkspace/run-code', payload);
      setOutput(response.data.data?.output || response.data.data?.stdout || "Biên dịch thành công.");
    } catch (error) {
      setOutput("Lỗi hệ thống khi kết nối Server biên dịch.");
    } finally {
      setIsRunning(false);
    }
  };

  const handleSubmitFinal = async () => {
    setIsSubmitting(true);
    // TRẢ DATA VỀ COMPONENT CHA (SkillAssessment) ĐỂ CHA GỌI API SUMBIT-EXAM
    try {
      await onComplete({
        language: "csharp",
        sourceCode: code,
        problemDescription: exerciseData?.problemDescription || exerciseData?.ProblemDescription || "Yêu cầu bài toán",
        stdin: exerciseData?.testStdin || exerciseData?.TestStdin || "",
        expectedOutput: exerciseData?.expectedOutput || exerciseData?.ExpectedOutput || ""
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
            <span className="fw-bold text-warning">💻 Code: {exerciseData?.title || exerciseData?.Title}</span>
          </div>
          
          <div className="p-3 bg-secondary bg-opacity-10 border-bottom" style={{ maxHeight: '200px', overflowY: 'auto' }}>
            <p className="mb-0 text-white" style={{ whiteSpace: 'pre-wrap', fontSize: '0.95rem' }}>
              {exerciseData?.problemDescription || exerciseData?.ProblemDescription}
            </p>
          </div>

          <div style={{ height: '400px' }}>
            <Editor height="100%" defaultLanguage="csharp" theme="vs-dark" value={code} onChange={(val) => setCode(val)} options={{ minimap: { enabled: false }, fontSize: 14 }} />
          </div>

          <div className="p-3 d-flex justify-content-between bg-dark">
            <button className="btn btn-secondary px-4" onClick={handleRunCode} disabled={isRunning}>{isRunning ? 'Đang chạy...' : '▶ Chạy thử Code'}</button>
            <button className="btn btn-success px-4" onClick={handleSubmitFinal} disabled={isSubmitting}>
              {isSubmitting ? <span className="spinner-border spinner-border-sm"></span> : 'Nộp Toàn Bộ Phiên Đánh Giá'}
            </button>
          </div>
        </div>
      </div>

      <div className="col-lg-4">
  <div className="card border-secondary border-opacity-25 p-0 h-100" style={{ backgroundColor: '#0b0c16' }}>
    <div className="p-3 border-bottom border-secondary" style={{ height: '200px', overflowY: 'auto' }}>
      <h6 className="text-success fw-bold font-monospace mb-2">Terminal Output</h6>
      <pre className="text-white-50 small mb-0">{output}</pre>
    </div>
    {/* BẠN NÊN XÓA DÒNG COMMENT DƯỚI ĐÂY */}
    {/* Bạn có thể giữ phần Chat AI ở đây tuỳ ý */}
  </div>
</div>
    </div>
  );
}

export default CodeAssessment;