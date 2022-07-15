// Resource dùng chung toàn chương trình
var Resource = Resource || {};

// Các kiểu dữ liệu của column trong grid
Resource.DataTypeColumn = {
  Number: "Number",
  Date: "Date",
  Enum: "Enum",
  String: "String",
};

// Các method khi gọi ajax
Resource.Method = {
  Get: "Get",
  Post: "Post",
  Put: "Put",
  Delete: "Delete",
};

// giới tính
Resource.Gender = {
  Female: "Nữ",
  Male: "Nam",
  Other: "Khác",
};

// Tình trạng công việc
Resource.WorkStatus = {
  NotWork: "Chưa làm việc",
  CurrentlyWorking: "Đang làm việc",
  StopWork: "Ngừng làm việc",
  Retired: "Đã Nghỉ việc",
};

// Các commandType của toolbar
Resource.CommandType = {
  Add: "Add",
  Edit: "Edit",
  Delete: "Delete",
  Refresh: "Refresh",
  Replication: "Replication",
  Import: "Import",
  Export: "Export",
};

// Các action trên form detail
Resource.CommandForm = {
  Save: "Save",
  Cancel: "Cancel",
};

// API Domain
Resource.Domain = "https://localhost:7231";

// API List
Resource.APIs = {
  Employees: Resource.Domain + "/api/v1/Employees",
  Departments: Resource.Domain + "/api/v1/Departments",
  Positions: Resource.Domain + "/api/v1/Positions",
};
