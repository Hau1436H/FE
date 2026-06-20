// src/pages/Jobs.jsx
import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/dashboard/Sidebar';
import JobHeader from '../../components/dashboard/myJob/JobHeader';
import JobFilters from '../../components/dashboard/myJob/JobFilters';
import JobCard from '../../components/dashboard/myJob/JobCard';
import DashboardHeader from '../../components/dashboard/DashboardHeader';
import SkillGapReport from '../../components/dashboard/myJob/SkillGapReport';
import axiosClient from '../../api/axiosClient';

function Jobs() {
  const [currentMainTab, setCurrentMainTab] = useState('gap-analysis');
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isScraping, setIsScraping] = useState(false); 
  const [refreshTrigger, setRefreshTrigger] = useState(0); 

  const [jobFilters, setJobFilters] = useState({
    search: '', type: 'Tất cả', level: 'Tất cả', minMatch: 0, skills: [], sortBy: 'match',
    page: 1, pageSize: 10 
  });

  const getStudentId = () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return null;
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.studentId || payload.StudentId || payload.sub;
    } catch (e) { return null; }
  };

  useEffect(() => {
    const fetchMatchingJobs = async () => {
      const studentId = getStudentId();
      if (!studentId) return;

      try {
        setLoading(true);
        const payload = {
          keyword: jobFilters.search,
          sourcePlatform: "", 
          page: jobFilters.page,
          pageSize: jobFilters.pageSize,
          minMatch: jobFilters.minMatch,  
          sortBy: jobFilters.sortBy,      
          skills: jobFilters.skills       
        };

        const response = await axiosClient.post(`/api/v1/MarketPulse/students/${studentId}/job-matches`, payload);
        const actualJobs = response.data.data || response.data;
        
        const mappedJobs = actualJobs.map(j => ({
          id: j.postingId || j.PostingId,
          title: j.jobTitle || j.JobTitle,
          companyName: j.companyName || j.CompanyName,
          match: j.matchPercentage || j.MatchPercentage || 0,
          matchedSkills: j.matchedSkills || j.MatchedSkills || [], 
          missingSkills: j.missingSkills || j.MissingSkills || [], 
          source: j.sourcePlatform || j.SourcePlatform,
          isApplied: false
        }));

        setJobs(mappedJobs);
      } catch (error) {
        console.error("Lỗi lấy danh sách việc làm:", error);
      } finally {
        setLoading(false);
      }
    };

    if (currentMainTab === 'jobs') {
        fetchMatchingJobs();
    }
  }, [jobFilters.search, jobFilters.page, jobFilters.skills, jobFilters.minMatch, jobFilters.sortBy, currentMainTab, refreshTrigger]);

  const handleTriggerScraper = async () => {
    try {
      setIsScraping(true);
      const response = await axiosClient.post('/api/v1/MarketPulse/admin/trigger-scraper');
      alert(response.data?.message || "Cập nhật dữ liệu thị trường thành công!");
      
      setRefreshTrigger(prev => prev + 1); 
    } catch (error) {
      console.error("Lỗi khi cào dữ liệu:", error);
      alert("Lỗi cập nhật dữ liệu: " + (error.response?.data?.message || error.message));
    } finally {
      setIsScraping(false);
    }
  };

  // ĐÃ CẬP NHẬT: Hàm gọi API tải PDF
  const handleExportPDF = async () => {
    const studentId = getStudentId();
    if (!studentId) {
      alert("Không tìm thấy thông tin User!");
      return;
    }

    try {
      alert("Hệ thống đang sinh báo cáo PDF. Vui lòng chờ trong giây lát...");
      
      // Gọi xuống API bạn vừa tạo
      const response = await axiosClient.get(`/api/SkillGapReports/${studentId}/export-pdf`, {
        responseType: 'blob', // Bắt buộc phải có để nhận file
      });

      // Tạo Blob và link ảo để tự động tải file
      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      // Đặt tên file khi tải về
      link.setAttribute('download', `Skill_Gap_Report_${studentId.substring(0,8)}.pdf`); 
      document.body.appendChild(link);
      link.click();
      
      // Dọn dẹp DOM
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);

    } catch (error) {
      console.error("Lỗi khi tải PDF:", error);
      alert("Có lỗi xảy ra khi tải báo cáo PDF. Vui lòng kiểm tra lại server.");
    }
  };

  return (
    <div className="d-flex min-vh-100 w-100" style={{ backgroundColor: '#0b0c10' }}>
      <Sidebar />
      <div className="flex-grow-1 p-4 overflow-auto text-white" style={{ maxHeight: '100vh', minWidth: 0 }}>
        <DashboardHeader />
        <div className="container-fluid px-0" style={{ maxWidth: '1200px' }}>
          
          <JobHeader />

          <div className="d-flex justify-content-between align-items-center mb-4">
            <div className="d-flex gap-2">
              <button 
                className="btn btn-sm rounded-pill px-3 py-1.5 fw-medium transition-all" 
                style={{ backgroundColor: currentMainTab === 'gap-analysis' ? '#17a2b8' : 'rgba(255,255,255,0.05)', color: currentMainTab === 'gap-analysis' ? '#fff' : 'rgba(255,255,255,0.5)', fontSize: '13px', border: 'none' }}
                onClick={() => setCurrentMainTab('gap-analysis')}
              >
                <i className="bi bi-radar me-1"></i> Phân tích Năng lực (Gap)
              </button>

              <button 
                className="btn btn-sm rounded-pill px-3 py-1.5 fw-medium transition-all" 
                style={{ backgroundColor: currentMainTab === 'jobs' ? 'var(--accent)' : 'rgba(255,255,255,0.05)', color: currentMainTab === 'jobs' ? '#fff' : 'rgba(255,255,255,0.5)', fontSize: '13px', border: 'none' }}
                onClick={() => setCurrentMainTab('jobs')}
              >
                <i className="bi bi-briefcase me-1"></i> Việc làm phù hợp
              </button>

              <button 
                className="btn btn-sm rounded-pill px-3 py-1.5 fw-medium transition-all" 
                style={{ backgroundColor: currentMainTab === 'mentors' ? 'var(--accent)' : 'rgba(255,255,255,0.05)', color: currentMainTab === 'mentors' ? '#fff' : 'rgba(255,255,255,0.5)', fontSize: '13px', border: 'none' }}
                onClick={() => setCurrentMainTab('mentors')}
              >
                👤 Mentor Directory
              </button>
            </div>

            {currentMainTab === 'jobs' && (
              <button 
                className="btn btn-sm rounded-pill px-3 py-1.5 fw-medium transition-all d-flex align-items-center"
                style={{ backgroundColor: 'rgba(40, 167, 69, 0.2)', color: '#28a745', border: '1px solid #28a745' }}
                onClick={handleTriggerScraper}
                disabled={isScraping}
              >
                {isScraping ? (
                  <><span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span> Đang quét Google Jobs...</>
                ) : (
                  <><i className="bi bi-cloud-arrow-down me-2"></i> Lấy dữ liệu Market mới</>
                )}
              </button>
            )}
          </div>

          {currentMainTab === 'gap-analysis' ? (
            
            <div className="row mt-3">
              <div className="col-12 mb-3 d-flex justify-content-between align-items-center">
                <div>
                  <h5 className="text-white mb-1"><i className="bi bi-bar-chart-line text-info me-2"></i>Báo cáo Phân tích Khoảng trống Kỹ năng</h5>
                  <p className="text-white-50 small mb-0">Hệ thống so sánh vốn kỹ năng hiện tại của bạn với yêu cầu thực tế của thị trường IT.</p>
                </div>
                <button 
                  className="btn btn-outline-success btn-sm transition-all hover-bg-success"
                  onClick={handleExportPDF}
                >
                  <i className="bi bi-file-earmark-pdf me-2"></i>Tải báo cáo PDF
                </button>
              </div>

              <div className="col-12">
                <div className="card bg-dark border-secondary border-opacity-25 p-4 rounded-4">
                  <SkillGapReport studentId={getStudentId()} />
                </div>
              </div>
            </div>

          ) : currentMainTab === 'jobs' ? (
            <>
              <JobFilters 
                currentTab="all" 
                onTabChange={() => {}} 
                totalCount={jobs.length} 
                tabCounts={{ matched: jobs.length, applied: 0 }} 
                filters={jobFilters} 
                onFilterChange={(k, v) => setJobFilters(p => ({ ...p, [k]: v }))}
              />

              <div className="row g-3 mt-2">
                {loading ? (
                  <div className="col-12 text-center py-5"><div className="spinner-border text-success"></div></div>
                ) : jobs.length > 0 ? (
                  jobs.map(job => (
                    <div key={job.id} className="col-12 col-md-6"><JobCard job={job} /></div>
                  ))
                ) : (
                  <div className="col-12 text-center py-5 text-white-50 small">
                    Bạn chưa có kỹ năng nào phù hợp hoặc chưa có dữ liệu Job. <br/> 
                    Hãy bấm nút "Lấy dữ liệu Market mới" ở trên để hệ thống quét việc làm nhé!
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="text-center py-5 mt-4 bg-dark bg-opacity-25 rounded border border-secondary border-opacity-25">
              <i className="bi bi-tools text-warning mb-3" style={{ fontSize: '2rem' }}></i>
              <h5 className="text-white">Tính năng đang được phát triển</h5>
              <p className="text-white-50 small">Chức năng tìm kiếm Mentor dựa trên Lộ trình của bạn sẽ sớm ra mắt.</p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default Jobs;