using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using EAM.CORE.Common;

namespace EAM.CORE.Entities.TRAN
{
    [Table("EAM_TRAN_ORDER_EQ")]
    public class TblTranOrderEq : SoftDeleteEntity
    {
        [Column("AUFNR")]
        [MaxLength(12)]
        public string? Aufnr { get; set; }

        [Key]
        [Column("EQUNR")]
        [MaxLength(18)]
        public string? Equnr { get; set; }

        [Column("ANLNR")]
        [MaxLength(12)]
        public string? Anlnr { get; set; }

        [Column("ANLUN")]
        [MaxLength(4)]
        public string? Anlun { get; set; }

        [Column("DATAB")]
        public DateTime? Datab { get; set; }

        [Column("TIME_F")]
        public TimeSpan? TimeF { get; set; }

        [Column("DATBI")]
        public DateTime? Datbi { get; set; }

        [Column("TIME_T")]
        public TimeSpan? TimeT { get; set; }

        [Column("STATUS")]
        [MaxLength(5)]
        public string? Status { get; set; }

        [Column("STATUS_TB")]
        [MaxLength(5)]
        public string? StatusTb { get; set; }

        [Column("STATUS_TH")]
        [MaxLength(4)]
        public string? StatusTh { get; set; }

        [Column("NOTE")]
        [MaxLength(255)]
        public string? Note { get; set; }

        [Column("STAFF_PL")]
        [MaxLength(10)]
        public string? StaffPl { get; set; }

        [Column("STAFF_QL")]
        [MaxLength(10)]
        public string? StaffQl { get; set; }

        [Column("STAFF_TH")]
        [MaxLength(10)]
        public string? StaffTh { get; set; }

        [Column("STAFF_SD")]
        [MaxLength(10)]
        public string? StaffSd { get; set; }

    }
}
