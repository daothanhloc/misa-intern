class EmployeePage {
  // Hàm khởi tạo
  constructor(gridId) {
    let me = this;

    // Lưu lại grid đang thao tác
    me.grid = $(`#${gridId}`);

    // Dùng khởi tạo sự kiện
    me.initEvents();

    // KHởi tạo form detail
    me.initFormDetail();
    me.initConfirmForm();

    // Lấy ra cấu hình các cột
    me.columnConfig = me.getColumnConfig();

    // Lấy dữ liệu
    me.getData();
    me.getDepartmentData();
    me.getPositionData();
  }

  /**
   * Lấy config các cột
   * @returns
   */
  getColumnConfig() {
    let me = this,
      columnDefault = {
        FieldName: "",
        DataType: "String",
        EnumName: "",
        Text: "",
      },
      columns = [];

    // Duyệt từng cột để vẽ header
    me.grid.find(".col").each(function () {
      let column = { ...columnDefault },
        that = $(this);

      Object.keys(columnDefault).filter(function (proName) {
        let value = that.attr(proName);

        if (value) {
          column[proName] = value;
        }

        column.Text = that.text();
      });

      columns.push(column);
    });

    return columns;
  }

  /**
   * Dùng để khởi tạo các sự kiện cho trang
   * NTXUAN (01.07.2022)
   */
  initEvents() {
    let me = this;

    // Khở tạo sự kiện cho toolbar
    me.initEventsToolbar();

    // Khởi tạo sự kiện cho table
    me.initEventsTable();
  }

  /**
   * Khởi tạo sự kiện cho toolbar
   */
  initEventsToolbar() {
    let me = this,
      toolbarId = me.grid.attr("Toolbar");

    // Khởi tạo sự kiện cho các button trên toolbar
    $(`#${toolbarId} [CommandType]`).off("click");
    $(`#${toolbarId} [CommandType]`).on("click", function () {
      let commandType = $(this).attr("CommandType");

      // Gọi đến hàm động cách 2
      if (me[commandType] && typeof me[commandType] == "function") {
        me[commandType]();
      }
    });
  }

  /**
   * THêm mới
   */
  add() {
    let me = this,
      param = {
        parent: me,
        formMode: Enumeration.FormMode.Add,
      };

    // Lấy mã nhân viên mới
    me.getNewEmployeeCode(param);
  }

  /**
   * Sửa
   */
  edit() {
    // debugger;
    let me = this,
      param = {
        parent: me,
        formMode: Enumeration.FormMode.Edit,
      },
      selectedEmployeeId = me.grid.find(".yellow-tr").attr("employee_id");

    me.employeeData.filter(function (item) {
      if (item.employeeID == selectedEmployeeId) {
        param.employee = item;
      }
    });
    if (me.formDetail) {
      me.formDetail.open(param);
    }
  }

  /**
   * Hàm khởi tạo click delete button
   */
  delete() {
    let me = this,
      param = {
        parent: me,
        formMode: Enumeration.FormMode.Delete,
      },
      selectedEmployeeId = me.grid.find(".yellow-tr").attr("employee_id");

    me.employeeData.filter(function (item) {
      if (item.employeeID == selectedEmployeeId) {
        param.employee = item;
      }
    });
    if (me.confirmForm) {
      me.confirmForm.open(param);
    }
  }

  replication() {
    let me = this,
      param = {
        parent: me,
        formMode: Enumeration.FormMode.Replication,
      },
      selectedEmployeeId = me.grid.find(".yellow-tr").attr("employee_id");

    me.employeeData.filter(function (item) {
      if (item.employeeID == selectedEmployeeId) {
        param.employee = item;
      }
    });

    // Lấy mã nhân viên mới
    me.getNewEmployeeCode(param);
  }

  getNewEmployeeCode(param) {
    let me = this;
    $.ajax({
      type: "GET",
      url: `${Resource.APIs.Employees}/new-code`,
      success: function (response, status, xhr) {
        me.renderNewCode(response, param);
      },
      error: function (errormessage) {
        console.log(errormessage.responseText);
      },
    });
  }

  renderNewCode(data, param) {
    let me = this,
      newCode = {};
    Object.assign(newCode, data);

    param.newEmployeeCode = data;
    console.log("AAAAAA", param);

    // kiểm tra có tồn tại form detail
    if (me.formDetail) {
      me.formDetail.open(param);
    }
  }

  /**
   * Khởi tạo trang detail
   * NTXUAN (04.07.2022)
   */
  initFormDetail() {
    let me = this;

    // Khởi tạo đối tượng form detail
    me.formDetail = new EmployeeDetail("EmployeeDetail");
  }

  /**
   * Khởi tạo confirm form
   */
  initConfirmForm() {
    let me = this;
    // khởi tạo đối tượng confirm form
    me.confirmForm = new EmployeeDetail("confirm-form");
  }

  /**
   * Khởi tạo sự kiện cho table
   */
  initEventsTable() {
    let me = this;

    // Khởi tạo sự kiện khi click vào dòng
    me.grid.off("click", "tr");
    me.grid.on("click", "tr", function () {
      me.grid.find(".yellow-tr").removeClass("yellow-tr");

      $(this).addClass("yellow-tr");
    });

    me.grid.off("dblclick", "tr");
    me.grid.on("dblclick", "tr", function () {
      me.edit();
    });
  }

  /**
   * Hàm dùng để lấy dữ liệu cho trang
   */
  getData() {
    let me = this,
      url = me.grid.attr("Url");

    CommonFn.Ajax(url, Resource.Method.Get, {}, function (response) {
      if (response) {
        me.loadData(response.employees);
      } else {
        console.log("Có lỗi khi lấy dữ liệu từ server");
      }
    });
  }

  /**
   * Load dữ liệu
   */
  loadData(data) {
    let me = this;

    if (data) {
      // Render dữ liệu cho grid
      me.renderGrid(data);
      me.employeeData = data;
    }
  }

  /**
   * Hàm tải lại dữ liệu
   */
  reloadData() {
    let me = this;
    me.getData();
    $(".delete").prop("disabled", true);
    $(".duplicate").prop("disabled", true);
  }

  /**
   * Render dữ liệu cho grid
   */
  renderGrid(data) {
    let me = this,
      table = $("<table></table>"),
      thead = me.renderThead(),
      tbody = me.renderTbody(data);

    table.append(thead);
    table.append(tbody);

    me.grid.find("table").remove();
    me.grid.append(table);
  }

  /**
   * Reder header
   */
  renderThead() {
    let me = this,
      thead = $("<thead></thead>"),
      tr = $("<tr></tr>");

    me.columnConfig.filter(function (column) {
      let text = column.Text,
        dataType = column.DataType,
        className = me.getClassFormat(dataType),
        th = $("<th></th>");

      th.text(text);
      th.addClass(className);

      tr.append(th);
    });

    thead.append(tr);

    return thead;
  }

  /**
   * Renderbody
   */
  renderTbody(data) {
    let me = this,
      tbody = $("<tbody></tbody>");

    if (data) {
      data.filter(function (item) {
        let tr = $("<tr></tr>");
        tr.attr("employee_id", item.employeeID);
        // Duyệt từng cột để vẽ header
        me.grid.find(".col").each(function () {
          let fieldName = $(this).attr("FieldName"),
            dataType = $(this).attr("DataType"),
            td = $("<td></td>"),
            value = me.getValueCell(item, fieldName, dataType),
            className = me.getClassFormat(dataType);

          td.text(value);
          td.addClass(className);

          tr.append(td);
        });

        tr.data("Xuan", item);

        tbody.append(tr);
      });
    }

    return tbody;
  }

  /**
   * Lấy giá trị ô
   * @param {} item
   * @param {*} fieldName
   * @param {*} dataType
   */
  getValueCell(item, fieldName, dataType) {
    let me = this,
      value = item[fieldName];

    switch (dataType) {
      case Resource.DataTypeColumn.Number:
        value = CommonFn.formatMoney(value);
        break;
      case "Date":
        break;
      case "Enum":
        break;
    }

    return value;
  }

  /**
   * Hàm dùng để lấy class format cho từng kiểu dữ liệu
   * CreatedBy: NTXUAN 06.05.2021
   */
  getClassFormat(dataType) {
    let className = "";

    switch (dataType) {
      case Resource.DataTypeColumn.Number:
        className = "align-right";
        break;
      case Resource.DataTypeColumn.Date:
        className = "align-center";
        break;
    }

    return className;
  }

  /**
   * Hàm dùng để lấy dữ liệu cho select box position
   */
  getPositionData() {
    let me = this,
      url = Resource.APIs.Positions;

    CommonFn.Ajax(url, Resource.Method.Get, {}, function (res) {
      if (res) {
        me.positionSelectGendering(res);
      } else {
        console.log("Có lỗi khi lấy dữ liệu từ server");
      }
    });
  }

  /**
   * Hàm dùng lấy dữ liệu cho select box department
   */
  getDepartmentData() {
    let me = this,
      url = Resource.APIs.Departments;

    CommonFn.Ajax(url, Resource.Method.Get, {}, function (res) {
      if (res) {
        me.departmentSelectGendering(res);
      } else {
        console.log("Có lỗi khi lấy dữ liệu từ server");
      }
    });
  }

  /**
   * Hàm gán positon vào checkbox
   */
  positionSelectGendering(data) {
    let positionSelect = $('[SelectID = "position-select"]');
    data.filter(function (item) {
      positionSelect.append(
        `<option value="${item.positionID}">${item.positionName}</option>`
      );
    });
  }

  /**
   * Hàm gán department vào checkbox
   */
  departmentSelectGendering(data) {
    let positionSelect = $('[SelectID = "department-select"]');
    data.filter(function (item) {
      positionSelect.append(
        `<option value="${item.departmentID}">${item.departmentName}</option>`
      );
    });
  }
}

// Khởi tạo một biến cho trang nhân viên
var employeePage = new EmployeePage("gridEmployee");
