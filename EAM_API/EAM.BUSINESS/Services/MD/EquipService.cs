using AutoMapper;
using Common;
using EAM.BUSINESS.Common;
using EAM.BUSINESS.Dtos.MD;
using EAM.BUSINESS.Filter.MD;
using EAM.CORE;
using EAM.CORE.Entities.MD;

namespace EAM.BUSINESS.Services.MD
{
    public interface IEquipService : IGenericService<TblMdEquip, EquipDto>
    {
        Task<PagedResponseDto> Search(EquipFilter filter);
    }
    public class EquipService(AppDbContext dbContext, IMapper mapper) : GenericService<TblMdEquip, EquipDto>(dbContext, mapper), IEquipService
    {
        public async Task<PagedResponseDto> Search(EquipFilter filter)
        {
            try
            {
                var query = _dbContext.TblMdEquip.AsQueryable();
                if (!string.IsNullOrWhiteSpace(filter.KeyWord))
                {
                    query = query.Where(x => x.Eqktx.ToString().Contains(filter.KeyWord));
                }

                if (!string.IsNullOrWhiteSpace(filter.Tplnr))
                {
                    query = query.Where(x => x.Tplnr == filter.Tplnr);
                }

                if (!string.IsNullOrWhiteSpace(filter.Eqart))
                {
                    query = query.Where(x => x.Eqart == filter.Eqart);
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
