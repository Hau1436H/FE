// daily Challenge ở trang dashboard chính.
import React, { useState, useEffect } from 'react';
import { FaFire } from 'react-icons/fa';

function DailyChallenge() {
  // 1. Khởi tạo dữ liệu gốc từ API (Gợi ý: Backend nên trả về một mốc thời gian cụ thể)
  const [challenge, setChallenge] = useState({
    id: 724,
    title: "Tổng hợp kĩ năng và thị trường",
    xpReward: 150,
    challengeUrl: "https://leetcode.com",
    // Thiết lập thời gian hết hạn: Ví dụ lấy thời gian hiện tại cộng thêm 6 giờ 23 phút
    expiresAt: new Date(new Date().getTime() + (6 * 60 + 23) * 60 * 1000).toISOString()
  });

  // 2. Khởi tạo State quản lý chuỗi hiển thị đếm ngược thời gian thực
  const [timeLeftStr, setTimeLeftStr] = useState("Đang tính toán...");
  const [isExpired, setIsExpired] = useState(false);

  // 3. Sử dụng useEffect kết hợp setInterval để chạy bộ đếm ngược
  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = new Date(challenge.expiresAt) - new Date();
      
      // Nếu đã quá hạn
      if (difference <= 0) {
        setTimeLeftStr("Đã hết thời gian");
        setIsExpired(true);
        return true; // Trả về true để báo hiệu cần xóa bộ lặp
      }

      // Tính toán Giờ, Phút, Giây còn lại
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / (1000 * 60)) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      // Định dạng hiển thị chuỗi (Thêm số 0 phía trước nếu nhỏ hơn 10)
      const hDisplay = hours > 0 ? `${hours}h ` : "";
      const mDisplay = minutes < 10 ? `0${minutes}m ` : `${minutes}m `;
      const sDisplay = seconds < 10 ? `0${seconds}s` : `${seconds}s`;

      setTimeLeftStr(`${hDisplay}${mDisplay}${sDisplay}`);
      return false;
    };

    // Chạy kiểm tra ngay lần đầu tiên khi component được dựng (render)
    const dynamicStop = calculateTimeLeft();
    if (dynamicStop) return;

    // Thiết lập vòng lặp chạy lại sau mỗi 1000ms (1 giây)
    const timer = setInterval(() => {
      const shouldStop = calculateTimeLeft();
      if (shouldStop) {
        clearInterval(timer);
      }
    }, 1000);

    // Bắt buộc phải clear để tránh tràn bộ nhớ khi người dùng chuyển trang
    return () => clearInterval(timer);
  }, [challenge.expiresAt]);

  // 4. Hàm xử lý khi nhấn nút làm bài
  const handleStartChallenge = () => {
    if (challenge.challengeUrl && !isExpired) {
      window.open(challenge.challengeUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="">
      <h2 className="text-white mb-1 fw-bold mt-1">{challenge.title}</h2>
    </div>
  );
}

export default DailyChallenge;
