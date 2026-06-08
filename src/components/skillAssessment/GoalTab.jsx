    // .\src\components\skillAssessment\GoalTab.jsx
    import React, { useState } from 'react';

    function GoalTab({ onNextTab }) {
    // State quản lý dữ liệu form
    const [fullName, setFullName] = useState('');
    const [mainGoal, setMainGoal] = useState('');
    const [selectedFields, setSelectedFields] = useState([]);
    const [currentLevel, setCurrentLevel] = useState('');
    const [studyTime, setStudyTime] = useState('2h');

    // Danh sách dữ liệu cấu hình dựa theo Test1_2.png
    const goals = [
        { id: 'job', title: 'Tìm việc IT', desc: 'Chuẩn bị portfolio & phỏng vấn'},
        { id: 'up_skill', title: 'Nâng cao kỹ năng', desc: 'Học thêm tech mới, lên senior'},
        { id: 'switch', title: 'Chuyển ngành Tech', desc: 'Từ ngành khác sang lập trình'},
        { id: 'research', title: 'Nghiên cứu / Học thuật', desc: 'Nghiên cứu hoặc làm luận văn' },
    ];

    const fields = ['Frontend', 'Backend', 'Mobile', 'AI / ML', 'DevOps', 'Data Engineering', 'Security', 'Full-stack'];

    const levels = [
        { id: 'newbie', title: 'Mới hoàn toàn', desc: 'Chưa biết code gì cả' },
        { id: 'basic', title: 'Đã học cơ bản', desc: 'Biết HTML, CSS, JS cơ bản' },
        { id: 'experienced', title: 'Có kinh nghiệm', desc: 'Đã có 1–2 project thực tế' },
    ];

    const timeOptions = ['1h', '2h', '3h', '4h', '5h'];

    // Xử lý chọn Lĩnh vực quan tâm (Tối đa 3)
    const handleSelectField = (field) => {
        if (selectedFields.includes(field)) {
        setSelectedFields(selectedFields.filter(f => f !== field));
        } else if (selectedFields.length < 3) {
        setSelectedFields([...selectedFields, field]);
        }
    };

    return (
        <div className="card border-secondary border-opacity-25 text-white p-4 p-md-5 mx-auto" style={{ backgroundColor: '#0b0c16', maxWidth: '900px' }}>
        
        {/* Badge định hướng */}
        <div className="mb-3">
            <span className="badge bg-success bg-opacity-10 text-white border border-success border-opacity-25 px-3 py-2 rounded-pill">
            Bước 1 — Khảo sát nhanh
            </span>
        </div>

        {/* Tiêu đề chính */}
        <h2 className="fw-bold mb-2">Chào mừng bạn đến AICareer!</h2>
        <p className="text-white-50 mb-5">Trả lời 4 câu nhanh để AI tạo lộ trình cá nhân hóa cho bạn.</p>

            {/* Câu 1: Tên */}
        <div className="mb-5">
        <label className="form-label fw-semibold mb-3">Bạn tên gì?</label>
        <input 
            type="text" 
            className="form-control form-control-lg border-secondary border-opacity-25"
            style={{ 
            backgroundColor: '#111324', 
            color: '#e3e4ed',
            // 👇 Sử dụng biến RGB gốc của Bootstrap để ép placeholder mờ đi 50%
            "--bs-body-color-rgb": "255, 255, 255",
            "--bs-secondary-color": "rgba(255, 255, 255, 0.5)"
            }}
            placeholder="Nguyễn Văn A..."
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
        />
        </div>

        {/* Câu 2: Mục tiêu chính */}
        <div className="mb-5">
            <label className="form-label fw-semibold mb-3">Mục tiêu chính của bạn là gì?</label>
            <div className="row g-3">
            {goals.map((g) => (
                <div className="col-md-6" key={g.id}>
                <div 
                    onClick={() => setMainGoal(g.id)}
                    className={`p-3 rounded-3 border h-100 cursor-pointer transition-all ${
                    mainGoal === g.id 
                        ? 'border-success bg-success bg-opacity-10' 
                        : 'border-secondary border-opacity-25'
                    }`}
                    style={{ backgroundColor: '#111324', cursor: 'pointer' }}
                >
                    <div className="d-flex align-items-start gap-3">
                    <div>
                        <div className="fw-bold text-white">{g.title}</div>
                        <div className="text-white-50 small">{g.desc}</div>
                    </div>
                    </div>
                </div>
                </div>
            ))}
            </div>
        </div>

        {/* Câu 3: Lĩnh vực quan tâm */}
        <div className="mb-5">
            <label className="form-label fw-semibold mb-2">Lĩnh vực quan tâm <span className="text-white-50 fw-normal">(chọn tối đa 3)</span></label>
            <div className="d-flex flex-wrap gap-2 mt-2">
            {fields.map((field) => {
                const isSelected = selectedFields.includes(field);
                return (
                <button
                    key={field}
                    type="button"
                    onClick={() => handleSelectField(field)}
                    className={`btn btn-sm rounded-pill px-3 py-2 border transition-all ${
                    isSelected 
                        ? 'btn-success border-success' 
                        : 'btn-outline-secondary border-secondary border-opacity-25 text-white-50'
                    }`}
                >
                    {field}
                </button>
                );
            })}
            </div>
        </div>

        {/* Câu 4: Cấp độ hiện tại */}
        <div className="mb-5">
            <label className="form-label fw-semibold mb-3">Bạn đang ở mức nào?</label>
            <div className="d-flex flex-column gap-3">
            {levels.map((lvl) => (
                <div 
                key={lvl.id}
                onClick={() => setCurrentLevel(lvl.id)}
                className={`p-3 rounded-3 border d-flex align-items-center gap-3 transition-all`}
                style={{ backgroundColor: '#111324', cursor: 'pointer', borderColor: currentLevel === lvl.id ? '#198754' : 'rgba(255,255,255,0.1)' }}
                >
                <input 
                    type="radio" 
                    name="currentLevel"
                    className="form-check-input m-0 flex-shrink-0"
                    checked={currentLevel === lvl.id}
                    onChange={() => setCurrentLevel(lvl.id)}
                    style={{ cursor: 'pointer' }}
                />
                <div>
                    <div className="fw-bold text-white">{lvl.title}</div>
                    <div className="text-white-50 small">{lvl.desc}</div>
                </div>
                </div>
            ))}
            </div>
        </div>

        {/* Câu 5: Thời gian học */}
        <div className="mb-5">
            <label className="form-label fw-semibold mb-3">Bạn có thể học mỗi ngày? <span className="text-success">{studyTime}</span></label>
            <div className="d-flex gap-2">
            {timeOptions.map((time) => (
                <button
                key={time}
                type="button"
                onClick={() => setStudyTime(time)}
                className={`btn flex-grow-1 py-3 rounded border transition-all ${
                    studyTime === time 
                    ? 'btn-success border-success' 
                    : 'btn-outline-secondary border-secondary border-opacity-25 text-white'
                }`}
                style={{ backgroundColor: studyTime === time ? '' : '#111324' }}
                >
                {time}
                </button>
            ))}
            </div>
        </div>

        {/* Nút Submit / Tiếp tục */}
        <button 
            className="btn btn-success w-100 py-3 fw-bold fs-5 rounded-3 d-flex align-items-center justify-content-center gap-2"
            onClick={onNextTab}
        >
            Tiếp tục làm bài Assessment ➔
        </button>

        </div>
    );
    }

    export default GoalTab;