using AutoMapper;
using Common;
using EAM.BUSINESS.Common;
using EAM.BUSINESS.Dtos.TRAN;
using EAM.CORE;
using EAM.CORE.Entities.TRAN;

namespace EAM.BUSINESS.Services.TRAN
{
    public interface IOrderService : IGenericService<TblTranOrder, OrderDto>
    {
    }
    
    public class OrderService(AppDbContext dbContext, IMapper mapper) : GenericService<TblTranOrder, OrderDto>(dbContext, mapper), IOrderService
    {
        public override async Task<PagedResponseDto> Search(BaseFilter filter)
        {
            try
            {
                var query = _dbContext.TblTranOrder.AsQueryable();
                if (!string.IsNullOrWhiteSpace(filter.KeyWord))
                {
                    query = query.Where(x => x.Aufnr.Contains(filter.KeyWord) ||
                                      x.Ktext.Contains(filter.KeyWord) ||
                                      x.Iwerk.Contains(filter.KeyWord) ||
                                      x.Auart.Contains(filter.KeyWord) ||
                                      x.Qmnum.Contains(filter.KeyWord) ||
                                      x.Equnr.Contains(filter.KeyWord) ||
                                      x.Tplnr.Contains(filter.KeyWord));
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