using AutoMapper;
using Common;
using EAM.BUSINESS.Common;
using EAM.BUSINESS.Dtos.TRAN;
using EAM.BUSINESS.Filter.TRAN;
using EAM.CORE;
using EAM.CORE.Entities.TRAN;
using Microsoft.EntityFrameworkCore;

namespace EAM.BUSINESS.Services.TRAN
{
    public interface ITranEqCounterService : IGenericService<TblTranEqCounter, TranEqCounterDto>
    {
        Task Insert(TranEqCounterDto dto);
        Task<decimal?> GetMaxPoint(string point, string equnr);
        Task<PagedResponseDto> Search(TranEqFilter filter);
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
            catch (Exception ex)
            {
                Status = false;
                Exception = ex;
            }
        }

        public async Task<decimal?> GetMaxPoint(string point, string equnr)
        {
            try
            {
                var p = _dbContext.TblTranEqCounter.Where(x => x.Equnr == equnr && x.Point == point).ToList();
                return p.Count() == 0 ? 0 : p.OrderByDescending(x => x.Reading).FirstOrDefault().Reading;
            }
            catch (Exception ex)
            {
                Status = false;
                Exception = ex;
                return 0;
            }
        }

        public async Task<PagedResponseDto> Search(TranEqFilter filter)
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
                if (filter.FromDate.HasValue)
                {
                    query = query.Where(x => x.IDate >= filter.FromDate);
                }
                if (filter.ToDate.HasValue)
                {
                    query = query.Where(x => x.IDate <= filter.ToDate);
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