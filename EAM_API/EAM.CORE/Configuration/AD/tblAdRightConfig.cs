﻿using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using EAM.CORE.Entities.AD;

namespace EAM.CORE.Configuration.AD
{
    public class TblAdRightConfig : IEntityTypeConfiguration<TblAdRight>
    {
        public void Configure(EntityTypeBuilder<TblAdRight> builder)
        {
            builder.HasMany(x=>x.AccountGroupRights).WithOne(x=>x.Right).HasForeignKey(x=>x.RightId).OnDelete(DeleteBehavior.Cascade);
            builder.HasMany(x => x.AccountRights).WithOne(x => x.Right).HasForeignKey(x => x.RightId).OnDelete(DeleteBehavior.Cascade);
        }
    }
}
