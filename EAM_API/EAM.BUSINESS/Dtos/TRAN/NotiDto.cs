using AutoMapper;
using Common;
using EAM.CORE.Entities.TRAN;
using System;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace EAM.BUSINESS.Dtos.TRAN
{
    public class NotiDto : BaseMdDto, IMapFrom, IDto
    {
        [JsonIgnore]
        [Description("STT")]
        public int OrdinalNumber { get; set; }
        [Key]
        [Description("Mã sự cố")]
        public string Qmnum { get; set; } = null!;
        public string? Iwerk { get; set; }
        public string? Qmart { get; set; }
        public string? Qmdetail { get; set; }
        [Description("Nội dung")]
        public string? Qmtxt { get; set; }
        [Description("người tạo sự cố")]
        public string? Qmnam { get; set; }
        [Description("Mức độ nghiêm trọng")]
        public string? Priok { get; set; }
        [Description("Ngày ghi nhận")]
        public DateTime? Qmdat { get; set; }
        public TimeSpan? Mzeit { get; set; }
        public DateTime? Strmn { get; set; }
        public TimeSpan? Strur { get; set; }
        [Description("Ngày hoàn thành")]
        public DateTime? Ltrmn { get; set; }
        public TimeSpan? Ltrur { get; set; }
        public string? Aufnr { get; set; }
        public string? Auart { get; set; }
        [Description("Bộ phận thực hiện")]
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
        public string? Htbtbd { get; set; }
        public string? Lvtsd { get; set; }
        [Description("Người sửa chữa")]
        public string? StaffSc { get; set; }
        public string? StaffKt { get; set; }
        public string? StaffLdpb { get; set; }
        [Description("Thiết bị")]
        public string? Equnr { get; set; }
        [Description("Khu vực phát sinh")]
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

        public DateTime? HtNbb { get; set; }
        public string? HtDvql { get; set; }
        public string? HtDvqlCd { get; set; }
        public string? HtDvsd { get; set; }
        public string? HtDvsdCd { get; set; }
        public string? HtDvth { get; set; }
        public string? HtDvthCd { get; set; }
        public string? HtNdkt { get; set; }
        public string? HtNddx { get; set; }
        public DateTime? NtNbb { get; set; }
        public string? NtDvql { get; set; }
        public string? NtDvqlDes { get; set; }
        public string? NtDvqlCd { get; set; }
        public string? NtDvsd { get; set; }
        public string? NtDvsdDes { get; set; }
        public string? NtDvsdCd { get; set; }
        public string? NtDvth { get; set; }
        public string? NtDvthDes { get; set; }
        public string? NtDvthCd { get; set; }
        public DateTime? DatePd { get; set; }
        public DateTime? DateTc { get; set; }
        public string? UserPd { get; set; }
        public string? UserTc { get; set; }
        public string? ContentPd { get; set; }
        public string? ContentTc { get; set; }

        public void Mapping(Profile profile)
        {
            profile.CreateMap<TblTranNoti, NotiDto>().ReverseMap();
        }
    }
} 