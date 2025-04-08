using AutoMapper;
using Common;
using EAM.BUSINESS.Common;
using EAM.BUSINESS.Dtos.MD;
using EAM.CORE;
using EAM.CORE.Entities.MD;

namespace EAM.BUSINESS.Services.MD
{
    public interface ITasklistService : IGenericService<TblMdTasklist, TasklistDto>
    {
    }
    
    public class TasklistService(AppDbContext dbContext, IMapper mapper) : GenericService<TblMdTasklist, TasklistDto>(dbContext, mapper), ITasklistService
    {
        public override async Task<PagedResponseDto> Search(BaseFilter filter)
        {
            try
            {
                var query = _dbContext.TblMdTasklist.AsQueryable();
                if (!string.IsNullOrWhiteSpace(filter.KeyWord))
                {
                    query = query.Where(x => x.Plnnr.Contains(filter.KeyWord) || 
                                            x.Ktext.Contains(filter.KeyWord) ||
                                            x.Iwerks.Contains(filter.KeyWord));
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