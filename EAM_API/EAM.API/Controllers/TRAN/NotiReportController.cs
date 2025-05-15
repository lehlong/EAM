using Common;
using EAM.API.AppCode.Enum;
using EAM.API.AppCode.Extensions;
using EAM.BUSINESS.Dtos.TRAN;
using EAM.BUSINESS.Services.TRAN;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace EAM.API.Controllers.TRAN
{
    [Route("api/[controller]")]
    [ApiController]
    public class NotiReportController(INotiReportService service) : ControllerBase
    {
        public readonly INotiReportService _service = service;

        [HttpPost("SaveReport")]
        public async Task<IActionResult> SaveReport([FromBody] NotiReportDto report)
        {
            var transferObject = new TransferObject();
            try
            {
                var result = await _service.SaveReport(report);

                transferObject.Data = result;
                transferObject.Status = true;
                transferObject.MessageObject.MessageType = MessageType.Success;
                transferObject.GetMessage("0100", _service);
            }
            catch (Exception ex)
            {
                transferObject.Status = false;
                transferObject.MessageObject.MessageType = MessageType.Error;
                transferObject.MessageObject.Message = ex.Message;
            }

            return Ok(transferObject);
        }
        [HttpGet("GetReportByQmnumAndType")]
        public async Task<IActionResult> GetReportByQmnumAndType([FromQuery] string qmnum, [FromQuery] string rpType)
        {
            var transferObject = new TransferObject();

            try
            {
                var report = await _service.GetReportByQmnumAndType(qmnum, rpType);

                transferObject.Data = report;
                transferObject.Status = true;
            }
            catch (Exception ex)
            {
                transferObject.Status = false;
                transferObject.MessageObject.MessageType = MessageType.Error;
                transferObject.MessageObject.Message = ex.Message;
            }

            return Ok(transferObject);
        }

        [HttpGet("GetReportsByQmnum/{qmnum}")]
        public async Task<IActionResult> GetReportsByQmnum([FromRoute] string qmnum)
        {
            var transferObject = new TransferObject();

            try
            {
                var reports = await _service.GetReportsByQmnum(qmnum);

                transferObject.Data = reports;
                transferObject.Status = true;
            }
            catch (Exception ex)
            {
                transferObject.Status = false;
                transferObject.MessageObject.MessageType = MessageType.Error;
                transferObject.MessageObject.Message = ex.Message;
            }

            return Ok(transferObject);
        }
        [HttpDelete("Delete/{id}")]
        public async Task<IActionResult> Delete([FromRoute] string id)
        {
            var transferObject = new TransferObject();
            await _service.Delete(id);
            if (_service.Status)
            {
                transferObject.Status = true;
                transferObject.MessageObject.MessageType = MessageType.Success;
                transferObject.GetMessage("0105", _service);
            }
            else
            {
                transferObject.Status = false;
                transferObject.MessageObject.MessageType = MessageType.Error;
                transferObject.GetMessage("0106", _service);
            }
            return Ok(transferObject);
        }

    }
}
