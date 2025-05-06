using EAM.CORE.Common;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EAM.CORE.Entities.AD
{
    [Table("EAM_AD_ACCOUNTGROUP")]
    public class TblAdAccountGroup : SoftDeleteEntity
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Column("ID")]
        public Guid Id { get; set; }

        [Column("NAME")]
        public string? Name { get; set; }

        [Column("NOTES")]
        public string? Notes { get; set; }

        [Column("ROLE_CODE")]
        public string? RoleCode { get; set; }

        public virtual List<TblAdAccount_AccountGroup>? Account_AccountGroups { get; set; }

        public virtual List<TblAdAccountGroupRight>? ListAccountGroupRight { get; set; }
    }
}
