import React, { useState, useEffect } from "react";
import CounselorChatBox from "./CounselorChatBox"; // ĐÃ FIX: Chỉ cần ./ vì cùng thư mục
import axiosClient from "../../api/axiosClient"; // ĐÃ FIX: Lùi 2 cấp (chat -> components -> src)

const CounselorChatPage = () => {
  const currentStudentId = localStorage.getItem("userId");
  const [assignedCounselorId, setAssignedCounselorId] = useState(null);

  // Giả lập việc gọi API để biết Sinh viên này đang thuộc về Cố vấn nào
  useEffect(() => {
    const fetchMyCounselor = async () => {
      try {
        // Bạn cần viết 1 API nhỏ ở backend để trả về CounselorId quản lý sinh viên này
        const res = await axiosClient.get(
          `/api/students/${currentStudentId}/my-counselor`,
        );
        setAssignedCounselorId(res.data.counselorId);
      } catch (error) {
        console.error("Lỗi lấy thông tin cố vấn", error);
      }
    };
    fetchMyCounselor();
  }, [currentStudentId]);

  return (
    <div className="container-fluid p-4">
      <h3 className="text-white mb-4">Trò chuyện cùng Cố vấn Học tập</h3>

      <div className="row justify-content-center">
        <div className="col-lg-8">
          {assignedCounselorId ? (
            <CounselorChatBox
              studentId={currentStudentId}
              counselorId={assignedCounselorId}
              currentUserId={currentStudentId}
              isStudent={true} // Khai báo đây là sinh viên
            />
          ) : (
            <div className="alert alert-info">
              Đang kết nối với Cố vấn của bạn hoặc bạn chưa được phân công cố
              vấn.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CounselorChatPage;
