using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using EAM.CORE.Common;

namespace EAM.CORE.Entities.TRAN
{
    [Table("EAM_TRAN_NOTI")]
    public class TblTranNoti : SoftDeleteEntity
    {
        [Key]
        [Column("QMNUM")]
        public string Qmnum { get; set; } = null!;

        [Column("IWERK")]
        public string Iwerk { get; set; } = null!;

        [Column("QMART")]
        public string? Qmart { get; set; }

        [Column("QMTXT")]
        public string? Qmtxt { get; set; }

        [Column("QMNAM")]
        public string? Qmnam { get; set; }

        [Column("PRIOK")]
        public string? Priok { get; set; }

        [Column("QMDAT")]
        public DateTime? Qmdat { get; set; }

        [Column("MZEIT")]
        public TimeSpan? Mzeit { get; set; }

        [Column("STRMN")]
        public DateTime? Strmn { get; set; }

        [Column("STRUR")]
        public TimeSpan? Strur { get; set; }

        [Column("LTRMN")]
        public DateTime? Ltrmn { get; set; }

        [Column("LTRUR")]
        public TimeSpan? Ltrur { get; set; }

        [Column("AUFNR")]
        public string? Aufnr { get; set; }

        [Column("AUART")]
        public string? Auart { get; set; }

        [Column("ARBPL")]
        public string? Arbpl { get; set; }

        [Column("STAT_ACT")]
        public string? StatAct { get; set; }

        [Column("NOCO_FLG")]
        public string? NocoFlg { get; set; }

        [Column("NOCO_DATE")]
        public DateTime? NocoDate { get; set; }

        [Column("ORAS_FLG")]
        public string? OrasFlg { get; set; }

        [Column("ORAS_DATE")]
        public DateTime? OrasDate { get; set; }

        [Column("DEL_FLG")]
        public string? DelFlg { get; set; }

        [Column("DEL_DATE")]
        public DateTime? DelDate { get; set; }

        [Column("NOPR_FLG")]
        public string? NoprFlg { get; set; }

        [Column("NOPR_DATE")]
        public DateTime? NoprDate { get; set; }

        [Column("LDPB_FLG")]
        public string? LdpbFlg { get; set; }

        [Column("STAFF_PL")]
        public string? StaffPl { get; set; }

        [Column("HT_BTBD")]
        public string? HtBtbd { get; set; }

        [Column("LOAIVT_SD")]
        public string? LoaivtSd { get; set; }

        [Column("STAFF_SC")]
        public string? StaffSc { get; set; }

        [Column("STAFF_KT")]
        public string? StaffKt { get; set; }

        [Column("STAFF_LDPB")]
        public string? StaffLdpb { get; set; }

        [Column("EQUNR")]
        public string? Equnr { get; set; }

        [Column("TPLNR")]
        public string? Tplnr { get; set; }

        [Column("ILOAN")]
        public string? Iloan { get; set; }

        [Column("EQART")]
        public string? Eqart { get; set; }

        [Column("EQART_SUB")]
        public string? EqartSub { get; set; }

        [Column("EQART_TP")]
        public string? EqartTp { get; set; }

        [Column("AUSVN")]
        public DateTime? Ausvn { get; set; }

        [Column("AUSBS")]
        public DateTime? Ausbs { get; set; }

        [Column("AUZTV")]
        public TimeSpan? Auztv { get; set; }

        [Column("AUZTB")]
        public TimeSpan? Auztb { get; set; }

        [Column("MSAUS")]
        public string? Msaus { get; set; }

        [Column("AUSZT")]
        public float? Auszt { get; set; }

        [Column("MAUEH")]
        public string? Maueh { get; set; }

        [Column("INGRP")]
        public string? Ingrp { get; set; }

        [Column("WARPL")]
        public string? Warpl { get; set; }

        [Column("ABNUM")]
        public int? Abnum { get; set; }

        [Column("WAPOS")]
        public string? Wapos { get; set; }

        [Column("ERNAM")]
        public string? Ernam { get; set; }

        [Column("ERDAT")]
        public DateTime? Erdat { get; set; }

        [Column("AENAM")]
        public string? Aenam { get; set; }

        [Column("AEDAT")]
        public DateTime? Aedat { get; set; }
    }
}
