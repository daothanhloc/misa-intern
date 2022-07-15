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
    me.getEmployeeData();
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

    me.initEventsFilter();

    me.initEventsNavigation();
  }

  /**
   * Hàm khởi tạo sự kiện cho navigation
   */
  initEventsNavigation() {
    let me = this;

    me.pageSize = $("input[SetField = 'pageSize']").val();
    me.pageNumber = 1;
    console.log(me.pageSize);

    $("input[SetField = 'pageSize']").on("keypress", function (event) {
      if (event.key == "Enter") {
        let value = $("input[SetField = 'pageSize']").val();
        if (20 > value) {
          value = 20;
        }
        if (value > 200) {
          value = 200;
        }
        $("input[SetField = 'pageSize']").val(value);

        me.pageSize = value;
        me.pageNumber = 1;
        me.reloadData();
      }
    });
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
   * Hàm khởi tạo sự kiện cho bộ lọc và tìm kiếm
   * LHNAM (13/7/2022)
   */
  initEventsFilter() {
    let me = this;

    // Hàm khởi tạo sự kiện tìm kiếm
    me.searchFilter();

    // Hàm khởi tạo sự kiện bộ lọc vị trí
    me.positionFilter();

    // Hàm khởi tạo sự kiện bộ lọc phòng ban
    me.departmentFilter();
  }
  /**
   * Hàm khởi tạo sự kiện tìm kiếm
   * LHNAM (13/7/2022)
   */
  searchFilter() {
    let me = this;
    $("#EmployeeFilter")
      .find("[Filter = 'search']")
      .on("keypress", function (event) {
        if (event.key == "Enter") {
          me.search = $(this).val();
          me.reloadData();
        }
      });
  }

  /**
   * Hàm khởi tạo sự kiện bộ lọc vị trí
   * LHNAM (13/7/2022)
   */
  positionFilter() {
    let me = this;
    $("#EmployeeFilter")
      .find("[Filter = 'position']")
      .on("change", function () {
        me.positionID = $(this).val();

        me.reloadData();
      });
  }

  /**
   * Hàm khởi tạo sự kiện bộ lọc phòng ban
   * LHNAM (13/7/2022)
   */
  departmentFilter() {
    let me = this;
    $("#EmployeeFilter")
      .find("[Filter = 'department']")
      .on("change", function () {
        me.departmentID = $(this).val();

        me.reloadData();
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

  refresh() {
    let me = this;
    // Lấy lại dữ liệu của employee
    me.reloadData();
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
  getEmployeeData() {
    let me = this;
    console.log("getEmployeeData", me.pageSize, me.pageNumber);
    me.limit = me.pageSize;
    me.skip = (me.pageNumber - 1 > 0 ? me.pageNumber - 1 : 0) * me.pageSize;
    if (me.search == null) {
      me.search = "";
    }
    if (me.positionID == null) {
      me.positionID = "";
    }
    if (me.departmentID == null) {
      me.departmentID = "";
    }

    if (me.departmentID == null) {
      me.departmentID = "";
    }

    if (me.limit == null) {
      me.limit = -1;
    }
    if (me.skip == null) {
      me.skip = -1;
    }
    let url = `${Resource.APIs.Employees}?search=${me.search}&positionID=${me.positionID}&departmentID=${me.departmentID}&includeDepartment=1&includePosition=1&limit=${me.limit}&skip=${me.skip}`;
    CommonFn.Ajax(url, Resource.Method.Get, {}, function (response) {
      if (response) {
        me.loadData(response.employees);
        me.getTotalCount(response.totalCount);
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
    me.getEmployeeData();
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

        // tr.data("Xuan", item);

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
        value = CommonFn.formatMoney2(value);
        break;
      case Resource.DataTypeColumn.Date:
        value = CommonFn.formatDateOutput(value);
        break;
      case Resource.DataTypeColumn.Enum:
        switch (fieldName) {
          case "gender":
            value = me.setGender(value);
            break;
          case "workStatus":
            value = me.setWorkStatus(value);
            break;
        }
        break;
    }

    return value;
  }
  value;

  /**
   * Hàm để set giá trị cho cột workStatus
   * LHNAM (12/7/2022)
   */
  setWorkStatus(workStatus) {
    switch (workStatus) {
      case Enumeration.WorkStatus.NotWork:
        workStatus = Resource.WorkStatus.NotWork;
        break;

      case Enumeration.WorkStatus.CurrentlyWorking:
        workStatus = Resource.WorkStatus.CurrentlyWorking;
        break;

      case Enumeration.WorkStatus.StopWork:
        workStatus = Resource.WorkStatus.StopWork;
        break;

      case Enumeration.WorkStatus.Retired:
        workStatus = Resource.WorkStatus.Retired;
        break;
    }

    return workStatus;
  }

  /**
   * Hàm để set giá trị cho cột giới tính
   * LHNAM(3/7/2022)
   */
  setGender(gender) {
    switch (gender) {
      case Enumeration.Gender.Female:
        gender = Resource.Gender.Female;
        break;
      case Enumeration.Gender.Male:
        gender = Resource.Gender.Male;
        break;
      case Enumeration.Gender.Other:
        gender = Resource.Gender.Other;
        break;
    }
    return gender;
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

  /**
   * Hàm Render phân trang
   */
  renderNavigation(totalCount) {
    let me = this,
      navigationPages = $(".pagination");

    me.pageTotalNumber = parseInt(totalCount / me.pageSize);
    console.log(me.pageTotalNumber);

    if (totalCount % me.pageSize > 0) {
      me.pageTotalNumber++;
    }
    navigationPages.html("");
    let prev = $(
      '<li class="page-item"><a class="page-link" href="#" aria-label="Previous"><span aria-hidden="true">&laquo;</span><span class="sr-only"></span></a></li>'
    );
    prev.attr("NavigationField", "prev");
    navigationPages.append(prev);
    for (let i = 1; i <= me.pageTotalNumber; i++) {
      let page =
        i == me.pageNumber
          ? $('<li class="page-item page-link nav-green"></li>')
          : $('<li class="page-item page-link"></li>');
      page.attr("PageNumber", i);
      page.addClass("page");
      page.text(i);
      navigationPages.append(page);
    }

    let next = $(
      '<li class="page-item"><a class="page-link" href="#" aria-label="Previous"><span aria-hidden="true">&raquo;</span><span class="sr-only"></span></a></li>'
    );
    next.attr("NavigationField", "next");
    navigationPages.append(next);

    me.getPageNumber();
  }

  /**
   * Hàm lấy page number
   * LHNAM (13/7/2022)
   */
  getPageNumber() {
    let me = this;

    me.setNavigationBtn();

    me.setNextPrevNavigationBtn();
  }

  /**
   * Hàm nhận event click nút prev và next
   * LHNAM (14/7/2022)
   */
  setNextPrevNavigationBtn() {
    let me = this;

    $(".pagination").find("[NavigationField]").off("click");
    $(".pagination")
      .find("[NavigationField]")
      .on("click", function () {
        let field = $(this).attr("NavigationField");

        // Gọi đến hàm động
        if (me[field] && typeof me[field] == "function") {
          me[field]();
        }
      });
  }

  /**
   * Hàm trở về trang trước
   * LHNAM (14/7/2022)
   */
  prev() {
    let me = this;

    if (me.pageNumber <= 1) {
      return;
    }
    me.pageNumber--;
    me.reloadData();
  }

  /**
   *  Hàm next trang sau
   * LHNAM (14/7/2022)
   */
  next() {
    let me = this;
    me.pageNumber++;
    me.reloadData();
  }

  /**
   *  Hàm nhận event click trực tiếp nút ở navigation
   * LHNAM (14/7/2022)
   */
  setNavigationBtn() {
    let me = this;

    $(".pagination").find("[PageNumber]").off("click");
    $(".pagination")
      .find("[PageNumber]")
      .on("click", function () {
        console.log("click");
        $(".pagination").find(".nav-green").removeClass("nav-green");
        $(this).addClass("nav-green");
        me.pageNumber = $(this).attr("PageNumber");
        console.log(me.pageNumber);

        me.reloadData();
      });
  }

  /**
   * Hàm lấy tổng số bản ghi
   * LHNAM(13/7/2022)
   */
  getTotalCount(totalCount) {
    let me = this;

    let fisrtData = me.pageSize * (me.pageNumber - 1) + 1,
      finalData = me.pageSize * me.pageNumber;

    if (finalData > totalCount) {
      finalData = totalCount;
    }
    let pageInfo = fisrtData + "-" + finalData + "/";

    $("span[SetField = 'pageInfo']").text(pageInfo);
    $("span[SetField = 'totalCount']").text(totalCount);

    me.renderNavigation(totalCount);
  }
}

// Khởi tạo một biến cho trang nhân viên
var employeePage = new EmployeePage("gridEmployee");
