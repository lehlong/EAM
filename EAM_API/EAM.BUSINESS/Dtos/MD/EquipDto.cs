using AutoMapper;
using Common;
using EAM.CORE.Entities.MD;
using System;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
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

        public DateTime? Datab { get; set; }
        public DateTime? Datbi { get; set; }

        [Description("Tên nhà máy")]
        public string? IwerkText { get; set; }

        [Description("Tên khu vực chức năng")]
        public string? TplnrText { get; set; }

        [Description("Tên loại thiết bị")]
        public string? EqtypText { get; set; }

        [Description("Tên nhóm thiết bị")]
        public string? EqartText { get; set; }

        [Description("Khu vực chức năng")]
        public string? Tplnr { get; set; }

        [Description("Bộ phận quản lý")]
        public string? Ingrp { get; set; }

        public string? Eqtyp { get; set; }
        public string? Eqart { get; set; }
        public string? EqartSub { get; set; }
        public string? EqartTp { get; set; }
        public string? Hequi { get; set; }
        public string? ParentFlg { get; set; }
        public int? ChildCnt { get; set; }

        [Description("Tổ đội bảo trì")]
        public string? Arbpl { get; set; }

        public string? Kostl { get; set; }
        public string? Beber { get; set; }
        public string? StatAct { get; set; }
        public string? StatActT { get; set; }
        public string? StatusTh { get; set; }

        [Description("Mã tài sản cố định")]
        public string? Anlnr { get; set; }

        public string? Anlun { get; set; }
        public string? Klart { get; set; }
        public string? Class { get; set; }
        public string? AuspFlg { get; set; }
        public string? DelFlg { get; set; }
        public DateTime? DelDate { get; set; }
        public string? InactFlg { get; set; }
        public DateTime? InactDate { get; set; }
        public DateTime? Inbdt { get; set; }

        [Description("Trạng thái")]
        public string State { get => this.IsActive == true ? "Đang hoạt động" : "Khóa"; }

        public void Mapping(Profile profile)
        {
            profile.CreateMap<TblMdEquip, EquipDto>().ReverseMap();
        }
    }
}
