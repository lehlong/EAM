using AutoMapper;
using Common;
using EAM.BUSINESS.Common;
using EAM.BUSINESS.Dtos.MD;
using EAM.CORE;
using EAM.CORE.Entities.MD;

namespace EAM.BUSINESS.Services.MD
{
    public interface ICatalogService : IGenericService<TblMdCatalog, CatalogDto>
    {
    }
    
    public class CatalogService(AppDbContext dbContext, IMapper mapper) : GenericService<TblMdCatalog, CatalogDto>(dbContext, mapper), ICatalogService
    {
        public override async Task<PagedResponseDto> Search(BaseFilter filter)
        {
            try
            {
                var query = _dbContext.TblMdCatalog.AsQueryable();
                if (!string.IsNullOrWhiteSpace(filter.KeyWord))
                {
                    query = query.Where(x => x.CatCode.Contains(filter.KeyWord) || 
                                         x.CatName.Contains(filter.KeyWord) ||
                                         x.Code.Contains(filter.KeyWord) ||
                                         x.CodeDes.Contains(filter.KeyWord));
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