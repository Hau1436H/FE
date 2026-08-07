import React, { useEffect, useRef, useState } from "react";
import { useAIChat } from "../../context/AIChatContext";

const quickPrompts = [
  "Tôi cần hướng dẫn sử dụng dashboard",
  "Gợi ý lộ trình học cho tôi",
  "Tôi muốn cải thiện kỹ năng nghề nghiệp",
  "Hỏi về việc làm phù hợp",
  "Tư vấn cách chuẩn bị phỏng vấn",
  "Giúp tôi xử lý lỗi đăng nhập",
];

const generateProfessionalReply = (input) => {
  const text = input.toLowerCase();

  if (/(xin chào|hello|hi|chào)/.test(text)) {
    return "Chào bạn! Tôi là trợ lý AI của nền tảng, có thể hỗ trợ bạn về học tập, nghề nghiệp, hồ sơ, việc làm, đăng nhập và cả các vấn đề kỹ thuật khi sử dụng hệ thống. Bạn cứ mô tả nhu cầu của mình, tôi sẽ hướng dẫn từng bước.";
  }

  if (/(đăng nhập|login|đăng ký|register|mật khẩu|password|tài khoản)/.test(text)) {
    return "Nếu bạn gặp vấn đề với đăng nhập hoặc tài khoản, hãy kiểm tra lại email/số điện thoại đã dùng, mật khẩu nhập đúng và đảm bảo mạng ổn định. Nếu vẫn không vào được, hãy thử quên mật khẩu, rồi kiểm tra thư spam hoặc liên hệ bộ phận hỗ trợ.";
  }

  if (/(dashboard|bảng điều khiển|menu|trang chủ|navigation|di chuyển)/.test(text)) {
    return "Để sử dụng dashboard hiệu quả, hãy bắt đầu từ các mục chính như Học tập, Thực hành, Công việc, Hồ sơ và Đánh giá. Mỗi mục đều có chức năng riêng, giúp bạn theo dõi tiến độ và lên kế hoạch tốt hơn.";
  }

  if (/(học|lộ trình|roadmap|khóa học|study|learning|course)/.test(text)) {
    return "Để xây dựng lộ trình học hiệu quả, tôi đề xuất bạn chia mục tiêu thành 3 giai đoạn: nền tảng, thực hành và portfolio. Hãy ưu tiên 1 kỹ năng cốt lõi, luyện tập đều đặn và hoàn thiện ít nhất 1 dự án thật để tăng giá trị cho hồ sơ của bạn.";
  }

  if (/(việc làm|job|nghề|career|công việc|nghề nghiệp|recruit|tuyển dụng)/.test(text)) {
    return "Đối với định hướng nghề nghiệp, bạn nên xác định 3 yếu tố: sở thích, năng lực và nhu cầu thị trường. Tôi có thể giúp bạn chọn hướng đi phù hợp, đề xuất kỹ năng cần tăng cường và chuẩn bị cho các cơ hội ứng tuyển.";
  }

  if (/(phỏng vấn|interview|cv|resume|thư giới thiệu|cover letter)/.test(text)) {
    return "Khi chuẩn bị phỏng vấn, hãy tập trung vào 4 phần: giới thiệu bản thân ngắn gọn, nêu giá trị bạn mang lại, trình bày dự án thực tế và thể hiện thái độ học hỏi. Một câu trả lời rõ ràng và có bằng chứng sẽ làm bạn nổi bật hơn.";
  }

  if (/(kỹ năng|skill|soft|technical|technical skill|mềm|hard skill)/.test(text)) {
    return "Để nâng cao kỹ năng, hãy ưu tiên các kỹ năng có tác động lớn như giao tiếp, giải quyết vấn đề, làm việc nhóm và chuyên môn cốt lõi. Bạn nên luyện tập hàng tuần và ghi lại tiến bộ để thấy sự cải thiện rõ rệt.";
  }

  if (/(hồ sơ|profile|thông tin|assessment|đánh giá|test|bài test|survey)/.test(text)) {
    return "Hồ sơ và bài đánh giá giúp hệ thống hiểu rõ điểm mạnh, điểm thiếu của bạn. Hãy cập nhật thông tin thật, hoàn thành các bài test và dùng kết quả để nhận đề xuất phù hợp hơn về học tập và nghề nghiệp.";
  }

  if (/(admin|quản trị|resource|course|user|mentor|cố vấn|counselor|tài nguyên)/.test(text)) {
    return "Nếu bạn đang cần quản lý nội dung, người dùng hoặc tài nguyên, hệ thống có các chức năng dành cho quản trị viên như quản lý khóa học, tài nguyên, người dùng và thống kê. Bạn có thể đi vào mục quản trị để xem và chỉnh sửa phù hợp.";
  }

  if (/(lỗi|bug|không hoạt động|không load|không hiển thị|error|crash|chậm)/.test(text)) {
    return "Nếu bạn thấy lỗi hoặc giao diện không hoạt động, hãy thử làm theo các bước: tải lại trang, kiểm tra kết nối mạng, xóa cache trình duyệt và thử lại sau vài phút. Nếu lỗi vẫn còn, hãy mô tả chi tiết lỗi bạn gặp để tôi hướng dẫn tiếp.";
  }

  if (/(căng thẳng|stress|mệt|áp lực|khó khăn|tư vấn|không biết)/.test(text)) {
    return "Nếu bạn đang căng thẳng, hãy ưu tiên nghỉ ngơi hợp lý, chia nhỏ mục tiêu và giữ thói quen học tập đều đặn. Một kế hoạch rõ ràng và lối sống ổn định sẽ giúp bạn kiểm soát áp lực tốt hơn.";
  }

  return "Cảm ơn bạn đã chia sẻ. Tôi có thể hỗ trợ bạn về học tập, nghề nghiệp, hồ sơ, việc làm, đăng nhập, quản trị và xử lý lỗi trên hệ thống. Hãy cho tôi biết mục tiêu hoặc vấn đề bạn đang gặp để tôi đưa ra hướng dẫn cụ thể và thực tế nhất.";
};

