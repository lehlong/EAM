using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using EAM.CORE.Common;

namespace EAM.CORE.Entities.MD
{
    [Table("EAM_MD_EQUIP")]
    public class TblMdEquip : SoftDeleteEntity
    {
        [Key]
        [Column("EQUNR")]
        [MaxLength(18)]
        public string EqUnr { get; set; } = null!; // Not nullable

        [Column("IWERK")]
        [MaxLength(4)]
        public string Iwerk { get; set; } = null!; // Not nullable

        [Column("DATAB")]
        public DateTime? Datab { get; set; }

        [Column("DATBI")]
        public DateTime? Datbi { get; set; }

        [Column("TPLNR")]
        [MaxLength(30)]
        public string? Tplnr { get; set; }

        [Column("INGRP")]
        [MaxLength(3)]
        public string? Ingrp { get; set; }

        [Column("EQTYP")]
        [MaxLength(1)]
        public string? Eqtyp { get; set; }

        [Column("EQART")]
        [MaxLength(10)]
        public string? Eqart { get; set; }

        [Column("EQART_SUB")]
        [MaxLength(10)]
        public string? EqartSub { get; set; }

        [Column("EQART_TP")]
        [MaxLength(10)]
        public string? EqartTp { get; set; }

        [Column("HEQUI")]
        [MaxLength(18)]
        public string? Hequi { get; set; }

        [Column("PARENT_FLG")]
        [MaxLength(1)]
        public string? ParentFlg { get; set; }

        [Column("CHILD_CNT")]
        public int? ChildCnt { get; set; }

        [Column("ARBPL")]
        [MaxLength(8)]
        public string? Arbpl { get; set; }

        [Column("KOSTL")]
        [MaxLength(10)]
        public string? Kostl { get; set; }

        [Column("BEBER")]
        [MaxLength(3)]
        public string? Beber { get; set; }

        [Column("STAT_ACT")]
        [MaxLength(5)]
        public string? StatAct { get; set; }

        [Column("STAT_ACT_T")]
        [MaxLength(4)]
        public string? StatActT { get; set; }

        [Column("STATUS_TH")]
        [MaxLength(4)]
        public string? StatusTh { get; set; }

        [Column("ANLNR")]
        [MaxLength(12)]
        public string? Anlnr { get; set; }

        [Column("ANLUN")]
        [MaxLength(4)]
        public string? Anlun { get; set; }

        [Column("KLART")]
        [MaxLength(3)]
        public string? Klart { get; set; }

        [Column("CLASS")]
        [MaxLength(18)]
        public string? Class { get; set; }

        [Column("AUSP_FLG")]
        [MaxLength(1)]
        public string? AuspFlg { get; set; }

        [Column("DEL_FLG")]
        [MaxLength(1)]
        public string? DelFlg { get; set; }

        [Column("DEL_DATE")]
        public DateTime? DelDate { get; set; }

        [Column("INACT_FLG")]
        [MaxLength(1)]
        public string? InactFlg { get; set; }

        [Column("INACT_DATE")]
        public DateTime? InactDate { get; set; }

        [Column("INBDT")]
        public DateTime? Inbdt { get; set; }

        // IS_ACTIVE, CREATE_BY, UPDATE_BY, etc. are inherited from SoftDeleteEntity
    }
}
