using AutoMapper;
using Common;
using EAM.CORE.Entities.MD;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace EAM.BUSINESS.Dtos.MD
{
    public class WcDto : BaseMdDto, IMapFrom, IDto
    {
        [JsonIgnore]
        [Description("STT")]
        public int OrdinalNumber { get; set; }
        [Key]
        [Description("Mã trung tâm công việc")]
        public string Arbpl { get; set; } = null!;
        [Description("Tên trung tâm công việc")]
        public string? ArbplTxt { get; set; }
        [Description("Mã nhà máy")]
        public string? Iwerk { get; set; }
        [Description("Trạng thái")]
        public string State { get => this.IsActive == true ? "Đang hoạt động" : "Khóa"; }
        public void Mapping(Profile profile)
        {
            profile.CreateMap<TblMdWc, WcDto>().ReverseMap();
        }
    }
}
