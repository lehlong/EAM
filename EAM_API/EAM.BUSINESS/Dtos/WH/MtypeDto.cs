using AutoMapper;
using Common;
using EAM.BUSINESS.Dtos.MD;
using EAM.CORE.Entities.MD;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Text.Json.Serialization;
using EAM.CORE.Entities.WH;

namespace EAM.BUSINESS.Dtos.WH
{
    public class MtypeDto : BaseMdDto, IMapFrom, IDto
    {
        [JsonIgnore]
        [Description("STT")]
        public int OrdinalNumber { get; set; }
        [Key]
        [Description("Mã")]
        public string Code { get; set; } = null!;
        [Description("Tên")]
        public string? Name { get; set; }
        [Description("Trạng thái")]
        public string State { get => this.IsActive == true ? "Đang hoạt động" : "Khóa"; }
        public void Mapping(AutoMapper.Profile profile)
        {
            profile.CreateMap<TblMdMType, MtypeDto>().ReverseMap();
        }
    }
}
