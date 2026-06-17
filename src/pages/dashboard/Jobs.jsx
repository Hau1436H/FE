// src/pages/Jobs.jsx
import React, { useState, useEffect, useMemo } from 'react';
import Sidebar from '../../components/dashboard/Sidebar';
import JobHeader from '../../components/dashboard/myJob/JobHeader';
import JobFilters from '../../components/dashboard/myJob/JobFilters';
import JobCard from '../../components/dashboard/myJob/JobCard';
import DashboardHeader from '../../components/dashboard/DashboardHeader';
import axiosClient from '../../api/axiosClient'; // Đảm bảo đã config axios

function Jobs() {
  const [currentMainTab, setCurrentMainTab] = useState('jobs');
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [jobFilters, setJobFilters] = useState({
    search: '', type: 'Tất cả', level: 'Tất cả', minMatch: 0, skills: [], sortBy: 'match',
    page: 1, pageSize: 10 // Thêm phân trang cho API
  });

  // Hàm lấy StudentId từ Token (Cần đồng bộ với logic auth của bạn)
  const getStudentId = () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return null;
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.studentId || payload.StudentId || payload.sub;
    } catch (e) { return null; }
  };

  // GỌI API THẬT TỪ BACKEND
  useEffect(() => {
    const fetchMatchingJobs = async () => {
      const studentId = getStudentId();
      if (!studentId) return;

      try {
        setLoading(true);
        const payload = {
          keyword: jobFilters.search,
          sourcePlatform: "", // Lấy từ tất cả nguồn
          page: jobFilters.page,
          pageSize: jobFilters.pageSize
        };

        const response = await axiosClient.post(`/api/v1/MarketPulse/students/${studentId}/job-matches`, payload);
        const actualJobs = response.data.data || response.data;
        
        // Chuyển đổi dữ liệu Backend về định dạng UI cần thiết
        const mappedJobs = actualJobs.map(j => ({
          id: j.postingId || j.PostingId,
          title: j.jobTitle || j.JobTitle,
          companyName: j.companyName || j.CompanyName,
          match: j.matchPercentage || j.MatchPercentage,
          matchedSkills: j.matchedSkills || j.MatchedSkills,
          missingSkills: j.missingSkills || j.MissingSkills,
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

    if (currentMainTab === 'jobs') fetchMatchingJobs();
  }, [jobFilters.search, jobFilters.page, currentMainTab]);

  return (
    <div className="d-flex min-vh-100 w-100" style={{ backgroundColor: '#0b0c10' }}>
      <Sidebar />
      <div className="flex-grow-1 p-4 overflow-auto text-white" style={{ maxHeight: '100vh' }}>
        <DashboardHeader />
        <div className="container-fluid px-0" style={{ maxWidth: '1200px' }}>
          <JobHeader />
          
          <div className="d-flex gap-2 mb-4">
            <button className="btn btn-sm rounded-pill px-3 py-1.5 fw-medium" style={{ backgroundColor: 'var(--accent)', color: '#fff' }}>
              Việc làm phù hợp theo năng lực
            </button>
          </div>

          <JobFilters 
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
              <div className="col-12 text-center py-5 text-white-50 small">Bạn chưa có kỹ năng nào phù hợp với thị trường. Hãy hoàn thành thêm Assessment!</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Jobs;