using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using EAM.CORE.Common;

namespace EAM.CORE.Entities.MD
{
    [Table("EAM_MD_EQUIP_MIC")]
    public class TblMdEquipMic : SoftDeleteEntity
    {
        [Key]
        [Column("EQUNR")]
        public string Equnr { get; set; } = null!;

        [Column("CLASS")]
        public string? Class { get; set; }

        [Column("MIC")]
        public string? Mic { get; set; }

        [Column("MICNAME")]
        public string? MicName { get; set; }

        [Column("STVALUE")]
        public decimal? StValue { get; set; }

        [Column("LOVALUE")]
        public decimal? LoValue { get; set; }

        [Column("HIVALUE")]
        public decimal? HiValue { get; set; }

        [Column("VALUEDT")]
        public string? ValueDt { get; set; }

        [Column("ADATU")]
        public DateTime? Adatu { get; set; }

        [Column("VNAME")]
        public string? Vname { get; set; }

        [Column("VDATU")]
        public DateTime? Vdatu { get; set; }

        [Column("VONDT")]
        public DateTime? Vondt { get; set; }

        [Column("BISDT")]
        public DateTime? Bisdt { get; set; }

        // IS_ACTIVE, CREATE_BY, UPDATE_BY, CREATE_DATE, UPDATE_DATE,
        // IS_DELETED, DELETE_DATE, DELETE_BY được kế thừa từ SoftDeleteEntity
    }
}
