using Common;
using EAM.API.AppCode.Enum;
using EAM.API.AppCode.Extensions;
using EAM.BUSINESS.Dtos.MD;
using EAM.BUSINESS.Dtos.PLAN;
using EAM.BUSINESS.Filter.PLAN;
using EAM.BUSINESS.Model;
using EAM.BUSINESS.Services.MD;
using EAM.BUSINESS.Services.PLAN;
using Microsoft.AspNetCore.Mvc;

namespace EAM.API.Controllers.PLAN
{
    [Route("api/[controller]")]
    [ApiController]
    public class PlanHController(IPlanHService service) : ControllerBase
    {
        public readonly IPlanHService _service = service;

        [HttpGet("Search")]
        public async Task<IActionResult> Search([FromQuery] PlanFilter filter)
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

        [HttpGet("SearchPlan")]
        public async Task<IActionResult> SearchPlan([FromQuery] FilterPlanModel filter)
        {
            var transferObject = new TransferObject();
            var result = await _service.SearchPlan(filter);
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

        [HttpGet("GenarateOrder")]
        public async Task<IActionResult> GenarateOrder([FromQuery] FilterPlanModel filter)
        {
            var transferObject = new TransferObject();
            await _service.GenarateOrder(filter);
            if (_service.Status)
            {
            }
            else
            {
                transferObject.Status = false;
                transferObject.MessageObject.MessageType = MessageType.Error;
                transferObject.GetMessage("0001", _service);
            }
            return Ok(transferObject);
        }

        [HttpPost("GenarateOrderSelect")]
        public async Task<IActionResult> GenarateOrderSelect([FromBody] List<string> ids)
        {
            var transferObject = new TransferObject();
            await _service.GenarateOrderSelect(ids);
            if (_service.Status)
            {
            }
            else
            {
                transferObject.Status = false;
                transferObject.MessageObject.MessageType = MessageType.Error;
                transferObject.GetMessage("0001", _service);
            }
            return Ok(transferObject);
        }

        [HttpGet("ExportReport")]
        public async Task<IActionResult> ExportReport()
        {
            var transferObject = new TransferObject();
            var result = await _service.ExportReport();
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

        [HttpGet("GenarateCode")]
        public async Task<IActionResult> GenarateCode([FromQuery] string m)
        {
            var transferObject = new TransferObject();
            var result = await _service.GenarateCode(m);
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
        [HttpPost("Insert")]
        public async Task<IActionResult> Insert([FromBody] PlanHDto time)
        {
            var transferObject = new TransferObject();
             await _service.Create(time);
            if (_service.Status)
            {
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
        public async Task<IActionResult> Update([FromBody] PlanHDto time)
        {
            var transferObject = new TransferObject();
            await _service.Update(time);
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
        [HttpGet("Export")]
        public async Task<IActionResult> Export([FromQuery] BaseMdFilter filter)
        {
            var transferObject = new TransferObject();
            var result = await _service.Export(filter);
            if (_service.Status)
            {
                return File(result, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "Danh sách đặc tính" + DateTime.Now.ToString() + ".xlsx");
            }
            else
            {
                transferObject.Status = false;
                transferObject.MessageObject.MessageType = MessageType.Error;
                transferObject.GetMessage("2000", _service);
                return Ok(transferObject);
            }
        }
    }
}
