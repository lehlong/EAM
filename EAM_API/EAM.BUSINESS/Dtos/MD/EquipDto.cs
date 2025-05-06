using AutoMapper;
using Common;
using EAM.CORE.Entities.MD;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EAM.BUSINESS.Dtos.MD
{
    public class EquipDto : BaseMdDto, IMapFrom, IDto
    {
        [Key]
        public string Equnr { get; set; } = null!;

        public string? Eqktx { get; set; }
        public string? Iwerk { get; set; }

        public DateTime? Datab { get; set; }

        public DateTime? Datbi { get; set; }

        public string? Tplnr { get; set; }

        public string? Ingrp { get; set; }

        public string? Eqtyp { get; set; }

        public string? Eqart { get; set; }

        public string? EqartSub { get; set; }

        public string? EqartTp { get; set; }

        public string? Hequi { get; set; }

        public string? ParentFlg { get; set; }

        public int? ChildCnt { get; set; }

        public string? Arbpl { get; set; }

        public string? Kostl { get; set; }

        public string? Beber { get; set; }

        public string? StatAct { get; set; }

        public string? StatActT { get; set; }

        public string? StatusTh { get; set; }

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

        public string State { get => this.IsActive == true ? "Đang hoạt động" : "Khóa"; }
        public void Mapping(Profile profile)
        {
            profile.CreateMap<TblMdEquip, EquipDto>().ReverseMap();
        }
    }
}
