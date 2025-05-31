using EAM.CORE.Common;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EAM.CORE.Entities.TRAN
{
    [Table("EAM_TRAN_EQ_COUNTER")]
    public class TblTranEqCounter : SoftDeleteEntity
    {
        [Key]
        [Column("MDOCM")]
        public string Mdocm { get; set; }
        [Column("POINT")]
        public string? Point { get; set; }
        [Column("EQUNR")]
        public string? Equnr { get; set; }
        [Column("IDATE")]
        public DateTime? IDate { get; set; }
        [Column("READING")]
        public decimal? Reading { get; set; }
        [Column("DVT")]
        public string? Dvt { get; set; }
        [Column("DIFVALUE")]
        public decimal? DifValue { get; set; }
        [Column("READ_TEXT")]
        public string? ReadText { get; set; }

    }
}
