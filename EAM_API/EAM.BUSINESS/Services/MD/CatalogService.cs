using AutoMapper;
using Common;
using EAM.BUSINESS.Common;
using EAM.BUSINESS.Dtos.MD;
using EAM.BUSINESS.Filter.MD;
using EAM.CORE;
using EAM.CORE.Entities.MD;

namespace EAM.BUSINESS.Services.MD
{
    public interface ICatalogService : IGenericService<TblMdCatalog, CatalogDto>
    {
        Task<byte[]> Export(BaseMdFilter filter);
        Task<PagedResponseDto> Search(CatalogFilter filter);
    }
    
    public class CatalogService(AppDbContext dbContext, IMapper mapper) : GenericService<TblMdCatalog, CatalogDto>(dbContext, mapper), ICatalogService
    {
        public async Task<PagedResponseDto> Search(CatalogFilter filter)
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

                if (!string.IsNullOrWhiteSpace(filter.CatType))
                {
                    query = query.Where(x => x.CatType == filter.CatType);
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
        public async Task<byte[]> Export(BaseMdFilter filter)
        {
            try
            {
                var query = _dbContext.TblMdCatalog.AsQueryable();
                if (!string.IsNullOrWhiteSpace(filter.KeyWord))
                {
                    query = query.Where(x => x.CatName.Contains(filter.KeyWord));
                }
                if (filter.IsActive.HasValue)
                {
                    query = query.Where(x => x.IsActive == filter.IsActive);
                }
                var data = await base.GetAllMd(query, filter);
                int i = 1;
                data.ForEach(x =>
                {
                    x.OrdinalNumber = i++;
                });
                return await ExportExtension.ExportToExcel(data);
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