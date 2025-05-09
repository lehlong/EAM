using AutoMapper;
using Common;
using EAM.CORE.Entities.MD;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace EAM.BUSINESS.Dtos.MD
{
    public class FlocDto : BaseMdDto, IMapFrom, IDto
    {
        [JsonIgnore]
        [Description("STT")]
        public int OrdinalNumber { get; set; }
        [Key]
        [Description("Mã vị trí chức năng")]
        public string Tplnr { get; set; } = null!;
        [Description("Mã nhà máy")]
        public string? Iwerk { get; set; }
        [Description("Mã nhóm quản lý")]
        public string? Ingrp { get; set; }
        [Description("Mô tả")]
        public string? Descript { get; set; }
        [Description("Vị trí chức năng cấp trên")]
        public string? Supfloc { get; set; }
        [Description("Mã trung tâm công việc")]
        public string? Arbpl { get; set; }
        [Description("Ngày bắt đầu cập nhật")]
        public DateTime? StartUpdate { get; set; }
        [Description("Mô tả ngắn")]
        public string? Txt30 { get; set; }
        [Description("Trạng thái")]
        public string State { get => this.IsActive == true ? "Đang hoạt động" : "Khóa"; }
        public void Mapping(Profile profile)
        {
            profile.CreateMap<TblMdFloc, FlocDto>().ReverseMap();
        }
    }
}
