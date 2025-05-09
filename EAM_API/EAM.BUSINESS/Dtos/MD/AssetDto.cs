using AutoMapper;
using Common;
using EAM.CORE.Entities.MD;
using System;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace EAM.BUSINESS.Dtos.MD
{
    public class AssetDto : BaseMdDto, IMapFrom, IDto
    {
        [JsonIgnore]
        [Description("STT")]
        public int OrdinalNumber { get; set; }
        [Description("Mã nhà máy")]
        public string? Iwerk { get; set; }
        
        [Key]
        [Description("Mã tài sản")]
        public string Anln1 { get; set; } = null!;
        [Description("Mã tài sản phụ")]
        public string? Anln2 { get; set; }
        [Description("Lớp tài sản")]
        public string? Anlkl { get; set; }
        [Description("Loại tài sản")]
        public string? Anlar { get; set; }
        [Description("Người tạo")]
        public string? Ernam { get; set; }
        [Description("Ngày tạo")]
        public DateTime? Erdat { get; set; }
        [Description("Người thay đổi")]
        public string? Aenam { get; set; }
        [Description("Ngày thay đổi")]
        public DateTime? Aedat { get; set; }
        [Description("Cờ xóa")]
        public string? Xloev { get; set; }
        [Description("Mô tả")]
        public string? Txt50 { get; set; }
        [Description("Loại tài sản")]
        public string? Anltp { get; set; }
        [Description("Năm bổ sung")]
        public string? Zujhr { get; set; }
        [Description("Kỳ bổ sung")]
        public string? Zuper { get; set; }
        [Description("Ngày nhận")]
        public DateTime? Zugdt { get; set; }
        [Description("Ngày kích hoạt")]
        public DateTime? Aktiv { get; set; }
        [Description("Ngày bán")]
        public DateTime? Abgdt { get; set; }
        [Description("Ngày ngừng hoạt động")]
        public DateTime? Deakt { get; set; }
        [Description("Ngày kế hoạch")]
        public DateTime? Gplab { get; set; }
        [Description("Ngày đặt hàng")]
        public DateTime? Bstdt { get; set; }
        [Description("Mã chuyển giao")]
        public string? Anlue { get; set; }
        [Description("Mã nhà cung cấp")]
        public string? Liefe { get; set; }
        [Description("Mã nhà sản xuất")]
        public string? Herst { get; set; }
        [Description("Năm mua")]
        public string? Urjhr { get; set; }
        [Description("Giá mua")]
        public decimal? Urwrt { get; set; }
        [Description("Đơn vị đo")]
        public string? Meins { get; set; }
        [Description("Số lượng")]
        public decimal? Menge { get; set; }
        [Description("Trạng thái")]
        public string State { get => this.IsActive == true ? "Đang hoạt động" : "Khóa"; }
        
        public void Mapping(Profile profile)
        {
            profile.CreateMap<TblMdAsset, AssetDto>().ReverseMap();
        }
    }
} 