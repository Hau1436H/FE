import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';

function PublicPortfolio() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [portfolioData, setPortfolioData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openOtherProjects, setOpenOtherProjects] = useState(false);

  useEffect(() => {
    const fetchPublicPortfolio = async () => {
      try {
        setLoading(true);
        const fullUrl = `https://techcompass.com/p/${slug}`;
        const encodedUrl = encodeURIComponent(fullUrl);
        const response = await axiosClient.get(`/api/Portfolios/shared?url=${encodedUrl}`);
        setPortfolioData(response.data);
      } catch (error) {
        console.error("Hồ sơ không tồn tại hoặc lỗi hệ thống", error);
      } finally {
        setLoading(false);
      }
    };

    if (slug) fetchPublicPortfolio();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center text-white" style={{ backgroundColor: '#07080d' }}>
        <div className="text-center">
          <div className="spinner-border text-success mb-3" role="status" style={{ width: '3rem', height: '3rem' }}></div>
          <p className="text-white-50 tracking-wide fs-6">ĐANG TỔNG HỢP HỒ SƠ NĂNG LỰC AI...</p>
        </div>
      </div>
    );
  }

  if (!portfolioData) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center text-white" style={{ backgroundColor: '#07080d' }}>
        <div className="text-center">
          <i className="bi bi-exclamation-triangle text-danger fs-1 mb-3"></i>
          <p className="fs-5 fw-bold">Không tìm thấy hồ sơ năng lực này</p>
          <p className="text-white-50 small">Đường dẫn có thể đã bị thay đổi hoặc hết hạn.</p>
        </div>
      </div>
    );
  }

  const featuredProjects = portfolioData.repositories?.filter(r => r.isFeatured) || [];
  const otherProjects = portfolioData.repositories?.filter(r => !r.isFeatured) || [];

  return (
    <div className="min-vh-100 pb-5 text-white" style={{ backgroundColor: '#07080d', letterSpacing: '-0.01em' }}>
      
      {/* GLOBAL ACTIONS BAR */}
      <div className="sticky-top py-3 px-4 border-bottom border-secondary border-opacity-10 d-print-none" style={{ backgroundColor: 'rgba(7, 8, 13, 0.8)', backdropFilter: 'blur(12px)', zIndex: 100 }}>
        <div className="container-fluid max-width-container d-flex justify-content-between align-items-center">
          <button onClick={() => navigate(-1)} className="btn btn-link text-white-50 text-decoration-none p-0 d-flex align-items-center gap-2 transition-all hover-text-white small">
            <i className="bi bi-arrow-left"></i> TRỞ VỀ SYSTEM
          </button>
          <div className="d-flex gap-2">
            <button className="btn btn-sm px-3 rounded-1 btn-outline-light border-opacity-25" onClick={() => window.print()}>
              <i className="bi bi-file-earmark-pdf me-2"></i>XUẤT CV / PDF
            </button>
            <button className="btn btn-sm px-3 rounded-1 btn-success text-dark fw-semibold" onClick={() => navigator.clipboard.writeText(window.location.href)}>
              <i className="bi bi-share me-2"></i>CHIA SẺ LINK
            </button>
          </div>
        </div>
      </div>

      <div className="container py-5" style={{ maxWidth: '1050px' }}>
        
        {/* 1. HERO PROFILE SECTION */}
        <section className="mb-5 pb-4 border-bottom border-secondary border-opacity-10">
          <div className="row g-4 align-items-center">
            <div className="col-12 col-md-8">
              <div className="d-flex align-items-start gap-4 flex-column flex-sm-row">
                <div className="d-flex align-items-center justify-content-center bg-dark text-success border rounded-2 fw-bold fs-2 shadow-sm" 
                     style={{ width: '80px', height: '80px', minWidth: '80px', borderColor: '#00ffa3' }}>
                  {portfolioData.studentName ? portfolioData.studentName.substring(0, 2).toUpperCase() : 'AI'}
                </div>
                <div>
                  <div className="d-flex align-items-center gap-3 mb-1 flex-wrap">
                    <h1 className="fw-bold fs-2 text-white m-0">
                      {portfolioData.studentName || portfolioData.studentId}
                    </h1>
                    
                    {/* BẢN VÁ LỖI HIỂN THỊ BADGE (Đảm bảo màu chữ #00ffa3 và nền đen mờ) */}
                    <span className="badge rounded-pill d-flex align-items-center" 
                          style={{ 
                            backgroundColor: 'rgba(0, 255, 163, 0.15)', 
                            color: '#00ffa3', 
                            border: '1px solid rgba(0, 255, 163, 0.4)',
                            fontSize: '11px', 
                            letterSpacing: '0.5px',
                            padding: '6px 12px'
                          }}>
                      <i className="bi bi-shield-check me-1 fs-6"></i> AI CERTIFIED
                    </span>
                  </div>
                  
                  <h4 className="text-white-50 fw-normal fs-5 mb-3 mt-2">Target: <span className="text-light">{portfolioData.careerRecommendation?.recommendedRole || "Software Engineer"}</span></h4>
                  
                  <div className="text-light opacity-75 small leading-relaxed" style={{ maxWidth: '680px', textAlign: 'justify' }}>
                    {portfolioData.aiProfileSummary}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Điểm AI Score giữ nguyên */}
            <div className="col-12 col-md-4 d-flex justify-content-md-end justify-content-start">
              <div className="p-3 rounded-2 text-center" style={{ backgroundColor: '#11121a', border: '1px solid rgba(255,255,255,0.05)', minWidth: '160px' }}>
                <span className="text-white-50 small font-monospace d-block mb-1">AI CAREER SCORE</span>
