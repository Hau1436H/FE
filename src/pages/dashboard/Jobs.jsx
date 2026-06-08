import React, { useState, useMemo } from 'react';
import Sidebar from '../../components/dashboard/Sidebar';
import JobHeader from '../../components/dashboard/myJob/JobHeader';
import JobFilters from '../../components/dashboard/myJob/JobFilters';
import JobCard from '../../components/dashboard/myJob/JobCard';
import MentorFilters from '../../components/dashboard/myJob/MentorFilters';
import MentorCard from '../../components/dashboard/myJob/MentorCard';
import DashboardHeader from '../../components/dashboard/DashboardHeader';

// ĐÃ CẬP NHẬT: Thay đổi đường dẫn import data sang thư mục data chung
import { JOBS_DATA } from '../../data/jobsData';
import { MENTOR_DATA } from '../../data/mentorData';

function Jobs() {
  // Quản lý trạng thái chuyển đổi giữa Tab Việc làm (jobs) hoặc Mentor (mentors)
  const [currentMainTab, setCurrentMainTab] = useState('jobs');
  const [currentJobTab, setCurrentJobTab] = useState('all');

  // State bộ lọc cho phần Việc làm
  const [jobFilters, setJobFilters] = useState({
    search: '', 
    type: 'Tất cả', 
    level: 'Tất cả', 
    minMatch: 0, 
    skills: [], 
    sortBy: 'match'
  });

  // State bộ lọc cho phần Mentor
  const [mentorFilters, setMentorFilters] = useState({
    search: '', 
    specialization: 'all', 
    minRating: 'all'
  });

  // Số lượng thống kê nhanh hiển thị trên các sub-tabs của Job
  const jobTabCounts = useMemo(() => {
    return {
      matched: JOBS_DATA.filter(j => j.match >= 90).length,
      applied: JOBS_DATA.filter(j => j.isApplied === true).length,
    };
  }, []);

  // Xử lý logic lọc danh sách việc làm dựa trên tương tác người dùng
  const filteredJobs = useMemo(() => {
    return JOBS_DATA.filter(job => {
      if (currentJobTab === 'matched' && job.match < 90) return false;
      if (currentJobTab === 'applied' && !job.isApplied) return false;
      
      const matchesSearch = job.title.toLowerCase().includes(jobFilters.search.toLowerCase()) || 
                            job.companyName.toLowerCase().includes(jobFilters.search.toLowerCase());
      const matchesType = jobFilters.type === 'Tất cả' || job.type === jobFilters.type;
      const matchesLevel = jobFilters.level === 'Tất cả' || job.level === jobFilters.level;
      const matchesMinMatch = job.match >= jobFilters.minMatch;
      const matchesSkills = jobFilters.skills.length === 0 || jobFilters.skills.every(s => job.skills.includes(s));
      
      return matchesSearch && matchesType && matchesLevel && matchesMinMatch && matchesSkills;
    });
  }, [jobFilters, currentJobTab]);

  // Xử lý logic lọc danh sách Mentor dựa trên tương tác người dùng
  const filteredMentors = useMemo(() => {
    return MENTOR_DATA.filter(mentor => {
      const matchesSearch = mentor.name.toLowerCase().includes(mentorFilters.search.toLowerCase()) || 
                            mentor.role.toLowerCase().includes(mentorFilters.search.toLowerCase());
      const matchesSpec = mentorFilters.specialization === 'all' || mentor.tags.includes(mentorFilters.specialization);
      const matchesRating = mentorFilters.minRating === 'all' || mentor.rating >= parseFloat(mentorFilters.minRating);
      
      return matchesSearch && matchesSpec && matchesRating;
    });
  }, [mentorFilters]);

  return (
    <div className="d-flex min-vh-100 w-100" style={{ backgroundColor: '#0b0c10' }}>
      {/* Thanh Sidebar bên trái */}
      <Sidebar />
      
      {/* Vùng Content chính hiển thị bên phải */}
      <div className="flex-grow-1 p-4 overflow-auto text-white" style={{ maxHeight: '100vh', minWidth: 0 }}>
        <DashboardHeader />
        <div className="container-fluid px-0" style={{ maxWidth: '1200px' }}>
          
          {/* Header tiêu đề và các thông số AI Matching */}
          <JobHeader />

          {/* Thanh điều hướng Tab chính (Việc làm / Mentor) dạng viên thuốc */}
          <div className="d-flex gap-2 mb-4">
            <button 
              className="btn btn-sm rounded-pill px-3 py-1.5 fw-medium transition-all" 
              style={{ backgroundColor: currentMainTab === 'jobs' ? 'var(--accent)' : 'rgba(255,255,255,0.05)', color: '#fff', fontSize: '13px', border: 'none' }}
              onClick={() => setCurrentMainTab('jobs')}
            >
              Việc làm phù hợp
            </button>
            <button 
              className="btn btn-sm rounded-pill px-3 py-1.5 fw-medium transition-all" 
              style={{ backgroundColor: currentMainTab === 'mentors' ? 'var(--accent)' : 'rgba(255,255,255,0.05)', color: currentMainTab === 'mentors' ? '#fff' : 'rgba(255,255,255,0.5)', fontSize: '13px', border: 'none' }}
              onClick={() => setCurrentMainTab('mentors')}
            >
              👤 Mentor Directory
            </button>
          </div>

          {/* Tách giao diện render dựa trên Tab chính đang chọn */}
          {currentMainTab === 'jobs' ? (
            <>
              {/* Khối bộ lọc và kết quả của phần Việc làm */}
              <JobFilters 
                currentTab={currentJobTab} onTabChange={setCurrentJobTab}
                totalCount={JOBS_DATA.length} tabCounts={jobTabCounts}
                filters={jobFilters} onFilterChange={(k, v) => setJobFilters(p => ({ ...p, [k]: v }))}
              />
              <div className="row g-3">
                {filteredJobs.length > 0 ? filteredJobs.map(job => (
                  <div key={job.id} className="col-12 col-md-6"><JobCard job={job} /></div>
                )) : <div className="col-12 text-center py-5 text-white-50 small">Không tìm thấy vị trí tuyển dụng nào.</div>}
              </div>
            </>
          ) : (
            <>
              {/* Khối bộ lọc và kết quả của phần Mentor */}
              <MentorFilters 
                filters={mentorFilters} 
                onFilterChange={(k, v) => setMentorFilters(p => ({ ...p, [k]: v }))}
              />
              <div className="row g-3">
                {filteredMentors.length > 0 ? filteredMentors.map(mentor => (
                  <div key={mentor.id} className="col-12 col-md-6 col-lg-4"><MentorCard mentor={mentor} /></div>
                )) : <div className="col-12 text-center py-5 text-white-50 small">Không tìm thấy Mentor phù hợp.</div>}
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  );
}

export default Jobs;
