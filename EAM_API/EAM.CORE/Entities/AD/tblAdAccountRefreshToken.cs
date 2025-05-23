﻿using EAM.CORE.Common;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EAM.CORE.Entities.AD
{
    [Table("EAM_AD_REFRESH_TOKEN")]
    public class TblAdAccountRefreshToken : BaseEntity
    {
        [Key]
        [Column("ID")]
        public Guid Id { get; set; }

        [Column("USER_NAME")]
        public string UserName { get; set; }

        [Column("REFRESH_TOKEN")]
        public string RefreshToken { get; set; }

        [Column("EXPIRE_TIME")]
        public DateTime ExpireTime { get; set; }

        public virtual TblAdAccount Account { get; set; }
    }
}
