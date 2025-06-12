================================================================================
                    MÔ PHỎNG VẬT LÝ XE HƠI 3D - CS105.P22
                        Đồ án môn Đồ họa máy tính
================================================================================


1. TỔNG QUAN DỰ ÁN
--------------------
Dự án này là một mô phỏng vật lý xe hơi 3D được xây dựng bằng React, Three.js, và React Three Fiber. Dự án có các tính năng vật lý xe hơi thực tế, điều khiển tương tác, hiệu ứng thời tiết động, và nhiều chế độ camera khác nhau. Mô phỏng bao gồm các mô hình xe hơi 3D, vật thể môi trường, hiệu ứng âm thanh, và tương tác vật lý sử dụng công cụ vật lý Cannon.js.

Tính năng chính:
- Mô phỏng vật lý xe hơi 3D thực tế
- Nhiều mô hình xe và góc nhìn camera khác nhau
- Hiệu ứng thời tiết (mưa, tuyết)
- Điều khiển tương tác (di chuyển WASD, phanh, còi)
- Môi trường 3D với chướng ngại vật, dốc, và đường đua
- Tích hợp âm thanh cho trải nghiệm sống động
- Va chạm và tương tác dựa trên vật lý


2. THÀNH VIÊN NHÓM
--------------------
|Họ và tên            | Mã số sinh viên |
|---------------------|-----------------|
|Nguyễn Phú Tài       | 22521280        |
|Mai Văn Tân          | 22521568        |
|Trần Lê Nguyên Trung | 22521568        |


3. HƯỚNG DẪN CÀI ĐẶT
--------------------
Bước 1: Cài đặt Node.js
- Tải và cài đặt Node.js từ https://nodejs.org/
- Xác minh cài đặt bằng cách chạy trong terminal:
  node --version
  npm --version

Bước 2: Tải/Clone dự án
- Link dự án: https://github.com/tanmaivan/car.git
- Giải nén hoặc clone dự án vào thư mục mong muốn
- Điều hướng đến thư mục dự án trong terminal:
  cd path/to/car-physics-project

Bước 3: Cài đặt các gói phụ thuộc
- Chạy lệnh sau để cài đặt tất cả các gói cần thiết:
  npm install

Lệnh này sẽ cài đặt:
- React
- Three.js cho đồ họa 3D
- React Three Fiber để tích hợp React-Three.js
- Cannon.js cho mô phỏng vật lý
- Leva cho điều khiển debug
- Các thư viện hỗ trợ khác cho hiệu ứng 3D


4. HƯỚNG DẪN XÂY DỰNG VÀ CHẠY ỨNG DỤNG
--------------------
1. Mở terminal trong thư mục dự án
2. Chạy: npm start
3. Ứng dụng sẽ tự động mở trong trình duyệt mặc định tại http://localhost:3000


5. CẤU TRÚC DỰ ÁN
--------------------
car-physics/
├── public/                # Tài nguyên tĩnh
│   ├── index.html         # File HTML chính
│   ├── audio/             # Hiệu ứng âm thanh
│   ├── models/            # Mô hình 3D (file .glb)
│   └── textures/          # Hình ảnh texture
├── src/                   # Mã nguồn
│   ├── index.js           # Điểm vào chính của ứng dụng
│   ├── Scene.jsx          # Scene 3D chính
│   ├── Car.jsx            # Component xe hơi với vật lý
│   ├── Track.jsx          # Component đường đua
│   ├── Weather components # Rain.jsx, Snow.jsx
│   └── Control hooks      # useControls.jsx, useAudio.jsx
├── package.json           # Các gói phụ thuộc và scripts
└── README.txt             # File này