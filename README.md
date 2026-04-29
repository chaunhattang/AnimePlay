# 🎬 AnimePlay - Nền Tảng Xem Phim Anime Trực Tuyến

![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-6DB33F?style=for-the-badge&logo=spring&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)

AnimePlay là một ứng dụng web xem phim Anime trực tuyến chất lượng cao. Dự án được xây dựng với kiến trúc Client-Server hiện đại, mang lại trải nghiệm mượt mà, tốc độ tải trang nhanh và khả năng quản lý video/người dùng mạnh mẽ.

## ✨ Tính Năng Nổi Bật

- **Xác thực người dùng:** Đăng nhập, đăng ký và bảo mật với Spring Security & JWT.
- **Quản lý hồ sơ (Profile):** Cập nhật thông tin cá nhân, thay đổi mật khẩu an toàn.
- **Tải lên Media (Uploads):** Hỗ trợ người dùng tải lên Avatar (hình ảnh) và hệ thống lưu trữ Video nội bộ.
- **Phân quyền (Role-based):** Hiển thị giao diện và cấp quyền dựa trên vai trò của người dùng (User/Admin).
- **Giao diện Responsive:** Thiết kế tối ưu cho cả giao diện Mobile và Desktop với Tailwind CSS.

## 🛠 Công Nghệ Sử Dụng

### Frontend

- **Framework:** Next.js (App Router)
- **Ngôn ngữ:** TypeScript
- **Styling:** Tailwind CSS
- **Icon:** Lucide React

### Backend

- **Framework:** Spring Boot (Java)
- **Bảo mật:** Spring Security
- **Quản lý file:** Spring Web MVC (`ResourceHandlerRegistry` cho thư mục vật lý)
- **API Architecture:** RESTful API (`/api/v1/...`)

---

## 🚀 Hướng Dẫn Cài Đặt (Getting Started)

Để chạy dự án này trên máy cá nhân của bạn, hãy làm theo các bước sau:

### 1. Yêu cầu hệ thống (Prerequisites)

- [Node.js](https://nodejs.org/) (Phiên bản 18.x trở lên)
- [Java JDK](https://www.oracle.com/java/technologies/downloads/) (Phiên bản 17 trở lên)
- Maven hoặc Gradle
- Hệ quản trị CSDL (MySQL / PostgreSQL tùy cấu hình backend)

### 2. Cài đặt Backend (Spring Boot)

1. Di chuyển vào thư mục Backend.
2. Đảm bảo bạn đã tạo database tương ứng và cấu hình đúng thông tin (username, password, url) trong file `src/main/resources/application.yaml`.
