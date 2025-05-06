using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using EAM.CORE.Common;

namespace EAM.CORE.Entities.MD
{
    [Table("EAM_MD_EQ_CAT")]
    public class TblMdEqCat : SoftDeleteEntity
    {
        [Key]
        [Column("EQTYP")]
        public string Eqtyp { get; set; } = null!;

        [Column("EQTYP_TXT")]
        public string? EqtypTxt { get; set; }
    }
}
