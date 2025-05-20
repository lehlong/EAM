using AutoMapper;
using Common;
using EAM.BUSINESS.Common;
using EAM.BUSINESS.Dtos.MD;
using EAM.BUSINESS.Dtos.PLAN;
using EAM.CORE;
using EAM.CORE.Entities.MD;
using EAM.CORE.Entities.PLAN;
using MathNet.Numerics.Statistics.Mcmc;

namespace EAM.BUSINESS.Services.PLAN
{
    public interface IPlanHService : IGenericService<TblPlanH, PlanHDto>
    {
        Task<byte[]> Export(BaseMdFilter filter);
        Task Create(PlanHDto dto);
    }

    public class PlanHService(AppDbContext dbContext, IMapper mapper) : GenericService<TblPlanH, PlanHDto>(dbContext, mapper), IPlanHService
    {
        public override async Task<PagedResponseDto> Search(BaseFilter filter)
        {
            try
            {
                var query = _dbContext.TblPlanH.AsQueryable();
                if (!string.IsNullOrWhiteSpace(filter.KeyWord))
                {
                    query = query.Where(x => x.Warpl.Contains(filter.KeyWord));
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

        public async Task Create(PlanHDto dto)
        {
            try
            {
                var entity = _mapper.Map<TblPlanH>(dto);
                _dbContext.TblPlanH.Add(entity);
                foreach(var i in dto.lstEquip)
                {
                    _dbContext.TblPlanD.Add(new TblPlanD
                    {
                        Id = Guid.NewGuid().ToString(),
                        Warpl = i.Warpl,
                        Equnr = i.Equnr,
                    });
                }
                await _dbContext.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                Status = false;
                Exception = ex;
            }
        }
        public async Task<byte[]> Export(BaseMdFilter filter)
        {
            try
            {
                var query = _dbContext.TblPlanH.AsQueryable();
                if (!string.IsNullOrWhiteSpace(filter.KeyWord))
                {
                    query = query.Where(x => x.Warpl.Contains(filter.KeyWord));
                }
                if (filter.IsActive.HasValue)
                {
                    query = query.Where(x => x.IsActive == filter.IsActive);
                }
                var data = await base.GetAllMd(query, filter);
                int i = 1;
                data.ForEach(x =>
                {
                    x.OrdinalNumber = i++;
                });
                return await ExportExtension.ExportToExcel(data);
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