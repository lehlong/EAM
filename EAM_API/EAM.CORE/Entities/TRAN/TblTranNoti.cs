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
        [MaxLength(12)]
        public string Qmnum { get; set; } = null!;

        [Column("IWERK")]
        [MaxLength(4)]
        public string Iwerk { get; set; } = null!;

        [Column("QMART")]
        [MaxLength(2)]
        public string? Qmart { get; set; }

        [Column("QMTXT")]
        [MaxLength(40)]
        public string? Qmtxt { get; set; }

        [Column("QMNAM")]
        [MaxLength(12)]
        public string? Qmnam { get; set; }

        [Column("PRIOK")]
        [MaxLength(1)]
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
        [MaxLength(12)]
        public string? Aufnr { get; set; }

        [Column("AUART")]
        [MaxLength(4)]
        public string? Auart { get; set; }

        [Column("ARBPL")]
        [MaxLength(8)]
        public string? Arbpl { get; set; }

        [Column("STAT_ACT")]
        [MaxLength(5)]
        public string? StatAct { get; set; }

        [Column("NOCO_FLG")]
        [MaxLength(1)]
        public string? NocoFlg { get; set; }

        [Column("NOCO_DATE")]
        public DateTime? NocoDate { get; set; }

        [Column("ORAS_FLG")]
        [MaxLength(1)]
        public string? OrasFlg { get; set; }

        [Column("ORAS_DATE")]
        public DateTime? OrasDate { get; set; }

        [Column("DEL_FLG")]
        [MaxLength(1)]
        public string? DelFlg { get; set; }

        [Column("DEL_DATE")]
        public DateTime? DelDate { get; set; }

        [Column("NOPR_FLG")]
        [MaxLength(1)]
        public string? NoprFlg { get; set; }

        [Column("NOPR_DATE")]
        public DateTime? NoprDate { get; set; }

        [Column("LDPB_FLG")]
        [MaxLength(1)]
        public string? LdpbFlg { get; set; }

        [Column("STAFF_PL")]
        [MaxLength(10)]
        public string? StaffPl { get; set; }

        [Column("HT_BTBD")]
        [MaxLength(2)]
        public string? HtBtbd { get; set; }

        [Column("LOAIVT_SD")]
        [MaxLength(2)]
        public string? LoaivtSd { get; set; }

        [Column("STAFF_SC")]
        [MaxLength(10)]
        public string? StaffSc { get; set; }

        [Column("STAFF_KT")]
        [MaxLength(10)]
        public string? StaffKt { get; set; }

        [Column("STAFF_LDPB")]
        [MaxLength(10)]
        public string? StaffLdpb { get; set; }

        [Column("EQUNR")]
        [MaxLength(18)]
        public string? Equnr { get; set; }

        [Column("TPLNR")]
        [MaxLength(30)]
        public string? Tplnr { get; set; }

        [Column("ILOAN")]
        [MaxLength(12)]
        public string? Iloan { get; set; }

        [Column("EQART")]
        [MaxLength(10)]
        public string? Eqart { get; set; }

        [Column("EQART_SUB")]
        [MaxLength(10)]
        public string? EqartSub { get; set; }

        [Column("EQART_TP")]
        [MaxLength(10)]
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
        [MaxLength(1)]
        public string? Msaus { get; set; }

        [Column("AUSZT")]
        public float? Auszt { get; set; }

        [Column("MAUEH")]
        [MaxLength(3)]
        public string? Maueh { get; set; }

        [Column("INGRP")]
        [MaxLength(3)]
        public string? Ingrp { get; set; }

        [Column("WARPL")]
        [MaxLength(12)]
        public string? Warpl { get; set; }

        [Column("ABNUM")]
        public int? Abnum { get; set; }

        [Column("WAPOS")]
        [MaxLength(16)]
        public string? Wapos { get; set; }

        [Column("ERNAM")]
        [MaxLength(12)]
        public string? Ernam { get; set; }

        [Column("ERDAT")]
        public DateTime? Erdat { get; set; }

        [Column("AENAM")]
        [MaxLength(12)]
        public string? Aenam { get; set; }

        [Column("AEDAT")]
        public DateTime? Aedat { get; set; }

    }
}
