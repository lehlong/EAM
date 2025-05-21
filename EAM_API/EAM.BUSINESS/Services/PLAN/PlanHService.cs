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
                var data = await Paging(query.OrderByDescending(x => x.CreateDate), filter);
                foreach (var i in data.Data as IEnumerable<PlanHDto>)
                {
                    i.lstEquip = _dbContext.TblPlanD.Where(x => x.Warpl == i.Warpl).ToList();
                    i.lstPlanOrder = _dbContext.TblPlanOrder.Where(x => x.Warpl == i.Warpl).OrderByDescending(x => x.Schstart).ToList();
                }
                return data;
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
                foreach (var i in dto.lstEquip)
                {
                    _dbContext.TblPlanD.Add(new TblPlanD
                    {
                        Id = Guid.NewGuid().ToString(),
                        Warpl = entity.Warpl,
                        Equnr = i.Equnr,
                        Eqart = i.Eqart,
                    });
                }
                foreach (var i in dto.lstPlanOrder)
                {
                    _dbContext.TblPlanOrder.Add(new TblPlanOrder
                    {
                        Id = Guid.NewGuid().ToString(),
                        Name = entity.Wptxt,
                        Warpl = entity.Warpl,
                        Schstart = i.Schstart,
                        Iscompled = false
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