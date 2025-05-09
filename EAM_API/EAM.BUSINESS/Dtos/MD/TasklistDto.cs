using AutoMapper;
using Common;
using EAM.CORE.Entities.MD;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace EAM.BUSINESS.Dtos.MD
{
    public class TasklistDto : BaseMdDto, IMapFrom, IDto
    {
        [JsonIgnore]
        [Description("STT")]
        public int OrdinalNumber { get; set; }
        [Key]
        [Description("Mã")]
        public string Id { get; set; } = null!;
        [Description("Mã danh sách nhiệm vụ")]
        public string? Plnnr { get; set; }
        [Description("Mã nhà máy")]
        public string? Iwerks { get; set; }
        [Description("Tiêu đề ngắn")]
        public string? Ktext { get; set; }
        [Description("Mã thao tác")]
        public string? Vornr { get; set; }
        [Description("Mã thao tác phụ")]
        public int? VornrSub { get; set; }
        [Description("Mô tả thao tác")]
        public string? Ltxa1 { get; set; }
        [Description("Thời gian")]
        public decimal? Duration { get; set; }
        [Description("Đơn vị thời gian")]
        public string? TimeUnit { get; set; }
        [Description("Trạng thái")]
        public string State { get => this.IsActive == true ? "Đang hoạt động" : "Khóa"; }
        
        public void Mapping(Profile profile)
        {
            profile.CreateMap<TblMdTasklist, TasklistDto>().ReverseMap();
        }
    }
} 