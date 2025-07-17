using EAM.CORE.Common;
using EAM.CORE.Entities.MD;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EAM.CORE.Entities.AD
{
    [Table("EAM_AD_ACCOUNT")]
    public class TblAdAccount : SoftDeleteEntity
    {
        [Key]
        [Column("USER_NAME")]
        public string UserName { get; set; } = null!;

        [Column("FULL_NAME")]
        public string? FullName { get; set; }

        [Column("PASSWORD")]
        public string? Password { get; set; }

        [Column("PHONE_NUMBER")]
        public string? PhoneNumber { get; set; }

        [Column("EMAIL")]
        public string? Email { get; set; }

        [Column("ADDRESS")]
        public string? Address { get; set; }

        [Column("ACCOUNT_TYPE")]
        public string? AccountType { get; set; }

        [Column("ORG_CODE")]
        public string? OrganizeCode { get; set; }

        [Column("URL_IMAGE")]
        public string? UrlImage { get; set; }

        [Column("TPLNR")]
        public string? Tplnr { get; set; }

        public virtual ICollection<TblAdAccount_AccountGroup>? Account_AccountGroups { get; set; }

        public virtual ICollection<TblAdAccountRight>? AccountRights { get; set; }

        public virtual ICollection<TblAdAccountRefreshToken>? RefreshTokens { get; set; }
    }
}
