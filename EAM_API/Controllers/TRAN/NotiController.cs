using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using EAM_API.Models;
using EAM_API.Services.TRAN;

namespace EAM_API.Controllers.TRAN
{
    [Route("api/[controller]")]
    [ApiController]
    public class NotiController : ControllerBase
    {
        private readonly NotiService _service;

        public NotiController(NotiService service)
        {
            _service = service;
        }

        [HttpGet("GetLastQmnum")]
        public async Task<IActionResult> GetLastQmnum([FromQuery] string qmart)
        {
            var transferObject = new TransferObject();
            var result = string.IsNullOrEmpty(qmart) ? 
                await _service.GetLastQmnum() : 
                await _service.GenerateQmnum(qmart);
                
            if (_service.Status)
            {
                transferObject.Data = result;
                transferObject.Status = true;
            }
            else
            {
                transferObject.Status = false;
                transferObject.MessageObject.MessageType = MessageType.Error;
                transferObject.GetMessage("0001", _service);
            }
            return Ok(transferObject);
        }
    }
}