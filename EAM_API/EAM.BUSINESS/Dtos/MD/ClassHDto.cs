using AutoMapper;
using Common;
using EAM.CORE.Entities.MD;
using System;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace EAM.BUSINESS.Dtos.MD
{
    public class ClassHDto : BaseMdDto, IMapFrom, IDto
    {
        [JsonIgnore]
        [Description("STT")]
        public int OrdinalNumber { get; set; }
        [Key]
        [Description("Mã lớp")]
        public string Class { get; set; } = null!;
        [Description("Tên lớp")]
        public string? ClassTxt { get; set; }
        [Description("Loại lớp")]
        public string? Klart { get; set; }
       // [Description("Trạng thái")]
        public string? Statu { get; set; }
     //   [Description("Nhóm lớp")]
        public string? Klagr { get; set; }
      //  [Description("Tên đặc tính")]
        public string? Aname { get; set; }
       // [Description("Ngày hiệu lực")]
        public DateTime? Adatu { get; set; }
      // [Description("Tên phiên bản")]
        public string? Vname { get; set; }
     //   [Description("Ngày phiên bản")]
        public DateTime? Vdatu { get; set; }
      //  [Description("Ngày bắt đầu")]
        public DateTime? Vondt { get; set; }
      //  [Description("Ngày kết thúc")]
        public DateTime? Bisdt { get; set; }
        [Description("Trạng thái")]
        public string State { get => this.IsActive == true ? "Đang hoạt động" : "Khóa"; }
        
        public void Mapping(Profile profile)
        {
            profile.CreateMap<TblMdClassH, ClassHDto>().ReverseMap();
        }
    }
} 