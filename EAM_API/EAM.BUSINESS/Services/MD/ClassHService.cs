using AutoMapper;
using Common;
using EAM.BUSINESS.Common;
using EAM.BUSINESS.Dtos.MD;
using EAM.CORE;
using EAM.CORE.Entities.MD;

namespace EAM.BUSINESS.Services.MD
{
    public interface IClassHService : IGenericService<TblMdClassH, ClassHDto>
    {
    }
    
    public class ClassHService(AppDbContext dbContext, IMapper mapper) : GenericService<TblMdClassH, ClassHDto>(dbContext, mapper), IClassHService
    {
        public override async Task<PagedResponseDto> Search(BaseFilter filter)
        {
            try
            {
                var query = _dbContext.TblMdClassH.AsQueryable();
                if (!string.IsNullOrWhiteSpace(filter.KeyWord))
                {
                    query = query.Where(x => x.Class.Contains(filter.KeyWord) || 
                                          x.Klart.Contains(filter.KeyWord) ||
                                          x.Klagr.Contains(filter.KeyWord));
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