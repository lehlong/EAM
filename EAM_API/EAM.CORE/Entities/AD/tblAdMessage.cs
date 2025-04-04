using EAM.CORE.Common;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EAM.CORE.Entities.AD
{
    [Table("EAM_AD_MESSAGE")]
    public class TblAdMessage : SoftDeleteEntity
    {
        [Key]
        [Column("CODE",TypeName = "VARCHAR(10)")]
        public string Code { get; set; }

        [Column("LANG",TypeName = "VARCHAR(10)")]
        public string Lang { get; set; }

        [Column("VALUE",TypeName = "NVARCHAR(255)")]
        public string Value { get; set; }
    }
}
