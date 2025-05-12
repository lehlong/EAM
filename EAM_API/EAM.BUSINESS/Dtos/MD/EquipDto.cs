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
    public class EquipDto : BaseMdDto, IMapFrom, IDto
    {
        [JsonIgnore]
        [Description("STT")]
        public int OrdinalNumber { get; set; }
        [Key]
        [Description("Mã thiết bị")]
        public string Equnr { get; set; } = null!;

        [Description("Tên thiết bị")]
        public string? Eqktx { get; set; }
        [Description("Mã nhà máy")]
        public string? Iwerk { get; set; }

    //    [Description("Ngày bắt đầu hiệu lực")]
        public DateTime? Datab { get; set; }

    //    [Description("Ngày kết thúc hiệu lực")]
        public DateTime? Datbi { get; set; }

        [Description("Khu vực chức năng")]
        public string? Tplnr { get; set; }

        [Description("Bộ phận quản lý")]
        public string? Ingrp { get; set; }

        [Description("Loại thiết bị")]
        public string? Eqtyp { get; set; }

        [Description("Nhóm thiết bị")]
        public string? Eqart { get; set; }

    //    [Description("Loại đối tượng phụ")]
        public string? EqartSub { get; set; }

    //    [Description("Loại đối tượng thường")]
        public string? EqartTp { get; set; }

        [Description("Thiết bị cấp trên")]
        public string? Hequi { get; set; }

        [Description("Cờ thiết bị cha")]
        public string? ParentFlg { get; set; }

        [Description("Số lượng thiết bị con")]
        public int? ChildCnt { get; set; }

        [Description("Tổ đội bảo trì")]
        public string? Arbpl { get; set; }

        [Description("Mã trung tâm chi phí")]
        public string? Kostl { get; set; }

        [Description("Mã phân đoạn")]
        public string? Beber { get; set; }

        [Description("Trạng thái hoạt động")]
        public string? StatAct { get; set; }

        [Description("Mô tả trạng thái hoạt động")]
        public string? StatActT { get; set; }

        [Description("Trạng thái kỹ thuật")]
        public string? StatusTh { get; set; }

        [Description("Mã tài sản cố định")]
        public string? Anlnr { get; set; }

    //    [Description("Mã tài sản phụ")]
        public string? Anlun { get; set; }

      //  [Description("Loại lớp")]
        public string? Klart { get; set; }

     //   [Description("Lớp")]
        public string? Class { get; set; }

      //  [Description("Cờ đăng xuất")]
        public string? AuspFlg { get; set; }

     //   [Description("Cờ đã xóa")]
        public string? DelFlg { get; set; }

     //   [Description("Ngày xóa")]
        public DateTime? DelDate { get; set; }

      //  [Description("Cờ không hoạt động")]
        public string? InactFlg { get; set; }

     //   [Description("Ngày không hoạt động")]
        public DateTime? InactDate { get; set; }

    //    [Description("Ngày vận hành")]
        public DateTime? Inbdt { get; set; }

        [Description("Trạng thái")]
        public string State { get => this.IsActive == true ? "Đang hoạt động" : "Khóa"; }
        public void Mapping(Profile profile)
        {
            profile.CreateMap<TblMdEquip, EquipDto>().ReverseMap();
        }
    }
}
