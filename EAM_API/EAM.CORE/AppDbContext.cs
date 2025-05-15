using EAM.CORE.Common;
using EAM.CORE.Entities.AD;
using EAM.CORE.Entities.MD;
using EAM.CORE.Entities.PLAN;
using EAM.CORE.Entities.TRAN;
using EAM.CORE.Entities.WH;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace EAM.CORE
{
    public class AppDbContext(DbContextOptions<AppDbContext> options, IHttpContextAccessor httpContextAccessor) : DbContext(options)
    {
        public IHttpContextAccessor _httpContextAccessor = httpContextAccessor;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.ApplyAllConfigurations();
            foreach (var type in modelBuilder.Model.GetEntityTypes())
            {
                if (typeof(ISoftDeleteEntity).IsAssignableFrom(type.ClrType))
                    modelBuilder.SetSoftDeleteFilter(type.ClrType);
            }

            modelBuilder.HasSequence<int>("ORDER_SEQUENCE")
                    .StartsAt(1)
                    .IncrementsBy(1);

            base.OnModelCreating(modelBuilder);
        }

        public Func<DateTime> TimestampProvider { get; set; } = ()
            => DateTime.Now;

        public override int SaveChanges()
        {
            TrackChanges();
            return base.SaveChanges();
        }

        public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            TrackChanges();
            return await base.SaveChangesAsync(cancellationToken);
        }
        public string GetUserRequest()
        {
            var tokens = _httpContextAccessor?.HttpContext?.Request?.Headers.Authorization.ToString()?.Split(" ")?.ToList();
            string? user = null;
            if (tokens != null)
            {
                var token = tokens.FirstOrDefault(x => x != "Bearer");
                if (!string.IsNullOrWhiteSpace(token) && token != "null")
                {
                    JwtSecurityTokenHandler tokenHandler = new();
                    JwtSecurityToken securityToken = tokenHandler.ReadToken(token) as JwtSecurityToken;
                    var claim = securityToken.Claims;
                    var result = claim.FirstOrDefault(x => x.Type == ClaimTypes.Name);
                    user = result?.Value;
                }
            }
            return user;
        }

        private void TrackChanges()
        {
            var user = GetUserRequest();

            foreach (var entry in ChangeTracker.Entries().Where(e => e.State == EntityState.Added || e.State == EntityState.Modified))
            {
                if (entry.Entity is IBaseEntity auditable)
                {
                    if (entry.State == EntityState.Added)
                    {
                        auditable.CreateBy = user;
                        auditable.CreateDate = TimestampProvider();
                    }
                    else
                    {
                        Entry(auditable).Property(x => x.CreateBy).IsModified = false;
                        Entry(auditable).Property(x => x.CreateDate).IsModified = false;
                        auditable.UpdateBy = user;
                        auditable.UpdateDate = TimestampProvider();
                    }
                }
            }

            foreach (var entry in ChangeTracker.Entries().Where(e => e.State == EntityState.Deleted))
            {
                if (entry.Entity is ISoftDeleteEntity deletedEntity)
                {
                    entry.State = EntityState.Unchanged;
                    deletedEntity.IsDeleted = true;
                    deletedEntity.DeleteBy = user;
                    deletedEntity.DeleteDate = TimestampProvider();
                }
            }
        }

        public async Task<int> GetNextSequenceValue(string sequence)
        {
            using var command = Database.GetDbConnection().CreateCommand();
            command.CommandText = $"SELECT {sequence}.NEXTVAL FROM DUAL";
            await Database.OpenConnectionAsync();
            using var result = await command.ExecuteReaderAsync();
            await result.ReadAsync();
            return result.GetInt32(0);
        }

        #region System Manage
        public DbSet<TblAdConfigTemplate> TblAdConfigTemplate { get; set; }

        public DbSet<TblAdAccount> TblAdAccount { get; set; }
        public DbSet<TblAdAccountGroup> TblAdAccountGroup { get; set; }
        public DbSet<TblAdMenu> TblAdMenu { get; set; }
        public DbSet<TblAdRight> TblAdRight { get; set; }
        public DbSet<TblAdMessage> TblAdMessage { get; set; }
        public DbSet<TblAdAccountGroupRight> TblAdAccountGroupRight { get; set; }
        public DbSet<TblAdAccountRefreshToken> TblAdAccountRefreshToken { get; set; }
        public DbSet<TblAdAppVersion> TblAdAppVersion { get; set; }
        public DbSet<TblAdAccount_AccountGroup> TblAdAccount_AccountGroup { get; set; }
        public DbSet<TblActionLog> TblActionLogs { get; set; }
        public DbSet<TblAdSystemTrace> TblAdSystemTrace { get; set; }
        public DbSet<tblAdOrganize> tblAdOrganize { get; set; }
        #endregion

        #region Master Data
        public DbSet<TblMdPlgrp> TblMdPlgrp { get; set; }
        public DbSet<TblMdUsageStatus> TblMdUsageStatus { get; set; }
        public DbSet<TblMdActiveStatus> TblMdActiveStatus { get; set; }
        public DbSet<TblMdCataType> TblMdCataType { get; set; }
        public DbSet<TblMdAccountType> TblMdAccountType { get; set; }
        public DbSet<TblMdEqGroup> TblMdEqGroup { get; set; }
        public DbSet<TblMdEqCat> TblMdEqCat { get; set; }
        public DbSet<TblMdPlant> TblMdPlant { get; set; }
        public DbSet<TblMdWc> TblMdWc { get; set; }
        public DbSet<TblMdNotiType> TblMdNotiType { get; set; }
        public DbSet<TblMdOrderType> TblMdOrderType { get; set; }
        public DbSet<TblMdFloc> TblMdFloc { get; set; }
        public DbSet<TblMdEquip> TblMdEquip { get; set; }
        public DbSet<TblMdTasklist> TblMdTasklist { get; set; }
        public DbSet<TblMdEquipPic> TblMdEquipPic { get; set; }
        public DbSet<TblMdEquipMic> TblMdEquipMic { get; set; }
        public DbSet<TblMdEquipDoc> TblMdEquipDoc { get; set; }
        public DbSet<TblMdEquipChar> TblMdEquipChar { get; set; }
        public DbSet<TblMdEquipClass> TblMdEquipClass { get; set; }
        public DbSet<TblMdChar> TblMdChar { get; set; }
        public DbSet<TblMdClassH> TblMdClassH { get; set; }
        public DbSet<TblMdClassD> TblMdClassD { get; set; }
        public DbSet<TblMdCatalog> TblMdCatalog { get; set; }
        public DbSet<TblMdAsset> TblMdAsset { get; set; }
        #endregion

        #region Transaction Data
        public DbSet<TblTranNoti> TblTranNoti { get; set; }
        public DbSet<TblTranNotiAtt> TblTranNotiAtt { get; set; }
        public DbSet<TblTranNotiReport> TblTranNotiReport { get; set; }
        public DbSet<TblTranNotiCatalog> TblTranNotiCatalog { get; set; }
        public DbSet<TblTranOrder> TblTranOrder { get; set; }
        public DbSet<TblTranOrderAtt> TblTranOrderAtt { get; set; }
        public DbSet<TblTranOrderEq> TblTranOrderEq { get; set; }
        public DbSet<TblTranOrderOperation> TblTranOrderOperation { get; set; }
        public DbSet<TblTranOrderVt> TblTranOrderVt { get; set; }
        #endregion

        #region Warehouse
        public DbSet<TblMdWH> TblMdWH { get; set; }
        #endregion

        #region Planning Data
        public DbSet<TblPlanH> TblPlanH { get; set; }
        public DbSet<TblPlanD> TblPlanD { get; set; }
        #endregion

    }
}
