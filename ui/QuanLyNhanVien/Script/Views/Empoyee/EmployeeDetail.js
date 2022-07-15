class EmployeeDetail {
  constructor(formId) {
    let me = this;
    me.form = $(`#${formId}`);
    // khởi tạo sự kiện cho form
    me.initEvents();
  }

  /**
   * Khởi tạo sự kiện cho form
   */
  initEvents() {
    let me = this;

    // khởi tạo sự kiện cho button trên toolbar
    me.initToolbarEvent();

    // khởi tạo sự kiện format tiền
    me.initMoneyFormatEvent();
  }

  /**
   * Hàm khởi tạo sự kiện format tiền
   */
  initMoneyFormatEvent() {
    let me = this;

    // me.form.find("[SetField = 'salary']").off("change");
    me.form.find("[SetField = 'salary']").on("change", function () {
      let value = CommonFn.formatMoney($(this).val());

      $(this).val(value);
    });
  }

  /**
   * Hàm khởi tạo sự kiện cho button trên toolbar
   */
  initToolbarEvent() {
    let me = this;

    me.form.find(".toolbar-form [CommandType]").off("click");
    me.form.find(".toolbar-form [CommandType]").on("click", function () {
      let commandType = $(this).attr("CommandType");

      // Gọi hàm động
      if (me[commandType] && typeof me[commandType] == "function") {
        me[commandType]();
      }
    });
  }

  /**
   * Đóng form
   */
  close() {
    let me = this;

    me.form.addClass("hide");
  }

  /**
   * Lưu dữ liệu
   */
  save() {
    let me = this,
      isValid = me.validateForm();

    if (isValid) {
      let data = me.getFormData();

      // lưu data
      me.saveData(data);
    }
  }

  /**
   * Hàm xóa dữ liệu
   */
  delete() {
    let me = this,
      url = `${Resource.APIs.Employees}/${me.employee.employeeID}`,
      method = "";

    console.log("a", me.employee.employeeID);
    switch (me.formMode) {
      case Enumeration.FormMode.Delete:
        method = Resource.Method.Delete;
        break;
    }

    // đẩy api bằng ajax
    CommonFn.Ajax(url, method, {}, function (response) {
      if (response) {
        me.getResult(response);
      } else {
        console.log("Có lỗi");
      }
    });
  }

  /**
   * Hàm validate form
   */
  validateForm() {
    let me = this,
      isValid = me.validateRequire();

    return isValid;
  }

  /**
   * Validate required
   */
  validateRequire() {
    let me = this,
      isValid = true;

    me.form.find("[Required]").each(function () {
      let value = $(this).val();

      if (!value) {
        isValid = false;

        $(this).addClass("require-control");
        $(this).attr("title", "Không được bỏ trống");
      } else {
        $(this).removeClass("require-control");
        $(this).attr("title", "");
      }
    });

    return isValid;
  }

  /**
   * Hàm đẩy dữ liệu data
   */
  saveData(data) {
    let me = this,
      method = "",
      url = "";

    // xác định method muốn đẩy lên
    switch (me.formMode) {
      case Enumeration.FormMode.Add:
        method = Resource.Method.Post;
        url = Resource.APIs.Employees;
        data["createdBy"] = "admin";
        break;
      case Enumeration.FormMode.Replication:
        method = Resource.Method.Post;
        url = Resource.APIs.Employees;
        data["createdBy"] = "admin";
        break;
      case Enumeration.FormMode.Edit:
        method = Resource.Method.Put;
        url = `${Resource.APIs.Employees}/${me.employee.employeeID}`;
        break;
    }

    // đẩy api bằng ajax
    data.dateOfBirth = new Date(data.dateOfBirth).toISOString();
    data.identityIssuedDate = new Date(data.identityIssuedDate).toISOString();
    data.joiningDate = new Date(data.joiningDate).toISOString();
    CommonFn.Ajax(url, method, data, function (response) {
      if (response) {
        me.getResult(response);
      } else {
        console.log("Có lỗi");
      }
    });
  }

  /**
   * Hàm nhận kết quả từ ajax
   */
  getResult(res) {
    let me = this;
    me.form.addClass("hide");
    me.parent.reloadData();
  }

  /**
   * Hàm lấy dữ liệu từ form
   */
  getFormData() {
    let me = this,
      data = {};

    me.form.find("[SetField]").each(function () {
      let dataType = $(this).attr("DataType") || "String",
        field = $(this).attr("SetField"),
        value = null;

      switch (dataType) {
        case Resource.DataTypeColumn.Enum:
          value = parseInt($(this).val());
          break;
        case Resource.DataTypeColumn.String:
          value = $(this).val();
          break;
        case Resource.DataTypeColumn.Number:
          if ($(this).val()) {
            value = CommonFn.formatMoney3($(this).val());
          }
          break;
        case Resource.DataTypeColumn.Date:
          if ($(this).val()) {
            value = CommonFn.formatDate($(this).val());
          }
      }

      data[field] = value;
    });
    data["modifiedBy"] = "admin";

    return data;
  }

  /**
   * Hàm mở form
   */

  open(param) {
    let me = this;
    Object.assign(me, param);
    //Nếu ở mode thì reset form
    if (param) {
      switch (param.formMode) {
        case Enumeration.FormMode.Add:
          // hiện form
          me.form.removeClass("hide");
          //reset form
          me.resetForm(param);
          break;
        case Enumeration.FormMode.Replication:
          //hiện form
          me.form.removeClass("hide");
          me.formAutoFill(param);
          break;
        case Enumeration.FormMode.Edit:
          // hiện form
          me.form.removeClass("hide");
          me.formAutoFill(param);
          break;
        case Enumeration.FormMode.Delete:
          me.form.removeClass("hide");
          me.formAutoFill(param);
          break;
      }
    }

    me.form.find('[SetField = "employeeCode"]').focus();
  }

  /**
   * Hàm tự động điền thông tin của người dùng lên form
   */
  formAutoFill(param) {
    let me = this,
      employee = param.employee;

    me.form.find("[SetField]").each(function () {
      let dataType = $(this).attr("DataType") || "String",
        field = $(this).attr("SetField"),
        value = null;
      switch (field) {
        case "employeeCode":
          if (param.newEmployeeCode) {
            value = param.newEmployeeCode;
          } else {
            value = employee.employeeCode;
          }
          break;

        default:
          switch (dataType) {
            case Resource.DataTypeColumn.Date:
              value = CommonFn.formatDateInput(employee[field]);
              break;
            case Resource.DataTypeColumn.Number:
              value = CommonFn.formatMoney2(employee[field]);
              break;
            case Resource.DataTypeColumn.Enum:
              value = employee[field];
              break;
            case Resource.DataTypeColumn.String:
              value = employee[field];
              break;
          }
          break;
      }
      $(this).val(value);
    });
  }

  /**
   * Hàm reset form
   */
  resetForm(param) {
    let me = this;

    me.form.find("[SetField]").each(function () {
      let dataType = $(this).attr("DataType") || "String",
        field = $(this).attr("SetField");

      switch (dataType) {
        case Resource.DataTypeColumn.String:
          $(this).val("");
          $(this).removeClass("require-control");
          $(this).attr("title", "");
          break;

        case Resource.DataTypeColumn.Date:
          $(this).val("");
          $(this).removeClass("require-control");
          $(this).attr("title", "");
          break;

        case Resource.DataTypeColumn.Enum:
          $(this).val("");
          $(this).removeClass("require-control");
          $(this).attr("title", "");
          break;

        case Resource.DataTypeColumn.Number:
          $(this).val("");
          $(this).removeClass("require-control");
          $(this).attr("title", "");
          break;
      }

      switch (field) {
        case "employeeCode":
          $(this).val(param.newEmployeeCode);
          break;
      }
    });
  }
}
