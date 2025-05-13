using Common;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace EAM.BUSINESS.Dtos.WH
{
    public class WarehouseDto : BaseMdDto, IMapFrom, IDto
    {
        [JsonIgnore]
        [Description("STT")]
        public int OrdinalNumber { get; set; }
        [Key]
        [Description("Mã Kho")]
        public string Werk { get; set; } = null!;
        [Description("Đơn vị bảo trì")]
        public string Iwerk { get; set; } = null!;
        [Description("Tên Kho")]
        public string? WerkTxt { get; set; }
        [Description("Trạng thái")]
        public string State { get => this.IsActive == true ? "Đang hoạt động" : "Khóa"; }
        public void Mapping(AutoMapper.Profile profile)
        {
            profile.CreateMap<EAM.CORE.Entities.WH.TblMdWH, WarehouseDto>().ReverseMap();
        }
    }
}