<span className="fs-1 fw-bold text-success font-monospace leading-none">
    {portfolioData.aiCareerScore || 0}
</span>
                <span className="text-white-50 font-monospace small">/100</span>
                <div className="text-warning small mt-1">
                  <i className="bi bi-star-fill"></i>
                  <i className="bi bi-star-fill"></i>
                  <i className="bi bi-star-fill"></i>
                  <i className="bi bi-star-fill"></i>
                  <i className="bi bi-star-fill"></i>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="row g-5">
          
          {/* LEFT CỘT: CAREER MATCH & PROFILE MATRIX */}
          <div className="col-12 col-lg-6 d-flex flex-column gap-5">
            
            {/* 3. CAREER SUITABILITY RANKING */}
            <section>
              <h5 className="text-white fs-6 fw-bold mb-4 font-monospace tracking-wider text-uppercase">
                <i className="bi bi-bar-chart-steps text-success me-2"></i>Top Career Suitability Ranking
              </h5>
              <div className="d-flex flex-column gap-3">
                {portfolioData.careerSuitabilities?.map((item, index) => (
                  <div key={index} className="p-3 rounded-2" style={{ backgroundColor: index === 0 ? '#11121a' : 'transparent', border: index === 0 ? '1px solid rgba(0,255,163,0.1)' : '1px solid transparent' }}>
                    <div className="d-flex justify-content-between align-items-center mb-1 small">
                      <span className={`fw-bold ${index === 0 ? 'text-success' : 'text-light'}`}>
                        {index + 1}. {item.roleName} {index === 0 && <i className="bi bi-bookmark-star ms-1"></i>}
                      </span>
                      <span className="font-monospace fw-bold text-white-50">{item.matchPercentage}%</span>
                    </div>
                    <div className="progress bg-dark bg-opacity-50" style={{ height: '4px', borderRadius: '0px' }}>
                      <div 
                        className={`progress-bar ${index === 0 ? 'bg-success' : 'bg-secondary bg-opacity-50'}`}
                        role="progressbar" 
                        style={{ width: `${item.matchPercentage}%`, borderRadius: '0px' }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* 10. LATENT TALENT MATRIX */}
            {portfolioData.latentTalent && (
              <section>
                <h5 className="text-white fs-6 fw-bold mb-4 font-monospace tracking-wider text-uppercase">
                  <i className="bi bi-compass text-success me-2"></i>AI Latent Talent Matrix
                </h5>
                <div className="d-flex flex-column gap-3">
                  {[
                    { label: "Logical Thinking", val: portfolioData.latentTalent.logicalThinking, icon: "bi-terminal" },
                    { label: "Problem Solving", val: portfolioData.latentTalent.problemSolving, icon: "bi-braces" },
                    { label: "System Design", val: portfolioData.latentTalent.systemDesign, icon: "bi-diagram-3" },
                    { label: "Communication flair", val: portfolioData.latentTalent.communication, icon: "bi-chat-left-dots" },
                    { label: "UI/UX Aesthetic Sense", val: portfolioData.latentTalent.uiUxSense, icon: "bi-palette" }
                  ].map((talent, idx) => (
                    <div key={idx}>
                      <div className="d-flex justify-content-between align-items-center mb-1 small">
                        <span className="text-white-50 d-flex align-items-center gap-2">
                          <i className={`bi ${talent.icon} text-info`}></i>{talent.label}
                        </span>
                        <span className="font-monospace text-info small">{talent.val}%</span>
                      </div>
                      <div className="progress bg-dark" style={{ height: '2px', borderRadius: '0px' }}>
                        <div className="progress-bar bg-info" role="progressbar" style={{ width: `${talent.val}%` }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* 13. STRENGTHS & IMPROVEMENTS */}
            {portfolioData.careerRecommendation && (
              <section>
                <h5 className="text-white fs-6 fw-bold mb-4 font-monospace tracking-wider text-uppercase">
                  <i className="bi bi-sliders text-success me-2"></i>Analysis Spectrum
                </h5>
                <div className="row g-4">
                  <div className="col-12 col-sm-6">
                    <div className="p-3 rounded-2 h-100" style={{ backgroundColor: '#11121a', borderTop: '2px solid #00ffa3' }}>
                      <span className="text-success font-monospace small fw-bold d-block mb-2">
                        <i className="bi bi-plus-circle me-1"></i> STRENGTHS
                      </span>
                      <ul className="list-unstyled d-flex flex-column gap-2 m-0 ps-0 text-white-50 small">
                        {portfolioData.careerRecommendation.strengths?.map((s, i) => (
                          <li key={i} className="d-flex align-items-start gap-2">
                            <i className="bi bi-check-lg text-success mt-0.5"></i><span>{s}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="col-12 col-sm-6">
                    <div className="p-3 rounded-2 h-100" style={{ backgroundColor: '#11121a', borderTop: '2px solid #ffb300' }}>
                      <span className="text-warning font-monospace small fw-bold d-block mb-2">
                        <i className="bi bi-exclamation-circle me-1"></i> IMPROVEMENTS
                      </span>
                      <ul className="list-unstyled d-flex flex-column gap-2 m-0 ps-0 text-white-50 small">
                        {portfolioData.careerRecommendation.improvements?.map((s, i) => (
                          <li key={i} className="d-flex align-items-start gap-2">
                            <i className="bi bi-arrow-up-right text-warning mt-0.5"></i><span>{s}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* 14. SKILL EVIDENCE ASSURANCE */}
            <section>
              <h5 className="text-white fs-6 fw-bold mb-4 font-monospace tracking-wider text-uppercase">
                <i className="bi bi-shield-shaded text-success me-2"></i>AI Skill Detection Evidence
              </h5>
              <div className="p-3 rounded-2" style={{ backgroundColor: '#11121a' }}>
                <div className="d-flex flex-column gap-2">
                  {portfolioData.repositories?.slice(0, 3).map((repo, i) => (
                    <div key={i} className="d-flex justify-content-between align-items-center small py-1 border-bottom border-secondary border-opacity-10 last-border-none">
                      <span className="text-white-50 font-monospace">{repo.repoName}</span>
                      <span className="badge bg-dark border border-secondary text-white-50 font-monospace">
                        {repo.extractedTechStack?.split(',')[0] || "Core Tech"} Detected
                      </span>
                    </div>
                  ))}
                </div>
                <span className="text-muted font-monospace d-block mt-3" style={{ fontSize: '10px' }}>
                  * Xác thực minh bạch bằng cách quét trực tiếp cấu trúc source-code thực tế trên Git.
                </span>
              </div>
            </section>

          </div>

          {/* RIGHT CỘT: SKILL GAP, FEATURED PROJECTS & PROGRESS */}
          <div className="col-12 col-lg-6 d-flex flex-column gap-5">
            
            {/* 4. SKILL GAP SPECTRUM - REFACTORED & BUG FIXED */}
            {portfolioData.skillGapAnalysis && (
              <section>
                <h5 className="text-white fs-6 fw-bold mb-4 font-monospace tracking-wider text-uppercase">
                  <i className="bi bi-intersect text-success me-2"></i>Skill Gap Spectrum
                </h5>
                <div className="p-4 rounded-3 d-flex flex-column gap-4" style={{ backgroundColor: '#11121a', border: '1px solid rgba(255,255,255,0.02)' }}>
                  
                  {/* CURRENT MATCHED TECH STACK */}
                  <div>
                    <span className="text-white-50 small d-block mb-2 font-monospace tracking-wide">
                      CURRENT TECH STACK MATCHED ({portfolioData.skillGapAnalysis.matchedSkills?.length || 0})
                    </span>
                    <div className="d-flex flex-wrap gap-2">
                      {portfolioData.skillGapAnalysis.matchedSkills && portfolioData.skillGapAnalysis.matchedSkills.length > 0 ? (
                        portfolioData.skillGapAnalysis.matchedSkills.map((sk, i) => (
                          <span key={i} className="badge font-monospace text-uppercase" 
                                style={{ backgroundColor: 'rgba(0, 255, 163, 0.1)', color: '#00ffa3', border: '1px solid rgba(0, 255, 163, 0.2)', padding: '6px 10px' }}>
                            {sk}
                          </span>
                        ))
                      ) : (
                        <span className="text-muted small font-monospace">Chưa phát hiện kỹ năng tương thích</span>
                      )}
                    </div>
                  </div>

                  {/* MISSING CAPABILITIES GAP - FIXED TEXT VISIBILITY */}
                  <div>
                    <span className="text-white-50 small d-block mb-2 font-monospace tracking-wide">
                      MISSING CAPABILITIES GAP ({portfolioData.skillGapAnalysis.missingSkills?.length || 0})
                    </span>
                    <div className="d-flex flex-wrap gap-2">
                      {portfolioData.skillGapAnalysis.missingSkills && portfolioData.skillGapAnalysis.missingSkills.length > 0 ? (
                        portfolioData.skillGapAnalysis.missingSkills.map((sk, i) => (
                          <span key={i} className="badge font-monospace text-uppercase" 
                                style={{ backgroundColor: 'rgba(255, 56, 56, 0.1)', color: '#ff3838', border: '1px solid rgba(255, 56, 56, 0.2)', padding: '6px 10px' }}>
                            {sk}
                          </span>
                        ))
                      ) : (
                        <span className="text-success small font-monospace">
                          <i className="bi bi-check-all me-1"></i>Đã đáp ứng đầy đủ yêu cầu của vị trí này
                        </span>
                      )}
                    </div>
                  </div>

                </div>
              </section>
            )}

            {/* 5. ROADMAP MATRIX PROGRESS */}
            {portfolioData.roadmapProgress && (
              <section>
                <h5 className="text-white fs-6 fw-bold mb-4 font-monospace tracking-wider text-uppercase">
                  <i className="bi bi-signpost-2 text-success me-2"></i>Roadmap Learning Velocity
                </h5>
                <div className="p-4 rounded-3" style={{ backgroundColor: '#11121a' }}>
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="text-white fw-bold small">{portfolioData.roadmapProgress.roadmapName}</span>
                    <span className="text-success font-monospace fw-bold">{portfolioData.roadmapProgress.progressPercentage}%</span>
                  </div>
                  <div className="progress bg-dark mb-4" style={{ height: '4px', borderRadius: '0px' }}>
                    <div className="progress-bar bg-success" role="progressbar" style={{ width: `${portfolioData.roadmapProgress.progressPercentage}%` }}></div>
                  </div>
                  <div className="row g-2 text-center text-sm-start">
                    <div className="col-4">
                      <span className="text-white-50 font-monospace" style={{ fontSize: '10px' }}>COMPLETED</span>
                      <div className="fs-5 fw-bold text-success font-monospace">{portfolioData.roadmapProgress.completedNodes}</div>
                    </div>
                    <div className="col-4">
                      <span className="text-white-50 font-monospace" style={{ fontSize: '10px' }}>IN PROGRESS</span>
                      <div className="fs-5 fw-bold text-info font-monospace">{portfolioData.roadmapProgress.inProgressNodes}</div>
                    </div>
                    <div className="col-4">
                      <span className="text-white-50 font-monospace" style={{ fontSize: '10px' }}>REMAINING</span>
                      <div className="fs-5 fw-bold text-muted font-monospace">{portfolioData.roadmapProgress.remainingNodes}</div>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* 6. ACADEMIC EVALUATION */}
            {portfolioData.academicHighlights && (
              <section>
                <h5 className="text-white fs-6 fw-bold mb-4 font-monospace tracking-wider text-uppercase">
                  <i className="bi bi-mortarboard text-success me-2"></i>Academic Core Highlights
                </h5>
                <div className="p-4 rounded-3" style={{ backgroundColor: '#11121a' }}>
                  <div className="d-flex justify-content-between align-items-center border-bottom border-secondary border-opacity-10 pb-3 mb-3">
                    <span className="text-white-50 small font-monospace">ACCUMULATED TRANSCRIPT GPA</span>
                    <span className="fs-3 fw-bold text-warning font-monospace">{portfolioData.academicHighlights.gpa}</span>
                  </div>
                  <div className="d-flex flex-column gap-2 small">
                    <div>
                      <span className="text-success fw-bold me-2 font-monospace">Top Performance:</span>
                      <span className="text-white-50">{portfolioData.academicHighlights.topSubjects?.join(', ')}</span>
                    </div>
                    <div>
                      <span className="text-warning fw-bold me-2 font-monospace">Focus Warning:</span>
                      <span className="text-white-50">{portfolioData.academicHighlights.weakSubjects?.join(', ')}</span>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* 7. GLOBAL GITHUB TELEMETRY */}
            {portfolioData.githubStats && (
              <section>
                <h5 className="text-white fs-6 fw-bold mb-4 font-monospace tracking-wider text-uppercase">
                  <i className="bi bi-activity text-success me-2"></i>Global Git Telemetry
                </h5>
                <div className="row g-2">
                  {[
                    { label: "REPOSITORIES", val: portfolioData.githubStats.totalRepositories },
                    { label: "TOTAL COMMITS", val: portfolioData.githubStats.totalCommits },
                    { label: "LANGUAGES", val: portfolioData.githubStats.totalLanguages },
                    { label: "LAST COMMITED", val: portfolioData.githubStats.lastActive || "N/A" }
                  ].map((stat, i) => (
                    <div key={i} className="col-6 col-sm-3">
                      <div className="p-3 text-center rounded-2 border border-secondary border-opacity-10" style={{ backgroundColor: '#11121a' }}>
                        <span className="text-white-50 font-monospace d-block text-truncate mb-1" style={{ fontSize: '9px' }}>{stat.label}</span>
                        <span className="fs-6 fw-bold font-monospace text-white text-truncate d-block">{stat.val}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

          </div>
        </div>

        {/* 11. TIMELINE OF DEVELOPMENT */}
        {portfolioData.careerJourney && (
          <section className="mt-5 pt-4">
            <h5 className="text-white fs-6 fw-bold mb-4 font-monospace tracking-wider text-uppercase">
              <i className="bi bi-clock-history text-success me-2"></i>Linear Journey Story
            </h5>
            <div className="position-relative border-start border-secondary border-opacity-25 ms-2 ps-4 d-flex flex-column gap-4">
              {portfolioData.careerJourney.map((evt, idx) => (
                <div key={idx} className="position-relative">
                  <div className="position-absolute bg-success rounded-circle border border-dark" style={{ width: '10px', height: '10px', left: '-29px', top: '6px' }}></div>
                  <span className="text-success font-monospace fw-bold small d-block mb-0.5">{evt.year} — {evt.eventTitle}</span>
                  <p className="text-white-50 small m-0" style={{ maxWidth: '800px' }}>{evt.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 8. FEATURED ARTIFACTS ARCHITECTURE */}
        <section className="mt-5 pt-4">
          <h5 className="text-white fs-6 fw-bold mb-4 font-monospace tracking-wider text-uppercase">
            <i className="bi bi-folder-symlink text-success me-2"></i>AI Featured Code Artifacts
          </h5>
          <div className="d-flex flex-column gap-4">
            {featuredProjects.map(repo => (
              <div key={repo.repoId} className="p-4 rounded-3 shadow-sm transition-all hover-card-border" style={{ backgroundColor: '#11121a', border: '1px solid rgba(255,255,255,0.03)' }}>
                <div className="d-flex justify-content-between align-items-start mb-3 flex-wrap gap-2">
                  <div>
                    <h4 className="fw-bold text-white fs-5 m-0 mb-1">{repo.repoName}</h4>
                    <span className="text-warning font-monospace" style={{ fontSize: '11px' }}>
                      Complexity Vector: {"★".repeat(repo.difficultyStars || 3)}
                    </span>
                  </div>
                  <a href={repo.githubUrl} target="_blank" rel="noreferrer" className="btn btn-sm btn-outline-success font-monospace rounded-1 py-1 px-3" style={{ fontSize: '11px' }}>
                    SOURCE INSPECTOR <i className="bi bi-box-arrow-up-right ms-1"></i>
                  </a>
                </div>
                <p className="text-white-50 small mb-3 leading-relaxed" style={{ textAlign: 'justify' }}>
                  {repo.aiProjectSummary}
                </p>
                <div className="pt-3 border-top border-secondary border-opacity-10 d-flex gap-1 flex-wrap">
                  {repo.extractedTechStack?.split(',').map((tech, i) => (
                    <span key={i} className="badge bg-dark text-light border border-secondary border-opacity-30 font-monospace fw-normal">{tech.trim()}</span>
                  ))}
                </div>
              </div>
            ))}
            {featuredProjects.length === 0 && (
              <span className="text-white-50 small font-monospace">Chưa có Artifact nào được phân lớp Tiêu Biểu.</span>
            )}
          </div>
        </section>

        {/* 9. OTHER REPOSITORIES EXPANSION (ACCORDION/COLLAPSE) */}
        {otherProjects.length > 0 && (
          <section className="mt-4">
            <div className="border border-secondary border-opacity-10 rounded-2" style={{ backgroundColor: '#11121a' }}>
              <button 
                className="btn w-100 p-3 text-start d-flex justify-content-between align-items-center text-white border-0 shadow-none"
                onClick={() => setOpenOtherProjects(!openOtherProjects)}
              >
                <span className="font-monospace small text-white-50">
                  <i className="bi bi-archive me-2"></i>CÁC DỰ ÁN KHÁC TRÊN HỆ THỐNG GITHUB ({otherProjects.length})
                </span>
                <i className={`bi ${openOtherProjects ? 'bi-chevron-up' : 'bi-chevron-down'} text-white-50 small`}></i>
              </button>
              
              {openOtherProjects && (
                <div className="p-3 pt-0 border-top border-secondary border-opacity-10 bg-dark bg-opacity-20">
                  <div className="d-flex flex-column gap-2 mt-2">
                    {otherProjects.map(repo => (
                      <div key={repo.repoId} className="d-flex justify-content-between align-items-center p-2 rounded small border border-secondary border-opacity-5" style={{ backgroundColor: '#07080d' }}>
                        <span className="fw-bold font-monospace text-white-50 text-truncate me-2">{repo.repoName}</span>
                        <a href={repo.githubUrl} target="_blank" rel="noreferrer" className="text-success text-decoration-none font-monospace small shrink-0" style={{ fontSize: '11px' }}>
                          INSPECT ↗
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

      </div>
    </div>
  );
}

export default PublicPortfolio;