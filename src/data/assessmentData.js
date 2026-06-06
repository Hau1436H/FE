// .\src\data\assessmentData.js
export const ASSESSMENT_QUESTIONS = [
  {
    id: 1,
    question: "Trong React, 'Hook' được sử dụng để làm gì trong Functional Component?",
    options: [
      { id: "A", text: "Để thao tác trực tiếp với Real DOM nhanh hơn." },
      { id: "B", text: "Để sử dụng state và các tính năng khác của React mà không cần viết class." },
      { id: "C", text: "Để thay thế hoàn toàn cho Redux trong mọi trường hợp." },
      { id: "D", text: "Để biên dịch code JSX sang HTML thuần." }
    ],
    correctAnswer: "B"
  },
  {
    id: 2,
    question: "Phương thức nào của Axios dùng để gửi dữ liệu tạo mới lên Server?",
    options: [
      { id: "A", text: "axios.get()" },
      { id: "B", text: "axios.delete()" },
      { id: "C", text: "axios.post()" },
      { id: "D", text: "axios.put()" }
    ],
    correctAnswer: "C"
  },
  {
    id: 3,
    question: "Ý nghĩa của thuộc tính 'scoped' hoặc mô hình Module hóa CSS trong các Framework hiện đại là gì?",
    options: [
      { id: "A", text: "Giới hạn phạm vi tác động của CSS chỉ trong component hiện tại." },
      { id: "B", text: "Làm tăng tốc độ tải file CSS của toàn bộ website." },
      { id: "C", text: "Tự động chuyển đổi CSS thành mã Javascript." },
      { id: "D", text: "Ép buộc lập trình viên phải viết CSS inline." }
    ],
    correctAnswer: "A"
  }
];