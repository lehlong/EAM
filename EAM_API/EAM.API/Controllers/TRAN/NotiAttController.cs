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
    public class NotiAttController : ControllerBase
    {
        private readonly INotiAttService _service;

        public NotiAttController(INotiAttService service)
        {
            _service = service;
        }

        [HttpGet("Search")]
        public async Task<IActionResult> Search([FromQuery] BaseFilter filter)
        {
            var transferObject = new TransferObject();
            var result = await _service.Search(filter);
            if (_service.Status)
            {
                transferObject.Data = result;
            }
            else
            {
                transferObject.Status = false;
                transferObject.MessageObject.MessageType = MessageType.Error;
                transferObject.GetMessage("0001", _service);
            }
            return Ok(transferObject);
        }

        [HttpGet("GetByQmnum/{qmnum}")]
        public async Task<IActionResult> GetByQmnum([FromRoute] string qmnum)
        {
            var transferObject = new TransferObject();
            var result = await _service.GetByQmnumAsync(qmnum);
            if (_service.Status)
            {
                transferObject.Data = result;
            }
            else
            {
                transferObject.Status = false;
                transferObject.MessageObject.MessageType = MessageType.Error;
                transferObject.GetMessage("0001", _service);
            }
            return Ok(transferObject);
        }

        [HttpPost("Upload")]
        [Consumes("multipart/form-data")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> Upload(IFormFile file, string qmnum)
        {
            var transferObject = new TransferObject();
            
            if (file == null || file.Length == 0)
            {
                transferObject.Status = false;
                transferObject.MessageObject.MessageType = MessageType.Error;
                transferObject.MessageObject.Message = "Không có file nào được chọn";
                return BadRequest(transferObject);
            }
            
            var result = await _service.UploadAttachmentAsync(file, qmnum);
            
            if (_service.Status)
            {
                transferObject.Status = true;
                transferObject.Data = result;
                transferObject.MessageObject.MessageType = MessageType.Success;
                transferObject.GetMessage("0103", _service);
            }
            else
            {
                transferObject.Status = false;
                transferObject.MessageObject.MessageType = MessageType.Error;
                transferObject.GetMessage("0104", _service);
            }
            
            return Ok(transferObject);
        }

        [HttpDelete("Delete/{id}")]
        public async Task<IActionResult> Delete([FromRoute] string id)
        {
            var transferObject = new TransferObject();
            var result = await _service.DeleteAttachmentAsync(id);
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
