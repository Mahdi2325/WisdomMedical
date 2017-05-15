using KMHC.SLTC.Persistence;
using KMHC.SLTC.Persistence.Audit;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace KMHC.SLTC.Repository
{
    public partial class SLTCContext : SltcDbContext
    {
        public override int SaveChanges()
        {
            UpdateAuditableProperties();
            return base.SaveChanges();
        }

        public override async Task<int> SaveChangesAsync()
        {
            UpdateAuditableProperties();
            return await base.SaveChangesAsync();
        }

        public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken)
        {
            UpdateAuditableProperties();
            return await base.SaveChangesAsync(cancellationToken);
        }

        protected virtual void UpdateAuditableProperties()
        {
            var now = DateTime.Now;
            int userId = -1;
            //if (System.Web.HttpContext.Current != null && System.Web.HttpContext.Current.Session != null && System.Web.HttpContext.Current.Session["CurrentAccountID"] != null)
            if (System.Web.HttpContext.Current != null && System.Web.HttpContext.Current.User != null && System.Web.HttpContext.Current.User.Identity != null)
            {
                int.TryParse(System.Web.HttpContext.Current.User.Identity.Name, out userId);
                //userId = Convert.ToInt32(System.Web.HttpContext.Current.Session["CurrentAccountID"]);
                //KMIH.Persistence.Security.IHCustomPrincipal iuser = System.Web.HttpContext.Current.User as KMIH.Persistence.Security.IHCustomPrincipal;
                //if (iuser != null) userId = iuser.UserId;
            }
            //bool b = long.TryParse(Thread.CurrentPrincipal.Identity.Name, out userId);
            var changedAuditableEntities = from entry in ChangeTracker.Entries<IAuditableEntity>()
                                           let state = entry.State
                                           where
                                               state.HasFlag(EntityState.Added) ||
                                               state.HasFlag(EntityState.Modified) ||
                                               state.HasFlag(EntityState.Deleted)
                                           select entry;

            foreach (var entry in changedAuditableEntities)
            {
                IAuditableEntity entity = entry.Entity as IAuditableEntity;
                if (entity != null)
                {

                    switch (entry.State)
                    {
                        case EntityState.Added:
                            entity.CreatedTime = now;
                            entity.CreatedBy = userId;
                            entity.ModifiedTime = now;
                            entity.ModifiedBy = userId;
                            entity.IsDeleted = false;
                            break;
                        case EntityState.Modified:
                            entity.ModifiedTime = now;
                            entity.ModifiedBy = userId;
                            //entity.IsDeleted = false;
                            break;
                        case EntityState.Deleted:
                            entry.State = EntityState.Modified;
                            entity.ModifiedTime = now;
                            entity.ModifiedBy = userId;
                            entity.IsDeleted = true;
                            break;
                    }
                }
            }
        }
    }

    public class BaseSqlServerMigrationSqlGenerator : System.Data.Entity.SqlServer.SqlServerMigrationSqlGenerator
    {
    }
    public class BaseConfiguration : MySql.Data.Entity.MySqlEFConfiguration
    {
    }
}
