using AutoMapper;
using Common;
using EAM.BUSINESS.Common;
using EAM.BUSINESS.Dtos.TRAN;
using EAM.CORE;
using EAM.CORE.Entities.TRAN;
using Microsoft.EntityFrameworkCore;

namespace EAM.BUSINESS.Services.TRAN
{
    public interface IOrderEqService : IGenericService<TblTranOrderEq, OrderEqDto>
    {
        Task<OrderEqDto> AddOrderEq(string aufnr, string equnr);
        Task<List<OrderEqDto>> GetByAufnr(string aufnr);
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
       
        public async Task<OrderEqDto> AddOrderEq(string aufnr, string equnr)
        {
            try
            {
                var newOrderEq = new TblTranOrderEq
                {
                    Id = Guid.NewGuid().ToString(),
                    Aufnr = aufnr,
                    Equnr = equnr,
                    IsActive = true,
                };

                await _dbContext.TblTranOrderEq.AddAsync(newOrderEq);
                await _dbContext.SaveChangesAsync();

                return _mapper.Map<OrderEqDto>(newOrderEq);
            }
            catch (Exception ex)
            {
                Status = false;
                Exception = ex;
                return null;
            }
        }
        public async Task<List<OrderEqDto>> GetByAufnr(string aufnr)
        {
            try
            {
                var items = await _dbContext.TblTranOrderEq.Where(x => x.Aufnr == aufnr).ToListAsync();
                var result = _mapper.Map<List<OrderEqDto>>(items);
                return result;
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