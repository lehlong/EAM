using AutoMapper;
using Common;
using EAM.CORE.Entities.MD;
using System;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace EAM.BUSINESS.Dtos.MD
{
    public class EquipCharDto : BaseMdDto, IMapFrom, IDto
    {
        [JsonIgnore]
        [Description("STT")]
        public int OrdinalNumber { get; set; }
        [Key]
        [Description("Mã ")]
        public string Id { get; set; } = null!;
        [Description("Mã thiết bị")]
        public string Equnr { get; set; } = null!;
        public string? Manuf { get; set; }
        public string? Coo { get; set; }
        public string? Yom { get; set; }
        public string? Modl { get; set; }
        public string? Serl { get; set; }
        public string? Used { get; set; }
        [Description("Lớp")]
        public string? Class { get; set; }
        [Description("Mã đặc tính")]
        public string? Atnam { get; set; }
        [Description("Giá trị")]
        public string? Value { get; set; }
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
            profile.CreateMap<TblMdEquipChar, EquipCharDto>().ReverseMap();
        }
    }
} 