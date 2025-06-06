using Common;
using EAM.API.AppCode.Enum;
using EAM.API.AppCode.Extensions;
using EAM.BUSINESS.Dtos.TRAN;
using EAM.BUSINESS.Filter.TRAN;
using EAM.BUSINESS.Services.TRAN;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace EAM.API.Controllers.TRAN
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrderController(IOrderService service) : ControllerBase
    {
        public readonly IOrderService _service = service;

        [HttpGet("Search")]
        public async Task<IActionResult> Search([FromQuery] NotiFilter filter)
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

        [HttpGet("SearchOrderPlan")]
        public async Task<IActionResult> SearchOrderPlan([FromQuery] OrderFilter filter)
        {
            var transferObject = new TransferObject();
            var result = await _service.SearchPlanOrder(filter);
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

        [HttpGet("GetDetail")]
        public async Task<IActionResult> GetDetail([FromQuery] string code)
        {
            var transferObject = new TransferObject();
            var result = await _service.GetDetail(code);
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

        [HttpGet("ExportExcel")]
        public async Task<IActionResult> ExportExcel([FromQuery] string aufnr)
        {
            var transferObject = new TransferObject();
            var result = await _service.ExportExcel(aufnr);
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

        [HttpPost("Insert")]
        public async Task<IActionResult> Insert([FromBody] OrderDto Order)
        {
            var transferObject = new TransferObject();
            var aufnr = await _service.InsertOrder(Order);
            if (_service.Status)
            {
                transferObject.Data = aufnr;
                transferObject.Status = true;
                transferObject.MessageObject.MessageType = MessageType.Success;
                transferObject.GetMessage("0100", _service);
            }
            else
            {
                transferObject.Status = false;
                transferObject.MessageObject.MessageType = MessageType.Error;
                transferObject.GetMessage("0101", _service);
            }
            return Ok(transferObject);
        }

        [HttpPut("Update")]
        public async Task<IActionResult> Update([FromBody] OrderDto Order)
        {
            var transferObject = new TransferObject();
            await _service.UpdateOrder(Order);
            if (_service.Status)
            {
                transferObject.Status = true;
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

        [HttpPut("UpdateListOrder")]
        public async Task<IActionResult> UpdateListOrder([FromBody] List<OrderDto> Order)
        {
            var transferObject = new TransferObject();
            await _service.UpdateListOrder(Order);
            if (_service.Status)
            {
                transferObject.Status = true;
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
