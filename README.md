# 🌟 AlgoVision - Trực Quan Hóa Thuật Toán & Cấu Trúc Dữ Liệu

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Netlify-00C7B7?style=for-the-badge&logo=netlify&logoColor=white)](https://ajitana-algovision.netlify.app)
[![React](https://img.shields.io/badge/React%2019-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)

> **AlgoVision** là ứng dụng web tương tác trực quan hóa từng bước (step-by-step) các thuật toán cấu trúc dữ liệu và giải thuật kinh điển. Thay vì chỉ đọc dòng lệnh hay console log khô khan, bạn có thể quan sát trực tiếp chuyển động của đồ họa kết hợp đồng bộ dòng mã nguồn C++ tương ứng theo thời gian thực.

🔗 **Trải nghiệm trực tiếp:** [https://ajitana-algovision.netlify.app](https://ajitana-algovision.netlify.app)

---

## 🚀 Các Tính Năng Nổi Bật

- 🎛️ **Bố cục song song (Side-by-Side):** Màn hình chia đôi với phần mô phỏng thuật toán bên trái và trình xem mã nguồn C++ bên phải, giúp theo dõi trạng thái chương trình cực kỳ trực quan.
- 📜 **Đồng bộ hóa dòng mã (Synchronized Step Execution):** Mỗi bước giải thích (narration) được gán chính xác với các dòng code C++ đang thực thi.
- 🎯 **Cuộn code cục bộ (Isolated Scroll):** Code C++ tự động trượt mượt mà đến đúng dòng highlight mà không làm ảnh hưởng hay rung lắc giao diện toàn trang.
- ⚡ **Thanh điều khiển trực quan (Playback Controls):** Hỗ trợ Chạy tự động (Play/Pause), Tua bước (Next/Prev step), Chỉnh tốc độ mô phỏng (0.5x, 1x, 2x, 4x) và Tạo dữ liệu ngẫu nhiên mới (Randomize).
- 🧭 **Kho thuật toán phong phú (Algorithm Catalog Modal & Quick Switcher):** Dễ dàng tìm kiếm và chuyển đổi giữa 14 thuật toán với 1 cú click chuột.

---

## 📚 Danh Mục 14 Thuật Toán Hỗ Trợ (6 Phân Nhóm Toàn Diện)

### 1. 🌐 Đồ thị & Tập hợp (Graph & Sets)
- **Disjoint Set Union (DSU / Union-Find):** Nén đường đi (*Path Compression* $\mathcal{O}(\alpha(N))$) & hợp nhất theo hạng (*Union by Rank*), phát hiện chu trình đồ thị vô hướng.
- **Dijkstra's Shortest Path:** Hàng đợi ưu tiên *Min-Heap* / *Priority Queue*, cơ chế nới lỏng cạnh (*Edge Relaxation*) và truy vết đường đi ngắn nhất phát sáng.
- **Kruskal's Minimum Spanning Tree (MST):** Thuật toán tham lam (*Greedy*) sắp xếp trọng số cạnh kết hợp DSU dựng cây khung nhỏ nhất.
- **Breadth-First Search (BFS):** Duyệt đồ thị theo từng lớp (*Layer-by-layer*) với cấu trúc hàng đợi *Queue (FIFO)*.
- **Depth-First Search (DFS):** Duyệt theo chiều sâu với ngăn xếp *Call Stack (LIFO)* và cơ chế quay lui (*Backtracking*).
- **Topological Sort (Thuật toán Kahn):** Sắp xếp thứ tự các đỉnh đồ thị có hướng không chu trình (DAG) bằng bán bậc vào (*In-degree*) và Queue.

### 2. 🔍 Tìm kiếm (Searching)
- **Binary Search (Tìm kiếm nhị phân):** 3 con trỏ `LOW`, `MID`, `HIGH` chia đôi không gian tìm kiếm với độ phức tạp tối ưu $\mathcal{O}(\log N)$.

### 3. ⚡ Sắp xếp (Sorting)
- **Quick Sort:** Phân hoạch Lomuto (*Lomuto Partitioning*), chọn chốt *Pivot*, swap trực quan và đệ quy sắp xếp.
- **Merge Sort:** Chia để trị (*Divide and Conquer*), phân tách các mảng con và trộn vào mảng đệm phụ `temp[]`.
- **Heap Sort:** Xây dựng Max-Heap từ mảng nhị phân, liên tục trích xuất cực đại đưa về cuối mảng và vun đống lại (*Heapify* $\mathcal{O}(N \log N)$).

### 4. 🌲 Cây & Cấu trúc dữ liệu (Tree & Data Structures)
- **Binary Search Tree (BST):** Chèn các phần tử vào cây nhị phân tìm kiếm và minh họa duyệt trung thứ tự (*In-order Traversal*) sinh ra dãy tăng dần.
- **Trie (Cây tiền tố - Prefix Tree):** Cây lưu trữ chuỗi ký tự chia sẻ tiền tố chung, tìm kiếm từ và tiền tố siêu tốc $\mathcal{O}(L)$.

### 5. 🎒 Quy Hoạch Động (Dynamic Programming)
- **0/1 Knapsack Problem (Bài toán Balo):** Xây dựng bảng quy hoạch động 2D $dp[i][w]$, trực quan hóa lựa chọn Lấy (*Take*) vs Bỏ (*Skip*), và truy ngược lời giải tối ưu.

### 6. 👑 Đệ Quy & Quay Lui (Backtracking)
- **N-Queens Problem (Bài toán N Quân Hậu):** Đặt N quân hậu lên bàn cờ $N \times N$, kiểm tra các tia chiếu xung đột (hàng, cột, đường chéo) và quay lui từng bước trực quan.

---

## 🛠️ Công Nghệ Sử Dụng

- **Frontend Core:** React 19, TypeScript
- **Bundler:** Vite
- **Styling:** Tailwind CSS, Lucide Icons
- **Animation & FX:** Framer Motion, Canvas Confetti
- **Deployment:** Netlify CDN

---

## 💻 Cài Đặt & Chạy Cục Bộ

Yêu cầu máy tính đã cài đặt **Node.js** (khuyên dùng Node 18+).

```bash
# 1. Clone repository
git clone https://github.com/hd929/algorithm-visualizer.git
cd algorithm-visualizer

# 2. Cài đặt các gói phụ thuộc
npm install

# 3. Chạy môi trường phát triển (Dev server)
npm run dev
```

Mở trình duyệt tại địa chỉ: `http://localhost:5173/`

### Build phiên bản Production:
```bash
npm run build
```
Kết quả build được lưu tại thư mục `dist/`.

---

## 📄 Bản Quyền (License)

Phát triển bởi [Duy Han (hd929)](https://github.com/hd929). Dự án được phân phối dưới giấy phép MIT.
