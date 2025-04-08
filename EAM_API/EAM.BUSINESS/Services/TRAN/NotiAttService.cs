using AutoMapper;
using Common;
using EAM.BUSINESS.Common;
using EAM.BUSINESS.Dtos.TRAN;
using EAM.CORE;
using EAM.CORE.Entities.TRAN;

namespace EAM.BUSINESS.Services.TRAN
{
    public interface INotiAttService : IGenericService<TblTranNotiAtt, NotiAttDto>
    {
    }
    
    public class NotiAttService(AppDbContext dbContext, IMapper mapper) : GenericService<TblTranNotiAtt, NotiAttDto>(dbContext, mapper), INotiAttService
    {
        public override async Task<PagedResponseDto> Search(BaseFilter filter)
        {
            try
            {
                var query = _dbContext.TblTranNotiAtt.AsQueryable();
                if (!string.IsNullOrWhiteSpace(filter.KeyWord))
                {
                    query = query.Where(x => x.Qmnum.Contains(filter.KeyWord) ||
                                       x.FileType.Contains(filter.KeyWord) ||
                                       x.Path.Contains(filter.KeyWord));
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