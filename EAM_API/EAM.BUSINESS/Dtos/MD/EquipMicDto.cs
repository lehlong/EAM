using AutoMapper;
using Common;
using EAM.CORE.Entities.MD;
using System;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace EAM.BUSINESS.Dtos.MD
{
    public class EquipMicDto : BaseMdDto, IMapFrom, IDto
    {
        [JsonIgnore]
        [Description("STT")]
        public int OrdinalNumber { get; set; }
        [Key]
        [Description("Mã thiết bị")]
        public string Equnr { get; set; } = null!;
        [Description("Lớp")]
        public string? Class { get; set; }
        [Description("Mã thông số")]
        public string? Mic { get; set; }
        [Description("Tên thông số")]
        public string? MicName { get; set; }
        [Description("Giá trị tiêu chuẩn")]
        public decimal? StValue { get; set; }
        [Description("Giá trị thấp")]
        public decimal? LoValue { get; set; }
        [Description("Giá trị cao")]
        public decimal? HiValue { get; set; }
        [Description("Ngày giá trị")]
        public string? ValueDt { get; set; }
        [Description("Ngày hiệu lực")]
        public DateTime? Adatu { get; set; }
        [Description("Tên phiên bản")]
        public string? Vname { get; set; }
        [Description("Ngày phiên bản")]
        public DateTime? Vdatu { get; set; }
        [Description("Ngày bắt đầu")]
        public DateTime? Vondt { get; set; }
        [Description("Ngày kết thúc")]
        public DateTime? Bisdt { get; set; }
        [Description("Trạng thái")]
        public string State { get => this.IsActive == true ? "Đang hoạt động" : "Khóa"; }
        
        public void Mapping(Profile profile)
        {
            profile.CreateMap<TblMdEquipMic, EquipMicDto>().ReverseMap();
        }
    }
} 