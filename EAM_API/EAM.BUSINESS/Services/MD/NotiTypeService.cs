using AutoMapper;
using Common;
using EAM.BUSINESS.Common;
using EAM.BUSINESS.Dtos.MD;
using EAM.CORE;
using EAM.CORE.Entities.MD;

namespace EAM.BUSINESS.Services.MD
{
    public interface INotiTypeService : IGenericService<TblMdNotiType, NotiTypeDto>
    {
    }
    public class NotiTypeService(AppDbContext dbContext, IMapper mapper) : GenericService<TblMdNotiType, NotiTypeDto>(dbContext, mapper), INotiTypeService
    {
        public override async Task<PagedResponseDto> Search(BaseFilter filter)
        {
            try
            {
                var query = _dbContext.TblMdNotiType.AsQueryable();
                if (!string.IsNullOrWhiteSpace(filter.KeyWord))
                {
                    query = query.Where(x => x.Code.ToString().Contains(filter.KeyWord) || x.Name.Contains(filter.KeyWord));
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
