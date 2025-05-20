using AutoMapper;
using Common;
using EAM.BUSINESS.Common;
using EAM.BUSINESS.Dtos.TRAN;
using EAM.CORE;
using EAM.CORE.Entities.TRAN;
using Microsoft.EntityFrameworkCore;

namespace EAM.BUSINESS.Services.TRAN
{
    public interface IOrderVtService : IGenericService<TblTranOrderVt, OrderVtDto>
    {
        Task<List<OrderVtDto>> SaveOrderVt(List<OrderVtDto> vtDto);
        Task<List<OrderVtDto>> GetByAufnrAndType(string aufnr, string category);
        Task<IEnumerable<OrderVtDto>> GetByAufnr(string aufnr);
    }

    public class OrderVtService(AppDbContext dbContext, IMapper mapper) : GenericService<TblTranOrderVt, OrderVtDto>(dbContext, mapper), IOrderVtService
    {
        public override async Task<PagedResponseDto> Search(BaseFilter filter)
        {
            try
            {
                var query = _dbContext.TblTranOrderVt.AsQueryable();
                if (!string.IsNullOrWhiteSpace(filter.KeyWord))
                {
                    query = query.Where(x => x.Aufnr.Contains(filter.KeyWord) ||
                                     x.Matnr.Contains(filter.KeyWord) ||
                                     x.Maktx.Contains(filter.KeyWord) ||
                                     x.Category.Contains(filter.KeyWord) ||
                                     x.Category2.Contains(filter.KeyWord) ||
                                     x.Werks.Contains(filter.KeyWord));
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
        public async Task<List<OrderVtDto>> SaveOrderVt(List<OrderVtDto> vtDtos)
        {
            var result = new List<OrderVtDto>();

            foreach (var dto in vtDtos)
            {
                var existing = await _dbContext.Set<TblTranOrderVt>()
                    .FirstOrDefaultAsync(x =>
                        x.Aufnr == dto.Aufnr &&
                        x.Category == dto.Category &&
                        x.IsActive== true);

                if (existing != null && dto.Id != "A")
                {
                    dto.Id = existing.Id;
                    await Update(dto);
                    result.Add(dto);
                }
                else
                {
                    dto.Id = Guid.NewGuid().ToString();
                    var added = await Add(dto);
                    result.Add(added);
                }
            }

            return result;
        }

        public async Task<List<OrderVtDto>> GetByAufnrAndType(string aufnr, string category)
        {
            var report = await _dbContext.Set<TblTranOrderVt>()
                .Where(x => x.Aufnr == aufnr && x.Category == category && x.IsActive == true)
                .ToListAsync();

            return _mapper.Map<List<OrderVtDto>>(report);
        }

        public async Task<IEnumerable<OrderVtDto>> GetByAufnr(string aufnr)
        {
            var reports = await _dbContext.Set<TblTranOrderVt>()
                .Where(x => x.Aufnr == aufnr && x.IsActive == true)
                .ToListAsync();

            return _mapper.Map<IEnumerable<OrderVtDto>>(reports);
        }

    }
}