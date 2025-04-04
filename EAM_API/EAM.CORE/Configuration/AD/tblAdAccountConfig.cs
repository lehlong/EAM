using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using EAM.CORE.Entities.AD;

namespace EAM.CORE.Configuration.AD
{
    public class TblAdAccountConfig : IEntityTypeConfiguration<TblAdAccount>
    {
        public void Configure(EntityTypeBuilder<TblAdAccount> builder)
        {
            builder.HasMany(x => x.Account_AccountGroups)
                .WithOne(g => g.Account)
                .HasForeignKey(x => x.UserName)
                .OnDelete(DeleteBehavior.Cascade);

           
        }
    }
}
