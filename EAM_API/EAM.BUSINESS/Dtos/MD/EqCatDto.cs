using AutoMapper;
using Common;
using EAM.CORE.Entities.MD;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace EAM.BUSINESS.Dtos.MD
{
    public class EqCatDto : BaseMdDto, IMapFrom, IDto
    {
        [JsonIgnore]
        [Description("STT")]
        public int OrdinalNumber { get; set; }
        [Key]
        [Description("Mã loại thiết bị")]
        public string Eqtyp { get; set; } = null!;
        [Description("Tên loại thiết bị")]
        public string? EqtypTxt { get; set; }
        [Description("Trạng thái")]
        public string State { get => this.IsActive == true ? "Đang hoạt động" : "Khóa"; }
        public void Mapping(Profile profile)
        {
            profile.CreateMap<TblMdEqCat, EqCatDto>().ReverseMap();
        }
    }
}
