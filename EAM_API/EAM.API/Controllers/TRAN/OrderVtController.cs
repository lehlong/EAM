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
    public class OrderVtController(IOrderVtService service) : ControllerBase
    {
        public readonly IOrderVtService _service = service;
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
        [HttpGet("GetAll")]
        public async Task<IActionResult> GetAll()
        {
            var transferObject = new TransferObject();
            var result = await _service.GetAll();
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
        [HttpPost("SaveOrderVt")]
        public async Task<IActionResult> SaveReport([FromBody] List<OrderVtDto> vtDto)
        {
            var transferObject = new TransferObject();
            try
            {
                var result = await _service.SaveOrderVt(vtDto);

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
        [HttpGet("GetByAufnrAndType")]
        public async Task<IActionResult> GetByAufnrAndType([FromQuery] string aufnr, [FromQuery] string category)
        {
            var transferObject = new TransferObject();

            try
            {
                var report = await _service.GetByAufnrAndType(aufnr, category);

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

        [HttpGet("GetByAufnr/{aufnr}")]
        public async Task<IActionResult> GetByAufnr([FromRoute] string aufnr)
        {
            var transferObject = new TransferObject();

            try
            {
                var reports = await _service.GetByAufnr(aufnr);

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
