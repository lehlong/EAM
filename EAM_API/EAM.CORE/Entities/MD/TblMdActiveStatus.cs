using EAM.CORE.Common;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EAM.CORE.Entities.MD
{
    [Table("EAM_MD_ACTIVE_STATUS")]
    public class TblMdActiveStatus : SoftDeleteEntity
    {
        [Key]
        [Column("CODE")]
        public string Code { get; set; } = null!;

        [Column("NAME")]
        public string? Name { get; set; }
    }
}
