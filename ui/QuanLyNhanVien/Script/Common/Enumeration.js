// Các enum dùng chung toàn chương trình
var Enumeration = Enumeration || {};

// Các mode của form detail
Enumeration.FormMode = {
  Add: 1, // Thêm mới
  Edit: 2, // Sửa
  Delete: 3, // Xóa
  Replication: 4, // Nhân bản
};

// Giới tính
Enumeration.Gender = {
  Female: 0, // Nữ
  Male: 1, // Nam
  Other: 2, // Khác
};

// Tình trạng công việc
Enumeration.WorkStatus = {
  NotWork: 0, // Chưa làm việc
  CurrentlyWorking: 1, // Đang làm việc
  StopWork: 2, // Ngừng làm việc
  Retired: 3, // Đã nghỉ việc
};
