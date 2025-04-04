using EAM.CORE.Common;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EAM.CORE.Entities.AD
{
    [Table("EAM_AD_RIGHT")]
    public class TblAdRight : SoftDeleteEntity
    {
        [Key]
        [Column(TypeName = "VARCHAR(50)")]
        public string Id { get; set; }

        [Column(TypeName = "NVARCHAR(50)")]
        public string Name { get; set; }

        [Column(TypeName = "VARCHAR(50)")]
        public string? PId { get; set; }

        [Column("ORDER_NUMBER")]
        public int? OrderNumber { get; set; }

        public virtual List<TblAdAccountGroupRight> AccountGroupRights { get; set; }

        public virtual List<TblAdAccountRight> AccountRights { get; set; }
    }
}
