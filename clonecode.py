import os

# Tên file đầu ra chứa toàn bộ code của bạn
output_file = "all_project_code.txt"
# Các thư mục hoặc file cần bỏ qua để tránh file quá nặng
exclude_dirs = {'.git', 'node_modules', 'build', 'dist', 'public'}
exclude_files = {'package-lock.json', 'yarn.lock', '.DS_Store'}

with open(output_file, 'w', encoding='utf-8') as outfile:
    for root, dirs, files in os.walk('.'):
        # Loại bỏ các thư mục không cần thiết
        dirs[:] = [d for d in dirs if d not in exclude_dirs]
        
        for file in files:
            if file in exclude_files:
                continue
                
            # Chỉ đọc các file code chính của dự án React
            if file.endswith(('.js', '.jsx', '.css', '.json', '.html')):
                file_path = os.path.join(root, file)
                outfile.write(f"\n{'='*50}\n")
                outfile.write(f"FILE: {file_path}\n")
                # ĐÃ SỬA LỖI TẠI ĐÂY: Xóa bỏ ký tự '=' thừa trong cú pháp f-string
                outfile.write(f"{'='*50}\n\n") 
                try:
                    with open(file_path, 'r', encoding='utf-8') as infile:
                        outfile.write(infile.read())
                except Exception as e:
                    outfile.write(f"Lỗi khi đọc file: {e}\n")

print(f"Đã gộp toàn bộ code thành công vào file: {output_file}")
