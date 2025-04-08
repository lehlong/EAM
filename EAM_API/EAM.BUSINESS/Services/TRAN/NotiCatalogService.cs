using AutoMapper;
using Common;
using EAM.BUSINESS.Common;
using EAM.BUSINESS.Dtos.TRAN;
using EAM.CORE;
using EAM.CORE.Entities.TRAN;

namespace EAM.BUSINESS.Services.TRAN
{
    public interface INotiCatalogService : IGenericService<TblTranNotiCatalog, NotiCatalogDto>
    {
    }
    
    public class NotiCatalogService(AppDbContext dbContext, IMapper mapper) : GenericService<TblTranNotiCatalog, NotiCatalogDto>(dbContext, mapper), INotiCatalogService
    {
        public override async Task<PagedResponseDto> Search(BaseFilter filter)
        {
            try
            {
                var query = _dbContext.TblTranNotiCatalog.AsQueryable();
                if (!string.IsNullOrWhiteSpace(filter.KeyWord))
                {
                    query = query.Where(x => x.Qmnum.Contains(filter.KeyWord) ||
                                       x.Objpart.Contains(filter.KeyWord) ||
                                       x.TypeCode.Contains(filter.KeyWord) ||
                                       x.TypeTxt.Contains(filter.KeyWord) ||
                                       x.CauseCode.Contains(filter.KeyWord) ||
                                       x.CauseTxt.Contains(filter.KeyWord) ||
                                       x.TaskCode.Contains(filter.KeyWord) ||
                                       x.TaskTxt.Contains(filter.KeyWord) ||
                                       x.ActCode.Contains(filter.KeyWord) ||
                                       x.ActTxt.Contains(filter.KeyWord));
                }
                if (filter.IsActive.HasValue)
                {
                    query = query.Where(x => x.IsActive == filter.IsActive);
                }
                return await Paging(query, filter);
            }
            catch (Exception ex)
            {
                Status = false;
                Exception = ex;
                return null;
            }
        }
    }
} 