function GlobalAIChatWidget() {
  const { messages, addUserMessage, addAIMessage, isSyncing } = useAIChat();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = (e) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || isTyping || isSyncing) return;

    // Thêm tin nhắn user
    addUserMessage(trimmed);
    setInput("");
    setIsTyping(true);

    // Tạo phản hồi AI
    window.setTimeout(() => {
      const reply = generateProfessionalReply(trimmed);
      addAIMessage(reply);
      setIsTyping(false);
    }, 700);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="btn btn-info rounded-circle shadow-lg d-flex align-items-center justify-content-center"
        style={{
          position: "fixed",
          right: "20px",
          bottom: "20px",
          width: "58px",
          height: "58px",
          zIndex: 1100,
        }}
        aria-label="Mở trợ lý AI"
      >
        <i className={`bi ${isOpen ? "bi-x-lg" : "bi-robot"}`} style={{ fontSize: "1.3rem" }}></i>
      </button>

      {isOpen && (
        <div
          className="card shadow-lg border-0"
          style={{
            position: "fixed",
            right: "20px",
            bottom: "90px",
            width: "min(92vw, 380px)",
            maxHeight: "70vh",
            zIndex: 1100,
            backgroundColor: "#0f172a",
            color: "#f8fafc",
          }}
        >
          <div className="card-header border-0 d-flex align-items-center justify-content-between" style={{ backgroundColor: "#111827" }}>
            <div>
              <div className="fw-bold">AI Trợ lý thông minh</div>
              <small className="text-info">Có thể hỗ trợ bạn giải quyết nhiều vấn đề trong hệ thống và lộ trình phát triển</small>
            </div>
            <button
              type="button"
              className="btn btn-sm btn-outline-light"
              onClick={() => setIsOpen(false)}
            >
              <i className="bi bi-x-lg"></i>
            </button>
          </div>

          <div className="card-body p-3 overflow-auto" style={{ maxHeight: "420px", backgroundColor: "#0f172a" }}>
            {messages && messages.length === 0 ? (
              <div className="text-center text-white-50 mt-4 small">
                Hãy bắt đầu cuộc trò chuyện với tôi! Tôi có thể tư vấn bạn về học tập, nghề nghiệp, kỹ năng và nhiều vấn đề khác.
              </div>
            ) : (
              messages?.map((message) => (
                <div
                  key={message.id}
                  className={`d-flex mb-2 ${message.sender === "user" ? "justify-content-end" : "justify-content-start"}`}
                >
                  <div
                    className={`p-2 px-3 rounded-4 ${message.sender === "user" ? "text-dark" : "text-light"}`}
                    style={{
                      maxWidth: "85%",
                      backgroundColor: message.sender === "user" ? "#38bdf8" : "#1e293b",
                      whiteSpace: "pre-wrap",
                      wordWrap: "break-word",
                    }}
                  >
                    {message.text}
                  </div>
                </div>
              ))
            )}

            {isTyping && (
              <div className="d-flex justify-content-start mb-2">
                <div className="p-2 px-3 rounded-4 text-light" style={{ backgroundColor: "#1e293b" }}>
                  <span className="me-2">Đang suy nghĩ</span>
                  <span className="spinner-border spinner-border-sm text-info"></span>
                </div>
              </div>
            )}

            <div className="mt-3">
              {quickPrompts.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  className="btn btn-sm btn-outline-info rounded-pill me-2 mb-2"
                  onClick={() => setInput(prompt)}
                  disabled={isTyping || isSyncing}
                >
                  {prompt}
                </button>
              ))}
            </div>

            <div ref={messagesEndRef} />
          </div>

          <div className="card-footer border-0" style={{ backgroundColor: "#111827" }}>
            <form onSubmit={handleSend} className="d-flex gap-2">
              <input
                type="text"
                className="form-control bg-dark text-white border-secondary"
                placeholder="Nhập câu hỏi hoặc vấn đề bạn cần giải quyết..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isTyping || isSyncing}
              />
              <button type="submit" className="btn btn-info" disabled={!input.trim() || isTyping || isSyncing}>
                <i className="bi bi-send-fill"></i>
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default GlobalAIChatWidget;
