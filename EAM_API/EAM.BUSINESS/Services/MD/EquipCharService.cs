using AutoMapper;
using Common;
using EAM.BUSINESS.Common;
using EAM.BUSINESS.Dtos.MD;
using EAM.CORE;
using EAM.CORE.Entities.MD;

namespace EAM.BUSINESS.Services.MD
{
    public interface IEquipCharService : IGenericService<TblMdEquipChar, EquipCharDto>
    {
    }
    
    public class EquipCharService(AppDbContext dbContext, IMapper mapper) : GenericService<TblMdEquipChar, EquipCharDto>(dbContext, mapper), IEquipCharService
    {
        public override async Task<PagedResponseDto> Search(BaseFilter filter)
        {
            try
            {
                var query = _dbContext.TblMdEquipChar.AsQueryable();
                if (!string.IsNullOrWhiteSpace(filter.KeyWord))
                {
                    query = query.Where(x => x.Equnr.Contains(filter.KeyWord) || 
                                           x.Class.Contains(filter.KeyWord) ||
                                           x.Atnam.Contains(filter.KeyWord) ||
                                           x.Value.Contains(filter.KeyWord));
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