using AutoMapper;
using Common;
using EAM.BUSINESS.Common;
using EAM.BUSINESS.Dtos.MD;
using EAM.CORE;
using EAM.CORE.Entities.MD;

namespace EAM.BUSINESS.Services.MD
{
    public interface IEquipDocService : IGenericService<TblMdEquipDoc, EquipDocDto>
    {
    }
    
    public class EquipDocService(AppDbContext dbContext, IMapper mapper) : GenericService<TblMdEquipDoc, EquipDocDto>(dbContext, mapper), IEquipDocService
    {
        public override async Task<PagedResponseDto> Search(BaseFilter filter)
        {
            try
            {
                var query = _dbContext.TblMdEquipDoc.AsQueryable();
                if (!string.IsNullOrWhiteSpace(filter.KeyWord))
                {
                    query = query.Where(x => x.Equnr.Contains(filter.KeyWord) || 
                                           x.Doctype.Contains(filter.KeyWord) ||
                                           x.Filetype.Contains(filter.KeyWord) ||
                                           x.Path.Contains(filter.KeyWord));
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