using AutoMapper;
using Common;
using EAM.CORE.Entities.TRAN;
using System;
using System.ComponentModel.DataAnnotations;

namespace EAM.BUSINESS.Dtos.TRAN
{
    public class NotiDto : BaseMdDto, IMapFrom, IDto
    {
        [Key]
        public string Qmnum { get; set; } = null!;
        public string? Iwerk { get; set; }
        public string? Qmart { get; set; }
        public string? Qmtxt { get; set; }
        public string? Qmnam { get; set; }
        public string? Priok { get; set; }
        public DateTime? Qmdat { get; set; }
        public TimeSpan? Mzeit { get; set; }
        public DateTime? Strmn { get; set; }
        public TimeSpan? Strur { get; set; }
        public DateTime? Ltrmn { get; set; }
        public TimeSpan? Ltrur { get; set; }
        public string? Aufnr { get; set; }
        public string? Auart { get; set; }
        public string? Arbpl { get; set; }
        public string? StatAct { get; set; }
        public string? NocoFlg { get; set; }
        public DateTime? NocoDate { get; set; }
        public string? OrasFlg { get; set; }
        public DateTime? OrasDate { get; set; }
        public string? DelFlg { get; set; }
        public DateTime? DelDate { get; set; }
        public string? NoprFlg { get; set; }
        public DateTime? NoprDate { get; set; }
        public string? LdpbFlg { get; set; }
        public string? StaffPl { get; set; }
        public string? HtBtbd { get; set; }
        public string? LoaivtSd { get; set; }
        public string? StaffSc { get; set; }
        public string? StaffKt { get; set; }
        public string? StaffLdpb { get; set; }
        public string? Equnr { get; set; }
        public string? Tplnr { get; set; }
        public string? Iloan { get; set; }
        public string? Eqart { get; set; }
        public string? EqartSub { get; set; }
        public string? EqartTp { get; set; }
        public DateTime? Ausvn { get; set; }
        public DateTime? Ausbs { get; set; }
        public TimeSpan? Auztv { get; set; }
        public TimeSpan? Auztb { get; set; }
        public string? Msaus { get; set; }
        public float? Auszt { get; set; }
        public string? Maueh { get; set; }
        public string? Ingrp { get; set; }
        public string? Warpl { get; set; }
        public int? Abnum { get; set; }
        public string? Wapos { get; set; }
        public string? Ernam { get; set; }
        public DateTime? Erdat { get; set; }
        public string? Aenam { get; set; }
        public DateTime? Aedat { get; set; }
        public string State { get => this.IsActive == true ? "Đang hoạt động" : "Khóa"; }
        
        public void Mapping(Profile profile)
        {
            profile.CreateMap<TblTranNoti, NotiDto>().ReverseMap();
        }
    }
} 