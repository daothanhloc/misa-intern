using Dapper;
using Microsoft.AspNetCore.Mvc;
using MISA.CukCuk.Api.Entities;
using MySqlConnector;
using Swashbuckle.AspNetCore.Annotations;

namespace MISA.WebDev2022.Api.Controllers
{
    [Route("api/v1/[controller]")]
    [ApiController]
    public class PositionsController : ControllerBase
    {
        /// <summary>
        /// API Lấy toàn bộ danh sách vị trí
        /// </summary>
        /// <returns>Danh sách vị trí</returns>
        [HttpGet]
        [SwaggerResponse(StatusCodes.Status200OK, type: typeof(List<Position>))]
        [SwaggerResponse(StatusCodes.Status400BadRequest)]
        [SwaggerResponse(StatusCodes.Status500InternalServerError)]
        public IActionResult GetAllPositions()
        {
            try
            {
                // Khởi tạo kết nối tới DB MySQL
                string connectionString = "Server=3.0.89.182;Port=3306;Database=WDT.2022.DTLOC;Uid=dev;Pwd=12345678;";
                var mySqlConnection = new MySqlConnection(connectionString);

                // Chuẩn bị câu lệnh truy vấn
                string getAllPositionsCommand = "SELECT * FROM Positions;";

                // Thực hiện gọi vào DB để chạy câu lệnh truy vấn ở trên
                var positions = mySqlConnection.Query<Position>(getAllPositionsCommand);

                // Xử lý dữ liệu trả về
                if (positions != null)
                {
                    // Trả về dữ liệu cho client
                    return StatusCode(StatusCodes.Status200OK, positions);
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
