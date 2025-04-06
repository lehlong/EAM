using EAM.CORE.Common;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EAM.CORE.Entities.MD
{
    [Table("EAM_MD_ACCOUNT_TYPE")]
    public class TblMdAccountType : SoftDeleteEntity
    {
        [Key]
        [Column("CODE")]
        public string Code { get; set; }
        [Column("NAME", TypeName = "NVARCHAR(255)")]
        public string Name { get; set; }
    }
}
