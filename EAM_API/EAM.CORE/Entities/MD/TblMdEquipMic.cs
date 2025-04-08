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
        [MaxLength(18)]
        public string? Equnr { get; set; }

        [Column("CLASS")]
        [MaxLength(18)]
        public string? Class { get; set; }

        [Column("MIC")]
        [MaxLength(30)]
        public string? Mic { get; set; }

        [Column("MICNAME")]
        [MaxLength(30)]
        public string? MicName { get; set; }

        [Column("STVALUE")]
        public decimal? StValue { get; set; }

        [Column("LOVALUE")]
        public decimal? LoValue { get; set; }

        [Column("HIVALUE")]
        public decimal? HiValue { get; set; }

        [Column("VALUEDT")]
        [MaxLength(100)]
        public string? ValueDt { get; set; }

        [Column("ADATU")]
        public DateTime? Adatu { get; set; }

        [Column("VNAME")]
        [MaxLength(12)]
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
