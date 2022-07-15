using Dapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MISA.CukCuk.Api.Entities;
using MySql.Data.MySqlClient;
//using MySqlConnector;
using Swashbuckle.AspNetCore.Annotations;

namespace MISA.WebDev2022.Api.Controllers
{
    [Route("api/v1/[controller]")]
    [ApiController]
    public class DepartmentsController : ControllerBase
    {
        /// <summary>
        /// API Lấy toàn bộ danh sách phòng ban
        /// </summary>
        /// <returns>Danh sách phòng ban</returns>
        [HttpGet]
        [SwaggerResponse(StatusCodes.Status200OK, type: typeof(List<Department>))]
        [SwaggerResponse(StatusCodes.Status400BadRequest)]
        [SwaggerResponse(StatusCodes.Status500InternalServerError)]
        public IActionResult GetAllDepartments()
        {
            try
            {
                // Khởi tạo kết nối tới DB MySQL
                string connectionString = "Server=3.0.89.182;Port=3306;Database=WDT.2022.DTLOC;Uid=dev;Pwd=12345678;";
                var mySqlConnection = new MySqlConnection(connectionString);

                // Chuẩn bị câu lệnh truy vấn
                string getAllDepartmentsCommand = "SELECT * FROM Departments;";

                // Thực hiện gọi vào DB để chạy câu lệnh truy vấn ở trên
                var departments = mySqlConnection.Query<Department>(getAllDepartmentsCommand);

                // Xử lý dữ liệu trả về
                if (departments != null)
                {
                    // Trả về dữ liệu cho client
                    return StatusCode(StatusCodes.Status200OK, departments);
                }
                else
                {
                    return StatusCode(StatusCodes.Status400BadRequest, "e002");
                }
            }
            catch (Exception exception)
            {
                // TODO: Sau này có thể bổ sung log lỗi ở đây để khi gặp exception trace lỗi cho dễ
                return StatusCode(StatusCodes.Status400BadRequest, "e001");
            }
        }
    }
}
