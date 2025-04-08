using AutoMapper;
using Common;
using EAM.BUSINESS.Common;
using EAM.BUSINESS.Dtos.MD;
using EAM.CORE;
using EAM.CORE.Entities.MD;

namespace EAM.BUSINESS.Services.MD
{
    public interface IEquipMicService : IGenericService<TblMdEquipMic, EquipMicDto>
    {
    }
    
    public class EquipMicService(AppDbContext dbContext, IMapper mapper) : GenericService<TblMdEquipMic, EquipMicDto>(dbContext, mapper), IEquipMicService
    {
        public override async Task<PagedResponseDto> Search(BaseFilter filter)
        {
            try
            {
                var query = _dbContext.TblMdEquipMic.AsQueryable();
                if (!string.IsNullOrWhiteSpace(filter.KeyWord))
                {
                    query = query.Where(x => x.Equnr.Contains(filter.KeyWord) || 
                                           x.Class.Contains(filter.KeyWord) ||
                                           x.Mic.Contains(filter.KeyWord) ||
                                           x.MicName.Contains(filter.KeyWord));
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