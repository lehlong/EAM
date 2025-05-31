using AutoMapper;
using Common;
using EAM.BUSINESS.Common;
using EAM.BUSINESS.Dtos.TRAN;
using EAM.CORE;
using EAM.CORE.Entities.TRAN;
using Microsoft.EntityFrameworkCore;

namespace EAM.BUSINESS.Services.TRAN
{
    public interface ITranEqCounterService : IGenericService<TblTranEqCounter, TranEqCounterDto>
    {
        Task Insert(TranEqCounterDto dto);
    }

    public class TranEqCounterService(AppDbContext dbContext, IMapper mapper) : GenericService<TblTranEqCounter, TranEqCounterDto>(dbContext, mapper), ITranEqCounterService
    {
        public async Task Insert(TranEqCounterDto dto)
        {
            try
            {
 var count = _dbContext.TblTranEqCounter.Count().ToString("D12");
            dto.Mdocm = count;
            await this.Add(dto);
            }
            catch(Exception ex)
            {
                Status = false;
                Exception = ex;
            }
           
        }

        public override async Task<PagedResponseDto> Search(BaseFilter filter)
        {
            try
            {
                var query = _dbContext.TblTranEqCounter.AsQueryable();
               
                if (!string.IsNullOrEmpty(filter.Equnr))
                {
                    query = query.Where(x => x.Equnr == filter.Equnr);
                }
                if (!string.IsNullOrEmpty(filter.Point))
                {
                    query = query.Where(x => x.Point == filter.Point);
                }
                if (filter.IsActive.HasValue)
                {
                    query = query.Where(x => x.IsActive == filter.IsActive);
                }
                return await Paging(query.OrderByDescending(x => x.CreateDate), filter);

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