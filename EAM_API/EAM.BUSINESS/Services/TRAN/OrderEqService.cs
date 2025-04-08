using AutoMapper;
using Common;
using EAM.BUSINESS.Common;
using EAM.BUSINESS.Dtos.TRAN;
using EAM.CORE;
using EAM.CORE.Entities.TRAN;

namespace EAM.BUSINESS.Services.TRAN
{
    public interface IOrderEqService : IGenericService<TblTranOrderEq, OrderEqDto>
    {
    }
    
    public class OrderEqService(AppDbContext dbContext, IMapper mapper) : GenericService<TblTranOrderEq, OrderEqDto>(dbContext, mapper), IOrderEqService
    {
        public override async Task<PagedResponseDto> Search(BaseFilter filter)
        {
            try
            {
                var query = _dbContext.TblTranOrderEq.AsQueryable();
                if (!string.IsNullOrWhiteSpace(filter.KeyWord))
                {
                    query = query.Where(x => x.Aufnr.Contains(filter.KeyWord) ||
                                      x.Equnr.Contains(filter.KeyWord) ||
                                      x.Note.Contains(filter.KeyWord) ||
                                      x.StaffPl.Contains(filter.KeyWord) ||
                                      x.StaffQl.Contains(filter.KeyWord) ||
                                      x.StaffTh.Contains(filter.KeyWord) ||
                                      x.StaffSd.Contains(filter.KeyWord));
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