using AutoMapper;
using Common;
using EAM.BUSINESS.Common;
using EAM.BUSINESS.Dtos.TRAN;
using EAM.CORE;
using EAM.CORE.Entities.TRAN;

namespace EAM.BUSINESS.Services.TRAN
{
    public interface INotiService : IGenericService<TblTranNoti, NotiDto>
    {
    }
    
    public class NotiService(AppDbContext dbContext, IMapper mapper) : GenericService<TblTranNoti, NotiDto>(dbContext, mapper), INotiService
    {
        public override async Task<PagedResponseDto> Search(BaseFilter filter)
        {
            try
            {
                var query = _dbContext.TblTranNoti.AsQueryable();
                if (!string.IsNullOrWhiteSpace(filter.KeyWord))
                {
                    query = query.Where(x => x.Qmnum.Contains(filter.KeyWord) || 
                                        x.Qmtxt.Contains(filter.KeyWord) ||
                                        x.Iwerk.Contains(filter.KeyWord) ||
                                        x.Aufnr.Contains(filter.KeyWord) ||
                                        x.Equnr.Contains(filter.KeyWord));
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