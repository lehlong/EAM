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
        public string Equnr { get; set; }

        [Column("EQKTX")]
        public string? Eqktx { get; set; }

        [Column("IWERK")]
        public string? Iwerk { get; set; }

        [Column("DATAB")]
        public DateTime? Datab { get; set; }

        [Column("DATBI")]
        public DateTime? Datbi { get; set; }

        [Column("TPLNR")]
        public string? Tplnr { get; set; }

        [Column("INGRP")]
        public string? Ingrp { get; set; }

        [Column("EQTYP")]
        public string? Eqtyp { get; set; }

        [Column("EQART")]
        public string? Eqart { get; set; }

        [Column("EQART_SUB")]
        public string? EqartSub { get; set; }

        [Column("EQART_TP")]
        public string? EqartTp { get; set; }

        [Column("HEQUI")]
        public string? Hequi { get; set; }

        [Column("PARENT_FLG")]
        public string? ParentFlg { get; set; }

        [Column("CHILD_CNT")]
        public int? ChildCnt { get; set; }

        [Column("ARBPL")]
        public string? Arbpl { get; set; }

        [Column("KOSTL")]
        public string? Kostl { get; set; }

        [Column("BEBER")]
        public string? Beber { get; set; }

        [Column("STAT_ACT")]
        public string? StatAct { get; set; }

        [Column("STAT_ACT_T")]
        public string? StatActT { get; set; }

        [Column("STATUS_TH")]
        public string? StatusTh { get; set; }

        [Column("ANLNR")]
        public string? Anlnr { get; set; }

        [Column("ANLUN")]
        public string? Anlun { get; set; }

        [Column("KLART")]
        public string? Klart { get; set; }

        [Column("CLASS")]
        public string? Class { get; set; }

        [Column("AUSP_FLG")]
        public string? AuspFlg { get; set; }

        [Column("DEL_FLG")]
        public string? DelFlg { get; set; }

        [Column("DEL_DATE")]
        public DateTime? DelDate { get; set; }

        [Column("INACT_FLG")]
        public string? InactFlg { get; set; }

        [Column("INACT_DATE")]
        public DateTime? InactDate { get; set; }

        [Column("INBDT")]
        public DateTime? Inbdt { get; set; }

        // IS_ACTIVE, CREATE_BY, UPDATE_BY, etc. are inherited from SoftDeleteEntity
    }
}
