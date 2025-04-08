using AutoMapper;
using Common;
using EAM.BUSINESS.Common;
using EAM.BUSINESS.Dtos.TRAN;
using EAM.CORE;
using EAM.CORE.Entities.TRAN;

namespace EAM.BUSINESS.Services.TRAN
{
    public interface IOrderOperationService : IGenericService<TblTranOrderOperation, OrderOperationDto>
    {
    }
    
    public class OrderOperationService(AppDbContext dbContext, IMapper mapper) : GenericService<TblTranOrderOperation, OrderOperationDto>(dbContext, mapper), IOrderOperationService
    {
        public override async Task<PagedResponseDto> Search(BaseFilter filter)
        {
            try
            {
                var query = _dbContext.TblTranOrderOperation.AsQueryable();
                if (!string.IsNullOrWhiteSpace(filter.KeyWord))
                {
                    query = query.Where(x => x.Aufnr.Contains(filter.KeyWord) ||
                                      x.Vornr.Contains(filter.KeyWord) ||
                                      x.Ltxa1.Contains(filter.KeyWord) ||
                                      x.Arbpl.Contains(filter.KeyWord) ||
                                      x.Note.Contains(filter.KeyWord) ||
                                      x.Ndxn.Contains(filter.KeyWord) ||
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